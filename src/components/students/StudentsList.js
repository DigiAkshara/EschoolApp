import { Dialog } from "@headlessui/react";
import { ArrowLongUpIcon, ArrowUpTrayIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { deleteData, getData } from "../../app/api";
import { setIsLoader } from "../../app/reducers/appConfigSlice";
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
  hasPermission,
} from "../../commonComponent/CommonFunctions";
import CommonUpload from "../../commonComponent/CommonUpload";
import ConfirmationModal from "../../commonComponent/ConfirmationModal";
import FilterComponent from "../../commonComponent/FilterComponent";
import TableComponent from "../../commonComponent/TableComponent";
import DeleteModal from "./DeleteModal";
import StudentProfileModal from "./Profile";
import PromoteModal from "./PromoteModal";
import Student from "./Student";
import BulkFeeModal from "./BulkFeeModal";

export default function StudentsList() {
  const dispatch = useDispatch();
  const location = useLocation();
   const academicYear = useSelector((state) => state.appConfig.academicYear)
  const { openModel } = location.state || { openModel: false }
  const { classes: clsOptions, sections: sectionOptions } = useSelector(
    (state) => state.students
  );
  const [studentList, setStudentList] = useState([]);
  const [showNewStudentModal, setshowNewStudentModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [filterForm, setFilterForm] = useState({
    class: "",
    section: "",
    gender: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const { branchData } = useSelector((state) => state.appConfig)
  const [showPromteModal, setShowPromteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkFeeModal, setShowBulkFeeModal] = useState(false);
  const [granuts, setGranuts] = useState({ create: false, edit: false, delete: false })

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Trans Gender", value: "transgender" },
  ];

  useEffect(() => {
    dispatch(fetchInitialStudentData());
    getStudents();
    if (openModel) {
      setshowNewStudentModal(true)
    }
  }, []);

  useEffect(() => {
    if (clsOptions.length > 0 && sectionOptions.length > 0) {
      const classId = clsOptions[0].value;
      const formObj = {
        class: classId,
        section: sectionOptions.filter((sec) => sec.class === classId)[0].value,
        gender: "",
      }
      handleFilter(formObj);
    }
  }, [clsOptions, sectionOptions, studentList]);


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
      const createPermission = hasPermission('student_details', 'write', { isSubmenu: true, parentMenu: 'students' })
      const editPermission = hasPermission('student_details', 'edit', { isSubmenu: true, parentMenu: 'students' })
      const deletePermission = hasPermission('student_details', 'delete', { isSubmenu: true, parentMenu: 'students' })
      setGranuts({ create: createPermission, edit: editPermission, delete: deletePermission })
      const studentData = student.data.data.map((item) => {
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
          ...(item.status === 'active'&&academicYear?.status === 'active') && {
            actions: [
              { label: "Edit", actionHandler: onHandleEdit, disabled: editPermission },
              { label: "Delete", actionHandler: onDelete, disabled: deletePermission },
            ]
          },
        };
      });
      setStudentList([...studentData]);
      // setFilteredData([...studentData]);
    } catch (error) {
      handleApiResponse(error);
    } finally {
      dispatch(setIsLoader(false))
    }
  };

  const handleCheckbox = (id, all = false) => {
    let index = filteredData.findIndex((item) => item._id == id);
    let updatedData = [...filteredData];
    if (index != -1) {
      updatedData[index].isChecked = !updatedData[index].isChecked
      setFilteredData(updatedData);
    }
  }

  const handleSelectAll = (e) => {
    const updatedData = filteredData.map((item) => {
      return { ...item, isChecked: e.target.checked };
    });
    setFilteredData(updatedData);
  }

  const getStudentData = async (studentId) => {
    const studentDetails = await getData(STUDENT + "/details/" + studentId);
    return studentDetails.data.data;
  }

  const onHandleEdit = async (studentId) => {
    try {
      const studentDetails = await getStudentData(studentId)
      dispatch(selectStudent(studentDetails));
      setshowNewStudentModal(true);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const onDelete = (Id) => {
    setDeleteId(Id);
    setDeleteConfirm(true);
  };

  const addNewStudent = () => {
    dispatch(selectStudent(null));
    setshowNewStudentModal(true);
  };
  const handleClose = () => {
    setshowNewStudentModal(false);
    dispatch(selectStudent(null));
  };

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
    const classId = clsOptions[0].value;
    const sectionId = sectionOptions.filter((item) => item.class == classId)[0].value;
    handleFilter({
      class: classId,
      section: sectionId,
      gender: "",
    });
    updatedValues("class", classId);
    updatedValues("section", sectionId);
    updatedValues("gender", "");
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

  const areCheckedAll = () => {
    return filteredData.length > 0 && filteredData.every((item) => item.isChecked);
  };

  const handleBulkClose = ({ refresh = false }) => {
    setShowPromteModal(false)
    setShowDeleteModal(false)
    setShowBulkFeeModal(false)
    if (refresh) {
      getStudents()
    }
  }

  return (
    <>
      {/* Secondary Tabs */}
      <div className="mt-4 flex justify-between">
        {/* active tab with count block */}
        <div className="sm:hidden"></div>
        <div className="hidden sm:block"></div>

        <div className="right-btns-blk space-x-4">
          <button
            disabled={granuts.create}
            type="button"
            onClick={addNewStudent}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Studentss
          </button>

          <button
            disabled={granuts.create}
            type="button"
            onClick={() => setShowUploadModal(true)}
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
            {filteredData.some((item) => item.isChecked) &&
              <div className="left-20 top-0 flex h-12 items-center space-x-3 bg-white sm:left-72">
                <button
                  disabled={granuts.create}
                  type="button"
                  onClick={() => { setShowPromteModal(true) }}
                  className="inline-flex items-center rounded gap-x-1.5 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  <ArrowLongUpIcon
                    aria-hidden="true"
                    className="size-5"
                  />
                  Promote
                </button>

                <button
                  disabled={granuts.create}
                  onClick={() => setShowBulkFeeModal(true)}
                  type="button"
                  className="inline-flex items-center rounded gap-x-1.5 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  <ArrowLongUpIcon
                    aria-hidden="true"
                    className="size-5"
                  />
                  Add Bulk Fees
                </button>

                <button
                  disabled={granuts.delete}
                  onClick={() => setShowDeleteModal(true)}
                  type="button"
                  className="inline-flex items-center rounded gap-x-1.5 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  <TrashIcon
                    aria-hidden="true"
                    className="size-5"
                  />
                  Delete
                </button>
              </div>}
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
                downloadDisabled={granuts.create}

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
                onCheckbox={handleCheckbox}
                onCheckAll={handleSelectAll}
                checkAll={areCheckedAll()}
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

      {/* Student Onboarding Modal */}
      <ConfirmationModal
        showModal={deleteConfirm}
        onYes={deleteRecord}
        onCancel={() => { setDeleteConfirm(false) }}
      />

      <Dialog open={showNewStudentModal} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0" />
        <Student onClose={handleClose} loadStudents={getStudents} />
      </Dialog>
      <Dialog open={showUploadModal} onClose={setShowUploadModal} className="relative z-50">
        <CommonUpload onClose={() => setShowUploadModal(false)} user="student" loadData={getStudents} />
      </Dialog>
      <Dialog open={showPromteModal} onClose={handleBulkClose} className="relative z-50">
        <div className="fixed inset-0" />
        <PromoteModal students={filteredData.filter((item) => item.isChecked).map((item) => item._id)} onClose={handleBulkClose} />
      </Dialog>

      <Dialog open={showBulkFeeModal} onClose={handleBulkClose} className="relative z-50">
        <div className="fixed inset-0" />
        <BulkFeeModal data={filterForm} students={filteredData.filter((item) => item.isChecked).map((item) => item._id)} onClose={handleBulkClose} />
      </Dialog>

      <Dialog open={showDeleteModal} onClose={handleBulkClose} className="relative z-50">
        <div className="fixed inset-0" />
        <DeleteModal students={filteredData.filter((item) => item.isChecked).map((item) => item._id)} onClose={handleBulkClose} />
      </Dialog>
    </>
  );
}


