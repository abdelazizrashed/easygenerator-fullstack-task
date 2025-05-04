import AuthLayout from "@/components/layout/AuthLayout";
import MainLayout from "@/components/layout/MainLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "@/features/home/pages/HomePage";

const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/signup", element: <SignUpPage /> }
        ]
    },
    {
        element: <ProtectedRoute />,
        children: [
            {

                element: <MainLayout />,
                children: [
                    { path: "/", element: <HomePage /> }
                ]
            }
        ]
    },
    {
        path: "*",
        element: <NotFoundPage />
    }
]);

export const AppRouterProvider = () => <RouterProvider router={router} />;

