import moment from 'moment'
import {getData, postData} from '../app/api'
import {CLASS_CATEGORIES, CLASSES, SECTIONS, UPLOAD} from '../app/url'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from 'react-toastify';
import { string } from 'yup';

export const getAcademicYears = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Determine the current academic year
  const startYear = currentMonth >= 6 ? currentYear : currentYear - 1
  const academicYears = []

  // Generate the academic years
  for (let year = startYear; year <= startYear + 2; year++) {
    academicYears.push({
      value: `${year}-${year + 1}`,
      label: `${year}-${year + 1}`,
    })
  }
  return academicYears
}

export const formatDate = (date) => {
  const formattedDate = moment(date).format('YYYY-MM-DD');
  return formattedDate
}

export const staffType = [
  {value: 'teaching', label: 'Teaching'},
  {value: 'non-teaching', label: 'Non-Teaching'}
]

export const feeduration = [
  {value: 'onetime', label: 'One Time'},
  {value: 'installments', label: 'Installments'},
]

export const roles = [
  {value: 'staff', label: 'Staff'},
  {value: 'student', label: 'student'},
  {value: 'other', label: 'other'},
]

export const gender = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
  {value: 'other', label: 'Other'},
]

export const boardOptions = [
  {value: 'cbse', label: 'CBSE'},
  {value: 'state', label: 'State'},
  {value: 'icse', label: 'ICSE'},
]

export const classCategory = [
  {value: 'kindergarten', label: 'KINDERGARTEN'},
  {value: 'primary', label: 'Primary – Classes 1 to 5'},
  {value: 'lower', label: 'Lower Secondary – Classes 6 to 8'},
  {value: 'secondary', label: 'Secondary – Classes 9 & 10'},
]

export const nationality = [
  {value: 'indian', label: 'Indian'},
  {value: 'foreign', label: 'Foreign'},
]

export const caste = [
  {value: 'general', label: 'General'},
  {value: 'obc', label: 'OBC'},
  {value: 'sc', label: 'SC'},
  {value: 'st', label: 'ST'},
]

export const religion = [
  {value: 'hindu', label: 'Hindu'},
  {value: 'muslim', label: 'Muslim'},
  {value: 'christian', label: 'Christian'},
  {value: 'sikh', label: 'Sikh'},
  {value: 'jain', label: 'Jain'},
  {value: 'buddhist', label: 'Buddhist'},
  {value: 'jewish', label: 'Jewish'},
  {value: 'other', label: 'Other'},
]

export const bloodGroup = [
  {value: 'a', label: 'A+'},
  {value: 'b', label: 'B+'},
  {value: 'ab', label: 'AB+'},
  {value: 'o', label: 'O+'},
  {value: 'aMinus', label: 'A-'},
  {value: 'bMinus', label: 'B-'},
  {value: 'abMinus', label: 'AB-'},
  {value: 'oMinus', label: 'O-'},
]

export const occupation = [
  {value: 'student', label: 'Student'},
  {value: 'teacher', label: 'Teacher'},
  {value: 'other', label: 'Other'},
]

export const staffCategory = [
  {value: 'teaching', label: 'Teacher'},
  {value: 'non-teaching', label: 'Non Teaching Staff'},
]

export const states = [
  {value: 'andhrapradesh', label: 'Andhra Pradesh'},
  {value: 'telangana', label: 'Telangana'},
  {value: 'tamilnadu', label: 'Tamil Nadu'},
]

export const monthsName = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];


export const capitalizeWords = (str) => {
  if(!str) return
  return str
  .split(' ') // Split the string into words
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter
  .join(' ') // Join the words back into a string
}

export const sections = [
  {value: 'a', label: 'A'},
  {value: 'b', label: 'B'},
  {value: 'c', label: 'C'},
  {value: 'd', label: 'D'},
  {value: 'e', label: 'E'},
]

export const teacher = [
  {value: 'teacher1', label: 'Teacher 1'},
  {value: 'teacher2', label: 'Teacher 2'},
  {value: 'teacher3', label: 'Teacher 3'},
  {value: 'teacher4', label: 'Teacher 4'},
]

