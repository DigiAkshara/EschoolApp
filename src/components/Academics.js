"use client";

import { useRef, useState } from "react";

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Class from "./Class";
import ManageCertificates from "./ManageCertificates";
import ManageDailyTimeTable from "./ManageDailyTimeTable";
import ManageExams from "./ManageExams";



const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tabs = ["Daily Time table", "Classes", "Exams", "Certificates"];



export default function Academics() {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const notificationMethods = [
    { id: "All", title: "All" },
    { id: "Old Students", title: "Old Students" },
    { id: "New Students", title: "New Students" },
  ];

  const [value, setValue] = useState({});

  // useLayoutEffect(() => {
  //   const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < people.length
  //   setChecked(selectedPeople.length === people.length)
  //   setIndeterminate(isIndeterminate)
  //   checkbox.current.indeterminate = isIndeterminate
  // }, [selectedPeople])

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : people);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const [animal, setAnimal] = useState(null);

  const handleChange = (value) => {
    console.log("value:", value);
    setAnimal(value);
  };
  const handleClose = () => setOpen(false);

  // const handleTabClick = (path) => {
  //   navigate(path);
  // };

  const handleTabChange = (event) => {
    const selectedTab = tabs.find((tab) => tab.name === event.target.value);
    if (selectedTab) {
      navigate(selectedTab.path);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Daily Time table":
        return <ManageDailyTimeTable />;
      case "Classes":
        return <Class />;
      case "Exams":
        return <ManageExams />;
      case "Certificates":
        return <ManageCertificates />;
      default:
        return <h2>No Content Available</h2>;
    }
  };

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
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
          >
            {tabs.map((tab) => (
              <option key={tab} value={tab}>
                {tab}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav aria-label="Tabs" className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={classNames(
                    activeTab === tab
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {renderTabContent()}
    </div>
  );
}
