import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import usetheme from './usetheme';
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

function Header() {

  const navigate=useNavigate()

  const {theme,toggletheme}=usetheme()



async function logout() {
  try {
    await signOut(auth);
    console.log("Logged out");
  } catch (error) {
    console.log(error.message);
  }
}
  

  const token=localStorage.getItem("token");
  const userstatus=localStorage.getItem("user");
  const email=localStorage.getItem("email");

  const [toggle,settoggle]=useState(false)
  const icon=email?.split('')[0]

  

  return (
      <div>
     {token && <div className='app-header sticky top-0 z-40 px-4 py-3'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4'>
     <div className='flex items-center gap-2'>
        <Link className='rounded-xl px-3 py-2 text-sm font-bold hover:bg-teal-500 hover:text-white' to='/'>Home</Link>
 <Link className='rounded-xl px-3 py-2 text-sm font-bold hover:bg-teal-500 hover:text-white' to='/deletedtasks'>Deleted Tasks</Link>
      </div>
        {(userstatus) && <h2 className='hidden rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-sm font-bold text-teal-700 sm:block'>hey {userstatus}</h2>}
      <div className='flex items-center gap-2'>
       <div className='relative flex items-center gap-2'>
           <button className='btn-secondary px-3 py-2 text-sm capitalize cursor-pointer' onClick={()=>toggletheme()}>{theme} mode</button>
          <button className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-teal-500/30 bg-teal-600 text-lg font-black uppercase text-white shadow-lg shadow-teal-700/20 hover:bg-teal-500' onClick={()=>settoggle(!toggle)}>{icon}</button>
          <div className='absolute right-0 top-12'>
             {toggle && <div className='card flex w-44 flex-col gap-2 rounded-xl p-3'>
                   

        <Link className='rounded-lg px-3 py-2 text-sm font-semibold hover:bg-teal-500 hover:text-white' to='/resetpass'>Reset Password</Link>

         <button className='rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-red-500 hover:text-white cursor-pointer' onClick={()=>{
          logout()
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          navigate('/login')
          }}>Logout</button>
          </div> }
          </div>
         
        </div>
       
      </div>
      </div>
    </div>
        }
        </div> 
  )
}

export default Header



