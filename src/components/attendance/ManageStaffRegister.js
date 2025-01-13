import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { FieldArray, Form, Formik } from "formik";
import {
  Button,
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import CustomSelect from "../../commonComponent/CustomSelect";
import { getData } from "../../app/api";
import { ACADEMIC_YEAR } from "../../app/url";
import { monthsName } from "../../commonComponent/CommonFunctions";

function ManageStaffRegister() {
  const [academicYears, setAcademicYears] = useState([]);
  const [open, setOpen] = useState(false);

  const getInitialValues = () => {
    return {
      class: "",
      section: "",
    };
  };

  const getValidationSchema = () => {
    return Yup.object({
      class: Yup.string(),
      section: Yup.string(),
    });
  };

  useEffect(() => {
    academicyear();
  }, []);

  const academicyear = async () => {
    try {
      const academicYearRes = await getData(ACADEMIC_YEAR);
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

  const handleSubmit = (values) => {
    console.log("Form submitted with values:", values);
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
          <Form>
            <div className="shadow ring-1 ring-black/5 sm:rounded-lg px-3 py-3 mt-4 flex justify-between">
              <div className="left-form-blk flex space-x-4">
                <CustomSelect
                  name="class"
                  placeholder=" Class"
                  // label="Class"
                  // required={true}
                  // options={classes}
                />
                <CustomSelect
                  name="section"
                  placeholder=" Section"
                  // label="Class"
                  // required={true}
                  // options={classes}
                />
                <CustomSelect
                  name="month"
                  placeholder=" Month"
                  options={monthsName}
                />

                <CustomSelect
                  name="academicYear"
                  placeholder="Academic year"
                  options={academicYears}
                />
              </div>

              <div className="content-item flex items-center">
                <dt className="text-sm/6 text-gray-500">No. Of Working Days</dt>
                <dd className="text-base text-gray-700 font-medium pl-2">24</dd>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <div className="text-lg text-gray-900 font-medium">
                Student Attendance Register
              </div>
              <div className="flex right-btns-blk space-x-4">
                <div className="">
                  Present: <span className="">P</span>
                </div>
                <div className="">
                  Absent: <span className="text-yellow-800">A</span>
                </div>
                <div className="">
                  Half Day: <span className="text-blue-800">F</span>
                </div>
                <div className="">
                  {" "}
                  Holiday: <span className="text-purple-700">H</span>
                </div>
              </div>
            </div>

              {/* /Removed overflow-x-auto cloass */}
                  <div className="shadow ring-1 ring-black/5 sm:rounded-lg">
                    {/* /Removed overflow-hidden cloass */}
                    <div className="relative table-tool-bar z-30">
                      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-4">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                          <div>
                            <div className="relative rounded-md">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon
                                  aria-hidden="true"
                                  className="size-4 text-gray-400"
                                />
                              </div>
                              <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Search"
                                className="block w-full rounded-md border-0 py-1 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 text-sm"
                              />
                            </div>
                          </div>

                          <div className="right-action-btns-blk space-x-4">
                            <button
                              type="button"
                              className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                              <ArrowDownTrayIcon
                                aria-hidden="true"
                                className="size-5"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="table-container-main overflow-y-auto overflow-x-auto max-h-[56vh]">
                      {/* Table View */}
                      <table className="table-auto min-w-full divide-y divide-gray-300">
                        <thead className="bg-purple-100">
                          <tr>
                            <th
                              scope="col"
                              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-40"
                            >
                              <a href="#" className="group inline-flex">
                                Student Name
                              </a>
                            </th>

                            <th
                              scope="col"
                              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-14"
                            >
                              <a href="#" className="group inline-flex">
                                Total Absents
                              </a>
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-16 bg-red-100"
                            >
                              <a
                                href="#"
                                className="flex flex-col items-center"
                              >
                                <div>Su</div>
                                <div>1</div>
                              </a>
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-16"
                            >
                              <a
                                href="#"
                                className="flex flex-col items-center"
                              >
                                <div>Mo</div>
                                <div>2</div>
                              </a>
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-16"
                            >
                              <a
                                href="#"
                                className="flex flex-col items-center"
                              >
                                <div>Tu</div>
                                <div>3</div>
                              </a>
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-16"
                            >
                              <a
                                href="#"
                                className="flex flex-col items-center"
                              >
                                <div>We</div>
                                <div>4</div>
                              </a>
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-16"
                            >
                              <a
                                href="#"
                                className="flex flex-col items-center"
                              >
                                <div>Th</div>
                                <div>5</div>
                              </a>
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-16"
                            >
                              <a
                                href="#"
                                className="flex flex-col items-center"
                              >
                                <div>Fr</div>
                                <div>6</div>
                              </a>
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-16"
                            >
                              <a
                                href="#"
                                className="flex flex-col items-center"
                              >
                                <div>Sa</div>
                                <div>7</div>
                              </a>
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-16 bg-red-100"
                            >
                              <a
                                href="#"
                                className="flex flex-col items-center"
                              >
                                <div>Su</div>
                                <div>1</div>
                              </a>
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-16 bg-purple-300"
                            >
                              <a
                                href="#"
                                className="flex flex-col items-center"
                              >
                                <div>Mo</div>
                                <div>9</div>
                              </a>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          <tr>
                            <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm">
                              <a
                                href="#"
                                className="text-purple-600 hover:text-purple-900"
                              >
                                <div className="flex items-center">
                                  <div className="size-9 shrink-0">
                                    <img
                                      alt=""
                                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                      className="size-9 rounded-full"
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="font-medium text-gray-900 text-purple-600">
                                      Janet Baker
                                    </div>
                                    <div className="mt-1 text-gray-500">
                                      112345
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              0
                            </td>

                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 text-center bg-red-100">
                              S
                            </td>

                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-3">
                              <Menu
                                as="div"
                                className="relative inline-block text-left"
                              >
                                <div>
                                  <MenuButton className="flex items-center rounded-full  text-gray-400">
                                    p
                                  </MenuButton>
                                </div>
                                <MenuItems className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none">
                                  <div className="py-1">
                                    <MenuItem>
                                      <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700"
                                      >
                                        Update Attendance
                                      </a>
                                    </MenuItem>
                                    <MenuItem>
                                      <label className="flex items-center text-sm text-gray-600 p-2">
                                        <input
                                          type="radio"
                                          name="attendance"
                                          value="P"
                                          className="mr-2 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        Present: P
                                      </label>
                                    </MenuItem>
                                    <MenuItem>
                                      <label className="flex items-center text-sm text-gray-600 p-2">
                                        <input
                                          type="radio"
                                          name="attendance"
                                          value="P"
                                          className="mr-2 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        Absent: A
                                      </label>
                                    </MenuItem>
                                    <MenuItem>
                                      <label className="flex items-center text-sm text-gray-600 p-2">
                                        <input
                                          type="radio"
                                          name="attendance"
                                          value="P"
                                          className="mr-2 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        Half Day: F
                                      </label>
                                    </MenuItem>
                                    <MenuItem>
                                      <label className="flex items-center text-sm text-gray-600 p-2">
                                        <input
                                          type="radio"
                                          name="attendance"
                                          value="P"
                                          className="mr-2 text-indigo-600 focus:ring-indigo-500"
                                        />
                                         Leave: L
                                      </label>
                                    </MenuItem>
                                    <MenuItem>
                                      <div className="flex p-4">
                                        <button
                                          type="button"
                                          onClick={() => setOpen(false)}
                                          className="w-1/2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="submit"
                                          className=" w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                                        >
                                          Apply
                                        </button>
                                      </div>
                                    </MenuItem>
                                  </div>
                                </MenuItems>
                              </Menu>
                            </td>

                            <td className="whitespace-nowrap px-2 py-2 text-sm text-center text-gray-500">
                              P
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-center text-gray-500">
                              P
                            </td>

                            <td className="whitespace-nowrap px-2 py-2 text-sm text-center text-gray-500">
                              P
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-center text-gray-500">
                              P
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-center text-gray-500">
                              P
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-center text-gray-900 text-center bg-red-100">
                              S
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 text-center bg-purple-300">
                              H
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="pagination">
                      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-3 py-3 sm:px-3">
                        <div className="flex flex-1 justify-between sm:hidden">
                          <a
                            href="#"
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Previous
                          </a>
                          <a
                            href="#"
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Next
                          </a>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Showing <span className="font-medium">1</span> to{" "}
                              <span className="font-medium">10</span> of{" "}
                              <span className="font-medium">97</span> results
                            </p>
                          </div>
                          <div>
                            <nav
                              aria-label="Pagination"
                              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                            >
                              <a
                                href="#"
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                              >
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </a>
                              {/* Current: "z-10 bg-purple-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                              <a
                                href="#"
                                aria-current="page"
                                className="relative z-10 inline-flex items-center bg-purple-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                              >
                                1
                              </a>
                              <a
                                href="#"
                                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                              >
                                2
                              </a>
                              <a
                                href="#"
                                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                              >
                                3
                              </a>
                              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                ...
                              </span>
                              <a
                                href="#"
                                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                              >
                                8
                              </a>
                              <a
                                href="#"
                                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                              >
                                9
                              </a>
                              <a
                                href="#"
                                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                              >
                                10
                              </a>
                              <a
                                href="#"
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                              >
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </a>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                
          </Form>
        )}
      </Formik>
    </>
  );
}

export default ManageStaffRegister;
