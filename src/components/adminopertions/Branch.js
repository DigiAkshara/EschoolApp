import React, { useEffect, useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import TableComponent from "../../commonComponent/TableComponent";
import DesignationModal from "./DesignationModal";
import { deleteData, getData } from "../../app/api";
import { BRANCH, DESIGNATION } from "../../app/url";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";
import { useDispatch } from "react-redux";
import { setSelectedDesignation } from "../../app/reducers/designationSlice";
import ConfirmationModal from "../../commonComponent/ConfirmationModal";
import BranchCreation from "./BranchCreation";
import { Dialog } from '@headlessui/react'


function Branch() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branch, setBranches] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const rowsPerPage = 10;
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  const dispatch = useDispatch();

  const columns = [
    { title: "Si. No", key: "siNo" },
    { title: "Branch Name", key: "name" },
    { title: "City", key: "city" },
    { title: "State", key: "state" },
    { title: "Pincode", key: "pincode" },
  ];

  useEffect(() => {
    getBranches();
  }, []);

  const getBranches = async () => {
    try {
      const response = await getData(BRANCH);
      const branchResponse = response.data.data;
      console.log("BRANCH DATA:", branchResponse);
      
      const branchData = branchResponse.map((item, index) => {
        return {
          _id: item._id,
          siNo: index + 1,
          name: item.name,
          city : item.address.city,
          state : item.address.state,
          pincode : item.address.pincode,
          actions: [
            { label: "Edit", actionHandler: onHandleEdit },
            { label: "Delete", actionHandler: onDelete },
          ],
        };
      });

      setBranches(branchData);
      setFilteredData(branchData);
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
       let res = await deleteData(BRANCH + '/' + deleteId)
       handleApiResponse(res.data.message, 'success')
       getBranches()
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
            Add Branch
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

      <Dialog open={isModalOpen} onClose={handleCloseModal} className="relative z-50">
        <div className="fixed inset-0" />
        <BranchCreation onClose={handleCloseModal} getBranches={getBranches}  />
      </Dialog>

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

export default Branch;
