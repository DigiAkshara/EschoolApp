import { DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { getData, postData } from "../app/api";
import { ACADEMICYEAR, CLASSES, FEEGROUP, FEES } from "../app/url";
import {
  applyFees,
  feeDiscount,
  feeduration,
  getAcademicYears,
  getFeeGroups,
} from "../commonComponent/CommonFunctions";
import CustomCheckBox from "../commonComponent/CustomCheckBox";
import CustomDate from "../commonComponent/CustomDate";
import CustomInput from "../commonComponent/CustomInput";
import CustomRadio from "../commonComponent/CustomRadio";
import CustomSelect from "../commonComponent/CustomSelect";

function FeeCreation({ onClose }) {
  const [feeDetails, setFeeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [academicYears, setAcademicYears] = useState([]);
  const [feeGroups, setFeeGroups] = useState([]);

  const getInitialValues = () => {
    return {
      academicYear: "",
      feeGroup: "",
      feeTitle: "",
      fees: feeDetails.map((item) => ({
        name: item.name,
        _id: item._id,
        checked: false,
        amount: "",
      })),
    };
  };

  const getValidationSchema = () => {
    return Yup.object({
      academicYear: Yup.string().required("Academic year is required"),
      feeGroup: Yup.string().required("Fee Group is required"),
      feeTitle: Yup.string().required("Fee Title is required"),
      fees: Yup.array().of(
        Yup.object({
          checked: Yup.boolean(),
          amount: Yup.string(),
          // .when("checked", {
          //   is: true,
          //   then: Yup.string()
          //     .required("Amount is required")
          //     .matches(/^\d+$/, "Amount must be a valid number"),
          //   otherwise: Yup.string().notRequired(),
          // }),
        })
      ),
    });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await postData(FEES, values);
      if (response.status === 200 || response.status === 201) {
        onClose();
        alert("Fees added successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeeDetails();
  }, []);

  const getFeeDetails = async () => {
    try {
      const [classRes, feeGroupRes, academicYearRes] = await Promise.all([
        getData(CLASSES),
        getData(FEEGROUP),
        getData(ACADEMICYEAR),
      ]);
      if (classRes.status === 200 || classRes.status === 201) {
        setFeeDetails(classRes.data.data);
        setLoading(false);
      } else {
        throw new Error(classRes.message);
      }
      if (feeGroupRes.status === 200 || feeGroupRes.status === 201) {
        let feeGroupData = feeGroupRes.data.data.map((item) => {
          return {
            label: item.name, // Displayed text in the dropdown
            value: item._id,
          };
        });
        setFeeGroups(feeGroupData);
      } else {
        throw new Error(feeGroupRes.message);
      }
      if (academicYearRes.status === 200 || academicYearRes.status === 201) {
        let academicYearData = [
          {
            label: academicYearRes.data.data.year, // Displayed text in the dropdown
            value: academicYearRes.data.data._id,
          },
        ];
        setAcademicYears(academicYearData);
      } else {
        throw new Error(academicYearRes.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectAllFees = () => {
    let dumpList = [];
    values.fees.forEach((item) => {
      dumpList.push({
        ...item,
        isChecked: !checked,
      });
    });
    setFieldValue("fees", dumpList);
    setCheckAll(!checkAll);
  };

  const handleFeeChecked = (e, index) => {
    let dumpList = values.feesData;
    dumpList[index].isChecked = e.target.checked;
    let isAllChecked = dumpList.every((item) => item.isChecked);
    setFieldValue("fees", dumpList);
    setCheckAll(isAllChecked);
  };

  if (loading || feeDetails.length === 0) {
    return <p>Loading classes...</p>;
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
          // console.log(values);
          console.log("Validation Errors:", errors);
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
                                        options={feeGroups}
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

                                    {/* <div className="sm:col-span-1">
                                      <CustomRadio
                                        name="feeApplicable"
                                        label="Apply this fees to Students"
                                        required={true}
                                        options={applyFees}
                                      />
                                    </div> */}

                                    {/* <div className="sm:col-span-1">
                                      <CustomSelect
                                        name="feeDuration"
                                        label="Fee Duration"
                                        required={true}
                                        options={feeduration}
                                        onChange={(e) => {
                                          const duration = Number(
                                            e.target.value
                                          );
                                          setFeeDuration(duration); // Update fee duration state
                                          setFieldValue(
                                            "dueDates",
                                            Array.from(
                                              { length: duration },
                                              (_, index) => ({
                                                installment_no: index + 1,
                                                dueDate: "",
                                              })
                                            ) // Reset dueDates array
                                          );
                                          setFieldValue(
                                            "feeDuration",
                                            duration
                                          );
                                        }}
                                      />
                                    </div> */}

                                    {/* <FieldArray name="dueDates">
                                      {() =>
                                        values.dueDates.map((_, index) => (
                                          <div
                                            className="sm:col-span-1"
                                            key={index}
                                          >
                                            <CustomDate
                                              name={`dueDates.${index}.dueDate`}
                                              label={
                                                "" +
                                                (index + 1) +
                                                " Installment Due Date"
                                              }
                                              required={true}
                                            />
                                          </div>
                                        ))
                                      }
                                    </FieldArray> */}

                                    {/* <div className="sm:col-span-1">
                                      <CustomSelect
                                        name="discount"
                                        label="One Time Discount Percentage"
                                        required={true}
                                        options={feeDiscount}
                                      />
                                    </div> */}
                                  </div>
                                </div>

                                <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                                  <thead className="bg-purple-100">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="relative px-7 sm:w-12 sm:px-6"
                                      >
                                        <CustomCheckBox name={"allClasses"} />
                                      </th>
                                      <th
                                        scope="col"
                                        className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                      >
                                        <a
                                          href="#"
                                          className="group inline-flex"
                                        >
                                          Class
                                        </a>
                                      </th>

                                      <th
                                        scope="col"
                                        className="px-2 py-2 text-left text-sm font-semibold text-gray-900 max-w-10"
                                      >
                                        <a
                                          href="#"
                                          className="group inline-flex"
                                        >
                                          Fees
                                        </a>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 bg-white">
                                    {values.fees.length >= 0 ? (
                                      <FieldArray name="fees">
                                        {() =>
                                          values.fees.map((fee, index) => (
                                            <tr key={fee._id}>
                                              <td className="relative px-7 sm:w-12 sm:px-6">
                                                <CustomCheckBox
                                                  name={`fees[${index}].checked`}
                                                />
                                              </td>
                                              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                {fee.name}
                                              </td>
                                              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                                <CustomInput
                                                  name={`fees[${index}].amount`}
                                                  placeholder="Enter Fee Amount"
                                                  type="number"
                                                  disabled={!fee.checked}
                                                />
                                              </td>
                                            </tr>
                                          ))
                                        }
                                      </FieldArray>
                                    ) : (
                                      <tr>
                                        <td colSpan={3} className="text-center">
                                          No Fees Found
                                        </td>
                                      </tr>
                                    )}
                                    <tr className="bg-purple-100">
                                      <td className="relative px-7 sm:w-12 sm:px-6"></td>
                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                      <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 max-w-10"></td>
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

export default FeeCreation;
