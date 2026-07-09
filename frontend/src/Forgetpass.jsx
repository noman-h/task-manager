import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useEffect } from 'react'

function Forgetpass() {

    const navigate=useNavigate()
  const [err,seterr]=useState({})

  const [forgetshow,setforgetshow]=useState(false)
  const [notific,setnotific]=useState("")
  const [forgetd,setforgetd]=useState({
    email:"",
    otp:"",
    newpassword:"",
    confirmpassword:"",
  })

  
  async function handlesendotp() {
     const obj={}

     if(forgetd.email==="") obj.email="email is required"
    
      if(Object.keys(obj).length===0){
        const time=(moment().add(10,'minute').format())
     try{
        const result=await axios.patch('http://localhost:5000/task/otpsend',{...forgetd,expiretime:time})
        console.log(result);
        
       if(result.status===200){
        setnotific("otp send successfull")
       } 
    }
    catch(err){
      if(err.status===404){
        obj.email="email not found"
      }
    }
    }
    seterr(obj)
  }



  async function handleverifyotp() {
     const obj={}

     if(forgetd.otp==="") obj.email="otp is required"

      if(Object.keys(obj).length===0){
     try{
      
        const result=await axios.patch('http://localhost:5000/task/otpcheck',forgetd)
        if(result.status===200){
          setforgetshow(true)
           setnotific("otp verified successfully")
        }
       
    }
    catch(err){      
      if(err.status===401){
        obj.otp="wrong otp"
      }
      if(err.status===403){
        obj.otp="otp expired"
      }
    }
    }
    seterr(obj)
  }
  

  

  async function handlesubmit(e){

    e.preventDefault()
    const obj={}

    
    if(forgetd.newpassword==="") obj.password="password is required"
    if(forgetd.confirmpassword==="") obj.password="password is required"
    
    if(Object.keys(obj).length===0 &&
     forgetd.confirmpassword===forgetd.newpassword ){
     try{
      
        const result=await axios.patch('http://localhost:5000/task/forgetpass',forgetd)

        if(result){
           
        }
       setforgetd({
    email:"",
    expiretime:"",
    otp:"",
    newpassword:"",
    confirmpassword:""
  })
   setnotific(result?.data?.message)
   setTimeout(()=>{
     navigate('/login')
   },2000)
       
    }
    catch(err){
      if(err.status===404){
        obj.email="email not found"
      }
    }
    }
    else {
        obj.confirmpassword="confirm password is not same as new password"
    }
    seterr(obj)
  }

  useEffect(()=>{
    if(notific){
      setTimeout(() => {
        setnotific("")
      }, 3000);
    }
  },[notific])

  return (
    <div className='app-page flex flex-col items-center justify-center overflow-y-auto'>
      
      <div className='surface flex  w-full max-w-md items-center justify-center rounded-2xl p-6'>
         <form action="" className='flex w-full flex-col gap-5' onSubmit={handlesubmit}>
          <div>
            <h1 className='text-3xl font-black tracking-tight'>Recover password</h1>
            <p className='mt-1 text-sm opacity-70'>Create a new password for your account.</p>
          </div>

        {!forgetshow && <div>
              <div className='flex flex-col'>
          <label htmlFor="" className='mb-2 text-sm font-bold text-teal-700'>Email</label>
          <input value={forgetd.email} onChange={(e)=>setforgetd({...forgetd,email:e.target.value})} type="text"  className='field'/>
          <p className='mt-1 text-sm font-semibold text-rose-500'>{err.email}</p>
           </div>

           <div className='flex flex-col'>
          <label htmlFor="" className='mb-2 text-sm font-bold text-teal-700'>Enter 4 digit-Otp</label>
          <input value={forgetd.otp} onChange={(e)=>setforgetd({...forgetd,otp:e.target.value})} type="text"  className='field'/>
          <p className='mt-1 text-sm font-semibold text-rose-500'>{err.otp}</p>
           </div>
        </div> }
          

    {forgetshow && <div>
          <div className='flex flex-col'>
          <label htmlFor="" className='mb-2 text-sm font-bold text-teal-700'>New Password</label>
          <input value={forgetd.newpassword} onChange={(e)=>setforgetd({...forgetd,newpassword:e.target.value})}  type="password"  className='field'/>
           <p className='mt-1 text-sm font-semibold text-rose-500'>{err.newpassword}</p>
          </div>

          <div className='flex flex-col'>
          <label htmlFor="" className='mb-2 text-sm font-bold text-teal-700'>Confirm Password</label>
          <input value={forgetd.confirmpassword} onChange={(e)=>setforgetd({...forgetd,confirmpassword:e.target.value})}  type="password"  className='field'/>
           <p className='mt-1 text-sm font-semibold text-rose-500'>{err.confirmpassword}</p>
          </div></div>
}
         {!forgetshow &&
          <div className='flex justify-between gap-4'>
             <button className='btn-primary cursor-pointer w-full' onClick={()=>handlesendotp()}>send otp</button>
             <button className='btn-primary cursor-pointer w-full' onClick={()=>handleverifyotp()}>verify otp</button>
          </div>}
         
         {forgetshow && <button className='btn-primary cursor-pointer'>forget password</button>}
          

         </form>
      </div>
         <p className='text-teal-500 text-2xl'>{notific}</p>
    </div>
  )
}

export default Forgetpass
