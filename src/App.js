import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Header from './components/Header';
import { useSelector } from 'react-redux';
import ManageStudents from './components/ManageStudents';
import Finance from './components/ManageFeesStructure';
import Academics from './components/Academics';
import ManageStaff from './components/ManageStaff';
import ManageAttendance from './components/ManageAttendance';
import { useDispatch } from 'react-redux';
import { setUser } from './app/reducers/appConfigSlice';
import { jwtDecode } from 'jwt-decode';
import ProtectedRoute from './commonComponent/ProtectedRoutes';
import ManageExams from './components/ManageExams';
import Class from './components/Class';
import FeesOverview from './components/ManageFeesOverview';
import ManageFinance from './components/ManageFinance';
import Tenants from './components/Tenants';


function App() {
  const {user} = useSelector((state) => state.appConfig);
  const [sidebarOpen, setSidebarOpen] = useState(false)
 
  const dispatch = useDispatch(); 
  useEffect(()=>{
    if(!user){
      const token  = localStorage.getItem("studentManagment");
      if(token) dispatch(setUser(jwtDecode(token)))
    }
  },[])
  return (
    <BrowserRouter>
      <div>
      {/* <Sidebar sidebarOpen={sidebarOpen} updateSideBar={(val)=>{setSidebarOpen(val)}} /> */}
      {user&&<Sidebar sidebarOpen={sidebarOpen} updateSideBar={(val)=>{setSidebarOpen(val)}} />}
      <div className={user?"lg:pl-72":""}>
        {user && <Header updateSideBar={(val)=>{setSidebarOpen(val)}} /> }
        {/* <Header updateSideBar={(val)=>{setSidebarOpen(val)}} /> */}
          <main className="">
            <div className={user?"px-4 sm:px-4 lg:px-6":""}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/students" element={<ProtectedRoute><ManageStudents /></ProtectedRoute>} />
                {/* <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} /> */}
                <Route path="/academics" element={<ProtectedRoute><Academics /></ProtectedRoute>} />
                <Route path="/staff" element={<ProtectedRoute><ManageStaff /></ProtectedRoute>} />
                <Route path="/attendance" element={<ProtectedRoute><ManageAttendance /></ProtectedRoute>} />
                <Route path='/tenant' element={<ProtectedRoute><Tenants /></ProtectedRoute>} />
                <Route path="/academics-class" element={<ProtectedRoute><Class /></ProtectedRoute>} />
                <Route path="/academics-exams" element={<ProtectedRoute><ManageExams /></ProtectedRoute>} />
                <Route path="/finance" element={<ProtectedRoute><ManageFinance /></ProtectedRoute>} />

              </Routes>
            </div>
          </main>
      </div>
      </div>
    </BrowserRouter>
  )
}

export default App;