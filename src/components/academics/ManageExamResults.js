"use client";
import {
  MagnifyingGlassIcon
} from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectExam } from "../../app/reducers/examSlice";
import ExamMarkDetailsPage from "./ExamMarkDetailsPage";
import ManageExamMarks from "./ManageExamMarks";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

function ManageExamResults() {
  const exams = useSelector((state) => state.exams.exams);
  const dispatch = useDispatch();
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [examData, setExamData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const columns = [
    { key: "examName", title: "Exam Name" },
    { key: "className", title: "Class" },
    { key: "sectionName", title: "Section" },
    { key: "examDates", title: "Exam Dates" },
    { key: "markStatus", title: "Marks Status" },
    { key: "passPercentage", title: "Pass Percentage" },
    { key: "results", title: "Results" }, 
  ];
  useEffect(() => {
    formatExamData();
  }, []);

  const getPercentage = (timeTable) => {
    const totalSubjects = timeTable.length;
    const passedSubjects = timeTable.filter(
      (subject) => subject.totalMark >= subject.passMark
    ).length;
    return ((passedSubjects / totalSubjects) * 100).toFixed(2);
  }

  const formatExamData = async () => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const data = exams.map((item, index) => {
      // Formatting the timeTable data
      const timeTableFormatted = item.timeTable.map((t) => ({
        subject: t.subject,
        examDate: formatter.format(new Date(t.examDate)),
        startTime: t.startTime,
        endTime: t.endTime,
        passMark: t.passMark,
        totalMark: t.totalMark,
        syllabus: t.syllabus,
      }));

      const isPassed = moment().isAfter(moment(item.endDate, "YYYY-MM-DD"));
      const markStatus =  isPassed ? item.examStatus?"Completed":"Pending" : "Not Yet Started";
      let passPercentage = "-"
      if(item.examStatus){
        passPercentage = getPercentage(item.timeTable)
      }
      return {
        id: index + 1,
        examName: item.name,
        category: item.classCategory?._id,
        categoryObject: item.classCategory,
        categoryName: item.classCategory?.name,
        class: item.class?._id,
        className: item.class?.name,
        classObject: item.class,
        section: item.section?._id,
        sectionName: item.section?.section,
        sectionObject: item.section,
        examDates: `${formatter.format(new Date(item.startDate))} - ${formatter.format(new Date(item.endDate))}`,
        board: item.board,
        timeTable: timeTableFormatted, // Add the formatted timeTable data
        markStatus:markStatus,
        passPercentage: "",
        results: "",
      };
    });
    setExamData(data);
    setFilteredData(data)
  };

  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);

  const handleAddButton = (data) => {
    dispatch(selectExam(data));
    setOpen(true);
  };

  return (
    <>
      <div className="filter-badges-blk mt-4 flex flex-wrap gap-x-4">
        <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          Class:<span className="font-bold">1</span>
          <button
            type="button"
            className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
          >
            <span className="sr-only">Remove</span>
            <svg
              viewBox="0 0 14 14"
              className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
            >
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>
        </span>
        <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          Section:<span className="font-bold">A</span>
          <button
            type="button"
            className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
          >
            <span className="sr-only">Remove</span>
            <svg
              viewBox="0 0 14 14"
              className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
            >
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>
        </span>

        <Button className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
          Clear All
        </Button>
      </div>

      <div className="-mx-2 -my-2 mt-0 sm:-mx-6">
        {/* /Removed overflow-x-auto cloass */}
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            {selectedPeople.length > 0 && (
              <div className="absolute left-20 top-0 flex h-12 items-center space-x-3 bg-white sm:left-72">
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  Delete
                </button>
              </div>
            )}
            <div className="relative shadow ring-1 ring-black/5 sm:rounded-lg">
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
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <MenuButton className="relative inline-flex items-center rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            <FunnelIcon aria-hidden="true" className="size-5" />
                            Filters
                            <span className="flex items-center justify-center text-center absolute w-5 h-5 rounded-full bg-red-500 text-white font-medium text-xs -right-2 -top-2">
                              3
                            </span>
                          </MenuButton>
                        </div>

                        <MenuItems
                          transition
                          className="max-h-[430px] z-40 overflow-y-auto absolute right-0 z-10 mt-2 px-4 py-4 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <div className="grid gap-3 ">
                            <MenuItem className="group mb-2">
                              <div className="flex">
                                <FunnelIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                                <span className="pl-2">Select Filters</span>
                              </div>
                            </MenuItem>
                            <MenuItem>
                              <div className="">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Exam Name
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="2024-2025"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                  >
                                    <option>Fee Name Title</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                  </select>
                                </div>
                              </div>
                            </MenuItem>

                            <MenuItem>
                              <div className="">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Class
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="All"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                  >
                                    <option>Fee Name Title</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                  </select>
                                </div>
                              </div>
                            </MenuItem>

                            <MenuItem>
                              <div className="">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Section
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="All"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                  >
                                    <option>Fee Name Title</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                  </select>
                                </div>
                              </div>
                            </MenuItem>

                            <MenuItem>
                              <div className="flex">
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-container-main max-h-[56vh]">
                {/* Table View */}
                <table className="table-auto min-w-full divide-y divide-gray-300">
                  <thead className="sticky top-0 bg-purple-100 z-20">
                    <tr>
                      <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                        />
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                      >
                        <a href="#" className="group inline-flex">
                          Exam Name
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        </a>
                      </th>

                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Class
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Sections
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Exam Dates
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Marks Status
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Pass Percentage
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Results
                        </a>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white z-1">
                    <tr>
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        name
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        1
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        A
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        {" "}
                        03/12/2024 - 09/12/2024
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          Completed
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          Pass-86%
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                        <a onClick={() => setOpen2(true)}>View</a>
                      </td>
                    </tr>

                    {examData.map((data) => (
                      <tr
                        key={data.email}
                        className={
                          selectedPeople.includes(data)
                            ? "bg-gray-50"
                            : undefined
                        }
                      >
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {selectedPeople.includes(data) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-purple-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                            value={data.email}
                            checked={selectedPeople.includes(data)}
                            onChange={(e) =>
                              setSelectedPeople(
                                e.target.checked
                                  ? [...selectedPeople, data]
                                  : selectedPeople.filter((p) => p !== data)
                              )
                            }
                          />
                        </td>

                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {data.examName}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {data.section}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {data.examDates}
                        </td>

                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                            Pending
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                            Pass-86%
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                          <a onClick={() => handleAddButton(data)}>Add</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <ManageExamMarks onClose={handleClose} />
      </Dialog>
      <Dialog open={open2} onClose={setOpen2} className="relative z-50">
        <ExamMarkDetailsPage onClose={handleClose2} />
      </Dialog>
    </>
  );
}

export default ManageExamResults;
