import { useState } from 'react';
import Axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChangePassword = () => {
    const [currPassword, currPasswordUpdate] = useState('');
    const [newPassword, newPasswordUpdate] = useState('');
    const [confirmNewPassword, confirmNewPasswordUpdate] = useState('');
    let token = sessionStorage.getItem('token');
    let userId = sessionStorage.getItem('user id');
    const navigate=useNavigate();

    // call change password API
    const UpdatePassword = (e) => {
        e.preventDefault();
        if (validate()) {
            Axios.put(`api/authenticate/${userId}`, {
                CurrentPassword: currPassword,
                NewPassword: newPassword
            }, {
                headers: {
                    'Authorization': `bearer ${token}`
                }
            })
            .then(res => {
                if (res.data.status == 'Error') {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
                    navigate('/');
                }
            })
            .catch((err) => {
                toast.error(err.message);
            });
        }
    }

    // validation check
    const validate = () => {
        let result = true;
        if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(newPassword)) {
            result = true;
        } else {
            result = false;
            toast.warning('Please enter the password that contains 8 to 15 characters, at least one lowercase letter, one uppercase letter, one numeric digit, and one special character');
        }
        if (newPassword != confirmNewPassword) {
            result = false;
            toast.warning('Your password and confirm password must be the same');
        }
        return result;
    }

    return (
        <div className="flex justify-center items-center py-10">
            <div className="relative shadow-2xl w-[30rem] px-14 py-5 bg-gray-100 rounded-md">                
                <h1 className="font-bold text-3xl my-10 py-1 text-center tracking-wider select-none">Change Password</h1>
                <form
                    className="text-lg"
                    method="post"
                    onSubmit={UpdatePassword}>
                    <div className="flex flex-col gap-4 mt-16 mb-10">
                        <label className="mx-2 select-none" htmlFor="curr-pass">Current Password</label>
                        <input
                            onChange={e => currPasswordUpdate(e.target.value)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="password"
                            id="curr-pass"
                            value={currPassword} required>
                        </input>
                    </div>
                    <div className="flex flex-col gap-4 my-5">
                        <label className="mx-2 select-none" htmlFor="new-pass">New Password</label>
                        <input
                            onChange={e => newPasswordUpdate(e.target.value)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="password"
                            id="new-pass"
                            value={newPassword} required>
                        </input>
                    </div>
                    <div className="flex flex-col gap-4 my-5">
                        <label className="mx-2 select-none" htmlFor="conf-new-pass">Confirm New Password</label>
                        <input
                            onChange={e => confirmNewPasswordUpdate(e.target.value)}
                            className="border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                            type="password"
                            id="conf-new-pass"
                            value={confirmNewPassword} required>
                        </input>
                    </div>
                    <div className="flex justify-center">
                        <button className="border rounded-lg px-4 py-1 mt-5 mb-2 text-white bg-gradient-to-r from-red-300 to-yellow-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 select-none" type="submit">Update</button>
                    </div>
                    <div className="flex justify-center">
                        <Link className="border rounded-lg px-4 py-1 mb-5 text-white bg-gradient-to-r from-red-300 to-yellow-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 select-none" to={"/"}>Close</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword;