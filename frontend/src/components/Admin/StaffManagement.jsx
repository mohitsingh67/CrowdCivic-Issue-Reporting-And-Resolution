import { useState, useEffect } from 'react';
import { Users, Mail, Building, CheckCircle } from 'lucide-react';
import { authAPI } from '../../utils/api';

export default function StaffManagement() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [staffRes, unapprovedRes] = await Promise.all([
        authAPI.getAllStaff(),
        authAPI.getUnapprovedUsers()
      ]);
      setStaffMembers(staffRes.data);
      setUnapprovedUsers(unapprovedRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await authAPI.approveUser(userId);
      alert('User approved successfully!');
      fetchData();
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Users className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">Staff Management</h3>
      </div>

      {unapprovedUsers.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-3">Pending Approvals</h4>
          <div className="space-y-2">
            {unapprovedUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between bg-white p-3 rounded">
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="text-xs text-gray-500 capitalize">{user.role} {user.department && `- ${user.department}`}</div>
                </div>
                <button
                  onClick={() => handleApprove(user._id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 max-h-80 overflow-y-auto">
        {staffMembers.map((staff) => (
          <div key={staff._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{staff.name}</h4>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Mail className="w-3 h-3" />
                    <span>{staff.email}</span>
                  </div>
                  {staff.department && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Building className="w-3 h-3" />
                      <span>{staff.department}</span>
                    </div>
                  )}
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full capitalize">
                {staff.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
