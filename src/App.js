import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import {
  fetchInitialAppData,
  loadNavConfig,
  setActiveMenu,
  setUser
} from './app/reducers/appConfigSlice'
import Loader from './commonComponent/Loader'
import ProtectedRoute from './commonComponent/ProtectedRoutes'
import Academics from './components/Academics'
import AdminOperations from './components/AdminOperations'
import Attendance from './components/Attendance'
import Contactus from './components/ContactUs/Contactus'
import EventsAndSms from './components/EventsAndSms'
import Finance from './components/Finance'
import Header from './components/Header'
import Help from './components/Help'
import Home from './components/Home'
import Login from './components/Login'
import ReportsAnalytics from './components/ReportsAnalytics'
import Sidebar from './components/Sidebar'
import Staff from './components/Staff'
import Students from './components/Students'
import Tenants from './components/Tenants'
import Transport from './components/Transport'
function App() {
  const { user } = useSelector((state) => state.appConfig)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const dispatch = useDispatch()


  useEffect(() => {
    if (!user) {
      const token = localStorage.getItem('studentManagement')
      if (token) {
        const user = jwtDecode(token)
        dispatch(setUser(user))
        dispatch(loadNavConfig({ permissions: user.permissions.permissions, role: user.role.name }))
        dispatch(setActiveMenu(window.location.pathname.split('/')[1]))
        dispatch(fetchInitialAppData())
      }
    }
  }, [])

  return (
    <BrowserRouter>
      <div>
        <Loader />
        <div className='toastcls'>
          <ToastContainer />
        </div>
        {user && (
          <Sidebar
            sidebarOpen={sidebarOpen}
            updateSideBar={(val) => {
              setSidebarOpen(val)
            }}
          />
        )}
        <div className={user ? 'lg:pl-72 pb-[36px]' : ''}>
          {user && (
            <Header
              updateSideBar={(val) => {
                setSidebarOpen(val)
              }}
            />
          )}
          <main className="">
            <div className={user ? 'px-4 sm:px-4 lg:px-6' : ''}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/students"
                  element={
                    <ProtectedRoute>
                      <Students />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/academics"
                  element={
                    <ProtectedRoute>
                      <Academics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute>
                      <Staff />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/attendance"
                  element={
                    <ProtectedRoute>
                      <Attendance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenant"
                  element={
                    <ProtectedRoute>
                      <Tenants />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance"
                  element={
                    <ProtectedRoute>
                      <Finance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin_operations"
                  element={
                    <ProtectedRoute>
                      <AdminOperations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/eventsSms"
                  element={
                    <ProtectedRoute>
                      <EventsAndSms />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports_and_analytics"
                  element={
                    <ProtectedRoute>
                      <ReportsAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transportation"
                  element={
                    <ProtectedRoute>
                      <Transport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/help"
                  element={
                    <ProtectedRoute>
                      <Help />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contactus"
                  element={
                    <ProtectedRoute>
                      <Contactus />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </main>
          {user && (<div className='flex items-center justify-center px-2 py-2 bg-gray-200 fixed bottom-0 w-[calc(100%-18rem)]'>
            <p className='text-sm'>© 2025 Svadhyaya Software Consultancy (OPC) Pvt Ltd. All rights reserved.</p>
          </div>)}
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
