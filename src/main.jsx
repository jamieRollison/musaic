import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import StarterPage from './routes/initreact/starterpage'
import Root from './routes/root'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    // element: <div>Hello world!</div>
    element: <Root />
  },
  {
    path: "initreact",
    element: <StarterPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
