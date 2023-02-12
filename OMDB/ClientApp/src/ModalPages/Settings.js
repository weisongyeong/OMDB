import { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from "../Components/Loading";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Settings = () => {
    const [algorithm, setAlgorithm] = useState('');
    const [sampleNum, setSampleNum] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();
    let token = sessionStorage.getItem('token');

    useEffect(() => {
        let url = "api/settings/get-settings";
        axios.get(url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
        .then(res => {
            let prevSetting = res.data;
            setAlgorithm(prevSetting.similarityAlgorithm);
            setSampleNum(prevSetting.sampleNum);
            setLoading(true);
        })
    }, [])

    // call login api
    const UpdateSetting = (e) => {
        let url = "api/settings/update-settings";
        e.preventDefault();
        if (IsValidate()) {
            axios.put(url, {
                SimilarityAlgorithm: algorithm,
                SampleNum: sampleNum
            }, {
                headers: {
                    'Authorization': `bearer ${token}`
                }
            })
                .then(res => {
                    toast.success('Settings updated successfully.')
                    navigate('/');
                })
                .catch((err) => {
                    toast.error('Failed :' + err.message);
                })
        }
    }

    // validation check
    const IsValidate = () => {
        let isproceed = true;
        if (algorithm != 'Cosine Similarity Index' &&
            algorithm != 'Jaccard Similarity Index' &&
            algorithm != 'Pearson Correlation Coefficient') {
            isproceed = false;
            toast.warning('Please select an algorithm');
        }
        return isproceed;
    }

    return (
        <div className="flex justify-center items-center py-10">
            <div className="relative shadow-2xl w-[30rem] px-14 py-5 bg-gray-100 rounded-md">                
                <h1 className="font-bold text-3xl my-10 py-1 text-center tracking-wider select-none">Settings</h1>
                {
                    loading ?
                        <form
                            method="post"
                            onSubmit={UpdateSetting}>
                            <div className="flex flex-col gap-5 mt-16 mb-10 items-start">
                                <div className="mx-2 text-lg">Similarity algorithm</div>
                                <div className="ml-20">
                                    <div className="flex gap-2 items-center text-sm">
                                        <input
                                            type="radio"
                                            id="cosine"
                                            value="Cosine Similarity Index"
                                            checked={algorithm === 'Cosine Similarity Index'}
                                            onChange={e => setAlgorithm(e.target.value)}>
                                        </input>
                                        <label htmlFor="cosine">Cosine Similarity Index</label>
                                    </div>

                                    <div className="flex gap-2 items-center text-sm">
                                        <input
                                            type="radio"
                                            id="jaccard"
                                            value="Jaccard Similarity Index"
                                            checked={algorithm === 'Jaccard Similarity Index'}
                                            onChange={e => setAlgorithm(e.target.value)}>
                                        </input>
                                        <label
                                        htmlFor="jaccard">Jaccard Similarity Index</label>
                                    </div>

                                    <div className="flex gap-2 items-center text-sm">
                                        <input
                                            type="radio"
                                            id="pearson"
                                            value="Pearson Correlation Coefficient"
                                            checked={algorithm === 'Pearson Correlation Coefficient'}
                                            onChange={e => setAlgorithm(e.target.value)}>
                                        </input>
                                        <label htmlFor="pearson">Pearson Correlation Coefficient</label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 mt-10 mb-10 items-start">
                                <label className="mx-2 text-base">Minimum number of sample per movie</label>
                                <input
                                    onChange={e => setSampleNum(e.target.value)}
                                    className="ml-20 text-sm border rounded-2xl py-1.5 px-3 focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"
                                    type="number"
                                    value={sampleNum} required>
                                </input>
                            </div>
                            <div className="flex justify-center">
                                <button className="border rounded-lg px-4 py-1 my-2 text-white bg-gradient-to-r from-red-300 to-yellow-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 select-none" type="submit">Save</button>
                            </div>
                            <div className="flex justify-center">
                                <Link className="border rounded-lg px-4 py-1 my-2 text-white bg-gradient-to-r from-red-300 to-yellow-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 select-none" to="/">Back to Home</Link>
                            </div>
                        </form>
                        : <Loading />
                }
            </div>
        </div>
    )
}

export default Settings;