// import { useState, useEffect } from 'react';
// import { useReports } from '../../contexts/ReportsContext';
// import { authAPI } from '../../utils/api';

// export default function ReportsList() {
//   const { getFilteredReports, updateReport } = useReports();
//   const reports = getFilteredReports();
//   const [staffMembers, setStaffMembers] = useState([]);

//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   const fetchStaff = async () => {
//     try {
//       const response = await authAPI.getAllStaff();
//       setStaffMembers(response.data);
//     } catch (error) {
//       console.error('Error fetching staff:', error);
//     }
//   };

//   const statusColors = {
//     Submitted: 'bg-blue-100 text-blue-800',
//     Assigned: 'bg-yellow-100 text-yellow-800',
//     'In Progress': 'bg-orange-100 text-orange-800',
//     Resolved: 'bg-green-100 text-green-800',
//     Closed: 'bg-gray-100 text-gray-800'
//   };

//   const priorityColors = {
//     Low: 'text-green-600',
//     Normal: 'text-blue-600',
//     High: 'text-orange-600',
//     Critical: 'text-red-600'
//   };

//   const handleAssignment = (reportId, staffId) => {
//     updateReport(reportId, {
//       assignedTo: staffId || null,
//       status: staffId ? 'Assigned' : 'Submitted'
//     });
//   };

//   const handlePriorityChange = (reportId, priority) => {
//     updateReport(reportId, { priority });
//   };

//   const handleStatusChange = (reportId, status) => {
//     updateReport(reportId, { status });
//   };

//   return (
//     <div className="space-y-3 max-h-96 overflow-y-auto">
//       {reports.map((report) => (
//         <div key={report._id} className="border border-gray-200 rounded-lg p-4">
//           <div className="flex items-start justify-between mb-3">
//             <div className="flex-1">
//               <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
//               <p className="text-sm text-gray-600 mb-2 line-clamp-2">{report.description}</p>
//               <div className="flex items-center space-x-4 text-xs text-gray-500">
//                 <span>{report.category}</span>
//                 <span>{new Date(report.createdAt).toLocaleDateString()}</span>
//                 <span className={priorityColors[report.priority]}>
//                   {report.priority} Priority
//                 </span>
//               </div>
//             </div>
//             <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
//               {report.status}
//             </span>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Assign to Staff
//               </label>
//               <select
//                 value={report.assignedTo?._id || ''}
//                 onChange={(e) => handleAssignment(report._id, e.target.value)}
//                 className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">Unassigned</option>
//                 {staffMembers.map((staff) => (
//                   <option key={staff._id} value={staff._id}>
//                     {staff.name} ({staff.department || staff.role})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Priority
//               </label>
//               <select
//                 value={report.priority}
//                 onChange={(e) => handlePriorityChange(report._id, e.target.value)}
//                 className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="Low">Low</option>
//                 <option value="Normal">Normal</option>
//                 <option value="High">High</option>
//                 <option value="Critical">Critical</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Status
//               </label>
//               <select
//                 value={report.status}
//                 onChange={(e) => handleStatusChange(report._id, e.target.value)}
//                 className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="Submitted">Submitted</option>
//                 <option value="Assigned">Assigned</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Resolved">Resolved</option>
//                 <option value="Closed">Closed</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       ))}

//       {reports.length === 0 && (
//         <div className="text-center py-8 text-gray-500">
//           <p>No reports match the current filters.</p>
//         </div>
//       )}
//     </div>
//   );
// }


// report filter feture integrated 

// import { useState, useEffect } from "react";
// import { useReports } from "../../contexts/ReportsContext";
// import { authAPI } from "../../utils/api";

// export default function ReportsList({ filter = "All" }) {
//   const { updateReport, reports } = useReports();
//   const [staffMembers, setStaffMembers] = useState([]);

//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   const fetchStaff = async () => {
//     try {
//       const response = await authAPI.getAllStaff();
//       setStaffMembers(response.data);
//     } catch (error) {
//       console.error("Error fetching staff:", error);
//     }
//   };

//   // 🔹 Filtering logic (Only by report status + assigned/unassigned)
//   const filteredReports = reports.filter((report) => {
//     if (filter === "All") return true;
//     if (filter === "Unassigned") return !report.assignedTo;
//     if (filter === "Assigned") return report.assignedTo;
//     return report.status === filter;
//   });

//   const statusColors = {
//     Submitted: "bg-blue-100 text-blue-800",
//     Assigned: "bg-yellow-100 text-yellow-800",
//     "In Progress": "bg-orange-100 text-orange-800",
//     Resolved: "bg-green-100 text-green-800",
//     Closed: "bg-gray-100 text-gray-800",
//   };

//   const priorityColors = {
//     Low: "text-green-600",
//     Normal: "text-blue-600",
//     High: "text-orange-600",
//     Critical: "text-red-600",
//   };

//   const handleAssignment = (reportId, staffId) => {
//     updateReport(reportId, {
//       assignedTo: staffId || null,
//       status: staffId ? "Assigned" : "Submitted",
//     });
//   };

//   const handlePriorityChange = (reportId, priority) => {
//     updateReport(reportId, { priority });
//   };

//   const handleStatusChange = (reportId, status) => {
//     updateReport(reportId, { status });
//   };

