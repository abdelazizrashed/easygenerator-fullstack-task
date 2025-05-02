import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import logoSrc from '@/assets/easygenerator-logo.webp';
import { Toaster } from '../ui/sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, selectCurrentUser } from '@/features/auth/authSlice';
const MainLayout: React.FC = () => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const user = useAppSelector(selectCurrentUser);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
                <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="text-m font-semibold text-gray-800 dark:text-white">
                        <img src={logoSrc} alt="EasyGenerator Logo" className="h-8 mr-2" /> Abdelaziz Rashed
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && (
                            <span className="text-gray-600 dark:text-gray-300">
                                Hi, {user.name}!
                            </span>
                        )}
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </nav>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <Toaster />
            <footer className="bg-gray-200 dark:bg-gray-700 p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Abdelaziz Rashed @ EasyGenerator
            </footer>
        </div>
    );
};

export default MainLayout;
