import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {getData} from '../api'
import {CLASS_CATEGORIES, CLASSES, SECTIONS, STAFF, SUBJECTS} from '../url'

export const fetchInitialAcademicData = createAsyncThunk(
  'data/fetchInitialAcademicData',
  async (_, {rejectWithValue}) => {
    try {
      const [classCategories, classes, sections, teachers, subjects] = await Promise.all([
        getData(CLASS_CATEGORIES),
        getData(CLASSES),
        getData(SECTIONS),
        getData(STAFF),
        getData(SUBJECTS)
      ]) // Replace with your API endpoint
      return {
        classCategories: classCategories.data.data,
        classes: classes.data.data,
        sections: sections.data.data,
        teachers: teachers.data.data,
        subjects: subjects.data.data
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to load data')
    }
  },
)

const academicSlice = createSlice({
  name: 'academics',
  initialState: {
    classCategories: [],
    classes: [],
    sections: [],
    teachers: [],
    subjects: [],
    selectedClass: null
  },
  reducers: {
    updateSelectedClass: (state, action) => {
      state.selectedClass = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitialAcademicData.fulfilled, (state, action) => {
      state.classCategories = action.payload.classCategories?.map(
        (category) => ({label: category.name, value: category._id}),
      )
      state.classes = action.payload.classes?.map((item) => ({
        label: item.name,
        value: item._id,
        category: item.classCategory,
      }))
      state.sections = action.payload.sections?.map((item) => ({
        label: item.section,
        value: item._id,
        class: item.class,
      }))
      state.teachers = action.payload.teachers?.map((item) => ({
        label: item.firstName + ' ' + item.lastName,
        value: item._id,
      }))
      state.subjects = action.payload.subjects?.map((item) => ({
        label: item.name,
        value: item._id,
      }))
    })
  },
})

export const {updateSelectedClass} = academicSlice.actions
export default academicSlice.reducer
