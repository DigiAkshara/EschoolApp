"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  ListBulletIcon,
} from "@heroicons/react/20/solid";
import {
  FunnelIcon,
  ArrowDownTrayIcon,
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Student from "./Student";
import { STUDENT } from "../app/url";
import TableComponent from "../commonComponent/TableComponent";
import { getData } from "../app/api";
import { gender } from "../commonComponent/CommonFunctions";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tabs = [
  { name: "Students", href: "#", current: true },
  { name: "Enrollments", href: "#", current: false },
];

const tabs2 = [
  { name: "Active", href: "#", count: "52", current: true },
  { name: "Drafts", href: "#", count: "12", current: false },
];

export default function ManageStudents() {
  const [studentList, setStudentList] = useState([]);
  const [open, setOpen] = useState(false);
  console.log(open, "sample text");

  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]);

  useEffect(() => {
    getStudents();
  }, []);

  const labels = [
    { name: "Student Name", key: "name" },
    { name: "Admission Number", key: "admissionNo" },
    { name: "Class", key: "class" },
    { name: "Section", key: "section" },
    { name: "Phone Number", key: "phoneNumber" },
    { name: "DOB", key: "date" },
    { name: "Aadhar No", key: "aadharNo" },
    { name: "Gender", key: "gender" },
    { name: "Actions", key: "actions" },
  ];

  const getStudents = async () => {
    const res = await getData(STUDENT);
    const studentData = res.data.data.map((item) => {
      return {
        _id: item._id,
        pic: item.profilePic,
        name: item.firstName + " " + item.lastName,
        admissionNo: item.admissionNumber,
        class: item.class,
        section: item.section,
        phoneNumber: item.fatherDetails.mobileNumber,
        date: item.DOB,
        aadharNo: item.aadharNumber,
        gender: () => gender().find((i) => i.value === item.gender).label,
        actions: ["Edit", "Delete", "Promote", "Exit"],
      };
    });
    setStudentList(studentData);
  };

  // useLayoutEffect(() => {
  //   const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < people.length
  //   setChecked(selectedPeople.length === people.length)
  //   // setIndeterminate(isIndeterminate)
  //   // checkbox.current.indeterminate = isIndeterminate
  // }, [selectedPeople])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="flow-root">
      {/* Primary Tabs */}
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            defaultValue={tabs.find((tab) => tab.current).name}
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav aria-label="Tabs" className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  aria-current={tab.current ? "page" : undefined}
                  className={classNames(
                    tab.current
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
                  )}
                >
                  {tab.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {/* Secondary Tabs */}
      <div className="mt-4 flex justify-between">
        <div className="sm:hidden">
          <label htmlFor="tabs2" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs2"
            name="tabs2"
            defaultValue={tabs2.find((tab) => tab.current).name}
            className="block w-full rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          >
            {tabs2.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav aria-label="Tabs2" className="flex space-x-4">
            {tabs2.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                aria-current={tab.current ? "page" : undefined}
                className={classNames(
                  tab.current
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-500 hover:text-gray-700",
                  "rounded-full px-3 py-2 text-sm font-medium"
                )}
              >
                {tab.name}
                {tab.count ? (
                  <span
                    className={classNames(
                      tab.current
                        ? "bg-white text-purple-600"
                        : "bg-gray-300 text-gray-900",
                      "ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block"
                    )}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </a>
            ))}
          </nav>
        </div>
        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            onClick={handleOpen}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Student
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <ArrowUpTrayIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Bulk Upload Students
          </button>
        </div>
      </div>

      <div className="-mx-2 -my-2 mt-0 overflow-x-auto sm:-mx-6">
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            {selectedPeople.length > 0 && (
              <div className="absolute left-20 top-0 flex h-12 items-center space-x-3 bg-white sm:left-72">
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  Promote
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  Exit
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  Delete
                </button>
              </div>
            )}
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              

              <div className="table-container-main overflow-y-auto max-h-[56vh]">
                {/* Table View */}
                <TableComponent labels={labels} studentList={studentList} />

                {/* Cards View */}
                {/* <div className='cards-view-blk px-4 py-4 hidden'>
                  <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {people2.map((person2) => (
                      <li key={person2.email} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow border border-gray-300">
                        <div className="flex w-full items-center justify-between space-x-6 p-6">
                          <img alt="" src={person2.imageUrl} className="size-10 shrink-0 rounded-full bg-gray-300" />

                          <div className="flex-1 truncate">
                            <div className="flex items-center space-x-3">
                              <h3 className="truncate text-sm font-medium text-gray-900">{person2.name}</h3>
                            </div>
                            <p className="mt-1 truncate text-sm text-gray-500">{person2.title}</p>
                          </div>
                        </div>
                        <div>
                          <div className="-mt-px flex divide-x divide-gray-200">
                            <div className="flex w-0 flex-1">
                              <a
                                href={`mailto:${person2.email}`}
                                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                              >
                                <ChatBubbleBottomCenterTextIcon aria-hidden="true" className="size-5 text-gray-400" />
                                Whatsapp
                              </a>
                            </div>
                            <div className="-ml-px flex w-0 flex-1">
                              <a
                                href={`tel:${person2.telephone}`}
                                className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                              >
                                <PhoneIcon aria-hidden="true" className="size-5 text-gray-400" />
                                Call
                              </a>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>   */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Onboarding Modal */}

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <div className="fixed inset-0" />

        <Student onClose={handleClose} />
      </Dialog>
    </div>
  );
}
