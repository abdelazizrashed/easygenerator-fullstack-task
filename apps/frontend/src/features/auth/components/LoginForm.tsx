import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { SignInFormData, signInSchema } from "../types/validateion";
import { LoginRequestDto } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AuthStatus, loginUser, selectAuthError, selectAuthStatus } from "../authSlice";
import { useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"; // Icon for alert

export function LoginForm() {

    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const dispatch = useAppDispatch();

    const authStatus = useAppSelector(selectAuthStatus);
    const authError = useAppSelector(selectAuthError);
    const navigate = useNavigate();

    useEffect(() => {
        if (authStatus === AuthStatus.SUCCESS) {
            navigate("/");
        } else if (authStatus === AuthStatus.ERROR) {
            toast.error(
                authError,
                {
                    richColors: true
                }
            )
        }
    }, [authStatus]);

    const isLoading = authStatus === AuthStatus.LOADING;


    const onSubmit = async (data: SignInFormData) => {
        dispatch(loginUser({
            email: data.email,
            password: data.password
        }));
    };
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle> Sign In </CardTitle>
                <CardDescription>
                    Enter your credentials to access your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Display error message if login failed */}
                {authStatus === AuthStatus.ERROR && authError && (
                    <Alert variant="destructive" className="mb-4">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="mb-5">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="john.doe@gmail.com"
                                            disabled={isLoading}
                                            {...field}
                                        />

                                    </FormControl>
                                    <FormMessage className="justify-self-start" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="mb-5">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="**********"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="justify-self-start" />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </Form>

            </CardContent>
            <CardFooter className="text-sm justify-center">
                Don't have an account? <Link to="/signup" className="underline ml-1">Sign Up</Link>
            </CardFooter>
        </Card >
    );
}