//   return (
//     <div className="space-y-3 max-h-96 overflow-y-auto">
//       {filteredReports.map((report) => (
//         <div key={report._id} className="border border-gray-200 rounded-lg p-4">
//           <div className="flex items-start justify-between mb-3">
//             <div className="flex-1">
//               <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
//               <p className="text-sm text-gray-600 mb-2 line-clamp-2">{report.description}</p>

//               <div className="flex items-center space-x-4 text-xs text-gray-500">
//                 <span>{report.category}</span>
//                 <span>{new Date(report.createdAt).toLocaleDateString("en-IN")}</span>
//                 <span className={priorityColors[report.priority]}>
//                   {report.priority} Priority
//                 </span>
//               </div>
//             </div>

//             <span
//               className={`px-2 py-1 rounded-full text-xs font-medium ${
//                 statusColors[report.status]
//               }`}
//             >
//               {report.status}
//             </span>
//           </div>

//           {/* Editable Controls */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//             {/* Assign Staff */}
//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Assign to Staff
//               </label>
//               <select
//                 value={report.assignedTo?._id || ""}
//                 onChange={(e) => handleAssignment(report._id, e.target.value)}
//                 className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">Unassigned</option>
//                 {staffMembers.map((staff) => (
//                   <option key={staff._id} value={staff._id}>
//                     {staff.name} ({staff.department || staff.role})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Priority */}
//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Priority
//               </label>
//               <select
//                 value={report.priority}
//                 onChange={(e) =>
//                   handlePriorityChange(report._id, e.target.value)
//                 }
//                 className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="Low">Low</option>
//                 <option value="Normal">Normal</option>
//                 <option value="High">High</option>
//                 <option value="Critical">Critical</option>
//               </select>
//             </div>

//             {/* Status */}
//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 Status
//               </label>
//               <select
//                 value={report.status}
//                 onChange={(e) =>
//                   handleStatusChange(report._id, e.target.value)
//                 }
//                 className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="Submitted">Submitted</option>
//                 <option value="Assigned">Assigned</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Resolved">Resolved</option>
//                 <option value="Closed">Closed</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       ))}

//       {filteredReports.length === 0 && (
//         <div className="text-center py-8 text-gray-500">
//           <p>No reports match the current filters.</p>
//         </div>
//       )}
//     </div>
//   );
// }


// new feature is integrated ------------deparment wise report assign to staff-----

import { useState, useEffect } from "react";
import { useReports } from "../../contexts/ReportsContext";
import { authAPI } from "../../utils/api";

export default function ReportsList({ filter = "All" }) {
  const { updateReport, reports } = useReports();
  const [staffMembers, setStaffMembers] = useState([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await authAPI.getAllStaff();
      setStaffMembers(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  // Filtering logic including assigned/unassigned
  const filteredReports = reports.filter((report) => {
    if (filter === "All") return true;
    if (filter === "Unassigned") return !report.assignedTo;
    if (filter === "Assigned") return report.assignedTo;
    return report.status === filter;
  });

  const statusColors = {
    Submitted: "bg-blue-100 text-blue-800",
    Assigned: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-orange-100 text-orange-800",
    Resolved: "bg-green-100 text-green-800",
    Closed: "bg-gray-100 text-gray-800",
  };

  const priorityColors = {
    Low: "text-green-600",
    Normal: "text-blue-600",
    High: "text-orange-600",
    Critical: "text-red-600",
  };

  const getAssignedStaff = (report) => {
    return staffMembers.find(
      (staff) => staff._id === (report.assignedTo?._id || report.assignedTo)
    );
  };

  const handleAssignment = (reportId, staffId) => {
    const selectedStaff = staffMembers.find((staff) => staff._id === staffId);

    updateReport(reportId, {
      assignedTo: staffId || null,
      status: staffId ? "Assigned" : "Submitted",
      department: selectedStaff?.department || ""
    });
  };

  const handlePriorityChange = (reportId, priority) => {
    updateReport(reportId, { priority });
  };

  const handleStatusChange = (reportId, status) => {
    updateReport(reportId, { status });
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {filteredReports.map((report) => {
        const assignedStaff = getAssignedStaff(report);

        return (
          <div key={report._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {report.description}
                </p>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{report.category}</span>
                  <span>{new Date(report.createdAt).toLocaleDateString("en-IN")}</span>

                  <span className={priorityColors[report.priority]}>
                    {report.priority} Priority
                  </span>

                  {assignedStaff && (
                    <span className="text-purple-600 font-medium">
                      Assigned to: {assignedStaff.name}
                    </span>
                  )}
                </div>
              </div>

              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}
              >
                {report.status}
              </span>
            </div>

            {/* Editable Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Assign Staff */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Assign to Staff
                </label>
                <select
                  value={report.assignedTo?._id || report.assignedTo || ""}
                  onChange={(e) => handleAssignment(report._id, e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>

                  {/* Filter staff by matching department with report category */}
                  {staffMembers
                    .filter(
                      (staff) =>
                        staff.department?.toLowerCase() ===
                        report.category?.toLowerCase()
                    )
                    .map((staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.name} ({staff.department})
                      </option>
                    ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={report.priority}
                  onChange={(e) => handlePriorityChange(report._id, e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={report.status}
                  onChange={(e) => handleStatusChange(report._id, e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        );
      })}

      {filteredReports.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No reports match the current filters.</p>
        </div>
      )}
    </div>
  );
}


