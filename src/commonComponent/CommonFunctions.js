import { useDispatch } from "react-redux";
import { getData, postData } from "../app/api";
import { CLASSES, UPLOAD } from "../app/url"; 
export const getAcademicYears = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Determine the current academic year
  const startYear = currentMonth >= 6 ? currentYear : currentYear - 1;
  const academicYears = [];

  // Generate the academic years
  for (let year = startYear; year <= startYear + 2; year++) {
    academicYears.push({
      value: `${year}-${year + 1}`,
      label: `${year}-${year + 1}`,
    });
  }
  return academicYears;
};

export const getFeeGroups = [
  { value: "1", label: "Primary" },
  { value: "2", label: "Secondary" },
  { value: "3", label: "Tertiary" },
  { value: "4", label: "Quaternary" },
  { value: "5", label: "Quinary" },
];

export const applyFees = [
  { value: "all", label: "All" },
  { value: "old", label: "Old Students" },
  { value: "new", label: "New Students" },
];

export const feeduration = [
  { value: "1", label: "One Time" },
  { value: "2", label: "2 Installments" },
  { value: "3", label: "3 Installments" },
];

export const roles = [
  { value: "staff", label: "Staff" },
  { value: "student", label: "student" },
  { value: "other", label: "other" },
];

export const feeDiscount = [
  { value: "0", label: "0%" },
  { value: "5", label: "5%" },
  { value: "10", label: "10%" },
  { value: "15", label: "15%" },
  { value: "20", label: "20%" },
  { value: "25", label: "25%" },
  { value: "30", label: "30%" },
];

export const gender = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const board = [
  { value: "cbse", label: "CBSE" },
  { value: "state", label: "State" },
  { value: "icse", label: "ICSE" },
];

export const classCategory = [
  { value: "kindergarten", label: "KINDERGARTEN" },
  { value: "primary", label: "Primary – Classes 1 to 5" },
  { value: "lower",label: "Lower Secondary – Classes 6 to 8",},
  { value: "secondary", label: "Secondary – Classes 9 & 10" },
];

export const nationality = [
  { value: "indian", label: "Indian" },
  { value: "foreign", label: "Foreign" },
];

export const caste = [
  { value: "general", label: "General" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
];

export const religion = [
  { value: "hindu", label: "Hindu" },
  { value: "muslim", label: "Muslim" },
  { value: "christian", label: "Christian" },
  { value: "sikh", label: "Sikh" },
  { value: "jain", label: "Jain" },
  { value: "buddhist", label: "Buddhist" },
  { value: "jewish", label: "Jewish" },
  { value: "other", label: "Other" },
];

export const bloodGroup = [
  { value: "a", label: "A+" },
  { value: "b", label: "B+" },
  { value: "ab", label: "AB+" },
  { value: "o", label: "O+" },
  { value: "aMinus", label: "A-" },
  { value: "bMinus", label: "B-" },
  { value: "abMinus", label: "AB-" },
  { value: "oMinus", label: "O-" },
]

export const occupation = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "other", label: "Other" },
]

export const staffCategory = [
  { value: "teacher", label: "Teacher" },
  { value: "Non-teacher", label: "Non Teaching Staff" },
]

export const states = [
  { value: "andhrapradesh", label: "Andhra Pradesh" },
  { value: "telangana", label: "Telangana" },
  { value: "tamilnadu", label: "Tamil Nadu" },
]

export const capitalizeWords = (str) => {
  return str
    .split(' ') // Split the string into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter
    .join(' '); // Join the words back into a string
};

export const sections = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
  { value: "d", label: "D" },
  { value: "e", label: "E" },
]

export const teacher = [
  { value: "teacher1", label: "Teacher 1" },
  { value: "teacher2", label: "Teacher 2" },
  { value: "teacher3", label: "Teacher 3" },
  { value: "teacher4", label: "Teacher 4" },
]

export const banks = [
  { value: "hdfc", label: "HDFC" },
  { value: "indusind", label: "Indusind" },
  { value: "sbi", label: "SBI" },
  { value: "icici", label: "ICICI" },
  { value: "axis", label: "AXIS" },
  { value: "canara", label: "CANARA" },
  { value: "kotak", label: "KOTAK" },
  { value: "yesbank", label: "YESBANK" },
  { value: "pnb", label: "PNB" },
  { value: "unionbank", label: "UNIONBANK" },
  { value: "other", label: "Other" },
]

export const payments = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bankTransfer", label: "Bank Transfer" },
  { value: "cheque", label: "CHEQUE" },

];

export const designations = [
  { value: "principal", label: "Principal" },
  { value: "viceprincipal", label: "Vice Principal" },
  { value: "teacher", label: "Teacher" },
  { value: "librarian", label: "Librarian" },
  { value: "accountant", label: "Accountant" },
  { value: "secretary", label: "Secretary" },
  { value: "manager", label: "Manager" },
  { value: "clerk", label: "Clerk" },
  { value: "cashier", label: "Cashier" },
  { value: "driver", label: "Driver" },
  { value: "labour", label: "Labour" },
  { value: "cleaner", label: "Cleaner" },
  { value: "cook", label: "Cook" },
  { value: "other", label: "Other" },
]

export const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const fileName = file.name
      let response = await postData(UPLOAD, formData, {headers: {
        'Content-Type': 'multipart/form-data',
      }});
      if (response.status === 200 || response.status === 201) {
        response.data.name = fileName
        return response.data
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  export const getClasses = async () => {
    try {
      const res = await getData(CLASSES);
      if(res.status === 200 || res.status === 201){
        const classData = res.data.data.map((item) => {
          return {
            label: item.name, // Displayed text in the dropdown
            value: item._id, 
          }
        })
        return classData
      }else{
        throw new Error(res.message)
      }
    } catch (error) {
      return []
      console.log(error);}
    }