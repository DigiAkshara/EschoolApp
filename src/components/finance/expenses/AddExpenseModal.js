import { DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Form, Formik } from 'formik'
import moment from 'moment'
import React from 'react'
import * as Yup from 'yup'
import CustomDate from '../../../commonComponent/CustomDate'
import CustomSelect from '../../../commonComponent/CustomSelect'
import CustomInput from '../../../commonComponent/CustomInput'
import CustomFileUploader from '../../../commonComponent/CustomFileUploader'
import { uploadFile } from '../../../commonComponent/CommonFunctions'

function AddExpenseModal({ onClose, getFees }) {

  const getInitialValues = () => {
    return {
      purchaseUser: '',
      purchaseDate: '',
      name: '',
      supplier: '',
      department: '',
      category: '',
      invoiceNumber: '',
      purchaseQty: '',
      amount: '',
      bankAccount: '',
      description: '',
      expenseDocs: null,
    }
  }

  const getValidationSchema = () => {
    return Yup.object({
      purchaseUser: Yup.string().required('Purchase User is required'),
      purchaseDate: Yup.date().nullable().required("Purchase Date  is required"),
      name: Yup.string().required('Name is required'),
      supplier: Yup.string(),
      department: Yup.string(),
      category: Yup.string(),
      invoiceNumber: Yup.string(),
      purchaseQty: Yup.string(),
      amount: Yup.string().required('Amount is required'),
      bankAccount: Yup.string(),
      description: Yup.string(),
      expenseDocs: Yup.mixed()
        .nullable()
        .test(
          "fileFormat",
          "Attachment must be in JPG, JPEG, or PNG format",
          (value) => {
            if (!value) return true; // If no file is uploaded, skip the test
            const supportedFormats = ["image/jpeg", "image/jpg", "image/png"];

            // Check MIME type first
            if (supportedFormats.includes(value.type)) {
              return true; // Valid MIME type
            }

            // If MIME type is incorrect, check the file extension as a fallback
            const fileExtension = value.name.split('.').pop().toLowerCase();
            const supportedExtensions = ["jpg", "jpeg", "png"];
            return supportedExtensions.includes(fileExtension); // Check file extension
          }
        )
        .test("fileSize", "Attachment size must not exceed 2MB", (value) => {
          if (!value) return true; // If no file is uploaded, skip the test
          const maxSizeInBytes = 2 * 1024 * 1024; // 2MB in bytes
          return value.size <= maxSizeInBytes; // Check if file size is within limit
        }),
    })
  }

  const handleSubmit = async (values) => {
    console.log(values)
    // try {
    //   const response = await postData(FEES, values)
    //   getFees()
    //   handleApiResponse(response.data.message, 'success')
    //   onClose()
    // } catch (error) {
    //   handleApiResponse(error)
    // }
  }

  const handleFileChange = async (e, setFieldValue) => {
    try {
      const fileResponse = await uploadFile(e.target.files[0])
      setFieldValue(e.target.name, fileResponse)
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        enableReinitialize
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
                                Add Expense
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
                              <div className="">
                                <div className="pb-4 mb-4">
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                    <div className="sm:col-span-1">
                                      <CustomSelect
                                        name="purchaseUser"
                                        label="Purchase User"
                                        required={true}
                                        options={[
                                          { value: 'student', label: 'Student' },
                                          { value: 'teacher', label: 'Teacher' },
                                          { value: 'staff', label: 'Staff' },]}
                                      />
                                    </div>

                                    <div className="sm:col-span-1">
                                      <CustomDate
                                        name="purchaseDate"
                                        label="Purchase Date"
                                        required={true}
                                        maxDate={moment().format('YYYY-MM-DD')}
                                      />
                                    </div>

                                    <div className="sm:col-span-1">
                                      <CustomInput
                                        name="name"
                                        label="Name"
                                        required={true}
                                        placeHolder="Enter Name"
                                      />
                                    </div>

                                    <div className="sm:col-span-1">
                                      <CustomInput
                                        name="supplier"
                                        label="Supplier"
                                        placeHolder="Enter Supplier"
                                      />
                                    </div>

                                    <div className="sm:col-span-1">
                                      <CustomSelect
                                        name="department"
                                        label="Department"
                                        options={[
                                          { value: 'IT', label: 'IT' },
                                          { value: 'HR', label: 'HR' },
                                          { value: 'Accounting', label: 'Accounting' },
                                          { value: 'Marketing', label: 'Marketing' },
                                          { value: 'Finance', label: 'Finance' },
                                          { value: 'Sales', label: 'Sales' },
                                        ]}
                                      />
                                    </div>

                                    <div className="sm:col-span-1">
                                      <CustomSelect
                                        name="category"
                                        label="Category"
                                        options={[
                                          { value: 'cat1', label: 'Cat 1' },
                                          { value: 'cat2', label: 'Cat 2' },
                                        ]}
                                      />
                                    </div>

                                    <div className="sm:col-span-1">
                                      <CustomInput
                                        name="invoiceNumber"
                                        label="Invoice Number"
                                        placeHolder="Enter Invoice Number"
                                      />
                                    </div>

                                    <div className="sm:col-span-1">
                                      <CustomInput
                                        name="purchaseQty"
                                        label="Pur.Qty"
                                        placeHolder="Enter Purchase Quantity"
                                      />
                                    </div>

                                    <div className="sm:col-span-1">
                                      <CustomInput
                                        name="amount"
                                        label="Amount"
                                        required={true}
                                        placeHolder="Enter Amount"
                                      />
                                    </div>

                                    <div className="sm:col-span-1">
                                      <CustomSelect
                                        name="bankAccount"
                                        label="Bank Account"
                                        placeHolder="Enter Bank Account"
                                        options={[
                                          { value: 'account1', label: 'Account 1' },
                                          { value: 'account2', label: 'Account 2' },
                                        ]}
                                      />
                                    </div>
                                    <div className="col-span-full">
                                      <CustomInput
                                        label="Description"
                                        name="description"
                                        placeHolder="Enter Description"
                                      />
                                    </div>
                                    <div className="col-span-full">
                                      <CustomFileUploader
                                        label="Attachments"
                                        name="expenseDocs"
                                        onChange={(e) => handleFileChange(e, setFieldValue)}
                                      />
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end bg-gray-100 px-4 py-4">
                          <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </DialogPanel>
                  </div>
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default AddExpenseModal
