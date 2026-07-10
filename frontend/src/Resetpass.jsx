import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Resetpass() {

    
  const navigate=useNavigate()
  const [err,seterr]=useState({})

  const [resetd,setresetd]=useState({
    email:"",
    password:"",
    newpassword:"",
    confirmpassword:"",
  })


  async function handlesubmit(e){

    e.preventDefault()
    const obj={}

    if(resetd.email==="") obj.email="email is required"
    if(resetd.password==="") obj.password="password is required"
     if(resetd.newpassword==="") obj.newpassword="password is required"
    if(resetd.confirmpassword==="") obj.confirmpassword="password is required"

    if(Object.keys(obj).length===0 &&
    resetd.newpassword===resetd.confirmpassword){
        
        if(resetd.newpassword !==resetd.password){
               try{
                const token=localStorage.getItem("token")
         const result=await axios.patch(`${import.meta.env.VITE_API_URL}/task/resetpass`,resetd,{headers:{
              Authorization:`Bearer ${token}`
            }})
      
   
               setresetd({
    email:"",
    password:"",
    newpassword:"",
    confirmpassword:""
  })
alert(result?.data?.message)
localStorage.removeItem("token")
navigate('/login')        
        
    }
    catch(err){
        
        if(err.status===404){
            obj.email="email not found"
        }
        if(err.status===401){
          obj.password="wrong password"

      }
    }
        }
     else {
        obj.newpassword="new password is same as old password"
     }   
    
    }
    else {
         obj.confirmpassword="confirm password is not same as new password"
    }
    seterr(obj)
  }

  return (
     <div className='app-page flex items-center justify-center overflow-y-auto'>
      
      <div className='surface flex w-full max-w-md items-center justify-center rounded-2xl p-6'>
         <form action="" className='flex w-full flex-col gap-5' onSubmit={handlesubmit}>
          <div>
            <h1 className='text-3xl font-black tracking-tight'>Reset password</h1>
            <p className='mt-1 text-sm opacity-70'>Confirm your current password before changing it.</p>
          </div>


           <div className='flex flex-col'>
          <label htmlFor="" className='mb-2 text-sm font-bold text-teal-700'>Email</label>
          <input value={resetd.email} onChange={(e)=>setresetd({...resetd,email:e.target.value})} type="text"  className='field'/>
          <p className='mt-1 text-sm font-semibold text-rose-500'>{err.email}</p>
           </div>

           <div className='flex flex-col'>
          <label htmlFor="" className='mb-2 text-sm font-bold text-teal-700'>Password</label>
          <input value={resetd.password} onChange={(e)=>setresetd({...resetd,password:e.target.value})}  type="password"  className='field'/>
           <p className='mt-1 text-sm font-semibold text-rose-500'>{err.password}</p>
          </div>

          <div className='flex flex-col'>
          <label htmlFor="" className='mb-2 text-sm font-bold text-teal-700'>New Password</label>
          <input value={resetd.newpassword} onChange={(e)=>setresetd({...resetd,newpassword:e.target.value})}  type="password"  className='field'/>
           <p className='mt-1 text-sm font-semibold text-rose-500'>{err.newpassword}</p>
          </div>

          <div className='flex flex-col'>
          <label htmlFor="" className='mb-2 text-sm font-bold text-teal-700'>Confirm Password</label>
          <input value={resetd.confirmpassword} onChange={(e)=>setresetd({...resetd,confirmpassword:e.target.value})}  type="password"  className='field'/>
           <p className='mt-1 text-sm font-semibold text-rose-500'>{err.confirmpassword}</p>
          </div>

          <button className='btn-primary cursor-pointer'>Reset password</button>

         </form>
      </div>
    </div>
  )
}

export default Resetpass
