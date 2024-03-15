import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import StarterPage from './routes/initreact/starterpage'
import Root from './routes/root'
import TempLoading from './routes/temp/temp-loading'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />
  },
  {
    path: "initreact",
    element: <StarterPage />
  },
  {
    path: "loading",
    element: <TempLoading />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
