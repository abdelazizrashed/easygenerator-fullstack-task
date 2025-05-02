import { Spinner } from "@/components/ui/Spinner";
import { AuthStatus, selectAuthStatus, selectCurrentToken } from "@/features/auth/authSlice";
import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {

    const token = useAppSelector(selectCurrentToken);
    const authStatus = useAppSelector(selectAuthStatus);

    const isLoading = authStatus === AuthStatus.LOADING;
    if (isLoading) return <Spinner />;

    return token ? <Outlet /> : <Navigate to="/login" replace />;

}

export default ProtectedRoute;
