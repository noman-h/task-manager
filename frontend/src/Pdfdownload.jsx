import React from 'react'
import axios from 'axios'

function Pdfdownload({tasks}) {

    const token=localStorage.getItem("token")
    async function handlepdf(tasks) {
        try{
          if(tasks.length===0){
            alert("no tasks available to download")
            return;
          }

        const response = await axios.post(
        "http://localhost:5000/task/taskpdf",
        {
          tasks: tasks,
        },
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        {
          responseType: "blob", // Important
        }
      );
    
     
      const url = window.URL.createObjectURL(new Blob([response.data]));
    
      const a = document.createElement("a");
      a.href = url;
      a.download = "text.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
    catch(err){
      console.log(err);
      
    }
    };

  return (
     <button className="mb-4 text-xl font-black tracking-tight border  rounded-2xl border-gray-500 cursor-pointer p-1 hover:bg-teal-700" onClick={()=>handlepdf(tasks)}>download pdf</button>
  )
}

export default Pdfdownload