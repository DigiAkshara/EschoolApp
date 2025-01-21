// src/redux/examSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getData} from '../api'
import {CLASSES, SECTIONS} from '../url'

export const fetchInitialStudentData = createAsyncThunk(
  'data/fetchInitialStudentData',
  async (_, {rejectWithValue}) => {
    try {
      const [classRes, secRes] = await Promise.all([
        getData(CLASSES),
        getData(SECTIONS),
      ]) // Replace with your API endpoint
      return {classRes: classRes.data.data, sectionRes: secRes.data.data}
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
    })
  },
})

export const {setStudents, selectStudent, setClasses} = studentSlice.actions
export default studentSlice.reducer
