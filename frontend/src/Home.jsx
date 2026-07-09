import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Addtask from "./Addtask";
import Viewmodel from "./Viewmodel";
import moment from "moment";
import useview from "./useview";
import DatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css";
import Viewdatetasks from "./Viewdatetasks";
import Pdfdownload from "./Pdfdownload";

function Home() {
  const navigate = useNavigate();

  const { view, toggleview } = useview();

  const token = localStorage.getItem("token");
  const userstatus = localStorage.getItem("user");

  const [taskdata, settaskdata] = useState([]);
  const [currenttab, setcurrenttab] = useState("mytasks");

  async function gettasks() {
    try {
      const token = localStorage.getItem("token");
      const result = await axios.get("http://localhost:5000/task/gettask", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      settaskdata(result.data);
    }catch(err){
            if(err.status===403){ 
              localStorage.clear("token")
              navigate('/login')
            }
            console.log(err)
          }
  }

  const [alluser, setalluser] = useState([]);
  async function getallusers() {
    try{
    const result = await axios.get("http://localhost:5000/task/alluser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setalluser(result.data);
  }catch(err){
            if(err.status===403){ 
              localStorage.clear("token")
              navigate('/login')
            }
            console.log(err)
          }
  }


  const [user, setuser] = useState([]);
  async function getusers() {
    try{
    const result = await axios.get("http://localhost:5000/task/getuser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setuser(result.data);
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
    getallusers();
    getusers();
  }, []);

  async function del(id) {
    try{
    const result = await axios.delete(
      `http://localhost:5000/task/deletetask/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    alert(result?.data?.message);
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

  async function tempdel(id) {
    try{
    const result = await axios.patch(
      `http://localhost:5000/task/tempdele/${id}`,
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


  

  const [taskstatus, settaskstatus] = useState(false);
  const [edit, setedit] = useState(false);
  function edittask(data) {
    settaskstatus(true);
    setedit(data);
  }

  async function handletaskactive(i, activity) {
    console.log(currenttab, activity);
    console.log(i.taskactivity);

    if (currenttab === "mytasks" && !(i.taskactivity === "completed")) {
      try{
      const result = await axios.patch(
        `http://localhost:5000/task/taskactive?id=${i._id}&&activity=${activity}`,
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
    } else if (!(currenttab === "mytasks")) {
      try{
      const result = await axios.patch(
        `http://localhost:5000/task/taskactive?id=${i._id}&&activity=${activity}`,
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
  }

  const [viewid, setviewid] = useState("");

  const [search, setsearch] = useState("");
  const [sortd, setsortd] = useState("");

  const alltasks = taskdata
    .filter((i) => {
      if (i.taskname.toLowerCase().includes(search.toLowerCase())) return i;
      else if (
        i.taskassignby?.name.toLowerCase().includes(search.toLowerCase()) &&
        (currenttab === "mytasks" || currenttab === "alltasks")
      )
        return i;
      else if (
        i.taskassignto?.name.toLowerCase().includes(search.toLowerCase()) &&
        (currenttab === "giventask" || currenttab === "alltasks")
      )
        return i;
      else if (search === "") return i;
    })
    .filter((i) => {
      if (
        i.taskassignby?.name.toLowerCase().includes(sortd.toLowerCase()) &&
        (currenttab === "mytasks" || currenttab === "alltasks")
      )
        return i;
      else if (
        i.taskassignto?.name.toLowerCase().includes(sortd.toLowerCase()) &&
        (currenttab === "giventask" || currenttab === "alltasks")
      )
        return i;
      else if (sortd === "") return i;
    });

  function optionsprint() {
    return alluser.map((i) => <option value={i.name}>{i.name}</option>);
  }

  function datestatus(date,status) {
    
    if (moment(date).isSame(moment(), "day") && status!=="completed") {
      return "status-due-today";
    } else if (moment(date).isBefore(moment(), "day") && status!=="completed") {
      return "status-overdue";
    } else {
      return "status-upcoming";
    }
  }

  function groupedTasks(u) {
    return alltasks.filter((i) =>
      currenttab === "mytasks"
        ? i.taskassignto._id === u._id
        : i.taskassignby._id === u._id,
    );
  }

  function statusBadge(task) {
    return (
      <span className="rounded-full bg-slate-900/10 px-2 py-1 text-xs font-bold uppercase tracking-wide">
        {task.taskactivity}
      </span>
    );
  }

  function statusSelect(task) {
    return (
      <select
        name=""
        id=""
        className="field py-2 text-sm"
        value={task.taskactivity}
        onChange={(e) => handletaskactive(task, e.target.value)}
      >
        <option value="pending">pending</option>
        <option value="inprogress">in progress</option>
        <option value="completed">completed</option>
      </select>
    );
  }

  function actionButtons(task, compact = false) {
    if (currenttab === "mytasks") {
      return (
        <button
          className="btn-secondary w-full cursor-pointer px-3 py-2 text-sm"
          onClick={() => setviewid(task._id)}
        >
          View
        </button>
      );
    }

    return (
      <div className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-2"}`}>
        <button
          className="btn-secondary cursor-pointer px-2 py-2 text-sm"
          onClick={() => setviewid(task._id)}
        >
          View
        </button>
        <button
          className="btn-secondary cursor-pointer px-2 py-2 text-sm"
          onClick={() => del(task._id)}
        >
          Delete
        </button>
        <button
          className="btn-secondary cursor-pointer px-2 py-2 text-sm"
          onClick={() => tempdel(task._id)}
        >
          Temp Delete
        </button>
        <button
          className="btn-secondary cursor-pointer px-2 py-2 text-sm"
          onClick={() => edittask(task)}
        >
          Edit
        </button>
      </div>
    );
  }

  function taskCard(task, showBothUsers = false) {
    return (
      <div
        className={`card task-card-accent flex h-full flex-col gap-3 rounded-2xl p-4 hover:-translate-y-0.5 ${datestatus(task.taskduedate,task.taskactivity)}`}
      >
        <h1
          className={`text-xl font-black ${task.taskactivity === "pending" ? "text-blue-500" : "text-emerald-500"}`}
        >
          {task.taskname}
        </h1>
         
         <img src={task.images} alt="" />

        <p className="text-sm leading-6 opacity-80">{task.taskdescription}</p>

        <p className="text-sm">
          <span className="font-bold text-teal-600">Created:</span>{" "}
          {task.createdAt?.split("T")[0] || task.updatedAt?.split("T")[0]}
        </p>

        <p className="text-sm">
          <span className="font-bold text-teal-600">Due:</span>{" "}
          {task.taskduedate?.split("T")[0]}
        </p>

        {showBothUsers ? (
          <>
            <p className="text-sm">
              <span className="font-bold text-teal-600">By:</span>{" "}
              {task.taskassignby.name}
            </p>
            <p className="text-sm">
              <span className="font-bold text-teal-600">To:</span>{" "}
              {task.taskassignto.name}
            </p>
          </>
        ) : currenttab === "mytasks" ? (
          <p className="text-sm">
            <span className="font-bold text-teal-600">Assigned by:</span>{" "}
            {task.taskassignby.name}
          </p>
        ) : (
          <p className="text-sm">
            <span className="font-bold text-teal-600">Assigned to:</span>{" "}
            {task.taskassignto.name}
          </p>
        )}

        <p className="text-sm">
          <span className="font-bold text-teal-600">Status:</span>{" "}
          {statusBadge(task)}
        </p>

        <div className="mt-auto flex flex-col gap-2">
          {actionButtons(task, true)}
         
           {statusSelect(task)}
         
        </div>
      </div>
    );
  }

  function taskTable(tasks, showBothUsers = false) {
    return (
      <div className="table-shell overflow-x-auto rounded-2xl">
        <table className="task-table w-full min-w-215">
          <thead>
            <tr>
              <th>Task</th>
              <th>Description</th>
              <th>Created</th>
              <th>Due</th>
              {showBothUsers ? (
                <>
                  <th>By</th>
                  <th>To</th>
                </>
              ) : (
                <th>{currenttab === "mytasks" ? "Assigned by" : "Assigned to"}</th>
              )}
              <th>Status</th>
              <th>Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>
                  <span
                    className={`font-black ${task.taskactivity === "pending" ? "text-blue-500" : "text-emerald-500"}`}
                  >
                    {task.taskname}
                  </span>
                </td>
                <td className="max-w-72 whitespace-normal opacity-80">
                  {task.taskdescription}
                </td>
                <td>{task.createdAt?.split("T")[0] || task.updatedAt?.split("T")[0]}</td>
                <td>{task.taskduedate?.split("T")[0]}</td>
                {showBothUsers ? (
                  <>
                    <td>{task.taskassignby.name}</td>
                    <td>{task.taskassignto.name}</td>
                  </>
                ) : (
                  <td>
                    {currenttab === "mytasks"
                      ? task.taskassignby.name
                      : task.taskassignto.name}
                  </td>
                )}
                <td>{statusBadge(task)}</td>
                <td>
                  {currenttab === "alltasks" ? (
                    <button
                      className="btn-primary cursor-pointer px-3 py-2 text-sm"
                      onClick={() => handletaskactive(task._id, task.taskactivity)}
                    >
                      {task.taskactivity}
                    </button>
                  ) : (
                    statusSelect(task)
                  )}
                </td>
                <td>{actionButtons(task, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  
  

  const [calendar,setcalendar]=useState(false)
  const [startDate, setStartDate] = useState(new Date());
  const [date,setdate]=useState("")

  const dueDates = alltasks.map((i)=> i.taskduedate)


  return (
    <div className="app-page">
      <div className="content-shell flex flex-col gap-6">
        <Addtask
          taskstatus={taskstatus}
          settaskstatus={settaskstatus}
          gettasks={gettasks}
          edittask={edittask}
          setedit={setedit}
          edit={edit}
        />

        <div className="surface rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                className={`${currenttab === "mytasks" ? "chip-active" : "chip-idle"} cursor-pointer rounded-xl px-4 py-2 text-sm font-bold`}
                onClick={() => setcurrenttab("mytasks")}
              >
                My Tasks
              </button>

              <button
                className={`${currenttab === "giventask" ? "chip-active" : "chip-idle"} cursor-pointer rounded-xl px-4 py-2 text-sm font-bold`}
                onClick={() => setcurrenttab("giventask")}
              >
                Given Tasks
              </button>

              {userstatus === "admin" && (
                <button
                  className={`${currenttab === "alltasks" ? "chip-active" : "chip-idle"} cursor-pointer rounded-xl px-4 py-2 text-sm font-bold`}
                  onClick={() => setcurrenttab("alltasks")}
                >
                  All Tasks
                </button>
              )}
            </div>

            <div className="flex gap-2">
             
              <button
                className="btn-primary h-11 w-11 cursor-pointer rounded-full p-0 text-2xl leading-none"
                onClick={() => setcalendar(!(calendar))}
              >🗓️</button>

              <button
                className="btn-primary h-11 w-11 cursor-pointer rounded-full p-0 text-2xl leading-none"
                onClick={() => settaskstatus(true)}
              >
                +
              </button>
              
              <button
                className="btn-secondary h-11 min-w-24 cursor-pointer rounded-full px-4 py-0 text-sm capitalize leading-none"
                onClick={() => toggleview()}
              >
                {view} view
              </button>

              {calendar &&
                <div className="top-20 fixed">
                  <DatePicker selected={startDate}
                   onChange={(date) =>{
                    setStartDate(date) 
                    setdate(date)
                  }}
                   inline 
                   highlightDates={[{
      "react-datepicker__day--highlighted-custom-1": dueDates,
    },]} />
                </div>
}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              className="field"
              type="text"
              placeholder="Search tasks, sender, or assignee"
              value={search}
              onChange={(e) => setsearch(e.target.value)}
            />

            <select
              name=""
              id=""
              className="field"
              value={sortd}
              onChange={(e) => setsortd(e.target.value)}
            >
              <option value="">No user filter</option>
              {optionsprint()}
            </select>
          </div>
        </div>

        {(currenttab === "mytasks" || currenttab === "giventask") && (
          <div className="flex flex-col gap-6">
            { user.length === 0 ? (
              <div className="surface rounded-2xl p-8 text-center">
                No users found
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {user.map((u) => {

                  const tasks = groupedTasks(u);
                  return (
                    <div key={u._id}>
                      <div className="flex gap-4">
                      <h1 className="mb-4 text-xl font-black tracking-tight text-teal-700">
                        {u.name}
                      </h1>

                      <Pdfdownload tasks={tasks}/>
                      </div>
                      {view === "card" ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                           {tasks.length === 0 ? (
              <div className="surface rounded-2xl p-8 text-center text-lg font-bold text-rose-500">
                No tasks available...
              </div>
            ) : tasks.map((task) => (
                            <div key={task._id}>{taskCard(task)}</div>
                          ))}
                        </div>
                      ) : (
                        taskTable(tasks)
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {userstatus === "admin" && currenttab === "alltasks" && (
          <div className="flex flex-col gap-6">
            {alltasks.length === 0 ? (
              <div className="surface rounded-2xl p-8 text-center text-lg font-bold text-rose-500">
                No tasks available...
              </div>
            ) : user.length === 0 ? (
              <div className="surface rounded-2xl p-8 text-center">
                No users found
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {user.map((u) => {
                  const tasks = groupedTasks(u);

                  return (
                    <div key={u._id}>
                      <h1 className="mb-4 text-xl font-black tracking-tight text-teal-700">
                        {u.name}
                      </h1>

                      {view === "card" ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {tasks.map((task) => (
                            <div key={task._id}>{taskCard(task, true)}</div>
                          ))}
                        </div>
                      ) : (
                        taskTable(tasks, true)
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <Viewmodel viewid={viewid} setviewid={setviewid} />
        <Viewdatetasks alltasks={alltasks} user={user} date={date} setdate={setdate} />
      </div>
    </div>
  );
}

export default Home;
