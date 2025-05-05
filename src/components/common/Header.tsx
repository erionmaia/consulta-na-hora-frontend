import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Menu,
    MenuItem,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import logo from '../../assets/logo-consulta-na-hora-sem-fundo.png';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleProfile = () => {
        navigate('/profile');
        handleClose();
    };

    if (!user) return null;

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
                <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
                    <img src={logo} alt="Consulta na Hora" style={{ height: 48, marginRight: 16 }} />
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                        Consulta na Hora
                    </Typography>
                </Box>

                <Box>
                    {user.user_type === 'PA' && (
                        <Button
                            color="primary"
                            onClick={() => navigate('/consultations/new')}
                        >
                            Agendar Consulta
                        </Button>
                    )}
                    <Button
                        color="primary"
                        onClick={() => navigate('/consultations')}
                    >
                        Minhas Consultas
                    </Button>
                    {token && (
                        <Button
                            color="primary"
                            onClick={() => navigate(user?.user_type === 'DO' ? '/doctor' : '/patient')}
                        >
                            Dashboard
                        </Button>
                    )}
                    <Button color="primary" onClick={handleLogout}>
                        Sair
                    </Button>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="primary"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleProfile}>Meu Perfil</MenuItem>
                        <MenuItem onClick={handleLogout}>Sair</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header; 