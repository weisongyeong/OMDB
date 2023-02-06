import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Axios from 'axios';
import { toast } from "react-toastify";

const Register = () => {
    const url = "https://localhost:44376/api/Authenticate/register";
    const [username, usernameUpdate] = useState('');
    const [email, emailUpdate] = useState('');
    const [password, passwordUpdate] = useState('');
    const [confirmPassword, confirmPasswordUpdate] = useState('');
    const navigate = useNavigate();

    // registration
    const HandleSubmit = (e) => {
        e.preventDefault();
        if (IsValidate()) {
            Axios.post(url, {
                username: username,
                email: email,
                password: password
            })
            .then((res) => {
                toast.success('Registered successfully.')
                navigate('/login');
            })
            .catch((err) => {
                toast.error('Failed :' + err.message);
            })
        }
    }

    // validation check
    const IsValidate = () => {
        let isproceed = true;
        if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
            isproceed = true;
        } else {
            isproceed = false;
            toast.warning('Please enter the valid email');
        }
        if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password)) {
            isproceed = true;
        } else {
            isproceed = false;
            toast.warning('Please enter the password that contains 8 to 15 characters, at least one lowercase letter, one uppercase letter, one numeric digit, and one special character');
        }
        if (password != confirmPassword) {
            isproceed = false;
            toast.warning('Your password and confirm password must be the same');
        }
        return isproceed;
    }

    

    return (
        <div className="flex justify-center items-center py-10">
            <div className="relative shadow-2xl w-[30rem] px-14 py-5 bg-gray-100 rounded-md">
                <h1 className="font-bold text-3xl my-10 py-1 text-center tracking-wider select-none">User Signup</h1>
                <form
                    className="text-lg"
                    method="post"
                    onSubmit={HandleSubmit}>
                    <div className="flex flex-col gap-4 my-5">
                        <label className="mx-2 select-none" htmlFor="user">Username</label>
                        <input
                            onChange={e => usernameUpdate(e.target.value)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="text"
                            id="user"
                            value={username} required>
                        </input>
                    </div>
                    <div className="flex flex-col gap-4 my-5">
                        <label className="mx-2 select-none" htmlFor="reg-email">Email</label>
                        <input
                            onChange={e => emailUpdate(e.target.value)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="text"
                            id="reg-email"
                            value={email} required>
                        </input>
                    </div>
                    <div className="flex flex-col gap-4 my-5">
                        <label className="mx-2 select-none" htmlFor="reg-pass">Password</label>
                        <input
                            onChange={e => passwordUpdate(e.target.value)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="password"
                            id="reg-pass"
                            value={password} required>
                        </input>
                    </div>
                    <div className="flex flex-col gap-4 my-5">
                        <label className="mx-2 select-none" htmlFor="reg-confpass">Confirm Password</label>
                        <input
                            onChange={e => confirmPasswordUpdate(e.target.value)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="password"
                            id="reg-confpass"
                            value={confirmPassword} required>
                        </input>
                    </div>
                    <div className="flex justify-center">
                        <button className="border rounded-lg px-4 py-1 mt-5 mb-2 text-white bg-gradient-to-r from-red-300 to-yellow-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 select-none" type="submit">Signup</button>
                    </div>
                    <div className="flex justify-center">
                        <Link className="border rounded-lg px-4 py-1 mb-5 text-white bg-gradient-to-r from-red-300 to-yellow-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 select-none" to={"/login"}>Close</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;