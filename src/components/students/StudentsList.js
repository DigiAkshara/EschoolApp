import { Dialog } from "@headlessui/react";
import { ArrowLongUpIcon, ArrowUpTrayIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";
import { deleteData, getData, postData } from "../../app/api";
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
  handleDownloadPDF
} from "../../commonComponent/CommonFunctions";
import CommonUpload from "../../commonComponent/CommonUpload";
import ConfirmationModal from "../../commonComponent/ConfirmationModal";
import CustomSelect from "../../commonComponent/CustomSelect";
import FilterComponent from "../../commonComponent/FilterComponent";
import TableComponent from "../../commonComponent/TableComponent";
import StudentProfileModal from "./Profile";
import Student from "./Student";

export default function StudentsList() {
  const dispatch = useDispatch();
  const location = useLocation();
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
  const [activeStudent, setActiveStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const { branchData, academicYears } = useSelector((state) => state.appConfig)
  const [showPromteModal, setShowPromteModal] = useState(false);
  const [academicYearOptions, setAcademicYearOptons] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      setFilterForm({
        class: classId,
        section: sectionOptions.filter((sec) => sec.class === classId)[0].value,
        gender: "",
      });
    }
  }, [clsOptions, sectionOptions]);

  useEffect(() => {
    if (academicYears.length > 0) {
      setAcademicYearOptons(academicYears.map((year) => ({ label: year.year, value: year._id })));
    }},[academicYears])
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
          actions: [
            { label: "Edit", actionHandler: onHandleEdit },
            { label: "Delete", actionHandler: onDelete },
          ],
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
          rec.isChecked = false;
          return rec[key].toLowerCase()===value.toLowerCase();
        });
      }
    });
    setFilteredData(filtered);
  };

  const handleReset = (updatedValues) => {
    const classId = clsOptions[0].value;
    const sectionId = sectionOptions.filter((item) => item.class == classId)[0].value;
    setFilterForm({
      class: classId,
      section: sectionId,
      gender: "",
    });
    updatedValues("class", classId);
    updatedValues("section", sectionId);
    updatedValues("gender", "");
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

  const areCheckedAll = () => {
    return filteredData.length > 0 && filteredData.every((item) => item.isChecked);
  };

  const handleDeleteSubmit = async (values) => {
    try {
      const selectedStudent = []
      filteredData.forEach((item) => {if(item.isChecked) selectedStudent.push(item._id)});
      const payload = {
        status: values.status,
        studentIds: selectedStudent,
      }
      const res = await deleteData(ACADEMICS, payload)
      handleApiResponse(res.data.message, 'success')
      getStudents()
      setShowDeleteModal(false)
    } catch (error) {
      handleApiResponse(error);
    }
  }
  const initialValues = {
    academicYear: academicYears.find((year) => year.status === "upcoming")?._id,
    class: "",
    section: "",
  }

  const getValidationSchema = () => {
    return Yup.object({
      academicYear: Yup.string().required("Academic Year is required"),
      class: Yup.string().required("Class is required"),
      section: Yup.string().required("Section is required")
    })
  }

  const getDeleteValidationSchema  = () => {
    return Yup.object({
      status: Yup.string().required("Status is required"),
    })
  }

  const handleSubmit = async (values) => {
    try {
      const selectedStudent = []
      filteredData.forEach((item) => {if(item.isChecked) selectedStudent.push(item._id)});
      const payload = {
        academicYear: values.academicYear,
        studentIds: selectedStudent,
        classId: values.class,
        sectionId: values.section,
      };
      const res = await postData(ACADEMICS, payload);
      handleApiResponse(res.data.message, "success");
      getStudents();
      setShowPromteModal(false);
    } catch (error) {
      handleApiResponse(error);
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
            type="button"
            onClick={addNewStudent}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Student
          </button>

          <button
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
                  type="button"
                  onClick={()=>setShowPromteModal(true)}
                  className="inline-flex items-center rounded gap-x-1.5 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  <ArrowLongUpIcon
                    aria-hidden="true"
                    className="size-5"
                  />
                  Promote
                </button>

                <button
                  onClick={()=>setShowDeleteModal(true)}
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
                close={() => {
                  setShowProfile(false);
                  dispatch(selectStudent(null));
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
        onCancel={() => {setDeleteConfirm(false) }}
      />

      <Dialog open={showNewStudentModal} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0" />
        <Student onClose={handleClose} loadStudents={getStudents} />
      </Dialog>
      <Dialog open={showUploadModal} onClose={setShowUploadModal} className="relative z-50">
        <CommonUpload onClose={() => setShowUploadModal(false)} user="student" loadData={getStudents} />
      </Dialog>
      <Dialog open={showPromteModal} onClose={() => setShowPromteModal(false)} className="relative z-50">
        <div className="fixed inset-0" />
        <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Form>
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                <div className="bg-white w-96 rounded-lg shadow-lg">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center bg-purple-600 text-white p-3 rounded-t-lg">
                    <h2 className="text-lg font-semibold">Promote Students</h2>
                    <button
                      onClick={()=> setShowPromteModal(false) }
                      className="text-white hover:text-gray-200"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6">
                    <CustomSelect
                      name="academicYear"
                      label="Academic Year"
                      options={academicYearOptions}
                      disabled={true}
                    />
                    <div className="my-4"></div>
                    <CustomSelect
                      name="class"
                      label="Class to be promoted"
                      options={clsOptions}
                      required={true}
                    />
                    <div className="my-4"></div>
                    <CustomSelect
                      name="section"
                      label="Section to be promoted"
                      disabled={!values.class}
                      options={sectionOptions.filter((item) => item.class === values.class)}
                      required={true}
                    />
                  </div>

                  {/* Modal Footer */}
                  <div className="p-3 flex justify-end space-x-2 border-t">
                    <button
                      onClick={()=>setShowPromteModal(false) }
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500">
                      Promote
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
      </Dialog>

      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="relative z-50">
        <div className="fixed inset-0" />
        <Formik
        initialValues={{status:''}}
        validationSchema={getDeleteValidationSchema()}
        onSubmit={handleDeleteSubmit}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Form>
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                <div className="bg-white w-96 rounded-lg shadow-lg">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center bg-purple-600 text-white p-3 rounded-t-lg">
                    <h2 className="text-lg font-semibold">Delete Students</h2>
                    <button
                      onClick={()=> setShowDeleteModal(false) }
                      className="text-white hover:text-gray-200"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6">
                    <CustomSelect
                      name="status"
                      label="Status"
                      options={[{label:'Remove',value:'remove'},{label:'Tranfer',value:'transfer'}]}
                      required={true}
                    />
                    <div className="my-4"></div>
                   
                  </div>

                  {/* Modal Footer */}
                  <div className="p-3 flex justify-end space-x-2 border-t">
                    <button
                      onClick={()=>setShowDeleteModal(false) }
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
      </Dialog>
    </>
  );
}


