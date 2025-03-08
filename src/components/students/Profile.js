import { Dialog, DialogPanel, DialogTitle, Legend, Transition } from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowLongUpIcon,
  ArrowUpRightIcon,
  ChatBubbleBottomCenterTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  PencilIcon,
  PhoneIcon,
  TrashIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { capitalizeWords, handleApiResponse } from "../../commonComponent/CommonFunctions";
import { use } from "react";
import { getData } from "../../app/api";
import { TRANSACTIONS } from "../../app/url";
import TableComponent from "../../commonComponent/TableComponent";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const StudentProfileModal = ({ show, close }) => {
  const data = useSelector((state) => state.students.selectedStudent);
  const [activeTab, setActiveTab] = useState(0);
  const studentInfotabs = [
    { name: "Overview", current: true },
    { name: "Personal Details", current: false },
    { name: "Academic Details", current: false },
    { name: "Fee details", current: false },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <PersonalDetailsTab data={data} />;
      case 2:
        return <AcademicDeatilsTab data={data} />;
      case 3:
        return <FeeDeatailsTab data={data} />;
      default:
        return <OverviewTab data={data} />;
    }
  };

  return (
    <Dialog open={show} onClose={close} className="relative z-50">
      <div className="fixed inset-0" />

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
                        Student Info
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => close()}
                          className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto">
                    <div className="student-big-card-blk">
                      <div className="flex w-full justify-between space-x-6 p-6 col-span-1 rounded-lg bg-white shadow border border-gray-300">
                        {data?.profilePic ? (
                          <img
                            alt=""
                            src={data?.profilePic?.Location}
                            className="size-36 shrink-0 rounded-full bg-gray-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600">
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                              {data?.firstName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 truncate">
                          <div className="flex justify-between space-x-3">
                            <h3 className="truncate text-lg font-medium text-gray-900">
                              {data?.firstName} {data?.lastName}
                            </h3>
                            <div className="right-contact-btns grid grid-cols-2 gap-4">
                              <button
                                type="button"
                                className="rounded bg-white px-2 py-1 text-xs font-semibold text-purple-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                <ChatBubbleBottomCenterTextIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </button>
                              <button
                                type="button"
                                className="rounded bg-white px-2 py-1 text-xs font-semibold text-purple-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                <PhoneIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="student-hdr-info-items-blk mt-2">
                            <dl className="grid grid-flow-col auto-cols-min gap-8">
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Academic year
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {data?.academics.academicYear.year}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Admission No
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {data?.admissionNumber}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Class & Section
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {data?.academics.class.name} /{" "}
                                  {data?.academics.section.section}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Roll No
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  NA
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">DOB</dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {moment(data?.DOB).format("DD-MM-YYYY")}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Gender
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {capitalizeWords(data?.gender)}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Class Teacher
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  NA
                                </dd>
                              </div>
                            </dl>
                          </div>
                          <div className="action-btns-blk mt-4 grid grid-flow-col auto-cols-min gap-4">
                            <button
                              type="button"
                              className="inline-flex items-center rounded gap-x-1.5 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                            >
                              <ArrowLongUpIcon
                                aria-hidden="true"
                                className="size-5"
                              />
                              Promote
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded gap-x-1.5 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                            >
                              <ArrowLeftStartOnRectangleIcon
                                aria-hidden="true"
                                className="size-5"
                              />
                              Exit
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded gap-x-1.5 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                            >
                              <PencilIcon
                                aria-hidden="true"
                                className="size-5"
                              />
                              Edit
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded gap-x-1.5 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                            >
                              <TrashIcon
                                aria-hidden="true"
                                className="size-5"
                              />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-content">
                      <div>
                        <div className="sm:hidden">
                          <label
                            htmlFor="tabsstudentInfotabs"
                            className="sr-only"
                          >
                            Select a tab
                          </label>
                          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                          <select
                            id="studentInfotabs"
                            name="studentInfotabs"
                            defaultValue={
                              studentInfotabs.find((tab) => tab.current).name
                            }
                            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                          >
                            {studentInfotabs.map((tab) => (
                              <option key={tab.name}>{tab.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="hidden sm:block">
                          <div className="border-b border-gray-200">
                            <nav
                              aria-label="Tabs"
                              className="-mb-px flex space-x-8"
                            >
                              {studentInfotabs.map((tab, index) => (
                                <a
                                  key={tab.name}
                                  onClick={() => setActiveTab(index)}
                                  className={classNames(
                                    index === activeTab
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

                      <div className="student-tab-info-blk py-4">
                        {renderTabContent(activeTab)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

const OverviewTab = ({ data }) => {
  const graphdata = [
    { name: "Collected Fee ", value: 16000 },
    { name: "Pending Fee", value: 6000 },
  ];

  const GraphCOLORS = ["#10B981", "#F59E0B"];

  const bargraphdata = [
    {
      name: "Jan 10",
      collection: 90000,
      expenses: 18000,
      salaries: 30000,
    },
    {
      name: "Jan 11",
      collection: 55000,
      expenses: 20000,
      salaries: 18000,
    },
    {
      name: "Jan 12",
      collection: 97000,
      expenses: 20000,
      salaries: 30000,
    },
    {
      name: "Jan 13",
      collection: 87000,
      expenses: 22000,
      salaries: 11000,
    },
    {
      name: "Jan 14",
      collection: 57000,
      expenses: 15000,
      salaries: 1700,
    },
    {
      name: "Jan 15",
      collection: 77000,
      expenses: 13000,
      salaries: 15000,
    },
  ];
  return (
    <ul role="list" className="grid grid-cols-3 gap-x-6 gap-y-8">
      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white">
              <ClipboardDocumentCheckIcon
                aria-hidden="true"
                className="size-5"
              />
            </div>
            <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
              <span>Attendance</span>
              <span className="text-xs text-gray-500">
                Total Days
                <span className="pl-2 font-medium text-gray-900">180</span>
              </span>
            </div>
          </div>
          <a href="#" className="text-gray-400">
            <ArrowUpRightIcon aria-hidden="true" className="size-5" />
          </a>
        </div>

        <div
          className="px-4 py-4 text-sm/6"
          style={{ width: "100%", height: 200 }}
        >
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={graphdata}
                cx={120}
                cy={80}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
                legendType="circle"
                label
              >
                {graphdata.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={GraphCOLORS[index % GraphCOLORS.length]}
                  />
                ))}
                <Label fontSize="18" width={30} position="center">
                  76%
                </Label>
              </Pie>
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </li>
      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white">
              <ClipboardDocumentCheckIcon
                aria-hidden="true"
                className="size-5"
              />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Contact Details
            </div>
          </div>
          <a href="#" className="text-gray-400">
            <ArrowUpRightIcon aria-hidden="true" className="size-5" />
          </a>
        </div>

        <div className="px-6 py-4 text-sm/6">
          <div className="flex justify-between gap-x-4 py-3">
            <dl className="grid gap-4">
              <div className="content-item pb-2 border-b border-gray-300">
                <dt className="text-sm/6 text-gray-500">
                  Father Name & Mobile
                </dt>
                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                  {data?.fatherDetails.name} |{" "}
                  {data?.fatherDetails.mobileNumber}
                </dd>
              </div>
              <div className="content-item pb-2 border-b border-gray-300">
                <dt className="text-sm/6 text-gray-500">
                  Mother Name & Mobile
                </dt>
                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                  {data?.motherDetails.name || "N/A"} |{" "}
                  {data?.motherDetails.mobileNumber || "N/A"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </li>
      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white">
              <ClipboardDocumentCheckIcon
                aria-hidden="true"
                className="size-5"
              />
            </div>
            <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
              <span>Fee Details</span>
              <span className="text-xs text-gray-500">
                Total Fee
                <span className="pl-2 font-medium text-gray-900">18000</span>
              </span>
            </div>
          </div>
          <a href="#" className="text-gray-400">
            <ArrowUpRightIcon aria-hidden="true" className="size-5" />
          </a>
        </div>

        <div className="px-6 py-4 text-sm/6">
          <div
            className="px-4 py-4 text-sm/6"
            style={{ width: "100%", height: 200 }}
          >
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={graphdata}
                  cx={120}
                  cy={80}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                  legendType="circle"
                  label
                >
                  {graphdata.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={GraphCOLORS[index % GraphCOLORS.length]}
                    />
                  ))}
                  <Label fontSize="18" width={30} position="center">
                    80%
                  </Label>
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </li>
      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white">
              <ClipboardDocumentCheckIcon
                aria-hidden="true"
                className="size-5"
              />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Marks Scored
            </div>
          </div>
          <a href="#" className="text-gray-400">
            <ArrowUpRightIcon aria-hidden="true" className="size-5" />
          </a>
        </div>

        <div
          className="px-6 py-4 text-sm/6"
          style={{ width: "100%", height: 200 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={bargraphdata}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
              barSize={10}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="marks"
                fill="#4ade80"
                activeBar={<Rectangle fill="#15803d" stroke="#15803d" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </li>
      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white">
              <ClipboardDocumentCheckIcon
                aria-hidden="true"
                className="size-5"
              />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Transport Details
            </div>
          </div>
          <a href="#" className="text-gray-400">
            <ArrowUpRightIcon aria-hidden="true" className="size-5" />
          </a>
        </div>

        <div className="px-6 py-4 text-sm/6">
          <div className="flex justify-between gap-x-4 py-3">
            <dl className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="content-item pb-2 border-b border-gray-300">
                  <dt className="text-sm/6 text-gray-500">
                    Transport allocated Date
                  </dt>
                  <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                    22-07-2024
                  </dd>
                </div>
                <div className="content-item pb-2 border-b border-gray-300">
                  <dt className="text-sm/6 text-gray-500">Bus Fee</dt>
                  <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                    5000
                  </dd>
                </div>
              </div>
              <div className="content-item pb-2 border-b border-gray-300">
                <dt className="text-sm/6 text-gray-500">Pickup Location</dt>
                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                  Ram Nagar, Street 5
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </li>
      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white">
              <ClipboardDocumentCheckIcon
                aria-hidden="true"
                className="size-5"
              />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Hostel Details
            </div>
          </div>
          <a href="#" className="text-gray-400">
            <ArrowUpRightIcon aria-hidden="true" className="size-5" />
          </a>
        </div>

        <div className="px-6 py-4 text-sm/6">
          <div className="flex justify-between gap-x-4 py-3">
            <dl className="grid gap-4">
              <div className="content-item pb-2 border-b border-gray-300">
                <dt className="text-sm/6 text-gray-500">
                  Hostel allocated Date
                </dt>
                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                  22-07-2024
                </dd>
              </div>
              <div className="content-item pb-2 border-b border-gray-300">
                <dt className="text-sm/6 text-gray-500">
                  Hostel Room & Bed Details
                </dt>
                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                  Hostel 1 \ Room 501 | 2 Bed
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </li>
    </ul>
  );
};

const PersonalDetailsTab = ({ data }) => {
  return (
    <ul role="list" className="grid grid-cols-1 gap-x-4 gap-y-4">
      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
              <UserCircleIcon aria-hidden="true" className="size-5" />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Personal Details
            </div>
          </div>
        </div>

        <div className="px-4 py-4 text-sm/6">
          <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">DOB</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.DOB ? moment(data?.DOB).format("DD-MM-YYYY") : "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Gender</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.gender ? capitalizeWords(data?.gender) : "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Nationality</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.nationality ? capitalizeWords(data?.nationality) : "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Religion</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.religion ? capitalizeWords(data?.religion) : "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Cast</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.cast ? capitalizeWords(data?.cast) : "N/A"}
              </dd>
            </div>

            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Blood Group</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.bloodGroup ? capitalizeWords(data?.bloodGroup) : "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Aadhar Number</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.aadharNumber || "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Aadhar Card</dt>
              <dd className="mt-1 text-base text-purple-500 sm:mt-2 font-medium">
                {data?.aadharPic ? <a href={data?.aadharPic?.Location} target="_blank">View Aadhar</a> : "N/A"}
              </dd>
            </div>
          </dl>
        </div>
      </li>
      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
              <UserCircleIcon aria-hidden="true" className="size-5" />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Father Details
            </div>
          </div>
        </div>

        <div className="px-4 py-4 text-sm/6">
          <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Father Full Name</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.fatherDetails.name || "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Mobile Number</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.fatherDetails.mobileNumber || "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Email</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.fatherDetails.email || "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Occupation</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.fatherDetails.occupation || "N/A"}
              </dd>
            </div>
          </dl>
        </div>
      </li>

      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
              <UserCircleIcon aria-hidden="true" className="size-5" />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Mother Details
            </div>
          </div>
        </div>

        <div className="px-4 py-4 text-sm/6">
          <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Mother Full Name</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.motherDetails.name || "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Mobile Number</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.motherDetails.mobileNumber || "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Email</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.motherDetails.email || "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Occupation</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.motherDetails.occupation || "N/A"}
              </dd>
            </div>
          </dl>
        </div>
      </li>
      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
              <UserCircleIcon aria-hidden="true" className="size-5" />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Present Address Details
            </div>
          </div>
        </div>

        <div className="px-4 py-4 text-sm/6">
          <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Area</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.presentAddress.area}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">City</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.presentAddress.city}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">State</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.presentAddress.state}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Pincode</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.presentAddress.pincode}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">ID Proofs </dt>
              <dd className="mt-1 text-base text-purple-500 sm:mt-2 font-medium">
                {data?.parentIdProof ? <a href={data?.parentIdProof.Location} target="_blank">View ID Proofs </a> : "N/A"}
              </dd>
            </div>
          </dl>
        </div>
      </li>
      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
              <UserCircleIcon aria-hidden="true" className="size-5" />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Permanent Address Details
            </div>
          </div>
        </div>

        <div className="px-4 py-4 text-sm/6">
          <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Area</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.permanentAddress.area}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">City</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.permanentAddress.city}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">State</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.permanentAddress.state}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Pincode</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.permanentAddress.pincode}
              </dd>
            </div>
          </dl>
        </div>
      </li>
    </ul>
  );
};

const AcademicDeatilsTab = ({ data }) => {
  return (
    <ul role="list" className="grid grid-cols-1 gap-x-4 gap-y-4">
      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
              <UserCircleIcon aria-hidden="true" className="size-5" />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Present Academic Details
            </div>
          </div>
        </div>

        <div className="px-4 py-4 text-sm/6">
          <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Academic year</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.academics.academicYear.year}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Date Of Admission</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.admissionDate
                  ? moment(data?.admissionDate).format("DD-MM-YYYY")
                  : "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Admission Number</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.admissionNumber || "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Class & Section</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.academics.class.name}/{data?.academics.section.section}
              </dd>
            </div>
          </dl>
        </div>
      </li>
      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
              <UserCircleIcon aria-hidden="true" className="size-5" />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Exams & Marks
            </div>
          </div>
        </div>

        <div className="px-4 py-4 text-sm/6">
          <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
            <thead className="bg-purple-100">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                >
                  <a href="#" className="group inline-flex">
                    Exam Name
                  </a>
                </th>

                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Exam Date
                  </a>
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Marks Scored
                  </a>
                </th>

                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Grade
                  </a>
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Progress Card
                  </a>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  Unit I
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  22-10-2024 - 24-10-2024
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  88%
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  A
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                  <a href="#">View</a>
                </td>
              </tr>

              <tr>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  Unit I
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  22-10-2024 - 24-10-2024
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  88%
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  A
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                  <a href="#">View</a>
                </td>
              </tr>

              <tr>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  Unit I
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  22-10-2024 - 24-10-2024
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  88%
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  A
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                  <a href="#">View</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </li>

      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
              <UserCircleIcon aria-hidden="true" className="size-5" />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Previous School Details
            </div>
          </div>
        </div>

        <div className="px-4 py-4 text-sm/6">
          <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Year of study</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.previousSchool.yearOfStudy || "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">School Name</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.previousSchool.schoolName || "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Class</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.previousSchool.classStudied || "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">Total Marks Scored</dt>
              <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                {data?.previousSchool.totalMarks || "N/A"}
              </dd>
            </div>
            <div className="content-item pb-2 border-b border-gray-300">
              <dt className="text-sm/6 text-gray-500">TC</dt>
              <dd className="mt-1 text-base text-purple-500 sm:mt-2 font-medium">
                {data?.previousSchool.studyProof ? <a href={data?.previousSchool.studyProof.Location} target="_blank">View TC</a> : "N/A"}
              </dd>
            </div>
          </dl>
        </div>
      </li>
    </ul>
  );
};

const FeeDeatailsTab = ({ data }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [receiptData, setReceiptData] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const rowsPerPage = 10;
  const { branchData } = useSelector((state) => state.appConfig);

  const columns = [
    { title: "Transaction Id", key: "transactionId" },
    { title: "Paid Date", key: "paidDate" },
    { title: "Paid Mode", key: "paidMode" },
    { title: "Fee Types & Paid Amount", key: "feeAmounts" },
    { title: "Total Paid", key: "totalPaid" },
    { title: "Invoice", key: "invoice" },
  ];

  const showInvoice = (feeData) => {
    const formattedFees =
      feeData.fees?.map((feeItem) => ({
        feeName: feeItem.fee.name,
        amount: feeItem.amount,
      })) || [];

    const receiptData = {
      ...feeData,
      name: capitalizeWords(
        data.firstName + " " + data.lastName
      ),
      academicYear: data.academics.academicYear.year,
      admissionNo: data.admissionNumber || "N/A",
      classSection: `${data.academics.class?.name || "N/A"} / ${data.academics.section?.section || "N/A"
        }`,
      fatersName: capitalizeWords(
        data.fatherDetails?.name || "N/A"
      ),
      mothersName: capitalizeWords(
        data.motherDetails?.name || "N/A"
      ),
      branch: branchData,
      fees: formattedFees, // Store fees separately
    };
    setReceiptData(receiptData);
    setIsReceiptOpen(true);
  };

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const generateReceiptPDF = (
    data,
    logoUrl,
    orientation = "portrait",
    save = false
  ) => {
    const defaultLogo = "./schoolLogo.jpg";
    const doc = new jsPDF(orientation, "mm", "a4");
    doc.setFont("helvetica", "bold");

    const centerX = orientation === "landscape" ? 148 : 105;

    // **Header Section**
    doc.addImage(logoUrl || defaultLogo, "PNG", 10, 5, 28, 28);
    doc.setFontSize(14);
    doc.text((data.branch?.label || "School Name").toUpperCase(), centerX, 15, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.text(
      `Phone: ${data.branch?.phoneNumber || "N/A"} | Email: ${data.branch?.email || "N/A"
      }`,
      centerX,
      21,
      { align: "center" }
    );
    doc.text(
      `Address: ${data.branch?.address?.area || "N/A"}, ${data.branch?.address?.city || "N/A"
      }, ${data.branch?.address?.state || "N/A"}, ${data.branch?.address?.pincode || "N/A"
      }`,
      centerX,
      27,
      { align: "center" }
    );
    doc.line(10, 35, orientation === "landscape" ? 290 : 200, 35);

    // **Receipt Title**
    doc.setFontSize(16);
    doc.text("FEE RECEIPT", centerX, 45, { align: "center" });

    // **Student & Fee Details**
    let detailsStartY = 55;
    doc.setFontSize(12);
    doc.text(`Receipt No: ${data?.receiptNo || "N/A"}`, 20, detailsStartY);
    doc.text(
      `Date: ${moment(data?.date || new Date()).format("DD-MM-YYYY")}`,
      140,
      detailsStartY
    );

    doc.text(`Student Name: ${data?.name || "N/A"}`, 20, detailsStartY + 10);
    doc.text(
      `Class & Section: ${data?.classSection || "N/A"}`,
      140,
      detailsStartY + 10
    );
    doc.text(
      `Admission No: ${data?.admissionNo || "N/A"}`,
      20,
      detailsStartY + 20
    );
    doc.text(`Roll No: ${data?.rollNo || "N/A"}`, 140, detailsStartY + 20);

    doc.text(
      `Academic Year: ${data?.academicYear || "N/A"}`,
      20,
      detailsStartY + 30
    );
    doc.text(`Branch: ${data?.branch.label || "N/A"}`, 140, detailsStartY + 30);

    doc.text(
      `Father's Name: ${data?.fatersName || "N/A"}`,
      20,
      detailsStartY + 40
    );
    doc.text(
      `Mother's Name: ${data?.mothersName || "N/A"}`,
      140,
      detailsStartY + 40
    );

    // doc.text(`Amount Paid: ₹${data?.amount || "0"}`, 20, detailsStartY + 50);
    // doc.text(`Total Paid: ₹${data?.amount || "0"}`, 140, detailsStartY + 50);
    // doc.text(`Balance: ₹${data?.balance || "0"}`, 20, detailsStartY + 60);

    // **Fee Breakdown Table**
    const tableStartY = detailsStartY + 50;
    const tableColumns = ["Si.No", "Fee Type", "Amount"];
    const tableData = (data?.fees || []).map((fee, index) => [
      index + 1,
      fee?.feeName || "N/A",
      `${fee?.amount || "0"}`,
    ]);

    autoTable(doc, {
      startY: tableStartY,
      head: [tableColumns],
      body: tableData.length
        ? tableData
        : [[1, "No fee details available", "₹0"]],
      theme: "grid",
      headStyles: { fillColor: [206, 175, 240] },
      styles: { fontSize: 10 },
    });

    // Function to convert amount to words (basic implementation)
    const numberToWords = (num) => {
      const words = require("number-to-words");
      return words.toWords(num).toUpperCase();
    };

    const paidAmount = data?.amount || 0; // Ensure a default value of 0
    const pending = data?.pendingAmount || 0; // Ensure a default value of 0

    // Convert amount to words safely
    const totalPaidAmountInWords = numberToWords(paidAmount) + " ONLY";

    // Calculate pending amount safely
    const pendingAmount = pending - paidAmount;

    // Get the final Y position after the table
    const finalY = doc.lastAutoTable.finalY + 10; // Adding some spacing below table

    // Add Total Paid Amount, Amount in Words, and Pending Balance below the table

    doc.text(`Total Paid Amount: ${paidAmount || "N/A"}`, 20, finalY);
    doc.text(
      `Total Paid Amount In Words: ${totalPaidAmountInWords || "N/A"}`,
      20,
      finalY + 10
    );
    // doc.text(`Pending Amount: ${pendingAmount || "N/A"}`, 20, finalY + 20);

    // **Footer Section**
    const footerY = doc.previousAutoTable.finalY + 40;
    doc.line(10, footerY, orientation === "landscape" ? 290 : 200, footerY);
    doc.setFontSize(10);

    // "Thank you for your payment!"
    doc.text("Thank you for your payment!", centerX, footerY + 10, {
      align: "center",
    });

    // **Accountant, Authorized Signature, Parent Signature in the same row**
    const signatureY = footerY + 30;
    const pageWidth = doc.internal.pageSize.getWidth();
    const sectionWidth = pageWidth / 3; // Divide into 3 equal sections

    doc.text("Accountant Signature", sectionWidth * 0.5, signatureY, {
      align: "center",
    });
    doc.text("Authorized Signature", sectionWidth * 1.5, signatureY, {
      align: "center",
    });
    doc.text("Parent Signature", sectionWidth * 2.5, signatureY, {
      align: "center",
    });

    if (save) {
      doc.save(`Fee_Receipt_${data?.receiptNo || "N/A"}.pdf`);
    } else {
      return URL.createObjectURL(doc.output("blob"));
    }
  };

  const getHistoryData = async (Id) => {
    try {
      let res = await getData(TRANSACTIONS + "/" + Id);
      let list = res.data.map((trans) => ({
        transactionId: trans.transactionId || "N/A",
        paidDate: moment(trans.date).format("DD-MM-YYYY"),
        paidMode: trans.transactionType.toUpperCase(),
        feeAmounts: trans.fees.map((fee, index) => (
          <span>
            {capitalizeWords(fee.fee.name)} : {fee.amount}
            {index + 1 === trans.fees.length ? "." : ", "}
          </span>
        )),
        totalPaid: trans.amount,
        invoice: (
          <button
            onClick={() => showInvoice(trans)}
            className="text-blue-600 hover:underline"
          >
            View
          </button>
        ),
      }));
      setTransactions(list);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  useEffect(() => {
    if (data) getHistoryData(data._id)
  }, [data])
  return (
    <ul role="list" className="grid grid-cols-1 gap-x-4 gap-y-4">
      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
              <UserCircleIcon aria-hidden="true" className="size-5" />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Academic Fee Details
            </div>
          </div>
        </div>

        <div className="px-4 py-4 text-sm/6">
          <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
            <thead className="bg-purple-100">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                >
                  <a href="#" className="group inline-flex">
                    Fee Name
                  </a>
                </th>

                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Duration
                  </a>
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Total Amont
                  </a>
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Discount & Refund
                  </a>
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Paid Amount
                  </a>
                </th>

                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Pending Balance
                  </a>
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Due Date
                  </a>
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                >
                  <a href="#" className="group inline-flex">
                    Status
                  </a>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data?.fees?.feeList.map((item) => {
                let cls =
                  item.paymentStatus.toLowerCase() === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-800";
                return (
                  <tr key={item._id}>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {capitalizeWords(item.fee.name)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {capitalizeWords(item.duration)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {item.fee.amount}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {item.discount}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {item.paidAmount}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {item.pendingAmount}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {moment(item.dueDate).format("DD-MM-YYYY")}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      <span
                        className={
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium " +
                          cls
                        }
                      >
                        {capitalizeWords(item.paymentStatus)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </li>

      <li className="overflow-hidden rounded-xl border border-gray-300">
        <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
          <div className="flex items-center item-title-blk">
            <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
              <UserCircleIcon aria-hidden="true" className="size-5" />
            </div>
            <div className="text-lg pl-4 font-medium text-gray-900">
              Fee History
            </div>
          </div>
        </div>

        <div className="px-4 py-4 text-sm/6">
          <TableComponent
            columns={columns}
            data={paginatedData}
            pagination={{
              currentPage,
              totalCount: transactions.length,
              onPageChange: handlePageChange,
            }}
            checkColumn={false}
          />
        </div>

        <Transition show={isReceiptOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setIsReceiptOpen(false)}
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />

            <div className="fixed inset-0 overflow-hidden flex items-center justify-center">
              <div className="w-screen h-screen flex flex-col bg-white shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center bg-purple-900 p-4 text-white">
                  <h3 className="text-lg font-semibold">Fee Receipt Preview</h3>
                  <button
                    onClick={handleCloseReceipt}
                    className="text-white text-xl"
                  >
                    ✖
                  </button>
                </div>

                {/* PDF Preview */}
                <div className="flex-1 overflow-auto">
                  {receiptData && (
                    <iframe
                      src={generateReceiptPDF(receiptData, "./schoolLogo.jpg")}
                      className="w-full h-full"
                    ></iframe>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between p-4 bg-gray-100">
                  <button
                    onClick={() =>
                      generateReceiptPDF(
                        receiptData,
                        "./schoolLogo.jpg",
                        "portrait",
                        true
                      )
                    }
                    className="px-4 py-2 bg-purple-600 text-white rounded-md"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={handleCloseReceipt}
                    className="px-4 py-2 bg-gray-400 text-white rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition>
      </li>
    </ul>
  );
};

export default StudentProfileModal;
