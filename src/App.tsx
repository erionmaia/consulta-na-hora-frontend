import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './store';
import theme from './theme';

// Components
import Header from './components/common/Header';
import Loading from './components/common/Loading';
import ErrorMessage from './components/common/ErrorMessage';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard Components
import DoctorDashboard from './components/dashboard/DoctorDashboard';
import PatientDashboard from './components/dashboard/PatientDashboard';

// Consultation Components
import ConsultationList from './components/consultations/ConsultationList';
import ConsultationForm from './components/consultations/ConsultationForm';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.user_type)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Header />
            <Loading />
            <ErrorMessage />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/doctor"
                element={
                  <ProtectedRoute allowedRoles={['DO']}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient"
                element={
                  <ProtectedRoute allowedRoles={['PA']}>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/consultations"
                element={
                  <ProtectedRoute allowedRoles={['DO', 'PA']}>
                    <ConsultationList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/consultations/new"
                element={
                  <ProtectedRoute allowedRoles={['PA']}>
                    <ConsultationForm />
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
