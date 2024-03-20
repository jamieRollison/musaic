import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Root from './routes/root'
import './index.css'
import Login from './routes/Login'
import Visualization from './routes/Visualization'

const router = createBrowserRouter([
  {
    path: "/",
    // element: <div>Hello world!</div>
    element: <Root />
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "visualization",
    element: <Visualization />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
