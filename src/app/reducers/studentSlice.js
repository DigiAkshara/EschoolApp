// src/redux/examSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getData} from '../api'
import {CLASSES, FEES, SECTIONS} from '../url'

export const fetchInitialStudentData = createAsyncThunk(
  'data/fetchInitialStudentData',
  async (_, {rejectWithValue}) => {
    try {
      const [classRes, secRes, feeRes] = await Promise.all([
        getData(CLASSES),
        getData(SECTIONS),
        getData(FEES)
      ]) // Replace with your API endpoint
      return {classRes: classRes.data.data, sectionRes: secRes.data.data, feesRes:feeRes.data.data}
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to load data')
    }
  },
)

const studentSlice = createSlice({
  name: 'students',
  initialState: {
    students: [], // List of all exams
    selectedStudent: null, // Stores details of the clicked exam
    classes: [],
    sections: [],
    fees:[]
  },
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload
    },
    selectStudent: (state, action) => {
      state.selectedStudent = action.payload // Set selected exam details
    },
    setClasses: (state, action) => {
      state.classes = action.payload
    },
    updateFees: (state, action) => {
      state.fees = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitialStudentData.fulfilled, (state, action) => {
      state.classes = action.payload.classRes.map((cls) => ({
        label: cls.name,
        value: cls._id,
        id: cls._id,
      }))
      state.sections = action.payload.sectionRes.map((item) => ({
        label: item.section,
        value: item._id,
        class: item.class,
        id: item._id,
      }))
      state.fees = action.payload.feesRes
    })
  },
})

export const {setStudents, selectStudent, setClasses, updateFees} = studentSlice.actions
export default studentSlice.reducer
