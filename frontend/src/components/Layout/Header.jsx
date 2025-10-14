import { Link } from 'react-router-dom';
import { MapPin, Plus, Settings, Users, BarChart3, FileText, LogOut, Flame } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Map', icon: MapPin },
    { path: '/report', label: 'Report Issue', icon: Plus },
    { path: '/my-reports', label: 'My Reports', icon: FileText },
    { path: '/hot-issues', label: 'Hot Issues', icon: Flame },
  ];

  if (user?.role === 'admin') {
    navItems.push(
      { path: '/admin', label: 'Admin', icon: Settings },
      { path: '/analytics', label: 'Analytics', icon: BarChart3 }
    );
  } else if (user?.role === 'staff') {
    navItems.push({ path: '/staff', label: 'Staff Portal', icon: Users });
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <MapPin className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">CrowdCiv</h1>
            </Link>

            <nav className="hidden md:flex space-x-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{user?.name}</span>
              <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs capitalize">
                {user?.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
