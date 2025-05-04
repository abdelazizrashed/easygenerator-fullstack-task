import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHomeData, HomeStatus, selectHomeError, selectHomeMessage, selectHomeStatus } from "../homeSlice";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const HomePage = () => {

    const dispatch = useAppDispatch();

    const homeMessage = useAppSelector(selectHomeMessage);
    const status = useAppSelector(selectHomeStatus);
    const error = useAppSelector(selectHomeError);


    useEffect(() => {
        if (status === HomeStatus.IDLE) {
            dispatch(fetchHomeData());
        }

    }, [status, dispatch]);


    if (status === HomeStatus.LOADING || status === HomeStatus.IDLE) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
                <p className="ml-2">Loading welcome message...</p>
            </div>
        );
    }

    if (status === HomeStatus.ERROR) {
        return (
            <Alert variant="destructive" className="max-w-md mx-auto mt-10">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Could not load welcome message: {error || 'Unknown error'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="text-center p-10">
            <h1 className="text-3xl font-bold mb-4">
                {homeMessage || 'Welcome!'} {/* Display fetched message or fallback */}
            </h1>
        </div>
    );
};

export default HomePage;
