import {createSlice} from '@reduxjs/toolkit'
import navData from '../../assets/json/nav.json'

const loadPermissions = (permissions) => {
    let nav = []
    permissions.forEach((item) => {
      const menu = navData.find((menu) => menu.name === item.name)
      if (menu&&item.read) {
        nav.push({
          ...item,
          icon: menu.icon,
          path: menu.path,
          submenu: item.submenu?.filter((submenu) => submenu.read),
        })
      }
    })
    return nav
  }

const AppConfigSlice = createSlice({
  name: 'AppConfig',
  initialState: {
    activeMenu: 'home',
    academicYear: null,
    user: null,
    navConfig: [],
    tenantId: null,
    formData: null,
  },
  reducers: {
    loadNavConfig: (state, action) => {
      const nav  = loadPermissions(action.payload)
      state.navConfig = nav
    },
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    clearSession: (state) => {
      state.user = null
      state.academicYear = null
    },
    setAcademicYear: (state, action) => {
      console.log(action.payload,"academicYear")
      state.academicYear = action.payload
    },
    setTenantId: (state, action) => {
      state.tenantId = action.payload
    },
    setFormData: (state, action) => {
      state.formData = action.payload
    },
    clearFormData: (state) => {
      state.formData = null
    },
  },
})

export const {
  setActiveMenu,
  loadNavConfig,
  setUser,
  clearSession,
  setTenantId,
  setFormData,
  clearFormData,
  setAcademicYear,
} = AppConfigSlice.actions
export default AppConfigSlice.reducer
