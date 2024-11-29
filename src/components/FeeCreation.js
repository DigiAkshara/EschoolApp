import React, { useRef, useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Select from "react-tailwindcss-select";
import Datepicker from "react-tailwindcss-datepicker";
import CustomSelect from "../commonComponent/CustomSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomInput from "../commonComponent/CustomInput";

function FeeCreation() {
  const [open, setOpen] = useState(false);
  const [animal, setAnimal] = useState(null);
  const [value, setValue] = useState({});
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);

  const formik = useFormik({
    initialValues: {
      academicYear: "",
      feeGroup: "",
      feeTitle: "",
      feeDuration: "",
      firstInstallment: null,
      secInstallment: null,
      discount: "",
      fees: [{ className: "LKG", fee: "" }],
    },
    validationSchema: Yup.object({
      academicYear: Yup.string().required("Academic year is required"),
      feeGroup: Yup.string().required("Fee Group is required"),
      feeTitle: Yup.string().required("Fee Title is required"),
      feeDuration: Yup.string().required("Fee Duration is required"),
      discount: Yup.string().required("Discount is required"),
      fees: Yup.array().of(
        Yup.object({
          className: Yup.string().required("Class is required"),
          fee: Yup.number()
            .required("Fee is required")
            .min(0, "Fee must be positive"),
        })
      ),
    }),
    onSubmit: (values) => {
      console.log("Form values", values);
    },
  });

  const notificationMethods = [
    { id: "All", title: "All" },
    { id: "Old Students", title: "Old Students" },
    { id: "New Students", title: "New Students" },
  ];

  const feeduration = [
    { value: "One Time", label: "One Time" },
    { value: "2 Installments", label: "2 Installments" },
    { value: "3 Installments", label: "3 Installments" },
  ];

  const classData = [
    { id: 1, className: "LKG", fees: "" },
    { id: 2, className: "UKG", fees: "" },
    { id: 3, className: "Grade 1", fees: "" },
  ];

  const handleChange = (value) => {
    console.log("value:", value);
    setAnimal(value);
  };

  return (
    <>
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
                        Fee Structure
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 px-6 py-6 sm:px-6 overflow-y-auto">
                    <div className="form-content">
                      {/* Basic details form */}
                      <form onSubmit={formik.handleSubmit}>
                        <div className="">
                          <div className="pb-4 mb-4">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                              <div className="sm:col-span-1">
                                <CustomSelect
                                  id="academicYear"
                                  name="academicYear"
                                  label="Academic year"
                                  required={true}
                                  options={[
                                    { value: "2023", label: "2023" },
                                    { value: "2024", label: "2024" },
                                    { value: "2025", label: "2025" },
                                  ]}
                                  {...formik.getFieldProps("academicYear")}
                                />
                                {formik.touched.academicYear &&
                                  formik.errors.academicYear && (
                                    <div className="text-red-500">
                                      {formik.errors.academicYear}
                                    </div>
                                  )}
                              </div>

                              <div className="sm:col-span-1">
                                <CustomSelect
                                  id="feeGroup"
                                  name="feeGroup"
                                  label="Fee Group"
                                  required={true}
                                  options={[
                                    {
                                      value: "feeGroup1",
                                      label: "Fee Group 1",
                                    },
                                    {
                                      value: "feeGroup2",
                                      label: "Fee Group 2",
                                    },
                                    {
                                      value: "feeGroup3",
                                      label: "Fee Group 3",
                                    },
                                  ]}
                                  {...formik.getFieldProps("feeGroup")}
                                />
                                {formik.touched.feeGroup &&
                                  formik.errors.feeGroup && (
                                    <div className="text-red-500">
                                      {formik.errors.feeGroup}
                                    </div>
                                  )}
                              </div>

                              <div className="sm:col-span-1">
                                <CustomInput
                                  name="feeTitle"
                                  label="Fee Title"
                                  placeholder="Enter Fee Title"
                                  type="text"
                                  required={true}
                                  {...formik.getFieldProps("feeTitle")}
                                />
                                {formik.touched.feeTitle &&
                                  formik.errors.feeTitle && (
                                    <div className="text-red-500">
                                      {formik.errors.feeTitle}
                                    </div>
                                  )}
                              </div>

                              <div className="sm:col-span-1">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Apply this fees to Students{" "}
                                  <span className="pl-1 text-red-500">*</span>
                                </label>
                                <div className="mt-2">
                                  <div className="space-y-6 sm:flex sm:items-center sm:space-x-4 sm:space-y-0">
                                    {notificationMethods.map(
                                      (notificationMethod) => (
                                        <div
                                          key={notificationMethod.id}
                                          className="flex items-center"
                                        >
                                          <input
                                            defaultChecked={
                                              notificationMethod.id === "email"
                                            }
                                            id={notificationMethod.id}
                                            name="notification-method"
                                            type="radio"
                                            className="size-4 border-gray-300 text-purple-600 focus:ring-purple-600"
                                          />
                                          <label
                                            htmlFor={notificationMethod.id}
                                            className="ml-3 block text-sm/6 font-regular text-gray-900"
                                          >
                                            {notificationMethod.title}
                                          </label>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="sm:col-span-1">
                                <CustomSelect
                                  id="feeDuration"
                                  name="feeDuration"
                                  label="Fee Duration"
                                  required={true}
                                  options={feeduration}
                                  {...formik.getFieldProps("feeDuration")}
                                />
                                {formik.touched.feeDuration &&
                                  formik.errors.feeDuration && (
                                    <div className="text-red-500">
                                      {formik.errors.feeDuration}
                                    </div>
                                  )}
                              </div>

                              <div className="sm:col-span-1">
                                <label
                                  htmlFor="firstInstallment"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  1st Installment Due Date
                                  <span className="pl-1 text-red-500">*</span>
                                </label>
                                <div className="mt-2">
                                  <Datepicker
                                    inputClassName="inline-block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                    primaryColor="purple"
                                    useRange={false}
                                    asSingle={true}
                                    value={formik.values.firstInstallment}
                                    onChange={(newValue) =>
                                      formik.setFieldValue(
                                        "firstInstallment",
                                        newValue
                                      )
                                    }
                                  />
                                  {/* {formik.touched.firstInstallment && formik.errors.firstInstallment && (
                <div className="text-red-500 mt-1">{formik.errors.firstInstallment}</div>
              )} */}
                                </div>
                              </div>

                              <div className="sm:col-span-1">
                                <label
                                  htmlFor="secInstallment"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  2nd Installment Due Date
                                  <span className="pl-1 text-red-500">*</span>
                                </label>
                                <div className="mt-2">
                                  <Datepicker
                                    inputClassName="inline-block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                    primaryColor="purple"
                                    useRange={false}
                                    asSingle={true}
                                    value={formik.values.secInstallment}
                                    onChange={(newValue) =>
                                      formik.setFieldValue(
                                        "secInstallment",
                                        newValue
                                      )
                                    }
                                  />
                                  {/* {formik.touched.secInstallment && formik.errors.secInstallment && (
                <div className="text-red-500">{formik.errors.secInstallment}</div>
              )} */}
                                </div>
                              </div>

                              <div className="sm:col-span-1">
                                <CustomSelect
                                  id="discount"
                                  name="discount"
                                  label="One Time Discount Percentage"
                                  required={true}
                                  options={[
                                    { value: "discount1", label: "10%" },
                                    { value: "discount2", label: "20%" },
                                    { value: "discount3", label: "30%" },
                                  ]}
                                  {...formik.getFieldProps("discount")}
                                />
                                {formik.touched.discount &&
                                  formik.errors.discount && (
                                    <div className="text-red-500">
                                      {formik.errors.discount}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>

                          <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                            <thead className="bg-purple-100">
                              <tr>
                                <th
                                  scope="col"
                                  className="relative px-7 sm:w-12 sm:px-6"
                                >
                                  <input
                                    type="checkbox"
                                    className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                                    ref={checkbox}
                                    checked={checked}
                                    //   onChange={toggleAll}
                                  />
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                >
                                  <a href="#" className="group inline-flex">
                                    Class
                                  </a>
                                </th>

                                <th
                                  scope="col"
                                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900 max-w-10"
                                >
                                  <a href="#" className="group inline-flex">
                                    Fees
                                  </a>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {classData.map((item) => (
      <tr key={item.id}>
        <td className="relative px-7 sm:w-12 sm:px-6">
          <input
            type="checkbox"
            className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
            value=""
            checked=""
            onChange=""
          />
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {item.className}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
          <input
            type="text"
            placeholder="Enter"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
          />
        </td>
      </tr>
    ))}
                              <tr>
                                <td className="relative px-7 sm:w-12 sm:px-6">
                                  <input
                                    type="checkbox"
                                    className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                                    value=""
                                    checked=""
                                    onChange=""
                                  />
                                </td>

                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                  UKG
                                </td>

                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                  <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder="Enter"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                  />
                                </td>
                              </tr>
                              <tr className="bg-purple-100">
                                <td className="relative px-7 sm:w-12 sm:px-6"></td>

                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 max-w-10">
                                  500
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 justify-between px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                  >
                    Cancel
                  </button>

                  <div>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeeCreation;