export const banks = [
  {value: 'hdfc', label: 'HDFC'},
  {value: 'indusind', label: 'Indusind'},
  {value: 'sbi', label: 'SBI'},
  {value: 'icici', label: 'ICICI'},
  {value: 'axis', label: 'AXIS'},
  {value: 'canara', label: 'CANARA'},
  {value: 'kotak', label: 'KOTAK'},
  {value: 'yesbank', label: 'YESBANK'},
  {value: 'pnb', label: 'PNB'},
  {value: 'unionbank', label: 'UNIONBANK'},
  {value: 'other', label: 'Other'},
]

export const payments = [
  {value: 'cash', label: 'Cash'},
  {value: 'upi', label: 'UPI'},
  {value: 'bankTransfer', label: 'Bank Transfer'},
  {value: 'cheque', label: 'CHEQUE'},
]

export const designations = [
  {value: 'principal', label: 'Principal'},
  {value: 'vice-principal', label: 'Vice Principal'},
  {value: 'teacher', label: 'Teacher'},
  {value: 'librarian', label: 'Librarian'},
  {value: 'accountant', label: 'Accountant'},
  {value: 'secretary', label: 'Secretary'},
  {value: 'manager', label: 'Manager'},
  {value: 'clerk', label: 'Clerk'},
  {value: 'cashier', label: 'Cashier'},
  {value: 'driver', label: 'Driver'},
  {value: 'labour', label: 'Labour'},
  {value: 'cleaner', label: 'Cleaner'},
  {value: 'cook', label: 'Cook'},
  {value: 'other', label: 'Other'},
]

export const attendanceOptions = [
  {value: 'present', label: 'Present'},
  {value: 'absent', label: 'Absent'},
  {value: 'half-day', label: 'Half Day'},
]

export const uploadFile = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const fileName = file.name
    let response = await postData(UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    if (response.status === 200 || response.status === 201) {
      response.data.name = fileName
      return response.data
    } else {
      alert(response.message)
    }
  } catch (error) {
    console.log(error)
  }
}

export const getClasses = async () => {
  try {
    const res = await getData(CLASSES)
    if (res.status === 200 || res.status === 201) {
      const classData = res.data.data.map((item) => {
        return {
          label: item.name, // Displayed text in the dropdown
          value: item._id,
        }
      })
      return classData
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    return []
  }
}

export const getClassCategories = async () => {
  try {
    const res = await getData(CLASS_CATEGORIES)
    if (res.status === 200 || res.status === 201) {
      const categoryData = res.data.data.map((item) => {
        return {
          label: item.name, // Displayed text in the dropdown
          value: item._id,
        }
      })
      return categoryData
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    return []
  }
}


export const getSections = async () => {
  try {
    const res = await getData(SECTIONS)
    if (res.status === 200 || res.status === 201) {
      const sectionData = res.data.data.map((item) => {
        return {
          label: item.section, // Displayed text in the dropdown
          value: item._id,
        }
      })
      return sectionData
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    return []
  }
}

export const handleDownload = (filteredData, fileName, excludedFields = []) => {
  try {
    console.log("Download started");

    // Filter data to exclude unnecessary fields
    const exportData = filteredData.map((item) => {
      const filteredItem = { ...item };
      excludedFields.forEach((field) => delete filteredItem[field]);
      return filteredItem;
    });

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Write workbook to binary and create a Blob
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Save the file
    saveAs(dataBlob, `${fileName}.xlsx`);
    console.log("Download complete");
  } catch (error) {
    console.error("Error during download:", error);
  }
};



export const handleDownloadCSV = (headers, fileName = "data.csv") => {
  // Generate CSV content with headers
  const csvContent = headers.join(",") + "\n";
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, fileName);
}
export const handleApiResponse = (res,type="error") => {
  let message = ''
  const options ={theme: 'colored',className:"text-xs"}
  if(type === 'error'){
    if (res.response) {
      // Server responded with a status code out of range [200, 299]
      console.error('API Error:', res.response.data);
      if(typeof res.response.data.message === "object"){
        message = res.response.data.message.join(", ")
      }else{
      message = res.response.data.message || 'Something went wrong!'}
    } else if (res.request) {
      // Request was made but no response was received
      console.error('Network Error:', res.request);
      message= 'Network error, please try again later.'
    } else {
      // Something happened in setting up the request
      console.error('Unknown Error:', res.message);
      message= 'An unexpected error occurred. Please try again.'
    }
    toast.error(message,options)
  }else{
    message = res
    toast.success(message,options)
  }
}
