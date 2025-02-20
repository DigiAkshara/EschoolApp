import { Dialog } from "@headlessui/react";
import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteData, getData } from "../../app/api";
import {
  fetchInitialStudentData,
  selectStudent,
} from "../../app/reducers/studentSlice";
import { ACADEMICS, STUDENT } from "../../app/url";
import {
  gender,
  handleApiResponse,
  handleDownload,
  handleDownloadPDF,
} from "../../commonComponent/CommonFunctions";
import CommonUpload from "../../commonComponent/CommonUpload";
import ConfirmationModal from "../../commonComponent/ConfirmationModal";
import FilterComponent from "../../commonComponent/FilterComponent";
import TableComponent from "../../commonComponent/TableComponent";
import StudentProfileModal from "./Profile";
import Student from "./Student";
import { setIsLoader } from "../../app/reducers/appConfigSlice";
import { useLocation } from "react-router-dom";

export default function StudentsList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const {openModel} = location.state || {openModel: false}
  const { classes: clsOptions, sections: sectionOptions } = useSelector(
    (state) => state.students
  );
  const [studentList, setStudentList] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const { branchData } = useSelector((state) => state.appConfig)
  const tenant = useSelector((state) => state.tenantData);


  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Trans Gender", value: "transgender" },
  ];

  useEffect(() => {
    dispatch(fetchInitialStudentData());
    getStudents();
    if (openModel) {
      setOpen(true)
    }

  }, [dispatch]);

  const columns = [
    { title: "Student Name", key: "name" },
    { title: "Admission Number", key: "admissionNo" },
    { title: "Class", key: "className" },
    { title: "Section", key: "sectionName" },
    { title: "Phone Number", key: "phoneNumber" },
    { title: "DOB", key: "date" },
    { title: "Aadhar Number", key: "aadharNumber" },
    { title: "Gender", key: "gender" },
    { title: "Actions", key: "actions" },
  ];


  const getStudents = async () => {
    try {
      dispatch(setIsLoader(true))
      const student = await getData(ACADEMICS);
      const studentRes = student.data.data;
      const studentData = studentRes.map((item) => {
        return {
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
          actions: [
            { label: "Edit", actionHandler: onHandleEdit },
            { label: "Delete", actionHandler: onDelete },
          ],
        };
      });
      setStudentList(studentData);
      setFilteredData(studentData);
    } catch (error) {
      handleApiResponse(error);
    } finally {
      dispatch(setIsLoader(false))
    }
  };

  const onHandleEdit = async (studentId) => {
    try {
      const studentDetails = await getData(STUDENT + "/details/" + studentId);
      dispatch(selectStudent(studentDetails.data.data));
      setOpen(true);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const onDelete = (Id) => {
    setDeleteId(Id);
    setDeleteConfirm(true);
  };

  const handleOpen = () => {
    setOpen(true);
    dispatch(selectStudent(null));
  };
  const handleClose = () => {
    setOpen(false);
    dispatch(selectStudent(null));
  };
  const handleClose2 = () => setOpen2(false);

  const deleteRecord = async () => {
    try {
      let res = await deleteData(STUDENT + '/' + deleteId)
      handleApiResponse(res.data.message, 'success')
      getStudents()
      setDeleteConfirm(false)
      setDeleteId(null)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const filterForm = {
    class: "",
    section: "",
    gender: "",
  };

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
    const filtered = studentList.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleFilter = (values) => {
    let filtered = studentList;
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((rec) => {
          return rec[key].toLowerCase().includes(value.toLowerCase());
        });
      }
    });
    setFilteredData(filtered);
  };

  const handleReset = (updatedValues) => {
    setFilteredData(studentList);
    updatedValues("gender", "");
    updatedValues("class", "");
    updatedValues("section", "");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showStudentProfile = (data) => {
    setActiveStudent(data);
    setShowProfile(true);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const downloadListxlsx = () => {
    const schoolName = branchData?.label || "Unknown School";
    const schoolAddress = `${branchData?.address?.area || ""}, ${branchData?.address?.city || ""}, ${branchData?.address?.state || ""}, ${branchData?.address?.pincode || ""}`.trim();
    const phoneNumber = branchData.phoneNumber || "N/A";
    const email = branchData.email || "N/A";
    handleDownload(
      filteredData,
      "StudentList",
      ["_id", "pic", "class", "section", "actions"],
      schoolName,
      phoneNumber,
      email,
      schoolAddress,
      ["Student List is below"]
    );
  };

  const downloadList = () => {
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
  };

  return (
    <>
      {/* Secondary Tabs */}
      <div className="mt-4 flex justify-between">
        {/* active tab with count block */}
        <div className="sm:hidden"></div>
        <div className="hidden sm:block"></div>

        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            onClick={handleOpen}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Student
          </button>

          <button
            type="button"
            onClick={() => setOpen2(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <ArrowUpTrayIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Bulk Upload Students
          </button>
        </div>
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
              />
              <StudentProfileModal
                data={activeStudent}
                show={showProfile}
                close={() => {
                  setShowProfile(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Student Onboarding Modal */}
      <ConfirmationModal
        showModal={deleteConfirm}
        onYes={deleteRecord}
        onCancel={() => { setDeleteConfirm(false) }}
      />

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <div className="fixed inset-0" />
        <Student onClose={handleClose} loadStudents={getStudents} />
      </Dialog>
      <Dialog open={open2} onClose={setOpen2} className="relative z-50">
        <CommonUpload onClose2={handleClose2} user="student" />
      </Dialog>
    </>
  );
}
