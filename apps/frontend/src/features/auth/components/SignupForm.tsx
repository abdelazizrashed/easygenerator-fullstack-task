import { useForm } from "react-hook-form";
import { SignUpFormData, SignupRequestDto } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../types/validateion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AuthStatus, registerUser, selectAuthError, selectAuthStatus } from "../authSlice";
import { useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";


export function SignupForm() {
    const form = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
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


    const onSubmit = async (data: SignUpFormData) => {
        dispatch(registerUser({
            name: data.name,
            email: data.email,
            password: data.password
        }));
    };
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>

                <CardTitle> Sign Up </CardTitle>
                <CardDescription>
                    Create your account to get started.
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
                            name="name"
                            render={({ field }) => (
                                <FormItem className="mb-5">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem className="mb-5">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="john.doe@me.com"
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
                                            placeholder="***********"
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
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="mb-5">
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="***********"
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
                            {isLoading ? "Registering..." : "Sign up"}
                        </Button>
                    </form>

                </Form>
            </CardContent>
            <CardFooter>
                Already have an account? <Link to="/login" className="underline ml-1">Login</Link>
            </CardFooter>

        </Card>
    );
}
