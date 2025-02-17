import React, { useEffect, useState } from "react";
import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/20/solid";
import TableComponent from "../../commonComponent/TableComponent";
import ClassModal from "./ClassModal";
import SectionModal from "./SectionModal";
import { deleteData, getData } from "../../app/api";
import { CLASSES, SECTIONS } from "../../app/url";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";
import ConfirmationModal from "../../commonComponent/ConfirmationModal";
import ClassCategoryCreation from "./ClassCategoryCreation";

function ClassAndSection() {
  const [classData, setClassData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSectionModal, setIsSectionModal] = useState(false);
  const [isCategoryModal , setCategoryModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const columns = [
    { title: "Si. No", key: "siNo" },
    { title: "Class and Section", key: "classSection" },
    { title: "Actions", key: "actions" },
  ];

  useEffect(() => {
    getClasses();
  }, []);

  // const getClasses = async () => {
  //   try {
  //     const response = await getData(CLASSES);
  //     console.log("[CLASSES]:", response.data.data);
  //     const classResponse = response.data.data;
  //     const classData = classResponse.map((item, index) => {
  //       return {
  //         _id: item._id,
  //         siNo: index + 1,
  //         name: item.name,
  //         actions: [
  //           { label: "Edit", actionHandler: onHandleEdit },
  //           { label: "Delete", actionHandler: onDelete },
  //         ],
  //       };
  //     });
  //     console.log("Designation Data44444:", classData);
  //     setClassData(classData);
  //     setFilteredData(classData);
  //   } catch (error) {
  //     handleApiResponse(error);
  //   }
  // };

  const getClasses = async () => {
    try {
      const [sectionsResponse, classesResponse] = await Promise.all([
        getData(SECTIONS),
        getData(CLASSES), // Fetch all class details
      ]);

      console.log("[SECTIONS]:", sectionsResponse.data.data);
      console.log("[CLASSES]:", classesResponse.data.data);

      // Create a lookup map for class IDs to class names
      const classesMap = {};
      classesResponse.data.data.forEach((cls) => {
        if (cls._id && cls.name) {
          classesMap[cls._id] = cls.name;
        }
      });

      const classData = sectionsResponse.data.data.map((item, index) => {
        const className = classesMap[item.class]?.toString() || "Unknown Class";
        const sectionName = item.section || "Unknown Section";

        return {
          _id: item._id,
          siNo: index + 1,
          classSection: `${className} - ${sectionName}`, // Combine class and section
          actions: [
            // { label: "Edit", actionHandler: () => onHandleEdit(item._id) },
            { label: "Delete", actionHandler: () => onDelete(item._id) },
          ],
        };
      });

      console.log("Processed Class Data:", classData);
      setClassData(classData);
      setFilteredData(classData);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const onHandleEdit = async (Id) => {
    console.log("edited", Id);
  };

  const onDelete = (Id) => {
    setDeleteId(Id);
    setDeleteConfirm(true);
  };

  const deleteRecord = async () => {
    try {
      let res = await deleteData(SECTIONS + "/" + deleteId);
      handleApiResponse(res.data.message, "success");
      getClasses();
      setDeleteConfirm(false);
      setDeleteId(null);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const handleOpen = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenSection = () => setIsSectionModal(true);
  const handleCloseSectionModal = () => setIsSectionModal(false);
  const handleOpenCategory = () => setCategoryModal(true)
  const handleCloseCategory = () => setCategoryModal(false)


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
            onClick={handleOpenCategory}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Class Category
          </button>
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
      {isCategoryModal && (
        <ClassCategoryCreation onClose={handleCloseCategory} getClasses={getClasses}  />
      )}
      {isModalOpen && (
        <ClassModal onClose={handleCloseModal} getClasses={getClasses} />
      )}
      {isSectionModal && (
        <SectionModal
          onClose={handleCloseSectionModal}
          getClasses={getClasses}
        />
      )}

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
