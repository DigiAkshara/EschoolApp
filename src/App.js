import { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Header from './components/Header';
import { useSelector } from 'react-redux';
import ManageStudents from './components/ManageStudents';


function App() {
  const {user} = useSelector((state) => state.appConfig);
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <BrowserRouter>
      <div>
      {/* {user && <Sidebar sidebarOpen={sidebarOpen} updateSideBar={(val)=>{setSidebarOpen(val)}} />} */}
      <Sidebar sidebarOpen={sidebarOpen} updateSideBar={(val)=>{setSidebarOpen(val)}} />
      <div className="lg:pl-72">
        {/* {user && <Header updateSideBar={(val)=>{setSidebarOpen(val)}} /> } */}
        <Header updateSideBar={(val)=>{setSidebarOpen(val)}} />
          <main className="">
            <div className="px-4 sm:px-4 lg:px-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/students" element={<ManageStudents />} />
              </Routes>
            </div>
          </main>
      </div>
      </div>
    </BrowserRouter>
  )
}

export default App;