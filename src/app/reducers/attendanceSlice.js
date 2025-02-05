import { createSlice } from '@reduxjs/toolkit'

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
        staff: [],
        holidays: [],
    },
    reducers: {
        updateStaff: (state, action) => {
            state.staff = action.payload
        },
        updateHolidays: (state, action) => {
            state.holidays = action.payload
        },
    },
})

export const { updateHolidays, updateStaff } = attendanceSlice.actions
export default attendanceSlice.reducer
