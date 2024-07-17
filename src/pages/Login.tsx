import { useNavigate } from 'react-router-dom'
import { Input, Button } from "@nextui-org/react";

export const Login = () => {
    const navigate = useNavigate()
    const login = () => { navigate('/main') }

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-8 bg-background pb-10 rounded-3xl shadow-2xl">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-text">Sign In</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="email" className="text-sm font-medium leading-6 text-text flex justify-start ms-1">Email</label>
                            <div className="mt-2">
                                <Input 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    placeholder="example@gmail.com" 
                                    required 
                                    className="input-background" 
                                    radius="full"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-text ms-1">Password</label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-primary hover:text-indigo-500">Forgot password?</a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <Input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    placeholder="password" 
                                    required 
                                    className="input-background" 
                                    radius="full"
                                />
                            </div>
                        </div>

                        <div>
                            <Button 
                                type="submit" 
                                onClick={login} 
                                className="w-[16rem] h-12 snap-center rounded-full bg-primary text-sm font-semibold leading-6 text-white">
                                Sign in
                            </Button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?
                        <a href="#" className="font-semibold leading-6 text-primary hover:text-primary">&nbsp;Register here.</a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login
