import React from 'react';
import { Container, Box, Typography, Card, CardContent, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import ConsultationList from '../consultations/ConsultationList';

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Bem-vindo, {user?.first_name} {user?.last_name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Aqui você pode gerenciar suas consultas médicas.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/consultations/new')}
                >
                  Agendar Nova Consulta
                </Button>
              </Box>
            </Box>
            <ConsultationList />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default PatientDashboard; 