import { DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { postData, updateData } from "../../app/api";
import { BRANCH, TENANT } from "../../app/url";
import {
  handleApiResponse,
  uploadFile,
} from "../../commonComponent/CommonFunctions";
import CustomFileUploader from "../../commonComponent/CustomFileUploader";
import CustomInput from "../../commonComponent/CustomInput";
import CustomRadio from "../../commonComponent/CustomRadio";
import { updateTenant } from "../../app/reducers/TenantConfigSlice";
import { useEffect, useState } from "react";

export default function Tenant({ onClose, loadTenants }) {
  const selectedTenant = useSelector((state) => state.tenant.selectedTenant);
  const tenants = useSelector((state) => state.appConfig.allTenants);
  const dispatch = useDispatch();
  const [selectedTenantData, setSelectedTenantData] = useState(null);

  useEffect(() => {
    if(selectedTenant) {
     const data = tenants.find((tenant) => tenant._id === selectedTenant);
     setSelectedTenantData(data)
    }
  },[selectedTenant, tenants])
  const getInitialValues = () => {
    return {
      name: "",
      contactPerson: "",
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
      whatsappCount: 0,
      portalEnabledStudents: "yes",
      portalEnabledStaff: "yes",
      whatsappUserId: "",
      whatsappPassword: "",
      ...(selectedTenantData && {
        name: selectedTenantData.name,
        contactPerson: selectedTenantData.contactPerson,
        email: selectedTenantData.email,
        mobileNumber: selectedTenantData.mobileNumber,
        address: selectedTenantData.address,
        logo: selectedTenantData.logo,
        studentCount: selectedTenantData.studentCount,
        smsCount: selectedTenantData.smsCount,
        whatsappCount: selectedTenantData.whatsappCount,
        portalEnabledStudents: selectedTenantData.portalEnabledStudents ? "yes" : "no",
        portalEnabledStaff: selectedTenantData.portalEnabledStaff ? "yes" : "no",
        tenantId: selectedTenantData.tenant._id,
        _id: selectedTenantData._id,
        whatsappUserId: selectedTenantData.whatsappUserId,
        whatsappPassword: selectedTenantData.whatsappPassword,
      }),
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
      studentCount: Yup.string(),
      smsCount: Yup.string(),
      whatsappCount: Yup.string(),
      portalEnabledStudents: Yup.string().required(
        "Portal Enabled Students is required"
      ),
      portalEnabledStaff: Yup.string().required(
        "Portal Enabled Staff is required"
      ),
      whatsappUserId: Yup.string(),
      whatsappPassword: Yup.string(),
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
      const response = values._id ? await updateData(BRANCH + "/" + values._id, values) : await postData(TENANT, values);
      handleApiResponse(response.data.message, "success");
      loadTenants();
      onClose();
      dispatch(updateTenant(null))
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
                                    disabled={values._id ? true : false}
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <CustomInput
                                    name="email"
                                    label="Email"
                                    placeholder="Enter email"
                                    required={true}
                                    disabled={values._id ? true : false}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="border-b border-gray-900/10 pb-4 mb-4">
                              <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                                Portal Settings
                              </h2>
                              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
                                <div className="sm:col-span-2">
                                  <CustomRadio
                                    name="portalEnabledStaff"
                                    label="Portal Enabled for Staff"
                                    options={[
                                      { value: "yes", label: "Yes" },
                                      { value: "no", label: "No" },
                                    ]}
                                    required={true}
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <CustomRadio
                                    name="portalEnabledStudents"
                                    label="Portal Enabled for Students"
                                    options={[
                                      { value: "yes", label: "Yes" },
                                      { value: "no", label: "No" },
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
                                  />
                                </div>
                                <div className="sm:col-span-1">
                                  <CustomInput
                                    type="number"
                                    name="smsCount"
                                    label="Number of SMS"
                                    placeholder="Enter no. of SMS allowed"
                                  />
                                </div>
                                <div className="sm:col-span-1">
                                  <CustomInput
                                    type="number"
                                    name="whatsappCount"
                                    label="No of Whatsapp"
                                    placeholder="Enter no. of Whatsapp messages allowed"
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <CustomInput
                                    name="whatsappUserId"
                                    label="Whatsapp User ID"
                                    placeholder="Enter Whatsapp User ID"
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <CustomInput
                                    type="password"
                                    name="whatsappPassword"
                                    label="Whatsapp Password"
                                    placeholder="Enter Whatsapp password"
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
