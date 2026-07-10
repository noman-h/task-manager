import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Login'
import Singup from './Singup'
import Header from './Header'
import './App.css'
import Home from './Home'
import Forgetpass from './Forgetpass'
import Resetpass from './Resetpass'
import Deletedtasks from './Deletedtasks'
import Protectedroute from './Protectedroute'

function App() {
  console.log(import.meta.env.VITE_API_URL);
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Protectedroute>
        <Home/>
      </Protectedroute> } />
      <Route path='/deletedtasks' element={<Protectedroute><Deletedtasks/></Protectedroute>} />
      <Route path='/singup' element={<Singup/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/forgetpass' element={<Forgetpass/>} />
      <Route path='/resetpass' element={<Protectedroute><Resetpass/></Protectedroute>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App