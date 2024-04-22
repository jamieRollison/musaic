import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom'
import Root from './routes/root'
import TempLoading from './routes/temp/temp-loading'
import Visualization from './routes/Visualization'
import './index.css'
import Login from './routes/Login'
// import Visualization from './routes/Visualization'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/visualization"/>
  },
  // {
  //   path: "login",
  //   element: <Login />
  // },
  // {
  //   path: "loading",
  //   element: <TempLoading />
  // },
  {
    path: "/visualization",
    element: <Visualization />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
