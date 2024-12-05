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
  {value: '4', label: 'Fourth'},
  {value: '5',label: 'Fifth'}
]

export const applyFees = ['All', 'Old Students', 'New Students']

export const feeduration = [
  { value: "1", label: "One Time" },
  { value: "2", label: "2 Installments" },
  { value: "3", label: "3 Installments" },
];

export const roles = [
  { value: "", label: "Select Role" },
  { value: "staff", label: "Staff" },
  { value: "student", label: "student" },
  { value: "other", label: "other" },
]