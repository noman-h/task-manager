import React from "react";
import moment from "moment";

function Viewdatetasks({ alltasks,user, date, setdate }) {

 
  function grouptasks(u){
      return alltasks.filter((i)=>{
          if(i?.taskassignto?._id===u._id || i?.taskassignby?._id===u._id &&
            moment(i.taskduedate).isSame(moment(new Date(date)),"day")
          ) return i; 
          
           })
  }
  
  function statusstyle(status){
    if(status==="completed") return "bg-emerald-500/15 text-emerald-600";
    if(status==="inprogress") return "bg-amber-500/15 text-amber-600";
    return "bg-blue-500/15 text-blue-600";
  }

  function taskcard(i,type){
    return <div className="card rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-teal-700">{i.taskname}</h3>
          <p className="mt-2 text-sm leading-6 opacity-80">{i.taskdescription}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black uppercase ${statusstyle(i.taskactivity)}`}>
          {i.taskactivity}
        </span>
      </div>

      <img src={i.images} alt="" />

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        {type==="to" ? (
          <p>
            <span className="block font-bold text-teal-600">Assigned by</span>
            {i.taskassignby?.name}
          </p>
        ) : (
          <p>
            <span className="block font-bold text-teal-600">Assigned to</span>
            {i.taskassignto?.name}
          </p>
        )}
        <p>
          <span className="block font-bold text-teal-600">Due date</span>
          {i.taskduedate?.split("T")[0]}
        </p>
      </div>
    </div>
  }

  function assignto(tasks,u){
      
       return tasks.map((i)=>{
       if(i?.taskassignto?._id===u._id){
       return <div key={i._id}>
        {taskcard(i,"to")}
      </div>} })
  }

  function assignby(tasks,u){
      
       return tasks.map((i)=>{
       if(i?.taskassignby?._id===u._id){
       return <div key={i._id}>
        {taskcard(i,"by")}
      </div>} })
  }

  
  return (
    <div>
      {date && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">

 <div className="surface relative max-h-[85vh] w-full max-w-4xl overflow-y-scroll rounded-2xl p-6">
         <button
              onClick={() => setdate("")}
              className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-rose-500 font-black text-white hover:bg-rose-600"
            >
              x
            </button>

        <div className="mb-6 pr-12">
          <p className="text-sm font-bold uppercase text-teal-600">Tasks by date</p>
          <h1 className="text-3xl font-black tracking-tight">{moment(new Date(date)).format("DD MMM YYYY")}</h1>
        </div>

        <div className="flex flex-col gap-8">
        {user.map((u)=>{
          const tasks=grouptasks(u)
         return <div className="rounded-2xl border border-slate-400/20 p-4" key={u._id}>
            <h2 className="mb-4 text-xl font-black tracking-tight text-teal-700">{u.name}</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 rounded-full bg-teal-500/10 px-4 py-2 text-sm font-black uppercase text-teal-700">My Tasks</h3>
                <div className="flex flex-col gap-3">
                  {assignto(tasks,u)}
                </div>
              </div>

              <div>
                <h3 className="mb-3 rounded-full bg-teal-500/10 px-4 py-2 text-sm font-black uppercase text-teal-700">Given Tasks</h3>
                <div className="flex flex-col gap-3">
                  {assignby(tasks,u)}
                </div>
              </div>
            </div>
          </div>
        })}
        </div>
       </div>
        </div>  
      )}
    </div>
  );
}

export default Viewdatetasks;
