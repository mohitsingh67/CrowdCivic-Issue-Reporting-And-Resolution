import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ReportsProvider } from './contexts/ReportsContext';
import ProtectedRoute from './utils/ProtectedRoute';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import MyReportsPage from './pages/MyReportsPage';
import HotIssuesPage from './pages/HotIssuesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StaffPortalPage from './pages/StaffPortalPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportDetailPage from './pages/ReportDetailPage';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReportsProvider>
          <Routes>
            <Route path="/login" element={<LoginForm />} />

            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<MapPage />} />
              <Route path="report" element={<ReportPage />} />
              <Route path="my-reports" element={<MyReportsPage />} />
              <Route path="hot-issues" element={<HotIssuesPage />} />
              <Route path="report/:id" element={<ReportDetailPage />} />
              <Route path="report/:id/feedback" element={<ReportDetailPage />} />

              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } />

              <Route path="analytics" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AnalyticsPage />
                </ProtectedRoute>
              } />

              <Route path="staff" element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <StaffPortalPage />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ReportsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
