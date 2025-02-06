import { DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import CustomInput from "../../../commonComponent/CustomInput";
import CustomFileUploader from "../../../commonComponent/CustomFileUploader";
import CustomDate from "../../../commonComponent/CustomDate";
import CustomSelect from "../../../commonComponent/CustomSelect";
import { staffType } from "../../../commonComponent/CommonFunctions";

function BankCreation({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    accountNo: "",
    confirmAccountNo: "",
    accountType: "",
    ifscCode: "",
    currentBalance: "",
      });

  const getValidationSchema = () => {
    return Yup.object({
        name: Yup.string().required(" Bank Name is required"),
        accountNo: Yup.string().required(" Account No. is required"),
        confirmAccountNo: Yup.string().required(" Confirm Account no. is required"),
        accountType: Yup.string().required(" Account Type is required"),
        ifscCode: Yup.string().required(" IFSC Code is required"),
        currentBalance: Yup.date().required("Current Balance is required"),
      
    });
  };

  const handleSubmit = async (values) => {
    // try {
    //   const response = await postData(FEES, values)
    //   getFees()
    //   handleApiResponse(response.data.message, 'success')
    //   onClose()
    // } catch (error) {
    //   handleApiResponse(error)
    // }
  };

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
                                Add Bank
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
                                  <CustomInput
                                      name="name"
                                      label="Bank Name "
                                      placeholder="Enter Bank Name"
                                      required={true}
                                    />
                                  </div>
                                  <div className="sm:col-span-1">
                                 
                                  </div>

                                  <div className="sm:col-span-1">
                                  <CustomInput
                                      name="accountNo"
                                      label="Account Number "
                                      placeholder="Enter Account Number "
                                      required={true}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                  <CustomInput
                                      name="confirmAccountNo"
                                      label="Confirm Account Number "
                                      placeholder="Confirm Account Number"
                                      required={true}
                                    />
                                  </div>
                                  <div className="sm:col-span-1">
                                  <CustomInput
                                      name="accountType"
                                      label="Account Type "
                                      placeholder="Enter Account Type"
                                      required={true}
                                    />
                                  </div>
                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      name="ifscCode"
                                      label="IFSC Code "
                                      placeholder="Enter IFSC code"
                                      required={true}
                                    />
                                  </div>
                                  <div className="sm:col-span-1">
                                  <CustomInput
                                      name="currentBalance"
                                      label="Current Balance "
                                      placeholder="Enter Current Balance"
                                      required={true}
                                    />
                                  </div>
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

export default BankCreation;
