import { PlusIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import { deleteData, getData, updateData } from "../../app/api";
import { SECTIONS } from "../../app/url";
import { capitalizeWords, handleApiResponse } from "../../commonComponent/CommonFunctions";
import ConfirmationModal from "../../commonComponent/ConfirmationModal";
import TableComponent from "../../commonComponent/TableComponent";
import ClassModal from "./ClassModal";
import SectionModal from "./SectionModal";
import EditModal from "./EditModal";

function ClassAndSection() {
  const [filteredData, setFilteredData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);
  const [isSectionModal, setIsSectionModal] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const columns = [
    { title: "Class", key: "class" },
    { title: "Section", key: "section" },
    { title: "Actions", key: "actions" },
  ];

  useEffect(() => {
    fecthInitialData();
  }, []);

  const fecthInitialData = async () => {
    try {
      const res = await getData(SECTIONS)
      setRawData(res.data.data)
      let data = []
      res.data.data.forEach((item) => {
        data.push({
          _id: item._id,
          classId: item.class?._id,
          class: capitalizeWords(item.class?.name),
          section: capitalizeWords(item.section),
          actions: [
            { label: "Class Edit", actionHandler: ()=>{onClassEdit(item)} },
            { label: "Section Edit", actionHandler: ()=>{onSectionEdit(item)} },
            { label: "Delete", actionHandler: onDelete },
          ],
        })
      })
      setFilteredData(data);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const onDelete = (Id) => {
    setDeleteId(Id);
    setDeleteConfirm(true);
  };
  const onClassEdit = (section) => {
    if (section) {
      setSelectedObject({ _id: section.class?._id, class: section.class?.name, name: "class", url: "/class" });
      setShowEditModal(true)
    }
  };
  const onSectionEdit = (section) => {
    if (section) {
      setSelectedObject({ _id: section._id, section: section.section, name: "section", url: "/sections" });
      setShowEditModal(true)
    }
  };


  const deleteRecord = async () => {
    try {
      let res = await deleteData(SECTIONS + "/" + deleteId);
      handleApiResponse(res.data.message, "success");
      fecthInitialData();
      setDeleteConfirm(false);
      setDeleteId(null);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const handleOpen = () => setIsClassOpen(true);
  const handleCloseModal = (openSection = false) => {
    setIsClassOpen(false);
    if (openSection) handleOpenSection();
  };
  const handleOpenSection = () => setIsSectionModal(true);
  const handleCloseSectionModal = () => setIsSectionModal(false);

  const handleEditClose = () => setShowEditModal(false);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
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
            Add Class
          </button>

          <button
            type="button"
            onClick={handleOpenSection}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Setion
          </button>
        </div>
      </div>
      <div className="-mx-2 -my-2 mt-0 sm:-mx-6">
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            <div className="shadow ring-1 ring-black/5 sm:rounded-lg">
              <TableComponent
                checkColumn={false}
                columns={columns}
                data={paginatedData}
                pagination={{
                  currentPage,
                  totalCount: filteredData.length,
                  onPageChange: handlePageChange,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {isClassOpen && (
        <ClassModal onClose={handleCloseModal} updateData={fecthInitialData} />
      )}
      {isSectionModal && (
        <SectionModal
          onClose={handleCloseSectionModal}
          updateData={fecthInitialData}
        />
      )}

      {showEditModal && (
        <EditModal
          onClose={handleEditClose}
          refreshData={fecthInitialData}
          data={selectedObject} />)}

      <ConfirmationModal
        showModal={deleteConfirm}
        onYes={deleteRecord}
        onCancel={() => {
          setDeleteConfirm(false);
        }}
      />
    </>
  );
}

export default ClassAndSection;
