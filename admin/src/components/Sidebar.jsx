import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div>

        <div>

            <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/add">

             <img className='w-5 h-5' src={assets.add_icon} alt="" />
             <p className='hidden md:block'>Add Items</p>


            </NavLink>

        </div>

    </div>
  )
}

export default Sidebar