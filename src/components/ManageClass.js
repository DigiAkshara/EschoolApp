import React, { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Select from "react-tailwindcss-select";
import { PlusIcon } from "@heroicons/react/20/solid";
import ManageClassTimetable from "./ManageClassTimetable";
import ManageClassSyllabus from "./ManageClassSyllabus";
import CustomSelect from "../commonComponent/CustomSelect";

function ManageClass({ onClose }) {
  const [animal, setAnimal] = useState(null);

  const subjects = [
    { value: "English", label: "English" },
    { value: "Telugu", label: "Telugu" },
    { value: "Social", label: "Social" },
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
              className="pointer-events-auto w-screen max-w-7xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="bg-purple-900 px-3 py-3 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className=" text-base font-semibold text-white">
                        Add Class
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
                      <form>
                        <div className="">
                          <div className="border-b border-gray-900/10 pb-4 mb-4">
                            <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                              Add New Class
                            </h2>
                            <div className=" grid grid-cols-5 gap-x-4 gap-y-4">
                              <div className="sm:col-span-1">
                                <CustomSelect
                                  id="board"
                                  name="board"
                                  label="Board"
                                  options={[
                                    { value: "cbse", label: "CBSE" },
                                    { value: "state", label: "State" },
                                    { value: "icse", label: "ICSE" },
                                  ]}
                                  required={true}
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomSelect
                                  id="classCategory"
                                  name="classCategory"
                                  label="Class Category"
                                  options={[
                                    { value: 'KINDERGARTEN', label: 'KINDERGARTEN' },
                                    { value: 'Primary', label: 'Primary – Classes 1 to 5' },
                                    { value: 'LowerSecondary', label: 'Lower Secondary – Classes 6 to 8' },
                                    { value: 'Secondary', label: 'Secondary – Classes 9 & 10' },
                                  ]}
                                  required={true}
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomSelect
                                  id="class"
                                  name="class"
                                  label="Class "
                                  options={[
                                    { value: 'Nursery', label: 'Nursery' },
                                    { value: 'UKG', label: 'UKG' },
                                    { value: 'LKG', label: 'LKG' },
                                  ]}
                                  required={true}
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomSelect
                                  id="section"
                                  name="section"
                                  label="Section "
                                  options={[
                                    { value: 'A', label: 'A' },
                                    { value: 'B', label: 'B' },
                                    { value: 'C', label: 'C' },
                                  ]}
                                  required={true}
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomSelect
                                  id="classTeacher"
                                  name="classTeacher"
                                  label="Class Teacher "
                                  options={[
                                    { value: 'Rama Krishna', label: 'Rama Krishna' },
                                    { value: 'Radha Devi', label: 'Radha Devi' },
                                    { value: 'Sita Ram', label: 'Sita Ram' },
                                  ]}
                                  required={true}
                                />
                              </div>

                                                                                
                              
                              
                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Subjects
                                  <span className="pl-1 text-red-500">*</span>
                                </label>
                                <div className="mt-2">
                                  <Select
                                    primaryColor={"purple"}
                                    placeholder=" Select Subjects"
                                    value={animal}
                                    onChange={handleChange}
                                    options={subjects}
                                    isMultiple={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pb-4 mb-4">
                            <ManageClassTimetable />
                          </div>

                          <div className="pb-4 mb-4">
                            <ManageClassSyllabus />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 px-4 py-4 bg-gray-100 w-full justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageClass;
