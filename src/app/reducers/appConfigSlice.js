import { createSlice } from "@reduxjs/toolkit";

const AppConfigSlice = createSlice({
  name: "AppConfig",
  initialState: {
    activeMenu: "home",
    academicYear:null,
    user: null,
    navConfig:[],
    tenantId: null,
    formData : null
  },
  reducers: {
    setActiveMenu:(state, action)=>{
      state.activeMenu = action.payload
    },
    setUser:(state, action)=>{
      state.user = action.payload
    },
    clearSession:(state)=>{
      state.user = null
      state.academicYear = null
    },
    setAcademicYear:(state,action)=>{
      state.academicYear = action.payload.academicYear
    },
    // loadNavConfig:(state, action)=>{  
    //   let temNav = navData.filter((item)=>{
    //     return item.role.includes(state.user.role.name)
    //   })
    //   state.navConfig = temNav
    // },
    setTenantId:(state, action)=>{
      state.tenantId = action.payload
    },
    setFormData:(state, action)=>{
      state.formData = action.payload
    },
    clearFormData:(state)=>{
      state.formData = null
    }
  },
})

export const { setActiveMenu, setUser, clearSession, setTenantId, setFormData, clearFormData, setAcademicYear} = AppConfigSlice.actions
export default AppConfigSlice.reducer