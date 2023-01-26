import { useState } from 'react';
import Axios from 'axios';

const Register = () => {
    const url = "http://localhost:5000/api/Authenticate/register";
    const [data, setData] = useState({
        username: "",
        email: "",
        password: ""
    })

    function submit(e) {
        e.preventDefault();
        Axios.post(url, {
            Username: data.username,
            Email: data.email,
            Password: data.password
        })
            .then(res => {
                console.log(res.data)
            })
    }

    function handle(e) {
        const newData = { ...data };
        newData[e.target.id] = e.target.value;
        setData(newData);
        console.log(newData);
    }

    return (
        <div className="flex justify-center items-center py-10">
            <div className="relative shadow-2xl w-[30rem] px-14 py-5 bg-gray-100 rounded-md">
                <button className="absolute top-1 right-5 text-yellow-500 text-3xl">x</button>
                <h1 className="font-bold text-3xl my-10 py-1 text-center tracking-wider select-none">Signup Form</h1>
                <form
                    className="text-lg"
                    method="post"
                    onSubmit={(e) => submit(e)}>
                    <div className="flex flex-col gap-4 my-5">
                        <label className="mx-2 select-none" htmlFor="username">Username</label>
                        <input
                            onChange={(e) => handle(e)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="text"
                            id="username"
                            value={data.username} required>
                        </input>
                    </div>
                    <div className="flex flex-col gap-4 my-5">
                        <label className="mx-2 select-none" htmlFor="email">Email</label>
                        <input
                            onChange={(e) => handle(e)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="text"
                            id="email"
                            value={data.email} required>
                        </input>
                    </div>
                    <div className="flex flex-col gap-4 my-5">
                        <label className="mx-2 select-none" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => handle(e)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="password"
                            id="password"
                            value={data.password} required>
                        </input>
                    </div>
                    <div className="flex justify-center">
                        <button className="border rounded-lg px-4 py-1 my-5 text-white bg-gradient-to-r from-red-300 to-yellow-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 select-none" type="submit">Signup</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;