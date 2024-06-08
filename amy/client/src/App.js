import './App.css';
import Login from './pages/login/Login';
import Regis from './pages/regis/Regis';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/home/Home"
import Profile from "./pages/profile/Profile"
import Navbar from './components/navbar/Navbar';
import Rightbar from './components/rightbar/Rightbar';
import "./style.scss"
import { useContext} from 'react';
import { DarkmodeContext } from './context/Darkmodecontext';
import { Authcontext } from './context/AuthContext';
import Leftbar from './components/leftbar/Leftbar';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import classNames from 'classnames';



function App() 
{

  const {currentUser}=useContext(Authcontext); //phải có tk ms vào dc trang chính

  const {darkMode}=useContext(DarkmodeContext)

  const queryClient = new QueryClient()


  const Layout =()=>
  {
    return(
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar/>
            <div style={{display:'flex'}}>
            <Leftbar/>
            <div className={classNames('content')}> 
            <Outlet/>
          </div>
          <Rightbar/>
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute=({children})=>
  {
    if(!currentUser)
    {
      return <Navigate to="login"/>
    }

    return children;
  }

  const router = createBrowserRouter
  ([
    {
      path:"/",
      element:
      (
        <ProtectedRoute>
          <Layout/>
        </ProtectedRoute>
      ),

      children:
      [
        {
          path:"/",
          element:<Home/>
        },

        {
          path:"/profile/:id",
          element:<Profile/>
        }      
      ]
    },

    {
      path: "/login",
      element: <Login/>,
    },

    {
      path: "/regis",
      element: <Regis/>,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
