import { createSlice } from '@reduxjs/toolkit'

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
        staff: [],
        students:[],
        holidays: [],
    },
    reducers: {
        updateStaff: (state, action) => {
            state.staff = action.payload
        },
        updateHolidays: (state, action) => {
            state.holidays = action.payload
        },
        updateStudents:(state,action)=>{
            state.students = action.payload
        }
    },
})

export const { updateHolidays, updateStaff,updateStudents } = attendanceSlice.actions
export default attendanceSlice.reducer
