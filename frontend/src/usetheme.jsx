import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

function usetheme() {


    const token=localStorage.getItem("token")
    const [theme,settheme]=useState(localStorage.getItem("theme") || "light")
  
    async function themeapi(){
        const result=await axios.patch(`http://localhost:5000/task/changetheme`,{theme},{headers:{
              Authorization:`Bearer ${token}`
            }})   
    }

    useEffect(()=>{
     document.body.className=theme 
     localStorage.setItem("theme",theme)
     themeapi()
    },[theme])

    function toggletheme(){
        (theme==="light") ? settheme("dark") : settheme("light")
    }

  return {theme,toggletheme}
}

export default usetheme