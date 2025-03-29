import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import navData from '../../assets/json/nav.json'
import { getData } from '../api'
import { ACADEMIC_YEAR, BRANCH } from '../url'


export const fetchInitialAppData = createAsyncThunk(
  'data/fetchInitialAppData',
  async (_, { rejectWithValue }) => {
    try {
      const [bracnRes, academicRes] = await Promise.all([
        getData(BRANCH),
        getData(ACADEMIC_YEAR + '/all'),
      ]) // Replace with your API endpoint
      return { bracnResp: bracnRes.data.data, academicResp: academicRes.data.data }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to load data')
    }
  },
)
const loadPermissions = (data) => {
  const permissions = data.permissions
  const role = data.role
  let nav = []
  if (role === 'superadmin') {
    navData.forEach((menu) => {
      if (menu.isSuperAdmin) {
        nav.push({
          ...menu,
          submenu: menu.submenu?.filter((submenu) => submenu.isSuperAdmin)
        })
      }
    })
  } else {
    permissions.forEach((item) => {
      const menu = navData.find((menu) => menu.name === item.name)
      if (menu && item.read) {
        nav.push({
          ...item,
          icon: menu.icon,
          path: menu.path,
          submenu: item.submenu?.filter((submenu) => submenu.read),
        })
      }
    })
  }
  return nav
}
let initialState={
  activeMenu: 'home',
  academicYear: null,
  academicYears: [],
  branchs: [],
  user: null,
  navConfig: [],
  tenantId: null,
  branchId: null,
  branchData: null,
  formData: null,
  isLoading: false
}
const AppConfigSlice = createSlice({
  name: 'AppConfig',
  initialState,
  reducers: {
    loadNavConfig: (state, action) => {
      const nav = loadPermissions(action.payload)
      state.navConfig = nav
    },
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    logout: () => initialState,
    setAcademicYear: (state, action) => {
      state.academicYear = action.payload
    },
    setBranchs: (state, action) => {
      state.branchs = action.payload
    },
    setTenantId: (state, action) => {
      state.tenantId = action.payload
    },
    setBranchId: (state, action) => {
      state.branchId = action.payload
    },
    setBranchData: (state, action) => {
      state.branchData = action.payload
    },
    setFormData: (state, action) => {
      state.formData = action.payload
    },
    setIsLoader: (state, action) => {
      state.isLoading = action.payload
    },
    clearFormData: (state) => {
      state.formData = null
    },
    setAcademicYears: (state, action) => {
      state.academicYears = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitialAppData.fulfilled, (state, action) => {
      let branchId = localStorage.getItem('branchId')
      let branchObj = null
      state.branchId = branchId
      state.branchs = action.payload.bracnResp.map((branch) => {
        let obj = {
          value: branch._id,
          label: branch.name,
          address: branch.address,
          logo: branch.logo,
          email: branch.email,
          mobileNumber: branch.mobileNumber,
          isDefault: branch.isDefault
        }
        if (branch._id === branchId) {
          branchObj = obj
        }
        return (obj)
      })
      state.branchData = branchObj
      state.academicYears = action.payload.academicResp
      let academicYear = localStorage.getItem('academicYear')
      let academic = action.payload.academicResp.find((year) => year._id === academicYear)
      state.academicYear = academic
    })
  },
})

export const {
  setActiveMenu,
  loadNavConfig,
  setUser,
  setTenantId,
  setBranchId,
  setBranchData,
  setFormData,
  clearFormData,
  setAcademicYear,
  setBranchs,
  setIsLoader,
  setAcademicYears,
  logout,
} = AppConfigSlice.actions
export default AppConfigSlice.reducer
