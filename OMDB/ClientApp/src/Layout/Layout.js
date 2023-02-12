import { Outlet, Link } from "react-router-dom"

// authorized link for admin
const AuthorizedLink = ({ IsAdmin }) => {
    if (IsAdmin) {
        return (
            <>
                <Link className="block text-gray-400 text-center hover:text-white rounded w-full px-2 py-1 tracking-wider select-none" to="/create-new-user">Create New User</Link>
                <Link className="block text-gray-400 text-center hover:text-white rounded w-full px-2 py-1 tracking-wider select-none" to="/register-admin">Create New Admin</Link>
                <Link className="block text-gray-400 text-center hover:text-white rounded w-full px-2 py-1 tracking-wider select-none" to="/settings">Settings</Link>
            </>
        )
    }
}

// NAVBAR
const Layout = () => {

    return (
        <>
            <nav className="bg-gray-900 h-16 flex text-white font-semibold px-10 justify-between items-center">
                <div className='flex items-center gap-4'>
                    <div>
                        <a className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-yellow-400 select-none" >OMDB</a>
                    </div>
                    <div className="flex gap-4">
                        <Link className=" text-gray-400 hover:text-white rounded px-2 py-1 tracking-wider select-none" to="/">Home</Link>
                        <Link className=" text-gray-400 hover:text-white rounded px-2 py-1 tracking-wider select-none" to="/new-movies">New Movies</Link>
                        <Link className=" text-gray-400 hover:text-white rounded px-2 py-1 tracking-wider select-none" to="/search">Search</Link>
                        <Link className=" text-gray-400 hover:text-white rounded px-2 py-1 tracking-wider select-none" to="/favourites">Favourites</Link>
                    </div>
                </div>
                <div className="group rounded text-gray-400 relative inline-block w-[15rem] select-none z-50">
                    <div className="group-hover:text-white text-center py-2">{sessionStorage.getItem('username')}</div>
                    <div className="group-hover:flex hidden absolute bg-gray-900 flex-col w-full rounded-md py-2">
                        <AuthorizedLink IsAdmin={sessionStorage.getItem('role')} />
                        <Link className="text-gray-400 text-center hover:text-white rounded w-full px-3 py-1 tracking-wider select-none" to="/change-pass">Change Password</Link>
                        <Link className="text-gray-400 text-center hover:text-white rounded w-full px-3 py-1 tracking-wider select-none" to="/login">Logout</Link>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    )
}

export default Layout;