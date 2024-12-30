import { Form, Formik } from "formik";
import CustomInput from "../commonComponent/CustomInput";
import * as Yup from "yup";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import CustomFileUploader from "../commonComponent/CustomFileUploader";
import { uploadFile } from "../commonComponent/CommonFunctions";



export default function Tenant({ onClose }) {
  const initialValues = {
    name: "",
  }

  const handleFileChange = async (e) => {
    try {
      const fileResponse = await uploadFile(e.target.files[0]);
      // setFieldValue(e.target.name, fileResponse);
    } catch (error) {
      console.log(error);
    }
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
  });

  const handleSubmit = (values) => {
    onClose();
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
                                Add Student
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
                                        Personal Details
                                      </h2>
                                      <div className=" grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
                                        <div className="col-span-full">
                                          <label
                                            htmlFor="first-name"
                                            className="block text-sm/6 font-regular text-gray-900"
                                          >
                                            Passport Size Photo<span className="pl-1 text-red-500">*</span>
                                          </label>
                                          <CustomFileUploader isProfile={true} name="profilePic" onChange={handleFileChange}/>
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
  )
}