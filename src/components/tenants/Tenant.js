import { DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  handleApiResponse,
  uploadFile,
} from "../../commonComponent/CommonFunctions";
import CustomFileUploader from "../../commonComponent/CustomFileUploader";
import CustomInput from "../../commonComponent/CustomInput";
import { useEffect } from "react";
import { getData, postData } from "../../app/api";
import { TENANT } from "../../app/url";
import CustomRadio from "../../commonComponent/CustomRadio";

export default function Tenant({ onClose }) {
  const getInitialValues = () => {
    return {
      name: "",
      email: "",
      mobileNumber: "",
      address: {
        area: "",
        city: "",
        state: "",
        pincode: "",
      },
      logo: null,
      studentCount: 0,
      smsCount: 0,
      whatsAppCount: 0,
      portalEnabledStudents: "",
      portalEnabledStaff: "",
      contactPerson: "",
    };
  };

  const getValidationSchema = () => {
    return Yup.object({
      name: Yup.string()
        .matches(
          /^[a-zA-Z\s]*$/,
          "School Name can only contain letters and spaces"
        )
        .min(3, "School Name must be at least 3 characters")
        .max(200, "School Name must be at most 200 characters")
        .required("School Name is required"),
      contactPerson: Yup.string()
        .matches(
          /^[a-zA-Z\s]*$/,
          "School Name can only contain letters and spaces"
        )
        .min(3, "School Name must be at least 3 characters")
        .max(50, "School Name must be at most 50 characters")
        .required("Contact Person is required"),
      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),
      mobileNumber: Yup.string()
        .required("Mobile Number is required")
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .max(10),
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
        state: Yup.string().required("State is required"),
        pincode: Yup.string()
          .matches(/^\d{6}$/, "Pincode must be a 6-digit numeric code")
          .required("Pincode is required"),
      }),
      studentCount: Yup.string().required("Students Count is required").max(5),
      smsCount: Yup.string().required("SMS Count is required").max(5),
      whatsAppCount: Yup.string().required("WhatsApp Count is required").max(5),
      portalEnabledStudents: Yup.boolean().required(
        "Portal Enabled Students is required"
      ),
      portalEnabledStaff: Yup.boolean().required(
        "Portal Enabled Staff is required"
      ),
      logo: Yup.mixed()
        .nullable()
        .test(
          "fileFormat",
          "Photo must be in JPG, JPEG, or PNG format",
          (value) => {
            if (!value) return true; // If no file is uploaded, skip the test
            const supportedFormats = ["image/jpeg", "image/jpg", "image/png"];

            // Check MIME type first
            if (supportedFormats.includes(value.type)) {
              return true; // Valid MIME type
            }

            // If MIME type is incorrect, check the file extension as a fallback
            const fileExtension = value.name.split(".").pop().toLowerCase();
            const supportedExtensions = ["jpg", "jpeg", "png"];
            return supportedExtensions.includes(fileExtension); // Check file extension
          }
        )
    });
  };

  const handleFileChange = async (e, setFieldValue) => {
    try {
      const fileResponse = await uploadFile(e.target.files[0]);
      setFieldValue(e.target.name, fileResponse);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await postData(TENANT, values);
      console.log(response);
      handleApiResponse(response.data.message, "success");
      onClose();
    } catch (error) {
      handleApiResponse(error);
    }
  };

  useEffect(() => {
    getTenants();
  }, []);

  const getTenants = async () => {
    try {
      const response = await getData(TENANT);
      console.log(response);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, errors }) => (
          console.log(errors),
          (
            <Form>
              <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <DialogPanel
                      transition
                      className="pointer-events-auto w-screen max-w-6xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                    >
                      <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                        <div className="flex min-h-0 flex-1 flex-col ">
                          <div className="bg-purple-900 px-3 py-3 sm:px-6">
                            <div className="flex items-start justify-between">
                              <DialogTitle className=" text-base font-semibold text-white">
                                Add School
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
                          <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto">
                            <div className="form-content mt-4">
                              <div className="border-b border-gray-900/10 pb-4 mb-4">
                                <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                                  School Details
                                </h2>
                                <div className=" grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
                                  <div className="col-span-full">
                                    <label
                                      htmlFor="first-name"
                                      className="block text-sm/6 font-regular text-gray-900"
                                    >
                                      School Logo
                                      <span className="pl-1 text-red-500">
                                        *
                                      </span>
                                    </label>
                                    <CustomFileUploader
                                      isProfile={true}
                                      name="logo"
                                      onChange={(e) =>
                                        handleFileChange(e, setFieldValue)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="border-b border-gray-900/10 pb-4 mb-4">
                              <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                                Basic Details
                              </h2>
                              <div className=" grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
                                <div className="sm:col-span-2">
                                  <CustomInput
                                    name="name"
                                    label="School Name"
                                    placeholder="Enter School Name"
                                    required={true}
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <CustomInput
                                    name="contactPerson"
                                    label="Contact Person Name"
                                    placeholder="Enter Contact Person"
                                    required={true}
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <CustomInput
                                    name="mobileNumber"
                                    label="Mobile Number"
                                    placeholder="Enter mobile"
                                    required={true}
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <CustomInput
                                    name="email"
                                    label="Email"
                                    placeholder="Enter email"
                                    required={true}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="border-b border-gray-900/10 pb-4 mb-4">
                              <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                                Portal Settings
                              </h2>
                              <div className=" grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
                                <div className="sm:col-span-2">
                                  <CustomRadio
                                    name="portalEnabledStaff"
                                    label="Portal Enabled for Staff"
                                    options={[
                                      { value: true, label: "Yes" },
                                      { value: false, label: "No" },
                                    ]}
                                    required={true}
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <CustomRadio
                                    name="portalEnabledStudents"
                                    label="Portal Enabled for Students"
                                    options={[
                                      { value: true, label: "Yes" },
                                      { value: false, label: "No" },
                                    ]}
                                    required={true}
                                  />
                                </div>
                                <div className="sm:col-span-1">
                                  <CustomInput
                                    type="number"
                                    name="studentCount"
                                    label="No. of Students"
                                    placeholder="Enter no. of students allowed"
                                    required={true}
                                  />
                                </div>
                                <div className="sm:col-span-1">
                                  <CustomInput
                                    type="number"
                                    name="smsCount"
                                    label="Number of SMS"
                                    placeholder="Enter no. of SMS allowed"
                                    required={true}
                                  />
                                </div>
                                <div className="sm:col-span-1">
                                  <CustomInput
                                    type="number"
                                    name="whatsappCount"
                                    label="No of Whatsapp"
                                    placeholder="Enter no. of Whatsapp messages allowed"
                                    required={true}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="border-b border-gray-900/10 pb-4 mb-4">
                              <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                                Address
                              </h2>
                              <div className=" grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
                                <div className="sm:col-span-2">
                                  <CustomInput
                                    name="address.area"
                                    label="Area"
                                    placeholder="Enter Area"
                                    required={true}
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <CustomInput
                                    name="address.city"
                                    label="City"
                                    placeholder="Enter City"
                                    required={true}
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <CustomInput
                                    name="address.state"
                                    label="State"
                                    placeholder="Enter State"
                                    required={true}
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <CustomInput
                                    name="address.pincode"
                                    label="Pincode"
                                    placeholder="Enter Pincode"
                                    required={true}
                                  />
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
                            {/* {currentStep > 1 && (
                              <button
                                type="button"
                                onClick={handleBack}
                                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                              >
                                Back
                              </button>
                            )} */}
                            <button
                              type="submit"
                              className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </DialogPanel>
                  </div>
                </div>
              </div>
            </Form>
          )
        )}
      </Formik>
    </>
  );
}
