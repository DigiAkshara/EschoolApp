import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { getData } from './app/api'
import {
  loadNavConfig,
  setAcademicYear,
  setActiveMenu,
  setBranchs,
  setUser,
} from './app/reducers/appConfigSlice'
import { ACADEMIC_YEAR, BRANCH } from './app/url'
import { handleApiResponse } from './commonComponent/CommonFunctions'
import ProtectedRoute from './commonComponent/ProtectedRoutes'
import Academics from './components/Academics'
import AdminOperations from './components/AdminOperations'
import Attendance from './components/Attendance'
import Finance from './components/Finance'
import Header from './components/Header'
import Home from './components/Home'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Staff from './components/Staff'
import Students from './components/Students'
import EventsAndSms from './components/EventsAndSms'
import Tenants from './components/Tenants'
import Loader from './commonComponent/Loader'
import ReportsAnalytics from './components/ReportsAnalytics'

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
        dispatch(loadNavConfig(user.permissions.permissions))
        dispatch(setActiveMenu(window.location.pathname.split('/')[1]))
        getAcademicData()
        if (user.role.name !== 'superadmin') {
          getBranchs()
        }
      }
    }
  }, [])

  const getAcademicData = async () => {
    try {
      const academic = await getData(ACADEMIC_YEAR)
      dispatch(setAcademicYear(academic.data.data))
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        dispatch(setUser(null))
        localStorage.removeItem('studentManagement')
        localStorage.removeItem('academicYear')
      } else {
        handleApiResponse(error)
      }
    }
  }

  const getBranchs = async () => {
    try {
      const resp = await getData(BRANCH)
      let branchs = resp.data.data.map(branch => ({
        value: branch._id,
        label: branch.name,
        address: branch.address,
        logo: branch.logo,
        isDefault: branch.isDefault
      }))
      dispatch(setBranchs(branchs))
    } catch (error) {
      handleApiResponse(error)
    }
  }
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
