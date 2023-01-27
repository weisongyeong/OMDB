import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Axios from 'axios';
import { toast } from "react-toastify";

const CreateNewUser = () => {
    const url = "https://localhost:44376/api/Authenticate/register";
    const [username, usernameupdate] = useState('');
    const [email, emailupdate] = useState('');
    const [password, passwordupdate] = useState('');
    const navigate = useNavigate();

    const handlesubmit = (e) => {
        e.preventDefault();
        if (IsValidate()) {
            Axios.post(url, {
                username: username,
                email: email,
                password: password
            })
            .then((res) => {
                toast.success('User created successfully.')
                navigate('/');
            })
            .catch((err) => {
                toast.error('Failed :' + err.message);
            })
        }
    }

    const IsValidate = () => {
        let isproceed = true;
        let errormessage = 'Please enter the value in ';
        if (username === '' || username === null) {
            isproceed = false;
            errormessage += ' Username';
        }
        if (email === null || email === '') {
            isproceed = false;
            errormessage += ' Email';
        }
        if (password === null || password === '') {
            isproceed = false;
            errormessage += ' Password';
        }

        if(!isproceed){
            toast.warning(errormessage)
        }else{
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
        }
        return isproceed;
    }

    

    return (
        <div className="flex justify-center items-center py-10">
            <div className="relative shadow-2xl w-[30rem] px-14 py-5 bg-gray-100 rounded-md">
                <h1 className="font-bold text-3xl my-10 py-1 text-center tracking-wider select-none">Create New User</h1>
                <form
                    className="text-lg"
                    method="post"
                    onSubmit={handlesubmit}>
                    <div className="flex flex-col gap-4 my-5">
                        <label className="mx-2 select-none" htmlFor="user">Username</label>
                        <input
                            onChange={e => usernameupdate(e.target.value)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="text"
                            id="user"
                            value={username} required>
                        </input>
                    </div>
                    <div className="flex flex-col gap-4 my-5">
                        <label className="mx-2 select-none" htmlFor="reg-email">Email</label>
                        <input
                            onChange={e => emailupdate(e.target.value)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="text"
                            id="email"
                            value={email} required>
                        </input>
                    </div>
                    <div className="flex flex-col gap-4 my-5">
                        <label className="mx-2 select-none" htmlFor="reg-pass">Password</label>
                        <input
                            onChange={e => passwordupdate(e.target.value)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="password"
                            id="pass"
                            value={password} required>
                        </input>
                    </div>
                    <div className="flex justify-center">
                        <button className="border rounded-lg px-4 py-1 mt-5 mb-2 text-white bg-gradient-to-r from-red-300 to-yellow-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 select-none" type="submit">Signup</button>
                    </div>
                    <div className="flex justify-center">
                        <Link className="border rounded-lg px-4 py-1 mb-5 text-white bg-gradient-to-r from-red-300 to-yellow-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 select-none" to={"/"}>Close</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateNewUser;