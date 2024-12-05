import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Header from './components/Header';
import { useSelector } from 'react-redux';
import ManageStudents from './components/ManageStudents';
import Finance from './components/Finance';
import Academics from './components/Academics';
import ManageStaff from './components/ManageStaff';
import ManageAttendance from './components/ManageAttendance';
import { useDispatch } from 'react-redux';
import { setUser } from './app/reducers/appConfigSlice';
import { jwtDecode } from 'jwt-decode';


function App() {
  const {user} = useSelector((state) => state.appConfig);
  const [sidebarOpen, setSidebarOpen] = useState(false)
 
  const dispatch = useDispatch(); 
  useEffect(()=>{
    if(!user){
      const token  = localStorage.getItem("studentManagment");
      if(token) dispatch(setUser(jwtDecode(token)));
    }
  },[])
  return (
    <BrowserRouter>
      <div>
      {/* {user && <Sidebar sidebarOpen={sidebarOpen} updateSideBar={(val)=>{setSidebarOpen(val)}} />} */}
      {user&&<Sidebar sidebarOpen={sidebarOpen} updateSideBar={(val)=>{setSidebarOpen(val)}} />}
      <div className="lg:pl-72">
        {user && <Header updateSideBar={(val)=>{setSidebarOpen(val)}} /> }
        {/* <Header updateSideBar={(val)=>{setSidebarOpen(val)}} /> */}
          <main className="">
            <div className="px-4 sm:px-4 lg:px-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/students" element={<ManageStudents />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/academics" element={<Academics />} />
                <Route path="/staff" element={<ManageStaff />} />
                <Route path="/attendance" element={<ManageAttendance />} />

              </Routes>
            </div>
          </main>
      </div>
      </div>
    </BrowserRouter>
  )
}

export default App;