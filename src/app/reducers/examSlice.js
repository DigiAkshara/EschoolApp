import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { EXAM } from '../url'
import { getData } from '../api'


export const fetchExamData = createAsyncThunk(
  'data/fetchExamData',
  async (_, {rejectWithValue}) => {
    try {
      const [examsData] = await Promise.all([
        getData(EXAM) 
      ]) // Replace with your API endpoint
      return {
        examsData: examsData.data.data 
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to load data')
    }
  },
)
const examSlice = createSlice({
  name: 'exams',
  initialState: {
    exams: [], // List of all exams
    selectedExam: null, // Stores details of the clicked exam
  },
  reducers: {
    setExams: (state, action) => {
      state.exams = action.payload
    },
    selectExam: (state, action) => {
      state.selectedExam = action.payload // Set selected exam details
    },
  },
  extraReducers: (builder) => {
      builder.addCase(fetchExamData.fulfilled, (state, action) => {
        state.exams = action.payload.examsData 
      })
    },
})

export const {setExams, selectExam} = examSlice.actions
export default examSlice.reducer
