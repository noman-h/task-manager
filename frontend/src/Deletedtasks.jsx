import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Deletedtasks() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [alltasks, setalltasks] = useState([]);
  async function gettasks() {
    const result = await axios.get("http://localhost:5000/task/getdeltask", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setalltasks(result.data);
  }

  const [alluser, setallusers] = useState([]);
  async function getusers() {
    try{
    const result = await axios.get("http://localhost:5000/task/getuser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setallusers(result.data);
  }
  catch(err){
            if(err.status===403){ 
              localStorage.clear("token")
              navigate('/login')
            }
            console.log(err)
          }
  }

  useEffect(() => {
    gettasks();
    getusers();
  }, []);

  async function handlerecover(item) {
    try{
    const result = await axios.patch(
      `http://localhost:5000/task/restoredele/${item._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    gettasks();
  }
  catch(err){
            if(err.status===403){ 
              localStorage.clear("token")
              navigate('/login')
            }
            console.log(err)
          }
  }


  function groupedTasks(u) {
    return alltasks.filter((i) =>
      i.taskassignby._id === u._id,
    );
  }
  
  
  return (
    <div className="app-page">
      <div className="content-shell">
      {alluser.length === 0 ? (
        <div className="surface flex min-h-80 items-center justify-center rounded-2xl p-8">
          <h1 className="text-2xl font-black text-teal-600">Data not found...</h1>
        </div>
      ) : (
        <div className="surface rounded-2xl p-4 sm:p-6">
          {alluser.length === 0 ? (
            <div>No users found</div>
          ) : (
            <div className="flex flex-col gap-8">
              {alluser.map((u) =>
              {
                const tasks=groupedTasks(u)
              return (
                <div>
                  <h1 className="mb-4 text-xl font-black tracking-tight text-teal-700">{u.name}</h1>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    
                    {(tasks.length===0) ?  <div className="text-red-400 text-3xl">no deleted tasks found...</div> : tasks.map((i) => (
                      <div>
                        {i.taskassignby._id === u._id && (
                          <div className="card flex h-full flex-col gap-3 rounded-2xl p-4 hover:-translate-y-0.5">
                            <h1
                              className={`text-xl font-black ${i.taskactivity === "pending" ? "text-blue-500" : "text-emerald-500"}`}
                            >
                              {i.taskname}
                            </h1>
                            <p className="text-sm leading-6 opacity-80">{i.taskdescription}</p>

                            <button
                              className="btn-primary mt-auto w-full cursor-pointer"
                              onClick={() => handlerecover(i)}
                            >
                              Restore
                            </button>
                          </div>
                        )}{" "}
                      </div>
                    ))}
                  </div>
                </div>)
})}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

export default Deletedtasks;
