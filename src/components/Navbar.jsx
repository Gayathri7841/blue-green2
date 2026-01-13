import React, { useContext, useState } from 'react';
import logo from '../assets/logo.png'; // Import the logo properly
import search_icon from '../assets/search_icon.png'; 
import profile_icon from '../assets/profile_icon.png'; 
import cart_icon from '../assets/cart_icon.png'; 
import menu_icon from '../assets/menu_icon.png';  

import { Link, NavLink } from 'react-router-dom'; // Ensure this import is correctly formatted
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible,setVisible]=useState(false);
  const {setShowSearch,getCartCount}= useContext(ShopContext);
  return (
    <div className='flex items-center justify-between py-5 font-medium'>
     <div className="flex items-center gap-1">
 <Link to='/'> <img src={logo} className="w-20" alt="Logo" /></Link>
  <p className="text-gray-800 text-sm font-semibold">CLICKIT</p>
</div>


      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1' >
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'  />
        </NavLink>

        <NavLink to='/collection' className='flex flex-col items-center gap-1' >
          <p>MARKETPLACE</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>

        <NavLink to='/about' className='flex flex-col items-center gap-1' >
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink to='/contact' className='flex flex-col items-center gap-1' >
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>
      <div className='flex items-center gap-6'>
        <img onClick={()=>setShowSearch(true)} src={search_icon} alt="Search Icon" className='w-10 cursor-pointer' />
        <div className='relative group'>
          <img src={profile_icon} alt="Profile Icon" className='w-10 cursor-pointer' />
          <div className='absolute right-0 hidden group-hover:block mt-2 bg-white border border-gray-200 shadow-lg'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 text-gray-700'>
              <p className='cursor-pointer hover:text-black'>Profile</p>
              <p className='cursor-pointer hover:text-black'>My Orders</p>
              <p className='cursor-pointer hover:text-black'>Logout</p>
            </div>
          </div>
        </div>
        <Link to='/cart' className='relative'>
        <img src={cart_icon} className='w-10 min-w-5' alt=''/>
        <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[10px]'>{getCartCount()}</p>
        </Link>
        <img onClick={()=>setVisible(true)} src={menu_icon} alt="" className='w-10 cursor-pointer sm:hidden'/>
      </div>
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3'>
            <img src="dropdown_icon" alt="" className='h-4 rotate-180' />
               <p>Back</p>
          </div>
          <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={()=>setVisible(false)}  className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
          <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
         
        </div>

      </div>
    </div>
  );
};

export default Navbar;
