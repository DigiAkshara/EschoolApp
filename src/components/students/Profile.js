import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Legend
} from "@headlessui/react";
import {
  ArrowLongUpIcon,
  ArrowUpRightIcon,
  ChatBubbleBottomCenterTextIcon,
  ClipboardDocumentCheckIcon,
  PhoneIcon,
  TrashIcon,
  UserCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { useEffect, useState } from "react";
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
import { deleteData, getData } from "../../app/api";
import { MARKS, STUDENT, TRANSACTIONS } from "../../app/url";
import {
  capitalizeWords,
  getGradeFromMarks,
  handleApiResponse,
  hasPermission,
} from "../../commonComponent/CommonFunctions";
import TableComponent from "../../commonComponent/TableComponent";
import PromoteModal from "./PromoteModal";
import DeleteModal from "./DeleteModal";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const StudentProfileModal = ({ show, onClose }) => {
  const data = useSelector((state) => state.students.selectedStudent);
  const [showPromteModal, setShowPromteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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



  const handleClose = ({ refresh = false }) => {
    setShowPromteModal(false)
    setShowDeleteModal(false)
    onClose({ refresh })
  }

  return (
    <>
      <Dialog open={show} onClose={onClose} className="relative z-50">
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
                                    {data?.rollNumber || 'N/A'}
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
                            {data?.academics?.status === "active" && (
                              <div className="action-btns-blk mt-4 grid grid-flow-col auto-cols-min gap-4">
                                <button
                                  onClick={() => setShowPromteModal(true)}
                                  disabled={hasPermission('student_details', 'edit', { isSubmenu: true, parentMenu: 'students' })}
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
                                  onClick={() => setShowDeleteModal(true)}
                                  disabled={hasPermission('student_details', 'delete', { isSubmenu: true, parentMenu: 'students' })}
                                  type="button"
                                  className="inline-flex items-center rounded gap-x-1.5 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                                >
                                  <TrashIcon
                                    aria-hidden="true"
                                    className="size-5"
                                  />
                                  Delete
                                </button>
                              </div>)}
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
      <Dialog open={showPromteModal} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0" />
        <PromoteModal students={[data?._id]} onClose={handleClose} />
      </Dialog>

      <Dialog open={showDeleteModal} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0" />
        <DeleteModal students={[data?._id]} onClose={handleClose} />
      </Dialog>
    </>
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
                {data?.aadharPic ? (
                  <a href={data?.aadharPic?.Location} target="_blank">
                    View Aadhar
                  </a>
                ) : (
                  "N/A"
                )}
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
                {data?.parentIdProof ? (
                  <a href={data?.parentIdProof.Location} target="_blank">
                    View ID Proofs{" "}
                  </a>
                ) : (
                  "N/A"
                )}
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
  const { branchData } = useSelector((state) => state.appConfig)
  const subjectOptions = useSelector((state) => state.students.subjects)
  const [exams, setExams] = useState([])

  const getResult = (marks, timeTable) => {
    let isPassed = true
    marks.forEach((item) => {
      let passMark = timeTable.find(
        (subject) => subject.subject === item.subject
      )?.passMark;
      if (item.marks < passMark * 1) {
        isPassed = false;
      }
    })
    return isPassed ? 'Pass' : 'Fail'
  }
  const getMarks = async () => {
    try {
      let res = await getData(MARKS + '/' + data._id)
      let dumpList = []
      res.data.data.forEach((exam) => {
        const obtainedMarks = exam.marksDetails[0].marks.reduce((acc, item) => acc + item.marks, 0)
        const totalMarks = exam?.exam.timeTable.reduce(
          (acc, item) => acc + item.totalMark * 1,
          0
        )
        dumpList.push({
          examName: exam.exam.name,
          examDate: `${moment(exam.exam.startDate).format("DD-MM-YYYY")} - ${moment(exam.exam.endDate).format("DD-MM-YYYY")}`,
          percentage: Math.round((obtainedMarks / totalMarks) * 100),
          grade: getGradeFromMarks(obtainedMarks, totalMarks),
          marksObtained: obtainedMarks,
          maxMarks: totalMarks,
          result: getResult(exam.marksDetails[0].marks, exam?.exam.timeTable),
          marks: exam.marksDetails[0].marks,
          timeTable: exam?.exam.timeTable,
        })
      })
      setExams(dumpList)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const getSubjectName = (subjectId) => {
    return subjectOptions
      .find((subject) => subject.value === subjectId)
      ?.label.toUpperCase();
  };

  const generatePDFPreview = async (index) => {
    const exam = exams[index]
    const doc = new jsPDF("p", "mm", "a4");
    // const pdfPromises = exams.map(async (student, index) => {
    const container = document.createElement("div");
    container.style.width = "800px"; // Set a fixed width for consistent rendering
    container.style.position = "absolute"; // Keep it offscreen
    container.style.left = "-9999px"; // Prevent flickering
    container.style.top = "-9999px"; // Keep it out of view
    //container.style.visibility = "hidden"; // Hide it from the user
    container.innerHTML = `
      <div style="padding: 30px; font-family: Arial, sans-serif;">
        <!-- Header Section -->
        <div style="display: flex; justify-content: center; align-items: center; ">
          <!-- School Emblem Div (left side) -->
          <div style="flex: 0 0 auto; text-align: center; position: absolute; left: 30px; width: 120px; height: 120px;">
            <img src="${branchData?.logo?.Location || '/schoolLogo.jpg'}"  alt="School Emblem" 
              style="width: 100%; height: 100%; object-fit: contain; max-width: 110px; max-height: 110px;">
          </div>
          <!-- School Information Div (centered) -->
          <div style="text-align: center;  padding-bottom: 20px; width: 100%; max-width: 600px;">
            <h1 style="text-align: center; margin: 0; font-weight: bold; font-size: 20px; color: rgb(116, 38, 199);">${branchData?.label?.toUpperCase()}</h1>
            <p style="margin: 0; font-weight: bold; font-size: 13px; color: rgb(116, 38, 199);">Ph: ${branchData?.mobileNumber || "NILL"} | Email: ${branchData?.email || "NILL"}</p>
            <p style="margin: 0; font-weight: bold;font-size: 13px; color: rgb(116, 38, 199); ">Address: ${branchData?.address?.area || ""}, ${branchData?.address?.city || ""}, ${branchData?.address?.state || ""}, ${branchData?.address?.pincode || ""}</p>
          </div>
        </div>
        <div style="border-bottom: 1px solid black; width: 100%; margin-top: 10px;"></div>

        <div>
        <h2 style="text-align: center;font-weight: bold; ">Result Card</h2>
        </div>
        <div style="display: flex; margin-top: 10px;">
          <!-- Left Section (Student details) -->
          <div style="flex: 1; padding-right: 10px;">
            <p><strong>Name of Student:</strong> ${data.firstName || ""} ${data.lastName || ""}</p>
            <p><strong>Mother's Name:</strong> ${data.motherDetails.name || "Nill"}</p>
            <p><strong>Father's Name:</strong> ${data.fatherDetails.name || "Nill"}</p>
            <p><strong>Address:</strong> ${data?.presentAddress?.area
      }, ${data?.presentAddress?.city}, ${data?.presentAddress?.state}, ${data?.presentAddress?.pincode
      }</p>
          </div>

          <!-- Right Section (5 details) -->
          <div style="flex: 1; padding-left: 10px;">
            <p><strong>Roll No:</strong> ${data.rollNumber || ""}</p>
            <p><strong>Admission Number:</strong> ${data.admissionNumber || ""}</p>
            <p><strong>Date of Birth:</strong> ${data.dob ? moment(data.dob).format('DD-MM-YYYY') : ""}</p>
            <p><strong>Exam:</strong> ${exam.examName || ""}</p>
            <p><strong>Academic Year:</strong> ${data?.academics?.academicYear?.year || ""}</p>
          </div>
          <div style="flex: 1; text-align: center;  display: flex; justify-content: center; align-items: center; ">
            <img src="${data?.profilePic?.Location || "/default-profile.png"}"  alt="School Emblem" 
              style="width: 100%; height: 100%; object-fit: contain; max-width: 110px; max-height: 110px;">
          </div>
        </div>

        <!-- Exam Results Table -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; font-family: Arial, sans-serif; color: #333;">
          <thead>
            <tr style="background:rgb(206, 175, 240); color: black; text-align: center; font-weight: bold;">
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Subject</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Marks Obtained</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Total Marks</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Pass Mark</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-transform: uppercase;">Grade</th>
            </tr>
          </thead>
          <tbody>
            ${exam.timeTable
        .map((subject, i) => {
          const marksObtained = exam.marks.find((mark) => mark.subject === subject.subject)?.marks || 0;
          return `
                  <tr style="background: ${i % 2 === 0 ? "#f9f9f9" : "#fff"}; text-align: center; border-bottom: 1px solid #ddd;">
                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${getSubjectName(subject.subject)}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${marksObtained}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${subject.totalMark}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${subject.passMark}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px; color: #555;">${getGradeFromMarks(marksObtained, subject.totalMark)}</td>
                  </tr>
                `;
        })
        .join("")}
            <tr style="background:rgb(232, 215, 250); font-weight: bold; text-align: center;">
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total Marks: ${exam.marksObtained} / ${exam.maxMarks}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Total Percentage: ${exam.percentage}%</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Overall Grade: ${getGradeFromMarks(exam.marksObtained, exam.maxMarks)}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Result: ${exam.result}</td>
            </tr>
          </tbody>
        </table>
  
        <div style="margin-top: 40px; text-align: center;">
          <p>Sign of Class Teacher &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; Sign of Principal &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; Sign of Manager</p>
          <hr style="margin-top: 10px; border: 1px solid #ccc; width: 100%;">
        </div>
      </div>`;
    // Append to body (hidden) for rendering
    document.body.appendChild(container);

    // Convert the HTML element to a canvas using html2canvas
    const canvas = await html2canvas(container, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    // Calculate PDF dimensions based on canvas size
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Add image to PDF
    doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);


    // });

    // Wait for all PDFs to be generated (in the same document)
    // await Promise.all(pdfPromises);

    window.open(URL.createObjectURL(doc.output("blob")), "_blank");
  };

  useEffect(() => {
    getMarks()
  }, [])
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
                {data?.academics?.academicYear?.year}
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
              {exams.map((item, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    {item.examName}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    {item.examDate}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    {item.percentage}%
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    {item.grade}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                    <a href="#" onClick={() => generatePDFPreview(index)}>View</a>
                  </td>
                </tr>
              ))}
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
                {data?.previousSchool?.yearOfStudy || "N/A"}
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
                {data?.previousSchool.studyProof ? (
                  <a
                    href={data?.previousSchool.studyProof.Location}
                    target="_blank"
                  >
                    View TC
                  </a>
                ) : (
                  "N/A"
                )}
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
  const [feeList, setFeeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const { branchData } = useSelector((state) => state.appConfig);

  const feeColumns = [
    { title: "Fee Name", key: "feeName" },
    { title: "Duration", key: "duration" },
    { title: "Total Amount", key: "totalAmount" },
    { title: "Discount & Refund", key: "discount" },
    { title: "Paid Amount", key: "paidAmount" },
    { title: "Pending Balance", key: "pendingAmount" },
    { title: "Due Date", key: "dueDate" },
    { title: "status", key: "status" },
  ];

  const columns = [
    { title: "Transaction Id", key: "transactionId" },
    { title: "Paid Date", key: "paidDate" },
    { title: "Paid Mode", key: "paidMode" },
    { title: "Fee Types & Paid Amount", key: "feeAmounts" },
    { title: "Total Paid", key: "totalPaid" },
    { title: "Invoice", key: "invoice" },
  ];

  const showInvoice = (feeData) => {
    let paidAmount = 0;
    const formattedFees =
      feeData.transaction.fees?.map((feeItem) => {
        if (feeItem.fee.feeGroup.name.toLowerCase() !== "miscellaneous fees")
          paidAmount += feeItem.amount;
        return {
          feeName: feeItem.fee.name,
          amount:
            feeItem.fee.feeGroup.name.toLowerCase() !== "miscellaneous fees"
              ? feeItem.amount
              : "Paid",
        };
      }) || [];
    let receiptLabel = branchData.label;
    if (feeData.transaction.receiptLabel) {
      receiptLabel = feeData.transaction.receiptLabel.name;
    }
    const receiptData = {
      ...feeData,
      ...feeData.transaction,
      name: capitalizeWords(data.firstName + " " + data.lastName),
      academicYear: data.academics.academicYear.year,
      admissionNo: data.admissionNumber || "N/A",
      classSection: `${data.academics.class?.name || "N/A"} / ${data.academics.section?.section || "N/A"
        }`,
      fatersName: capitalizeWords(data.fatherDetails?.name || "N/A"),
      mothersName: capitalizeWords(data.motherDetails?.name || "N/A"),
      branch: branchData,
      fees: formattedFees, // Store fees separately
      receiptLabel,
      paidAmount,
    };
    generateReceiptPDF(receiptData, "./schoolLogo.jpg")
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
    doc.text((data?.receiptLabel || "School Name").toUpperCase(), centerX, 15, {
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
    doc.text(`Roll No: ${data?.rollNumber || "N/A"}`, 140, detailsStartY + 20);

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

    const paidAmount = data?.paidAmount || 0; // Ensure a default value of 0
    const pending = data?.pendingAmount || 0; // Ensure a default value of 0

    // Convert amount to words safely
    const totalPaidAmountInWords = numberToWords(paidAmount) + " ONLY";

    // Calculate pending amount safely
    const pendingAmount = pending - paidAmount;

    // Get the final Y position after the table
    const finalY = doc.lastAutoTable.finalY + 10; // Adding some spacing below table

    // Add Total Paid Amount, Amount in Words, and Pending Balance below the table
    if (paidAmount > 0) {
      doc.text(`Total Paid Amount: ${paidAmount || "N/A"}`, 20, finalY);
      doc.text(
        `Total Paid Amount In Words: ${totalPaidAmountInWords || "N/A"}`,
        20,
        finalY + 10
      );
      // doc.text(`Pending Amount: ${pendingAmount || "N/A"}`, 20, finalY + 20);
    }
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
      window.open(URL.createObjectURL(doc.output("blob")), "_blank");
      // return URL.createObjectURL(doc.output("blob"));
    }
  };

  const getHistoryData = async (Id) => {
    try {
      let res = await getData(TRANSACTIONS + "/" + Id);
      let list = res.data.map((trans) => ({
        transactionId: trans.transaction.transactionNo || "N/A",
        paidDate: moment(trans.date).format("DD-MM-YYYY"),
        paidMode: trans.transaction.transactionType.toUpperCase(),
        feeAmounts: trans.transaction.fees.map((fee, index) => (
          <span>
            {capitalizeWords(fee.fee.name)} : {fee.amount}
            {index + 1 === trans.transaction.fees.length ? "." : ", "}
          </span>
        )),
        totalPaid: trans.transaction.amount,
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

  const formatData = async (data) => {
    try {
      let dummyList = data?.fees?.feeList.map((item) => {
        let cls =
          item.paymentStatus.toLowerCase() === "paid"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-800";
        return {
          _id: item._id,
          feeName: capitalizeWords(item.fee.name) || "N/A",
          duration: capitalizeWords(item.duration) || "N/A",
          totalAmount: item.fee.amount * 1 || item.paybalAmount * 1 || 0,
          discount: item.discount * 1 || 0,
          paidAmount: item.paidAmount,
          pendingAmount: item.pendingAmount,
          dueDate: moment(item.dueDate).format("DD-MM-YYYY") || "N/A",
          status: (
            <span
              className={
                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium " +
                cls
              }
            >
              {capitalizeWords(item.paymentStatus)}
            </span>
          ),
        };
      });
      setFeeList(dummyList || []);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  useEffect(() => {
    if (data) {
      getHistoryData(data._id);
      formatData(data);
    }
  }, [data]);
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
          <TableComponent
            columns={feeColumns}
            data={feeList}
            pagination={{
              currentPage,
              totalCount: 0,
            }}
            checkColumn={false}
          />
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

      </li>
    </ul>
  );
};

export default StudentProfileModal;
