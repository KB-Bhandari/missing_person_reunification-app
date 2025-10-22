import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'


import App from './App.jsx'
import VolunteerRegister from './pages/volunteerRegister.jsx'
import FamilyRegister from './pages/family_Register.jsx'

const router= createBrowserRouter([
  {path:'/', element:<App/>},
  {path:'/volunteerRegister', element:<VolunteerRegister/>},
  {path:'/family-Register', element:<FamilyRegister/>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
    {/* <RouterProvider router={router}/> */}
      <App />
    </BrowserRouter>
    
  </StrictMode>,
)
