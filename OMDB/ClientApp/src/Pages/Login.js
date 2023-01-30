import { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
    const url = "https://localhost:44376/api/Authenticate/login";
    const [username, usernameupdate] = useState('');
    const [password, passwordupdate] = useState('');
    const usenavigate=useNavigate();

    // clear user data when the user logged out
    useEffect(() => {
        sessionStorage.clear();
    }, []);

    // call login api
    const ProceedLoginusingAPI = (e) => {
        e.preventDefault();
        if (validate()) {
            Axios.post(url, {
                Username: username,
                Password: password
            })
            .then(res => {
                if (Object.keys(res).length === 0) {
                    toast.error('Login failed, invalid credentials');
                } else {
                    toast.success('Success');
                    sessionStorage.setItem('username', username);
                    sessionStorage.setItem('token', res.data.token);
                    sessionStorage.setItem('role', res.data.role);
                    usenavigate('/');
                }
            })
            .catch((err) => {
                toast.error('Login Failed due to :' + err.message);
            });
        }
    }

    // validation check
    const validate = () => {
        let result = true;
        if (username === '' || username === null) {
            result = false;
            toast.warning('Please Enter Username');
        }
        if (password === '' || password === null) {
            result = false;
            toast.warning('Please Enter Password');
        }
        return result;
    }

    return (
        <div className="flex justify-center items-center py-10">
            <div className="relative shadow-2xl w-[30rem] px-14 py-5 bg-gray-100 rounded-md">                
                <h1 className="font-bold text-3xl my-10 py-1 text-center tracking-wider select-none">User Login</h1>
                <form
                    className="text-lg"
                    method="post"
                    onSubmit={ProceedLoginusingAPI}>
                    <div className="flex flex-col gap-4 mt-16 mb-10">
                        <label className="mx-2 select-none" htmlFor="username">Username</label>
                        <input
                            onChange={e => usernameupdate(e.target.value)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="text"
                            id="username"
                            value={username} required>
                        </input>
                    </div>
                    <div className="flex flex-col gap-4 mt-10 mb-16">
                        <label className="mx-2 select-none" htmlFor="password">Password</label>
                        <input
                            onChange={e => passwordupdate(e.target.value)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="password"
                            id="password"
                            value={password} required>
                        </input>
                    </div>
                    <div className="flex justify-center">
                        <button className="border rounded-lg px-4 py-1 mt-5 mb-2 text-white bg-gradient-to-r from-red-300 to-yellow-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 select-none" type="submit">Login</button>
                    </div>
                    <div className="flex justify-center">
                        <Link className="px-4 py-1 mb-5 text-blue-800 text-[16px] underline transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 select-none" to={"/register"}>New User?</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;