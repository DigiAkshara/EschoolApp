import { DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import CustomInput from "../../../commonComponent/CustomInput";
import CustomFileUploader from "../../../commonComponent/CustomFileUploader";
import CustomDate from "../../../commonComponent/CustomDate";
import CustomSelect from "../../../commonComponent/CustomSelect";
import { handleApiResponse, staffType } from "../../../commonComponent/CommonFunctions";
import { BANK_ACCOUNTS } from "../../../app/url";
import { postData } from "../../../app/api";

function BankCreation({ onClose }) {
  const formData = {
    name: "",
    accountNumber: "",
    confirmAccountNumber: "",
    accountType: "",
    ifscCode: "",
    currentBalance: "",
  };

  const getValidationSchema = () => {
    return Yup.object({
      name: Yup.string().required("Bank Name is required"),
      accountNumber: Yup.string()
        .matches(/^\d{4}$/, "Account number must be 4 digits")
        .required("Account Number Last 4 digits is Required"),
      confirmAccountNumber: Yup.string()
        .matches(/^\d{4}$/, "ConfirmAccount number must be digits")
        .required("Confirm The Account Number Last 4 digits here")
        .test(
          "match-last-4",
          "Account Number do not match",
          function (value) {
            const { accountNumber } = this.parent;
            return (
              value &&
              accountNumber &&
              value === accountNumber
            );
          }
        ),
      accountType: Yup.string(),
      ifscCode: Yup.string(),
      currentBalance: Yup.number()
    });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await postData(BANK_ACCOUNTS, values)
      handleApiResponse(response.data.message, 'success')
      onClose()
    } catch (error) {
      handleApiResponse(error)
    }
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
                                      name="accountNumber"
                                      label="Account Number "
                                      placeholder="Enter Account Number "
                                      required={true}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      name="confirmAccountNumber"
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
                                    />
                                  </div>
                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      name="ifscCode"
                                      label="IFSC Code "
                                      placeholder="Enter IFSC code"
                                    />
                                  </div>
                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      name="currentBalance"
                                      label="Current Balance "
                                      placeholder="Enter Current Balance"
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
