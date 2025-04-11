import { DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { getData, postData } from "../../../app/api";
import { FEE_CATEGORY, LOANS, STAFF, TRANSACTIONS } from "../../../app/url";
import {
  financeType,
  handleApiResponse,
  paymentType,
  uploadFile
} from "../../../commonComponent/CommonFunctions";
import CustomDate from "../../../commonComponent/CustomDate";
import CustomFileUploader from "../../../commonComponent/CustomFileUploader";
import CustomInput from "../../../commonComponent/CustomInput";
import CustomSelect from "../../../commonComponent/CustomSelect";
import CustomTextArea from "../../../commonComponent/CustomTextArea";
import moment from "moment";

function SpecialCredits({ onClose, refreshData }) {
  const { bankAccounts } = useSelector((state) => state.fees);
  const [bankAccountsOptions, setBankAccountsOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [staffLoans, setStaffLoans] = useState([]);
  const formData = {
    transactionType: "",
    transactionMode: "",
    category: "",
    subCategory: "",
    staff: '',
    account: "",
    amount: "",
    date: "",
    reason: "",
    proof: null,
    transactionId: "",
    loanId: '',
    title: ''
  };

  const getValidationSchema = () => {
    return Yup.object({
      transactionType: Yup.string().required("Transaction Type is required"),
      transactionMode: Yup.string().required("Transaction Mode is required"),
      category: Yup.string().required("Category is required"),
      subCategory: Yup.string().test(
        "is-category-is-other",
        "Sub Category is required",
        function (value) {
          const { category } = this.parent; // Access sibling field 'paymentMode'
          if (categoryOptions.find((item) => item.value === category)?.label.includes("Other") && !value) {
            return false; // Fail validation if category is not 'other' but value is invalid
          }
          return true; // Pass validation otherwise
        }
      ),
      title: Yup.string().test(
        "is-debit-and-loan",
        "Title is required",
        function (value) {
          const { category, transactionType } = this.parent; // Access sibling field
          if (transactionType === "debit" && categoryOptions.find((item) => item.value === category)?.label.includes("Loan") && !value) {
            return false;
          }
          return true; // Pass validation otherwise
        }
      ),
      staff: Yup.string().test(
        "is-category-is-loan",
        "Staff is required",
        function (value) {
          const { category } = this.parent; // Access sibling field 'paymentMode'
          if (categoryOptions.find((item) => item.value === category)?.label.includes("Loan") && !value) {
            return false; // Fail validation if category is not 'other' but value is invalid
          }
          return true; // Pass validation otherwise
        }
      ),
      loanId: Yup.string().test(
        "is-credit-and-loan",
        "Loan is required",
        function (value) {
          const { transactionType, category } = this.parent; // Access sibling field 'paymentMode'
          if (transactionType === 'credit' && categoryOptions.find((item) => item.value === category)?.label.includes("Loan") && !value) {
            return false; // Fail validation if transactionMode is not 'cash' but value is invalid
          }
          return true; // Pass validation otherwise
        }
      ),
      account: Yup.string().test(
        "is-transactionmode-is-online",
        "Bank Account is required",
        function (value) {
          const { transactionMode } = this.parent; // Access sibling field 'paymentMode'
          if (transactionMode === 'online' && !value) {
            return false; // Fail validation if transactionMode is not 'cash' but value is invalid
          }
          return true; // Pass validation otherwise
        }
      ),
      transactionId: Yup.string().test(
        "is-transactionmode-is-online",
        "Transaction ID is required",
        function (value) {
          const { transactionMode } = this.parent; // Access sibling field 'paymentMode'
          if (transactionMode === 'online' && !value) {
            return false; // Fail validation if transactionMode is not 'cash' but value is invalid
          }
          return true; // Pass validation otherwise
        }
      ),
      amount: Yup.string().required("Amount is required"),
      date: Yup.date().required("Date is required"),
      reason: Yup.string(),
      proof: Yup.mixed()
        .nullable()
        .test(
          "fileFormat",
          "Photo must be in JPG, JPEG, or PNG format",
          (value) => {
            if (!value || !(value instanceof File)) return true; // Allow empty/null value
            const supportedFormats = ["image/jpeg", "image/jpg", "image/png"];
            return supportedFormats.includes(value.type);
          }
        )
        .test("fileSize", "Photo size must not exceed 2MB", (value) => {
          if (!value || !(value instanceof File)) return true; // Allow empty/null value
          const maxSizeInBytes = 2 * 1024 * 1024;
          return value.size <= maxSizeInBytes;
        }),
    });
  };

  const handleFileChange = async (e, setFieldValue) => {
    try {
      const fileResponse = await uploadFile(e.target.files[0])
      setFieldValue(e.target.name, fileResponse)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const handleSubmit = async (values) => {
    try {
      const res = await postData(TRANSACTIONS, values)
      handleApiResponse(res.data.message, 'success')
      refreshData()
      onClose()
    } catch (error) {
      handleApiResponse(error)
    }
  };

  useEffect(() => {
    let accountOptions = bankAccounts.map((account) => {
      return ({
        value: account._id,
        label: `${account.name} - ${account.accountNumber}`
      })
    })
    setBankAccountsOptions(accountOptions)
  }, [bankAccounts])

  const getCategories = async () => {
    try {
      let res = await getData(FEE_CATEGORY)
      let categoryOptions = res.data.data.map((item) => {
        return ({
          value: item._id,
          label: item.name,
          transactionType: item.transactionType
        })
      })
      setCategoryOptions(categoryOptions)
    } catch (e) {
      handleApiResponse(e)
    }
  }

  const getStaffData = async () => {
    try {
      let res = await getData(STAFF)
      let list = res.data.data.map((item) => ({
        value: item._id,
        label: `${item.firstName} ${item.lastName}`,
      }))
      setStaffOptions(list)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const getStaffLoans = async (e, setFieldValue) => {
    setStaffLoans([])
    setFieldValue('loanId', '')
    setFieldValue(e.target.name, e.target.value)
    try {
      let res = await getData(LOANS + '/' + e.target.value)
      let list = res.data.data.map((item) => ({
        value: item._id,
        label: item.title,
      }))
      if(list.length === 1) {
        setFieldValue('loanId', list[0].value)
      }
      setStaffLoans(list)
    } catch (error) {
      handleApiResponse(error)
    }
  }
  useEffect(() => {
    getCategories()
    getStaffData()
  }, [])

  return (
    <>
      <Formik
        initialValues={formData}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Form>
              <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <DialogPanel
                      transition
                      className="pointer-events-auto w-screen max-w-3xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                    >
                      <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                        <div className="flex min-h-0 flex-1 flex-col">
                          <div className="bg-purple-900 px-3 py-3 sm:px-6">
                            <div className="flex items-start justify-between">
                              <DialogTitle className=" text-base font-semibold text-white">
                                Add Special Credits / Debits
                              </DialogTitle>
                              <div className="ml-3 flex h-7 items-center">
                                <button
                                  type="button"
                                  onClick={onClose}
                                  className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                  <span className="absolute -inset-2.5" />
                                  <span className="sr-only">Close panel</span>
                                  <XMarkIcon
                                    aria-hidden="true"
                                    className="size-6"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="relative flex-1 px-6 py-6 sm:px-6 overflow-y-auto">
                            <div className="form-content">
                              <div className="pb-4 mb-4">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                  <div className="sm:col-span-1">
                                    <CustomSelect
                                      name="transactionType"
                                      label=" Credit or Debit"
                                      options={financeType}
                                      required={true}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "transactionType",
                                          e.target.value
                                        )
                                        setFieldValue("category", "");
                                        setFieldValue("staff", "")
                                        setFieldValue("subCategory", "")
                                      }}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomSelect
                                      name="transactionMode"
                                      label="Transaction Mode"
                                      options={paymentType}
                                      required={true}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "transactionMode",
                                          e.target.value
                                        )
                                        setFieldValue("account", "");
                                      }}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomSelect
                                      name="category"
                                      label="Category"
                                      options={categoryOptions.filter((item) => item.transactionType === values.transactionType)}
                                      required={true}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "category",
                                          e.target.value
                                        )
                                        setFieldValue("staff", "")
                                        setFieldValue("subCategory", "")
                                      }}
                                    />
                                  </div>

                                  {values.transactionType === "debit" && categoryOptions.find(item => item.value === values.category)?.label.includes("Loan") && (
                                    <div className="sm:col-span-1">
                                      <CustomInput
                                        name="title"
                                        label="Loan Title"
                                        placeholder="Enter Loan Title"
                                        required={true}
                                      />
                                    </div>
                                  )}

                                  {values.transactionMode === "online" && (
                                    <div className="sm:col-span-1">
                                      <CustomSelect
                                        name="account"
                                        label="Bank Name"
                                        options={bankAccountsOptions}
                                        required={true}
                                      />
                                    </div>
                                  )}

                                  { categoryOptions.find(item => item.value === values.category)?.label.includes("Loan") && (
                                    <div className="sm:col-span-1">
                                      <CustomSelect
                                        name="staff"
                                        label="Staff"
                                        options={staffOptions}
                                        required={true}
                                        onChange={(e) => {
                                          getStaffLoans(e, setFieldValue)
                                        }}
                                      />
                                    </div>
                                  )}

                                  {(values.transactionType === "credit" && categoryOptions.find(item => item.value === values.category)?.label.includes("Loan") )&& (
                                    <div className="sm:col-span-1">
                                      <CustomSelect
                                        name="loanId"
                                        label="Loan"
                                        options={staffLoans}
                                        required={true}
                                      />
                                    </div>
                                  )}

                                  {categoryOptions.find(item => item.value === values.category)?.label.includes("Other") && (
                                    <div className="sm:col-span-1">
                                      <CustomInput
                                        name="subCategory"
                                        label="Sub Category"
                                        placeholder="Enter Sub-Category"
                                        required={true}
                                      />
                                    </div>
                                  )}

                                  <div className="sm:col-span-1">
                                    <CustomDate
                                      name="date"
                                      label="Date of Transaction"
                                      required={true}
                                      max={moment().format("YYYY-MM-DD")}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      name="amount"
                                      label="Amount "
                                      placeholder="Enter Fee Title"
                                      required={true}
                                    />
                                  </div>

                                  {values.transactionMode === "online" && (
                                    <div className="sm:col-span-1">
                                      <CustomInput
                                        name="transactionId"
                                        label="Transaction ID"
                                        required={true}
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="sm:col-span-4 mt-2">
                                  <CustomTextArea
                                    label="Reason"
                                    name="reason"
                                    placeholder="Enter Reason."
                                    onChange={(e) => setFieldValue('reason', e.target.value)}
                                  />
                                </div>
                                <div className="sm:col-span-4 mt-2">
                                  <CustomFileUploader
                                    label="Upload Proof "
                                    name="proof"
                                    onChange={(e) => handleFileChange(e, setFieldValue)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex shrink-0 justify-between px-4 py-4">
                          <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                          >
                            Cancel
                          </button>

                          <div>
                            <button
                              type="submit"
                              className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </DialogPanel>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

export default SpecialCredits;
