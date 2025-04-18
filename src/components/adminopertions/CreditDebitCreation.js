import { PlusIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteData, getData } from "../../app/api";
import { setSelectedDesignation } from "../../app/reducers/designationSlice";
import { DESIGNATION } from "../../app/url";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";
import ConfirmationModal from "../../commonComponent/ConfirmationModal";
import TableComponent from "../../commonComponent/TableComponent";
import CategoryCreation from "./CategoryCreation";
import SubCategoryCreation from "./SubCategoryCreation";

function CreditDebitCreation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [designation, setDesignation] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const rowsPerPage = 10;
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [isSectionModal, setIsSectionModal] = useState(false);


  const dispatch = useDispatch();

  const transactions = [
    {
      siNo: 1,
      transactionType: "Debit",
      category: "Groceries",
      subCategory: "Vegetables"
    },
    {
      siNo: 2,
      transactionType: "Credit",
      category: "Salary",
      subCategory: "Monthly Pay"
    },
    {
      siNo: 3,
      transactionType: "Debit",
      category: "Entertainment",
      subCategory: "Movies"
    }
  ];
  const [filteredData, setFilteredData] = useState(
    transactions.map(item => ({
      ...item,
      actions: [
        { label: "Edit", actionHandler: () => onHandleEdit(item.siNo) },
        { label: "Delete", actionHandler: () => onDelete(item.siNo) },
      ]
    }))
  );



  const columns = [
    { title: "Si. No", key: "siNo" },
    { title: "Transaction Type", key: "transactionType" },
    { title: "Category", key: "category" },
    { title: "Subcategory", key: "subCategory" },
    { title: "Actions", key: "actions" },

  ];

  useEffect(() => {
  }, []);



  const onHandleEdit = async (Id) => {
    try {
      const designationDetails = await getData(DESIGNATION + "/" + Id);
      dispatch(setSelectedDesignation({ ...designationDetails.data.data }));
      setShowAddStaffModal(true);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const onDelete = (Id) => {
    setDeleteId(Id);
    setDeleteConfirm(true);
  };

  const deleteRecord = async () => {
    try {
      let res = await deleteData(DESIGNATION + '/' + deleteId)
      handleApiResponse(res.data.message, 'success')
      setDeleteConfirm(false)
      setDeleteId(null)
    } catch (error) {
      handleApiResponse(error)
    }
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpen = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenSection = () => setIsSectionModal(true);
  const handleCloseSectionModal = () => setIsSectionModal(false);

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
            Add Category
          </button>

          <button
            type="button"
            onClick={handleOpenSection}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Subcategory
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

      {/* Modal */}
      {isModalOpen && <CategoryCreation onClose={handleCloseModal} />}
      {isSectionModal && (
        <SubCategoryCreation

          onClose={handleCloseSectionModal}
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

export default CreditDebitCreation;
