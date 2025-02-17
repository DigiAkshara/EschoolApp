import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Form, Formik, Field  } from "formik";
import * as Yup from "yup";
import CustomInput from "../../commonComponent/CustomInput";
import CustomSelect from "../../commonComponent/CustomSelect";
import {
  handleApiResponse,
  staffType,
  uploadFile,
} from "../../commonComponent/CommonFunctions";
import { postData } from "../../app/api";
import { BRANCH, DESIGNATION } from "../../app/url";
import { useNavigate } from "react-router-dom";
import CustomFileUploader from "../../commonComponent/CustomFileUploader";
import { DialogPanel, DialogTitle } from "@headlessui/react";


function BranchCreation({ onClose, getBranches }) {
  const [formData, setFormData] = useState({
    name: "",
    address: {
      area: "",
      city: "",
      state: "",
      pincode: "",
    },
    maxCount: "",
    logo: null,
    whatsappCount: "",
    smsCount: "",
    studentPortalEnabled: false,  // Added field
    staffPortalEnabled: false,   // Added field
  });

  const getValidationSchema = () => {
    return Yup.object({
      name: Yup.string().required(" Branch name is required"),
      address: Yup.object({
        area: Yup.string()
          .matches(
            /^[a-zA-Z\s#\/-]*$/,
            "Area can only contain letters, spaces, and the special characters #, /, -"
          )
          .min(3, "Area must be at least 3 characters")
          .max(100, "Area must be at most 100 characters")
          .required("Area is required"),
        city: Yup.string()
          .matches(/^[a-zA-Z\s]*$/, "City can only contain letters and spaces")
          .max(15, "City must be at most 15 characters")
          .min(3, "City must be at least 3 characters")
          .required("City is required"),
        state: Yup.string().required("state is required"),
        pincode: Yup.string()
          .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
          .required("Pincode is required"),
      }),
      studentCount: Yup.number().required(" Maximum Student Count is required"),
      whatsappCount: Yup.number().required(" WhatsApp Count is required"),
      smsCount: Yup.number().required("SMS Count is required"),
      studentPortalEnabled: Yup.boolean(),
      staffPortalEnabled: Yup.boolean(),
      logo: Yup.mixed()
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

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const response = await postData(BRANCH, values);
      console.log("[RESPONSE]:", response);
      if (response.status === 200 || response.status === 201) {
        onClose();
        getBranches();
        handleApiResponse(response.data.message, "success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = async (e, setFieldValue) => {
    try {
      const fileResponse = await uploadFile(e.target.files[0]);
      setFieldValue(e.target.name, fileResponse);
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
                                Add Branch
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
                                      label="Branch Name"
                                      placeholder="Enter Branch"
                                      required={true}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      name="address.area"
                                      label="Area"
                                      placeholder="Enter Area"
                                      required={true}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      name="address.city"
                                      label="City"
                                      placeholder="Enter City"
                                      required={true}
                                    />
                                  </div>
                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      name="address.state"
                                      label="State"
                                      placeholder="Enter State"
                                      required={true}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      name="address.pincode"
                                      label="Pincode"
                                      placeholder="Enter pincode"
                                      required={true}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      name="studentCount"
                                      label="Student Max Count"
                                      placeholder="Enter Max Count"
                                      required={true}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      name="whatsappCount"
                                      label="WhatsApp Count"
                                      placeholder="Enter WhatsApp Count"
                                      required={true}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      name="smsCount"
                                      label="SMS Count"
                                      placeholder="Enter SMS Count"
                                      required={true}
                                    />
                                  </div>
                                </div>

                                   {/* Checkbox Fields */}
                            <div className="grid grid-cols-2 gap-x-4 mt-4">
                              <label className="flex items-center space-x-2">
                                <Field type="checkbox" name="studentPortalEnabled" className="h-5 w-5 text-purple-600" />
                                <span>Student Portal Enabled</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <Field type="checkbox" name="staffPortalEnabled" className="h-5 w-5 text-purple-600" />
                                <span>Staff Portal Enabled</span>
                              </label>
                            </div>

                                <div className="sm:col-span-4 mt-2">
                                  <CustomFileUploader
                                    label="Upload Logo "
                                    name="logo"
                                    onChange={(event) =>
                                      handleFileChange(event, setFieldValue)
                                    }
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

export default BranchCreation;
