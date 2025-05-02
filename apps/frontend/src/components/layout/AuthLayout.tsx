import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '../ui/sonner';

const AuthLayout: React.FC = () => {
    return (
        <>
            <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
                <Outlet />
            </main>
            <Toaster />
        </>
    );
};

export default AuthLayout;
