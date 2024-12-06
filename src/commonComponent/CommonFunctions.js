export const getAcademicYears = ()=> {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Determine the current academic year
  const startYear = currentMonth >= 6 ? currentYear : currentYear - 1;
  const acadamicYears = [];

  // Generate the academic years
  for (let year = startYear; year <= startYear + 2; year++) {
    acadamicYears.push({
      value: `${year}-${year + 1}`,
      label: `${year}-${year + 1}`,
    });
  }
  return acadamicYears;
}

export const getFeeGroups =  [
  {value: '1', label: 'Primary'},
  {value: '2', label: 'Secondary'},
  {value: '3', label: 'Tertiary'},
  {value: '4', label: 'Quaternary'},
  {value: '5',label: 'Quinary'}
]

export const applyFees = [
  {value: 'all', label: 'All'}, 
  {value: 'old', label: 'Old Students'},
  {value: 'new', label: 'New Students'}
]

export const feeduration = [
  { value: "1", label: "One Time" },
  { value: "2", label: "2 Installments" },
  { value: "3", label: "3 Installments" },
];

export const roles = [
  { value: "staff", label: "Staff" },
  { value: "student", label: "student" },
  { value: "other", label: "other" },
]

export const feeDiscount = [
  { value: "0", label: "0%" },
  { value: "5", label: "5%" },
  { value: "10", label: "10%" },
  { value: "15", label: "15%" },
  { value: "20", label: "20%" },
  { value: "25", label: "25%" },
  { value: "30", label: "30%" },
]

export const gender = [
  { value: "male", label: "Male"},
  { value: "female", label: "Female"},
  { value: "other", label: "Other"}
];