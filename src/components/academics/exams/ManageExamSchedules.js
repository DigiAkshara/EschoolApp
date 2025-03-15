"use client";
import { Dialog } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteData } from "../../../app/api";
import { fetchExamData, selectExam } from "../../../app/reducers/examSlice";
import { EXAM } from "../../../app/url";
import { handleApiResponse, handleDownloadPDF } from "../../../commonComponent/CommonFunctions";
import ConfirmationModal from "../../../commonComponent/ConfirmationModal";
import FilterComponent from "../../../commonComponent/FilterComponent";
import TableComponent from "../../../commonComponent/TableComponent";
import CreateExam from "./CreateExam";
import ExamDetailsPage from "./ExamDetailsPage";

function ManageExamSchedules() {
  const { classes: classOptions, sections: sectionOptions } = useSelector(
    (state) => state.academics
  );
  const exams = useSelector((state) => state.exams.exams);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showExamDetailsModal, setShowExamDetailsModal] = useState(false);
  const [examData, setExamData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [deleteId, setDeleteId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const { branchData } = useSelector((state) => state.appConfig)

  const columns = [
    { key: "examName", title: "Exam Name" },
    { key: "className", title: "Class" },
    { key: "sectionName", title: "Section" },
    { key: "examDates", title: "Exam Dates" },
    { key: "totalSubjects", title: "Subjects Included" },
    { key: "timeTableSyllabus", title: "Time Table/ Hall tickets" },
    { key: "actions", title: "Actions" },
  ];

  const filterForm = {
    examName: "",
    class: "",
    section: "",
  };

  const filters = {
    examName: { options: [] },
    class: {
      options: classOptions,
    },
    section: {
      options: sectionOptions,
      dependency: true,
      dependencyKey: "class",
      filterOptions: true,
    },
  };
  useEffect(() => {
    formatExamData();
  }, [exams]);

  const formatExamData = async () => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const data = []
    exams.forEach((item, index) => {
      // Formatting the timeTable data
      const timeTableFormatted = item.timeTable.map((t) => ({
        subject: t.subject,
        examDate: formatter.format(new Date(t.examDate)),
        startTime: t.startTime,
        endTime: t.endTime,
        passMark: t.passMark,
        totalMark: t.totalMark,
        syllabus: t.syllabus,
      }));
      let actions = [{ label: "Delete", actionHandler: onDelete },]
      if (item.examStatus !== 'completed') {
        actions.push({ label: "Edit", actionHandler: onHandleEdit })
      }
      data.push({
        ...item,
        id: index + 1,
        examName: item.name,
        board: item.board?._id,
        boardName: item.board?.name,
        boardObject: item.board,
        class: item.class?._id,
        className: item.class?.name,
        classObject: item.class,
        section: item.section?._id,
        sectionName: item.section?.section,
        sectionObject: item.section,
        examDates: `${formatter.format(
          new Date(item.startDate)
        )} - ${formatter.format(new Date(item.endDate))}`,
        timeTable: timeTableFormatted, // Add the formatted timeTable data
        totalSubjects: item.timeTable.length,
        timeTableSyllabus: "View",
        actions: actions,
      })
    });
    setExamData(data);
    setFilteredData(data);
  };

  const onHandleEdit = (Id) => {
    const data = exams.filter((item) => (item._id === Id));
    dispatch(selectExam({ ...data[0], actions: undefined }));
    setShowAddExamModal(true);
  };

  const onDelete = (Id) => {
    setDeleteId(Id)
    setDeleteConfirm(true)
  }

  const deleteRecord = async () => {
    try {
      let res = await deleteData(EXAM + '/' + deleteId)
      dispatch(fetchExamData())
      handleApiResponse(res.data.message, 'success')
      setDeleteConfirm(false)
      setDeleteId(null)
    } catch (error) {
      handleApiResponse(error)
    }
  }


  const handleViewDetails = (exam) => {
    dispatch(selectExam({ ...exam, actions: null }));
    setShowExamDetailsModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (term) => {
    const filtered = examData.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleFilter = (values) => {
    let filtered = examData;
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((rec) =>
          rec[key].toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    setFilteredData(filtered);
  };

  const handleReset = (updatedValues) => {
    setFilteredData(examData);
    updatedValues("examName", "");
    updatedValues("class", "");
    updatedValues("section", "");
  };

  const handleModalClose = () => {
    setShowExamDetailsModal(false)
    setShowAddExamModal(false);
    dispatch(selectExam(null));
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const downloadList = () => {
    handleDownloadPDF(filteredData, "Exam_Details", [
      { key: "examName", label: "Exam Name" },
      { key: "className", label: "Class" },
      { key: "sectionName", label: "Section" },
      { key: "examDates", label: "Exam Dates" },
      { key: "totalSubjects", label: "Subjects Included" },
    ], "Exam Details Report", branchData, undefined, "portrait");
  };


  return (
    <>
      <div className="right-btns-blk space-x-4 float-right">
        <button
          type="button"
          onClick={() => setShowAddExamModal(true)}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
          Add New Exam
        </button>
      </div>
      <div className="-mx-2 -my-2 mt-0 sm:-mx-6">
        {/* /Removed overflow-x-auto cloass */}
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            {selectedPeople.length > 0 && (
              <div className="absolute left-20 top-0 flex h-12 items-center space-x-3 bg-white sm:left-72">
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  Delete
                </button>
              </div>
            )}
            <div className="relative shadow ring-1 ring-black/5 sm:rounded-lg">

              <FilterComponent
                onSearch={handleSearch}
                filters={filters}
                filterForm={filterForm}
                handleFilter={handleFilter}
                handleReset={handleReset}
                downloadList={downloadList}
              />
              <TableComponent
                columns={columns}
                data={paginatedData}
                pagination={{
                  currentPage,
                  totalCount: filteredData.length,
                  onPageChange: handlePageChange,
                }}
                modalColumn={["timeTableSyllabus"]}
                showModal={(data) => handleViewDetails(data)}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        showModal={deleteConfirm}
        onYes={deleteRecord}
        onCancel={() => { setDeleteConfirm(false) }}
      />
      <Dialog
        open={showExamDetailsModal}
        onClose={handleModalClose}
        className="relative z-50"
      >
        <ExamDetailsPage onClose={handleModalClose} />
      </Dialog>

      <Dialog open={showAddExamModal} onClose={handleModalClose} className="relative z-50">
        <CreateExam onClose={handleModalClose} />
      </Dialog>
    </>
  );
}

export default ManageExamSchedules;
