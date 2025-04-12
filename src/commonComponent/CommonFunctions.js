import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { getData, postData } from "../app/api";
import { logout } from "../app/reducers/appConfigSlice";
import { store } from "../app/store";
import { CLASS_CATEGORIES, CLASSES, SECTIONS, UPLOAD } from "../app/url";

export const generateYearRanges = (numYears) => {
  const currentYear = moment().year();
  return Array.from({ length: numYears }, (_, i) => {
    const startYear = currentYear - i - 1;
    const endYear = currentYear - i;
    const label = `${startYear} - ${endYear}`;
    return { label, value: `${startYear}-${endYear}` };
  });
};

export const formatDate = (date) => {
  const formattedDate = moment(date).format("YYYY-MM-DD");
  return formattedDate;
};

export const staffType = [
  { value: "teaching", label: "Teaching" },
  { value: "non-teaching", label: "Non-Teaching" },
];

export const msgSendOptions = [
  { value: "send-now", label: "Send Now" },
  { value: "schedule", label: "Schedule" },
];

export const feeduration = [
  { value: "onetime", label: "One Time" },
  { value: "installments", label: "Installments" },
];

export const roles = [
  { value: "staff", label: "Staff" },
  { value: "student", label: "student" },
  { value: "other", label: "other" },
];

export const gender = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const eventFor = [
  { value: "wholeSchool", label: "Whole School" },
  { value: "classWise", label: "Class Wise" },
];

export const boardOptions = [
  { value: "cbse", label: "CBSE" },
  { value: "state", label: "State" },
  { value: "icse", label: "ICSE" },
];

export const classCategory = [
  { value: "kindergarten", label: "KINDERGARTEN" },
  { value: "primary", label: "Primary – Classes 1 to 5" },
  { value: "lower", label: "Lower Secondary – Classes 6 to 8" },
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
];

export const occupation = [
  { label: "Government Employee", value: "government_employee" },
  { label: "Police Officer", value: "police_officer" },
  { label: "Army/Defense Personnel", value: "army_defense_personnel" },
  { label: "Teacher/Professor", value: "teacher" },
  { label: "Railway Employee", value: "railway_employee" },
  { label: "Post Office Employee", value: "post_office_employee" },
  { label: "Bank Employee", value: "bank_employee" },
  { label: "Engineer", value: "engineer" },
  { label: "Doctor", value: "doctor" },
  { label: "Lawyer", value: "lawyer" },
  { label: "Businessman", value: "businessman" },
  { label: "Farmer", value: "farmer" },
  { value: "other", label: "Other" },
];

export const staffCategories = [
  { value: "teaching", label: "Teacher" },
  { value: "non-teaching", label: "Non Teaching Staff" },
];

export const financeType = [
  { value: "credit", label: "Credit" },
  { value: "debit", label: "Debit" },
];

export const paymentType = [
  { value: "offline", label: "Offline/Cash" },
  { value: "online", label: "Online" },
];

export const financeCategoryDebit = [
  { value: "loan", label: "Loan" },
  { value: "expenses", label: "Expenses" },
];

export const financeCategoryCredit = [
  { value: "loan-advance", label: "Loan/Advance Payment" },
  { value: "other-income", label: "Other Income" },
];

export const states = [
  { value: "andhrapradesh", label: "AndhraPradesh" },
  { value: "telangana", label: "Telangana" },
  { value: "tamilnadu", label: "TamilNadu" },
];

export const monthsName = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const capitalizeWords = (str) => {
  if (!str) return;
  return str
    .split(" ") // Split the string into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter
    .join(" "); // Join the words back into a string
};

export const sections = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
  { value: "d", label: "D" },
  { value: "e", label: "E" },
];

export const teacher = [
  { value: "teacher1", label: "Teacher 1" },
  { value: "teacher2", label: "Teacher 2" },
  { value: "teacher3", label: "Teacher 3" },
  { value: "teacher4", label: "Teacher 4" },
];

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
];

