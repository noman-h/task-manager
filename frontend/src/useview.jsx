import React, { useState } from 'react'

function useview() {

    const [view,setview]=useState("card")

    function toggleview(){
        (view==="card") ? setview("table") : setview("card")
    }

  return {view,toggleview}
}

export default useview