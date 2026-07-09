import axios from "axios";
import React, { useEffect, useState } from "react";

function Viewmodel({ viewid, setviewid }) {
  const [viewdata, setviewdata] = useState({});

  async function handleview(id) {
    try {
      const token = localStorage.getItem("token");
      const result = await axios.get(`http://localhost:5000/task/viewtask/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(result);
      setviewdata(result.data);
    } catch (err) {
      console.log(err);

      if (err?.response?.data === "jwt expired") {
        localStorage.removeItem("token");
        alert("login again session expired");
        navigate("/login");
      }
    }
  }

  useEffect(() => {
    if (viewid) {
      handleview(viewid);
    }
  }, [viewid]);

  return (
    <div>
      {viewid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="surface relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6">
            <button
              onClick={() => setviewid("")}
              className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-rose-500 font-black text-white hover:bg-rose-600"
            >
              x
            </button>

            <div className="pr-10">
              <h1
                className={`text-3xl font-black tracking-tight ${viewdata.taskactivity === "pending" ? "text-blue-500" : "text-emerald-500"}`}
              >
                {viewdata.taskname}
              </h1>
              <p className="mt-3 leading-7 opacity-80">
                {viewdata.taskdescription}
              </p>
            </div>

            <img src={viewdata.images} alt="" />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <p className="card rounded-xl p-3 text-sm">
                <span className="block font-bold text-teal-600">Assigned by</span>
                {viewdata.taskassignby?.name}
              </p>
              <p className="card rounded-xl p-3 text-sm">
                <span className="block font-bold text-teal-600">Assigned to</span>
                {viewdata.taskassignto?.name}
              </p>
              <p className="card rounded-xl p-3 text-sm">
                <span className="block font-bold text-teal-600">Created at</span>
                {viewdata.createdAt?.split("T")[0]}
              </p>
              <p className="card rounded-xl p-3 text-sm">
                <span className="block font-bold text-teal-600">Complete till</span>
                {viewdata.taskduedate?.split("T")[0]}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Viewmodel;
