import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { clearError } from '../../store/authSlice';

const ErrorMessage: React.FC = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.auth);

  const handleClose = () => {
    dispatch(clearError());
  };

  if (!error) return null;

  return (
    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorMessage; 