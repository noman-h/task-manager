import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Addtask({taskstatus,settaskstatus,gettasks,edit,setedit}) {

  const navigate=useNavigate()
    const token=localStorage.getItem("token")

      const [taskd,settaskd]=useState({
        taskname:"",
        taskdescription:"",
        taskduedate:"",
        taskassignto:"" ,
        taskfile:null
      })
useEffect(()=>{
  if(edit){
    settaskd(edit)
  }
},[edit])

 const [notif,setnotif]=useState("")
 const [err,seterr]=useState("")

   async function addtask(){
     const obj={}

     if(!taskd.taskname) obj.taskname="enter task name"
     if(!taskd.taskdescription) obj.taskdescription="enter task  description"
     if(!taskd.taskduedate)  obj.taskduedate="select task date"
     if(!taskd.taskassignto) obj.taskassignto="select task assign to"

    seterr(obj)

    if(Object.keys(obj).length===0){
          if(edit){
           try{
           
            const formData = new FormData();

formData.append("taskname", taskd.taskname);
formData.append("taskdescription", taskd.taskdescription);
formData.append("taskduedate", taskd.taskduedate);
formData.append("taskassignto", taskd.taskassignto);

if (taskd.taskfile) {
  formData.append("taskfile", taskd.taskfile);
}

if (taskd._id) {
  formData.append("_id", taskd._id);
}



            const result =await axios.patch('http://localhost:5000/task/updatetask',formData,{headers:{
              Authorization:`Bearer ${token}`
            }})
            
            if(result.status===200){
              settaskd({
                 taskname:"",
        taskdescription:"",
        taskduedate:"",
        taskassignto:"",
         taskfile:null
              })
              gettasks()
              setedit(false)
              setnotif("task updated successfully")
            }
          }
          catch(err){
            if(err.status===403){ 
              localStorage.clear("token")
              navigate('/login')
            }
            console.log(err)
          }
          }
          else{
          try{

            const formData = new FormData();

formData.append("taskname", taskd.taskname);
formData.append("taskdescription", taskd.taskdescription);
formData.append("taskduedate", taskd.taskduedate);
formData.append("taskassignto", taskd.taskassignto);

if (taskd.taskfile) {
  formData.append("taskfile", taskd.taskfile);
}


            const result =await axios.post('http://localhost:5000/task/addtask',formData,{headers:{
              Authorization:`Bearer ${token}`
            }})
            
            if(result.status===201){
              settaskd({
                taskname:"",
        taskdescription:"",
        taskduedate:"",
        taskassignto:"",
         taskfile:null
              })
              gettasks()
              setnotif("task added successfully")
            }
          }
          catch(err){
            if(err.status===403){ 
              localStorage.clear("token")
              navigate('/login')
            }
            console.log(err)
          }
        }
    }
   }

   useEffect(()=>{
     if(notif){
      setTimeout(() => {
        setnotif("")
      },3000);
     }
   },[notif])

    const [alluser,setallusers]=useState([])
   async function getusers(){
    try{
    const result=await axios.get('http://localhost:5000/task/alluser',{headers:{
              Authorization:`Bearer ${token}`
            }})
          setallusers(result.data)
    }
    catch(err){
            if(err.status===403){ 
              localStorage.clear("token")
              navigate('/login')
            }
            console.log(err)
          }
   }
   useEffect(()=>{
      getusers()
   },[])

   function useroption(){
    return alluser.map((i)=> <option value={i._id}>{i.name}</option> )
   }
 
  
  return (
    <div>
         {taskstatus && <div className='fixed inset-0 z-50 bg-slate-950/60 p-4 backdrop-blur-sm'>
     <div className='flex h-full w-full flex-col items-center justify-center'>
            <div className='surface w-full max-w-md rounded-2xl p-5'>
                <div className='mb-5 flex items-center justify-between'>
                   <h3 className='text-2xl font-black tracking-tight'>{(edit) ? "Update task" : "Add task"}</h3>
          <button className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-rose-500 font-black text-white hover:bg-rose-600' onClick={()=>settaskstatus(false)}>x</button>
                </div>
          

          <div className='mb-4'>
             <input className='field' type="text" name="" id="" placeholder='Task name'
          value={taskd.taskname}
           onChange={(e)=>settaskd({...taskd,taskname:e.target.value})} />
           <p className='mt-1 text-sm font-semibold text-rose-500'>{err.taskname}</p>
          </div>
         

          <div className='mb-4'>
            <textarea className='field min-h-28 resize-y' name="" id="" placeholder='Task description' 
          value={taskd.taskdescription}
          onChange={(e)=>settaskd({...taskd,taskdescription:e.target.value})}></textarea>
          <p className='mt-1 text-sm font-semibold text-rose-500'>{err.taskdescription}</p>
          </div>
          
          <div className='mb-4'>
            <label htmlFor="" className='mb-2 block text-sm font-bold text-teal-700'>
               Due date</label>
              <input className='field' value={taskd.taskduedate}
           onChange={(e)=>settaskd({...taskd,taskduedate:e.target.value})} type="date" />
           <p className='mt-1 text-sm font-semibold text-rose-500'>{err.taskduedate}</p>
          </div>
         
        

          <div className='mb-5'>
            <select className='field' name="" id=""  value={taskd.taskassignto}
           onChange={(e)=>settaskd({...taskd,taskassignto:e.target.value})}>
            <option value="" disabled>Assign to</option>
            {useroption()}
          </select>
          <p className='mt-1 text-sm font-semibold text-rose-500'>{err.taskassignto}</p>
          </div>

          <div className='mb-5'>
            <input className='border rounded' type="file" 
            onChange={(e)=>settaskd({...taskd,taskfile:e.target.files[0]})
            }
            />
          </div>

          <button className='btn-primary w-full cursor-pointer' onClick={()=>addtask()}>{(edit) ? "Update task" : "Add task"}</button>

        </div>
        <p className='mt-3 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-500'>{notif}</p>
      </div>
    </div>}
    </div>
    
    
  )
}

export default Addtask
