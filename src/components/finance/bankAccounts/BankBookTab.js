"use client";
import {
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  PlusIcon
} from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  DocumentCurrencyRupeeIcon,
  EllipsisVerticalIcon,
  EnvelopeOpenIcon,
  FunnelIcon,
  UsersIcon
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import BankCreation from "./BankCreation";

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

const stats = [
  {
    id: 1,
    name: "Fee Collection",
    stat: "71,897",
    icon: DocumentCurrencyRupeeIcon,
    change: "122",
    changeType: "increase",
  },
  {
    id: 2,
    name: "Expenses",
    stat: "2400",
    icon: EnvelopeOpenIcon,
    change: "5.4%",
    changeType: "increase",
  },
  {
    id: 3,
    name: "Staff Salaries",
    stat: "18000",
    icon: UsersIcon,
    change: "3.2%",
    changeType: "decrease",
  },
  {
    id: 4,
    name: "Total Income",
    stat: "60000",
    icon: DocumentCurrencyRupeeIcon,
    change: "3.2%",
    changeType: "decrease",
  },
  {
    id: 5,
    name: "Fee Collection",
    stat: "71,897",
    icon: DocumentCurrencyRupeeIcon,
    change: "122",
    changeType: "increase",
  },
  {
    id: 6,
    name: "Total Cash Received",
    stat: "2400",
    icon: EnvelopeOpenIcon,
    change: "5.4%",
    changeType: "increase",
  },
  {
    id: 7,
    name: "Expenses",
    stat: "18000",
    icon: UsersIcon,
    change: "3.2%",
    changeType: "decrease",
  },
  {
    id: 8,
    name: "Closing Balance ",
    stat: "60000",
    icon: DocumentCurrencyRupeeIcon,
    change: "3.2%",
    changeType: "decrease",
  },
];

export default function BankBookTab() {
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [showAddBank, setShowAddBank] = useState(false);

  const handleClose = () => setShowAddBank(false);

  return (
    <>
      <div className="mt-4 flex justify-between">
        {/* active tab with count block */}
        <div className="sm:hidden"></div>
        <div className="hidden sm:block"></div>

        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            onClick={() => setShowAddBank(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Bank
          </button>
        </div>
      </div>
      {/* Finaance overview cards */}
      <div className="f-overview-cards">
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.id}
              className="relative rounded-lg bg-white px-4 pb-4 pt-4 shadow ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <div className="absolute right-4 top-4">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                      <span className="sr-only">Open options</span>
                      <EllipsisVerticalIcon
                        aria-hidden="true"
                        className="size-5"
                      />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <div className="py-1">
                      <Menu.Item>
                        {({ close }) => (
                          <button
                            onClick={close}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ close }) => (
                          <button
                            onClick={close}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
              <dt>
                <div className="absolute rounded-md bg-green-50">
                  <img src="/icici.png" className="h-12 w-12 object-contain" />
                </div>

                <p className="ml-16 truncate text-sm font-medium text-400">
                  Balance: 3000/-
                </p>
                <p className="ml-16 truncate text-sm font-medium text-400">
                  A/C No: 0123456789
                </p>
                <p className="ml-16 truncate text-sm font-medium text-gray-400">
                  Savings Acount
                </p>
              </dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="-mx-2 -my-2 mt-0 overflow-x-auto sm:-mx-6">
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
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
                          className="max-h-[430px] overflow-y-auto absolute right-0 z-10 mt-2 px-4 py-4 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
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
                                  Class Category
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
                              <div className="">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Class Teacher
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="All"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                  >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
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
                                  Board
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
                                  // onClick={() => setOpen(false)}
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
                      <th
                        scope="col"
                        className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                      >
                        <a href="#" className="group inline-flex">
                          Date
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
                          Bank Account
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
                          Particulars
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
                          Category
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
                          Debit
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
                          Credit
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
                          Closing Balance
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        </a>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white z-1">
                    <tr className="border-t border-gray-200">
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                        {" "}
                        KINDERGARTEN
                      </th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                        {" "}
                        KINDERGARTEN
                      </th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                        {" "}
                        KINDERGARTEN
                      </th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                        {" "}
                        KINDERGARTEN
                      </th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                        {" "}
                        KINDERGARTEN
                      </th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                        {" "}
                        KINDERGARTEN
                      </th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                        {" "}
                        KINDERGARTEN
                      </th>
                    </tr>

                    {people.map((person) => (
                      <tr
                        key={person.email}
                        className={
                          selectedPeople.includes(person)
                            ? "bg-gray-50"
                            : undefined
                        }
                      >
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          CBSE
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          CBSE
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          Nursery
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          A
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          30
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          Janet Baker
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                          <a href="#">View</a>
                        </td>
                      </tr>
                    ))}
                    {people.map((person) => (
                      <tr
                        key={person.email}
                        className={
                          selectedPeople.includes(person)
                            ? "bg-gray-50"
                            : undefined
                        }
                      >
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          CBSE
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          CBSE
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          LKG
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          A
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          30
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          Janet Baker
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                          <a href="#">View</a>
                        </td>
                      </tr>
                    ))}
                    {people.map((person) => (
                      <tr
                        key={person.email}
                        className={
                          selectedPeople.includes(person)
                            ? "bg-gray-50"
                            : undefined
                        }
                      >
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          CBSE
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          CBSE
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          UKG
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          A
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          30
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          Janet Baker
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                          <a href="#">View</a>
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
      <Dialog
        open={showAddBank}
        onClose={handleClose}
        className="relative z-50"
      >
        <div className="fixed inset-0" />
        <BankCreation onClose={handleClose} />
      </Dialog>
    </>
  );
}
