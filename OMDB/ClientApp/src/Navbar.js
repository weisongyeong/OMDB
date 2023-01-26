const Navbar = () => {
    return (
        <nav className="bg-gray-900 h-16 flex text-white font-semibold px-10 justify-between items-center">
            <div className='flex items-center gap-7'>
                <div>
                    <a className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-yellow-400 select-none" >OMDB</a>
                </div>
                <div className="flex gap-4">
                    <a className="hover:bg-gray-800 rounded px-3 py-1 tracking-wider select-none" href="#">Home</a>
                </div>
            </div>
            <div className='flex items-center gap-7'>
                <form id="form">
                    <input type="text" placeholder="Search" id="search" className="py-1 px-2 bg-gray-700 border rounded-xl border-[#333] text-[#999] placeholder-[#999] focus:outline-none focus:border-[#9ecaed] focus:shadow-[0_0_10px_#92caed]"></input>
                </form>
                <div className="flex gap-4">
                    <a className="hover:bg-gray-800 rounded px-3 py-1 tracking-wider select-none" href="#">Login</a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;