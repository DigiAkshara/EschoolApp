import { Dialog } from '@headlessui/react';
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import * as Yup from "yup";
import { deleteData, getData, postData } from "../../app/api";
import { RECEIPT_NAMES } from "../../app/url";
import { capitalizeWords, handleApiResponse } from "../../commonComponent/CommonFunctions";
import ConfirmationModal from "../../commonComponent/ConfirmationModal";
import CustomInput from "../../commonComponent/CustomInput";
import CustomSelect from '../../commonComponent/CustomSelect';
import TableComponent from "../../commonComponent/TableComponent";

function ReceiptNames() {
  const [showRecieptNameModal, setShowRecieptNameModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const rowsPerPage = 10;

  const columns = [
    { title: "Receipt Name", key: "receiptName" },
    { title: "Branch Name", key: "branchName" },
    { title: "Actions", key: "actions" },
  ];

  useEffect(() => {
    getReceiptNames();
  }, []);

  const getReceiptNames = async () => {
    try {
      const res = await getData(RECEIPT_NAMES);
      const data = res.data.data.map((item, index) => {
        return {
          _id: item._id,
          receiptName: capitalizeWords(item.name), //item.name,
          branchName: capitalizeWords(item.branch.name),
          actions: [
            { label: "Delete", actionHandler: onDelete },
          ],
        };
      });
      setFilteredData(data);
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
      let res = await deleteData(RECEIPT_NAMES + '/' + deleteId)
      handleApiResponse(res.data.message, 'success')
      setDeleteConfirm(false)
      setDeleteId(null)
      getReceiptNames()
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

  const handleOpen = () => setShowRecieptNameModal(true);
  const handleCloseModal = () => setShowRecieptNameModal(false);

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
            Add Receipt Names
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

      <Dialog open={showRecieptNameModal} onClose={handleCloseModal} className="relative z-50">
        <div className="fixed inset-0" />
        <NewReceiptNameModal onClose={handleCloseModal} updateData={getReceiptNames} />
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


const NewReceiptNameModal = ({ onClose, updateData }) => {
  const branchs = useSelector((state) => state.appConfig.allTenants);
  const [branchOptions, setBranchOptions] = useState([])
  const [tenantOptions, setTenantOptions] = useState([])
  const formData = { name: "", tenantId: null, branchId: null }

  useEffect(() => {
    if (branchs.length > 0) {
      let branchRes = []
      let tenantRes = []
      branchs.forEach((item) => {
        branchRes.push({
          value: item._id,
          label: item.name,
          tenant: item.tenant._id
        })
        if (item.isDefault) tenantRes.push({
          value: item.tenant._id,
          label: item.name,
        })
      })
      setBranchOptions(branchRes)
      setTenantOptions(tenantRes)
    }
  }, [branchs]);

  const getValidationSchema = () => {
    return Yup.object({
      name: Yup.string().required("Receipt Name is required"),
      branchId: Yup.string().required("Branch is required"),
      tenantId: Yup.string().required("Tenant is required"),
    });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await postData(RECEIPT_NAMES, values);
      onClose();
      updateData();
      handleApiResponse(response.data.message, "success");
    } catch (error) {
      handleApiResponse(error);
    }
  };

  return (
    <>
      <Formik
        initialValues={formData}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors }) => (
          <Form>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white w-96 rounded-lg shadow-lg">
                {/* Modal Header */}
                <div className="flex justify-between items-center bg-purple-600 text-white p-3 rounded-t-lg">
                  <h2 className="text-lg font-semibold">Add Receipt Name</h2>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <CustomSelect
                    name="tenantId"
                    label="Tenant"
                    placeholder="Select Tenant"
                    options={tenantOptions}
                    required={true}
                  />
                  <CustomSelect
                    name="branchId"
                    label="Branch"
                    placeholder="Select Branch"
                    options={branchOptions.filter((item) => item.tenant === values.tenantId)}
                    required={true}
                    disabled={values.tenantId ? false : true}
                  />
                  <CustomInput
                    name="name"
                    label="Receipt Name"
                    placeholder="Enter Receipt Name"
                    required={true}
                  />
                </div>

                {/* Modal Footer */}
                <div className="p-3 flex justify-end space-x-2 border-t">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ReceiptNames;