export const payments = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bankTransfer", label: "Bank Transfer" },
  { value: "cheque", label: "CHEQUE" },
];

export const designations = [
  { value: "principal", label: "Principal" },
  { value: "vice-principal", label: "Vice Principal" },
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
];

export const attendanceOptions = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "half-day", label: "Half Day" },
];

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const fileName = file.name;
    let response = await postData(UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200 || response.status === 201) {
      response.data.name = fileName;
      return response.data;
    } else {
      alert(response.message);
    }
  } catch (error) {
    handleApiResponse(error);
  }
};

export const getClasses = async () => {
  try {
    const res = await getData(CLASSES);
    if (res.status === 200 || res.status === 201) {
      const classData = res.data.data.map((item) => {
        return {
          label: item.name, // Displayed text in the dropdown
          value: item._id,
        };
      });
      return classData;
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    return [];
  }
};

export const getClassCategories = async () => {
  try {
    const res = await getData(CLASS_CATEGORIES);
    if (res.status === 200 || res.status === 201) {
      const categoryData = res.data.data.map((item) => {
        return {
          label: item.name, // Displayed text in the dropdown
          value: item._id,
        };
      });
      return categoryData;
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    return [];
  }
};

export const handleDownload = (
  filteredData,
  fileName,
  schoolName = "Your School Name",
  phoneNumber,
  email,
  schoolAddress,
  columns = []
) => {
  try {
    const exportData = filteredData.map((row) =>
      columns.map((col) => {
        const value = row[col.key] || "-";
        if (col.key === "date" || col.key === "dateOfBirth") {
          return moment(value).format("DD-MM-YYYY"); // Format date
        }
        return value;
      })
    );

    // Create worksheet manually
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    // Add custom rows (school name and message)
    XLSX.utils.sheet_add_aoa(worksheet, [[schoolName]], { origin: "A1" }); // School name in row 1
    XLSX.utils.sheet_add_aoa(worksheet, [[phoneNumber]], { origin: "A2" });
    XLSX.utils.sheet_add_aoa(worksheet, [[email]], { origin: "A3" });
    XLSX.utils.sheet_add_aoa(worksheet, [[schoolAddress]], { origin: "A4" });
    XLSX.utils.sheet_add_aoa(worksheet, [[""]], { origin: "A5" }); // Empty row in row 2
    XLSX.utils.sheet_add_aoa(worksheet, [[`${fileName} is below`]], {
      origin: "A6",
    }); // Message in row 3

    // Add headers (capitalized)
    const headers = columns.map((header) => header.label);
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A7" }); // Headers start from row 4

    // Add student data below headers
    XLSX.utils.sheet_add_json(worksheet, exportData, {
      origin: "A8",
      skipHeader: true,
    });

    // Create workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Write workbook to binary and create a Blob
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    // Save the file
    saveAs(dataBlob, `${fileName}.xlsx`);
  } catch (error) {
    handleApiResponse(error);
  }
};

export const handleDownloadPDF = (
  data,
  fileName,
  columns,
  title,
  branch,
  orientation = "portrait"
) => {
  const defaultLogo = "./schoolLogo.jpg";

  // Initialize jsPDF with dynamic orientation
  const doc = new jsPDF(orientation, "mm", "a4"); // Use dynamic orientation
  doc.setFont("helvetica", "bold");

  // School Header Information
  const schoolName = (branch?.label || "Unknown School").toUpperCase();
  const schoolAddress = `${branch?.address?.area || ""}, ${
    branch?.address?.city || ""
  }, ${branch?.address?.state || ""}, ${branch?.address?.pincode || ""}`.trim();
  const phoneNumber = branch?.mobileNumber || "N/A";
  const email = branch?.email || "N/A";

  const logo = branch?.logo?.Location || defaultLogo;

  // Add School Logo (Left Side) with adjusted Y position
  doc.addImage(logo, "PNG", 10, 5, 28, 28); // (image, type, x, y, width, height)

  // Adjust header formatting for portrait and landscape orientation
  doc.setFontSize(14);

  // Calculate X position for centering in landscape mode
  const centerX = orientation === "landscape" ? 148 : 105; // 148 is half of the A4 landscape width, 105 is half of portrait

  doc.text(schoolName, centerX, 15, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Phone: ${phoneNumber} | Email: ${email}`, centerX, 21, {
    align: "center",
  });
  doc.text(`Address: ${schoolAddress}`, centerX, 27, { align: "center" });

  // Add a separator line with adjusted Y position to avoid touching the logo
  doc.setLineWidth(0.5);
  doc.line(10, 35, orientation === "landscape" ? 290 : 200, 35); // Adjust line width based on orientation

  const contentStartY = 45; // Adjust this value for more or less spacing

  // Report Title
  doc.setFontSize(12);
  doc.text(title, 14, contentStartY);

  const tableStartY = contentStartY + 5;

  // Extract column headers and row data
  const tableColumnHeaders = columns.map((col) => col.label);
  const tableRows = data.map((row) =>
    columns.map((col) => {
      const value = row[col.key] || "-";
      if (col.key === "date" || col.key === "dateOfBirth") {
        return moment(value).format("DD-MM-YYYY"); // Format date
      }
      return value;
    })
  );

  // Add table
  autoTable(doc, {
    head: [tableColumnHeaders],
    body: tableRows,
    startY: tableStartY,
    styles: { fontSize: 10 },
    theme: "grid",
  });

  doc.save(`${fileName}.pdf`);
};

export const handleDownloadCSV = (headers, fileName = "data.csv") => {
  // Generate CSV content with headers
  const csvContent = headers.join(",") + "\n";
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, fileName);
};
export const handleApiResponse = (res, type = "error") => {
  let message = "";
  const options = { theme: "colored", className: "text-xs" };
  if (type === "error") {
    if (res.response) {
      // Server responded with a status code out of range [200, 299]
      console.error("API Error:", res.response.data);
      if (typeof res.response.data.message === "object") {
        message = res.response.data.message.join(", ");
      } else {
        if (res.response.data.statusCode === 403) {
          store.dispatch(logout());
          localStorage.clear();
          window.location.href = "/login";
        }
        message = res.response.data.message || "Something went wrong!";
      }
    } else if (res.request) {
      // Request was made but no response was received
      console.error("Network Error:", res.request);
      message = "Network error, please try again later.";
    } else {
      // Something happened in setting up the request
      console.error("Unknown Error:", res.message);
      message =
        res.message || "An unexpected error occurred. Please try again.";
    }
    toast.error(message, options);
  }
  if (type === "info") {
    message = res;
    toast.info(message, options);
  } else {
    message = res;
    toast.success(message, options);
  }
};

export const checkAcademicYear = () => {
  const state = store.getState();
  const academicYear = state.appConfig.academicYear;
  const currentYear = moment().year();
  return academicYear.year.split("-")[0] === currentYear.toString();
};

export function hasPermission(menuName, permissionType, options = {}) {
  const state = store.getState();
  const { academicYear,navConfig:permissions} = state.appConfig
  const currentYear = moment().year();
  if(academicYear?.year.split("-")[0] !== currentYear.toString()&&academicYear?.status!=='active') return true
  const { isSubmenu = false } = options;

  const menu = permissions.find(p => p.name === (isSubmenu ? options.parentMenu : menuName));
  if (!menu) return false;

  if (!isSubmenu) {
    return menu[permissionType] ?? false;
  }

  const subItem = menu.submenu?.find(sub => sub.name === menuName);
  return subItem?.[permissionType]?false:true;
}


export function getGradeFromMarks(obtainedMarks, totalMarks) {
  if (totalMarks === 0) return 'Invalid'; // avoid divide-by-zero

  const percentage = (obtainedMarks / totalMarks) * 100;

  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

