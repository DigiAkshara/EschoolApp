import { DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {  Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import CustomSelect from "../../commonComponent/CustomSelect";
import CustomInput from "../../commonComponent/CustomInput";
import CustomFileUploader from "../../commonComponent/CustomFileUploader";
import CustomRadio from "../../commonComponent/CustomRadio";
import MutliSelect from "../../commonComponent/MultiSelect";
import { eventFor } from "../../commonComponent/CommonFunctions";

function TemplateCreation({ onClose }) {
  const [formData, setFormData] = useState({
    templateType: "",
    templateTitle: "",
    discription: "",
  });

  const getValidationSchema = () => {
    return Yup.object({
        templateType: Yup.string().required(" Template Type is required"),
        templateTitle: Yup.string().required(" Template Title is required"),
        discription: Yup.string().required(" Discription is required"),      
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
                                Add Template
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
                                                                    
                                  <div className="sm:col-span-2">
                                    <CustomSelect
                                      name="type"
                                      label=" Select Template"
                                      required={true}
                                    />
                                  </div>
                                  
                                  <div className="sm:col-span-2">
                                    <CustomInput
                                      name="lastName"
                                      label="Last Name"
                                      placeholder="Enter last Name"
                                    />
                                  </div>
                                                                   
                                </div>
                                <div className="sm:col-span-4 mt-2">
                                  <label
                                    htmlFor="notes"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Event Description
                                  </label>
                                  <textarea
                                    id="reason"
                                    name="reason"
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 sm:text-sm"
                                    placeholder="Enter Reason."
                                  ></textarea>
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

export default TemplateCreation;
