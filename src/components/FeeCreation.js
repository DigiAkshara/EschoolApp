import React, { useEffect, useRef, useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CustomSelect from "../commonComponent/CustomSelect";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import CustomInput from "../commonComponent/CustomInput";
import CustomDate from "../commonComponent/CustomDate";
import { applyFees, feeduration, getAcademicYears, getFeeGroups } from "../commonComponent/CommonFunctions";
import CustomRadio from '../commonComponent/CustomRadio';
import { GET_CLASSES } from "../app/url";
import { getData } from '../app/api';

function FeeCreation({ onClose }) {
  const [academicYears, setAcademicYears] = useState(getAcademicYears());
  const [feeGroup, setFeeGroup] = useState(getFeeGroups);
  const [applyFee, setApplyFee] = useState(applyFees);
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);

  const classData = [
    { id: 1, className: "LKG", fees: "" },
    { id: 2, className: "UKG", fees: "" },
    { id: 3, className: "Grade 1", fees: "" },
  ];

  const initialValues = {
    academicYear: "",
    feeGroup: "",
    feeTitle: "",
    feeDuration: "",
    feeApplicable: "",
      // firstInstallment: null,
      // secInstallment: null,
      // discount: "",
      // fees: classData.map((item) => ({
      //   className: item.className,
      //   fee: item.fees,
      // })),
    }

    const validationSchemas = Yup.object({
      academicYear: Yup.string().required("Academic year is required"),
      feeGroup: Yup.string().required("Fee Group is required"),
      feeTitle: Yup.string().required("Fee Title is required"),
      feeDuration: Yup.string().required("Fee Duration is required"),
      feeApplicable: Yup.string().required("who to apply fee is required"),
      // discount: Yup.string().required("Discount is required"),
      // fees: Yup.array()
      //   .of(
      //     Yup.object({
      //       className: Yup.string().required(),
      //       fee: Yup.number()
      //         .min(0, "Fee must be at least 0")
      //         .required("Fee is required"),
      //     })
      //   )
      //   .test("at-least-one-selected", "Please select class", (fees) =>
      //     fees.some((fee) => fee.fee)
      //   ),
    })

  const handleSubmit = (values) => {
    const finalData = values;
    console.log("Final Data: ", finalData);
    alert("Form submitted successfully!");
  };

  useEffect(() => {
    getClass();
  }, [])

  const getClass = async () => {
    const res= await getData(GET_CLASSES);
    console.log(res);
  }

  // const toggleClassSelection = (className) => {
  //   const updatedFees = formik.values.fees.some(
  //     (fee) => fee.className === className
  //   )
  //     ? formik.values.fees.filter((fee) => fee.className !== className)
  //     : [...formik.values.fees, { className, fee: "" }];
  //   formik.setFieldValue("fees", updatedFees);
  // };

  //   const toggleClassSelection = (className) => {
  //   const fees = formik.values.fees;
  //   const isSelected = fees.some((fee) => fee.className === className);

  //   if (isSelected) {
  //     // Remove class from fees
  //     formik.setFieldValue(
  //       "fees",
  //       fees.filter((fee) => fee.className !== className)
  //     );
  //   } else {
  //     // Add class to fees
  //     formik.setFieldValue("fees", [...fees, { className, fee: "" }]);
  //   }
  // };

  // const toggleAllClasses = () => {
  //   if (checked) {
  //     formik.setFieldValue("fees", []);
  //   } else {
  //     const allFees = classData.map((item) => ({
  //       className: item.className,
  //       fee: "",
  //     }));
  //     formik.setFieldValue("fees", allFees);
  //   }
  //   setChecked(!checked);
  // };

  return (
    <>
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchemas}
        onSubmit= {handleSubmit }
      >
        {({ values }) => (
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
                        Fee Structure
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={onClose}
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
                        <div className="">
                          <div className="pb-4 mb-4">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                              <div className="sm:col-span-1">
                                <CustomSelect
                                  name="academicYear"
                                  label="Academic year"
                                  required={true}
                                  options={academicYears}
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomSelect
                                  name="feeGroup"
                                  label="Fee Group"
                                  required={true}
                                  options={feeGroup}
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomInput
                                  name="feeTitle"
                                  label="Fee Title"
                                  placeholder="Enter Fee Title"
                                  required={true}
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomRadio
                                  name="feeApplicable"
                                  label="Apply this fees to Students"
                                  required={true}
                                  options= {applyFee}
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomSelect
                                  name="feeDuration"
                                  label="Fee Duration"
                                  required={true}
                                  options={feeduration}
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomDate
                                  name="firstInstallment"
                                  label="1st Installment Due Date"
                                  required={true}
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomDate
                                  name="secondInstallment"
                                  label="2nd Installment Due Date"
                                  required={true}
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomSelect
                                  name="discount"
                                  label="One Time Discount Percentage"
                                  required={true}
                                  options={[
                                    { value: "discount1", label: "10%" },
                                    { value: "discount2", label: "20%" },
                                    { value: "discount3", label: "30%" },
                                  ]}
                                />
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
                                    // onChange={toggleAllClasses}
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
                                      // checked={formik.values.fees.some(
                                      //   (fee) =>
                                      //     fee.className === item.className
                                      // )}
                                      // onChange={() =>
                                      //   toggleClassSelection(item.className)
                                      // }
                                    />
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                    {item.className}
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                    <input
                                      type="number"
                                      placeholder="Enter"
                                      // value={
                                      //   formik.values.fees.find(
                                      //     (fee) =>
                                      //       fee.className === item.className
                                      //   )?.fee || ""
                                      // }
                                      // onChange={(e) =>
                                      //   formik.setFieldValue(
                                      //     "fees",
                                      //     formik.values.fees.map((fee) =>
                                      //       fee.className === item.className
                                      //         ? { ...fee, fee: e.target.value }
                                      //         : fee
                                      //     )
                                      //   )
                                      // }
                                      // disabled={
                                      //   !formik.values.fees.some(
                                      //     (fee) =>
                                      //       fee.className === item.className
                                      //   )
                                      // }
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
                                  
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>                      
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 justify-between px-4 py-4">
                  <button
                    type="button"
                    // onClick={onClose}
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
        )}
      </Formik>
    </>
  );
}

export default FeeCreation;
