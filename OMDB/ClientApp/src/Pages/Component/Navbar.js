import { Link } from "react-router-dom"

const Authorized = (props) => {
    const isAdmin = props.isAdmin;
    if (isAdmin) {
        return (
            <>
                <div className="flex gap-4">
                    <Link className="hover:bg-gray-800 rounded px-3 py-1 tracking-wider select-none" to="/create-new-user">Create New User</Link>
                </div>
                <div className="flex gap-4">
                    <Link className="hover:bg-gray-800 rounded px-3 py-1 tracking-wider select-none" to="/register-admin">Create New Admin</Link>
                </div>
            </>
        )
    }
}

const Navbar = () => {
    return (
        <nav className="bg-gray-900 h-16 flex text-white font-semibold px-10 justify-between items-center">
            <div className='flex items-center gap-7'>
                <div>
                    <a className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-yellow-400 select-none" >OMDB</a>
                </div>
                <div className="flex gap-4">
                    <Link className="hover:bg-gray-800 rounded px-3 py-1 tracking-wider select-none" to="/">Home</Link>
                </div>
            </div>
                <div className='flex items-center gap-7'>
                    <Authorized isAdmin={sessionStorage.getItem('role')} />
                    <div className="flex gap-4">
                        <Link className="hover:bg-gray-800 rounded px-3 py-1 tracking-wider select-none" to="/login">Logout</Link>
                    </div>
                </div>
        </nav>
    )
}

export default Navbar;