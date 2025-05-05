import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ConsultationList from '../consultations/ConsultationList';

const DoctorDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bem-vindo, Dr. {user?.first_name} {user?.last_name}
        </Typography>
        <ConsultationList />
      </Box>
    </Container>
  );
};

export default DoctorDashboard; 