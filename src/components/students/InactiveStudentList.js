import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getData } from "../../app/api";
import { setIsLoader } from "../../app/reducers/appConfigSlice";
import {
  selectStudent
} from "../../app/reducers/studentSlice";
import { ACADEMICS, STUDENT } from "../../app/url";
import {
  gender,
  handleApiResponse,
  handleDownload,
  handleDownloadPDF,
  hasPermission,
} from "../../commonComponent/CommonFunctions";
import FilterComponent from "../../commonComponent/FilterComponent";
import TableComponent from "../../commonComponent/TableComponent";
import StudentProfileModal from "./Profile";

export default function InactiveStudentsList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const academicYear = useSelector((state) => state.appConfig.academicYear)
  const { classes: clsOptions, sections: sectionOptions } = useSelector(
    (state) => state.students
  );
  const [studentList, setStudentList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterForm, setFilterForm] = useState({
    class: "",
    section: "",
    gender: "",
  });
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const { branchData } = useSelector((state) => state.appConfig)
  const [granuts, setGranuts] = useState({ create: false, edit: false, delete: false })

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Trans Gender", value: "transgender" },
  ];

  useEffect(() => {
    getStudents();
  }, [academicYear])

  const columns = [
    { title: "Student Name", key: "name" },
    { title: "Admission Number", key: "admissionNo" },
    { title: "Class", key: "className" },
    { title: "Section", key: "sectionName" },
    { title: "Phone Number", key: "phoneNumber" },
    { title: "DOB", key: "date" },
    { title: "Aadhar Number", key: "aadharNumber" },
    { title: "Gender", key: "gender" }
  ];

  const getStudents = async () => {
    try {
      dispatch(setIsLoader(true))
      const res = await getData(ACADEMICS + `?status=inactive`);
      const createPermission = hasPermission('student_details', 'write', { isSubmenu: true, parentMenu: 'students' })
      const editPermission = hasPermission('student_details', 'edit', { isSubmenu: true, parentMenu: 'students' })
      const deletePermission = hasPermission('student_details', 'delete', { isSubmenu: true, parentMenu: 'students' })
      setGranuts({ create: createPermission, edit: editPermission, delete: deletePermission })
      const studentData = res.data.data.map((item) => {
        return {
          isChecked: false,
          _id: item.student._id,
          pic: item.student.profilePic?.Location,
          name: item.student.firstName + " " + item.student.lastName,
          admissionNo: item.student.admissionNumber,
          className: item.class?.name,
          class: item.class?._id,
          section: item.section?._id,
          sectionName: item.section.section,
          phoneNumber: item.student.fatherDetails.mobileNumber,
          date: item.student.DOB,
          aadharNumber: item.student.aadharNumber,
          gender: gender.find((gender) => gender.value === item.student.gender)
            .label,
          dateOfBirth: item.student.DOB,
          aadharNumber: item.student.aadharNumber,
          fatherName: item.student.fatherDetails?.name,
          fatherMobile: item.student.fatherDetails?.mobileNumber,
          fatherOccupation: item.student.fatherDetails?.occupation || "N/A",
          religion: item.student.religion,
          cast: item.student.cast,
          subCast: item.student.subCast,
          nationality: item.student.nationality,
          bloodGroup: item.student.bloodGroup,
          motherName: item.student.motherDetails?.name,
          motherMobile: item.student.motherDetails?.mobileNumber,
          motherOccupation: item.student.motherDetails?.occupation || "N/A",
          presentArea: item.student.presentAddress?.area,
          presentCity: item.student.presentAddress?.city,
          presentState: item.student.presentAddress?.state,
          presentPincode: item.student.presentAddress?.pincode,
          permanentArea: item.student.permanentAddress?.area,
          permanentCity: item.student.permanentAddress?.city,
          permanentState: item.student.permanentAddress?.state,
          permanentPincode: item.student.permanentAddress?.pincode,
          previousSchool: item.student.previousSchool?.schoolName,
          previousClass: item.student.previousSchool?.classStudied,
          previousstudyProof: item.student.previousSchool?.studyProof,
          previousSchoolyearOfStudy: item.student.previousSchool?.yearOfStudy,
          presentAddress: `${item.student.presentAddress?.area}, ${item.student.presentAddress?.city}, ${item.student.presentAddress?.state} - ${item.student.presentAddress?.pincode}`,
        };
      });
      setStudentList([...studentData]);
      setFilteredData([...studentData]);
    } catch (error) {
      handleApiResponse(error);
    } finally {
      dispatch(setIsLoader(false))
    }
  };


  const getStudentData = async (studentId) => {
    const studentDetails = await getData(STUDENT + "/details/" + studentId);
    return studentDetails.data.data;
  }

  const filters = {
    class: { options: clsOptions },
    section: {
      options: sectionOptions,
      dependency: true,
      dependencyKey: "class",
      filterOptions: true,
    },
    gender: { options: genderOptions },
  };

  const handleSearch = (term) => {
    const curRecords = filterRecords(filterForm)
    const filtered = curRecords.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1)
  };

  const handleFilter = (values) => {
    setFilterForm(values);
    let filtered = filterRecords(values)
    setFilteredData(filtered);
    setCurrentPage(1)
  };

  const filterRecords = (values) => {
    let filtered = studentList;
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((rec) => {
          rec.isChecked = false;
          return rec[key].toLowerCase() === value.toLowerCase();
        });
      }
    });
    return filtered
  }

  const handleReset = (updatedValues) => {
    updatedValues("class", "");
    updatedValues("section", "");
    updatedValues("gender", "");
    setFilteredData(studentList);
    setCurrentPage(1)
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showStudentProfile = async (data) => {
    let studentData = await getStudentData(data._id);
    dispatch(selectStudent(studentData));
    setShowProfile(true);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const downloadListxlsx = () => {
    if (granuts.create) {
      handleApiResponse({ message: "You don't have permission to download." });
    } else {
      const schoolName = branchData?.label || "Unknown School";
      const schoolAddress = `${branchData?.address?.area || ""}, ${branchData?.address?.city || ""}, ${branchData?.address?.state || ""}, ${branchData?.address?.pincode || ""}`.trim();
      const phoneNumber = branchData.mobileNumber || "N/A";
      const email = branchData.email || "N/A";

      handleDownload(
        filteredData,
        "StudentList",
        schoolName,
        phoneNumber,
        email,
        schoolAddress,
        [
          { label: "Stu.Name", key: "name" },
          { label: "Ad.No", key: "admissionNo" },
          { label: "Class", key: "className" },
          { label: "Section", key: "sectionName" },
          { label: "Aadhar.No.", key: "aadharNumber" },
          { label: "DOB", key: "dateOfBirth" },
          { label: "Fathers Name", key: "fatherName" },
          { label: "Phone No.", key: "fatherMobile" },
          { label: "Mothers Name", key: "motherName" },
          { label: "Present Address", key: "presentAddress" },
        ]
      );
    }
  };

  const downloadList = () => {
    if (granuts.create) {
      handleApiResponse({ message: "You don't have permission to download." });
    } else {
      handleDownloadPDF(
        filteredData,
        "Student_Details",
        [
          { label: "Stu.Name", key: "name" },
          { label: "Ad.No", key: "admissionNo" },
          { label: "Class", key: "className" },
          { label: "Section", key: "sectionName" },
          { label: "Aadhar.No.", key: "aadharNumber" },
          { label: "DOB", key: "dateOfBirth" },
          { label: "Fathers Name", key: "fatherName" },
          { label: "Phone No.", key: "fatherMobile" },
          { label: "Mothers Name", key: "motherName" },
          { label: "Present Address", key: "presentAddress" },
        ],
        "Student Details Report",
        branchData,
        undefined,
        "landscape"
      );
    }
  };

  return (
    <>
      {/* Secondary Tabs */}
      <div className="mt-4 flex justify-between">
        {/* active tab with count block */}
        <div className="sm:hidden"></div>
        <div className="hidden sm:block"></div>
      </div>

      <div className="-mx-2 -my-2 mt-0 sm:-mx-6">
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">

            <div className="shadow ring-1 ring-black/5 sm:rounded-lg">
              <FilterComponent
                onSearch={handleSearch}
                filters={filters}
                filterForm={filterForm}
                handleFilter={handleFilter}
                handleReset={handleReset}
                downloadList={downloadList}
                downloadListxlsv={downloadListxlsx}
                isDownloadDialog={true}
                downloadDisabled={granuts.create || granuts.edit || granuts.delete}

              />
              {/* Table View */}

              <TableComponent
                columns={columns}
                data={paginatedData}
                pagination={{
                  currentPage,
                  totalCount: filteredData.length,
                  onPageChange: handlePageChange,
                }}
                showModal={showStudentProfile}
                checkColumn={false}
              />
              <StudentProfileModal
                show={showProfile}
                onClose={({ refresh = false }) => {
                  setShowProfile(false);
                  dispatch(selectStudent(null));
                  if (refresh) {
                    getStudents()
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


