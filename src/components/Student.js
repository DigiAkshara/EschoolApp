import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/20/solid";
import BasicInfo from "./StudentBasicInfo";
import SchoolDetailsTab from "./StudentAcademicDetails";
import FeeDetailsTab from "./StudentFeeDetails";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "../app/reducers/appConfigSlice";

function Student({ onClose }) {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.appConfig.formData);
  const [formRefs, setFormRefs] = useState({}); // Store form refs

  const [activeStep, setActiveStep] = useState(1);

    
  useEffect(() => {
    // Initialize the form data in Redux store
    dispatch(
      setFormData({
        basicInfo: {},
        prevSchoolDetails: {},
        feeDetails: [],
      })
    );
  }, [dispatch]);

  const steps = [
    {
      id: "1",
      name: "Basic Info",
      status:
        activeStep === 1 ? "current" : activeStep > 1 ? "complete" : "upcoming",
    },
    {
      id: "2",
      name: "Academic Details",
      status:
        activeStep === 2 ? "current" : activeStep > 2 ? "complete" : "upcoming",
    },
    {
      id: "3",
      name: "Fee details",
      status: activeStep === 3 ? "current" : "upcoming",
    },
  ];

  const handleNext = () => {
    const currentForm = formRefs[activeStep];
    if (currentForm && typeof currentForm.submitForm === "function") {
      currentForm.submitForm(); // Trigger the current form's submission
    }
  };

 

  // const [open, setOpen] = useState(false);
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
 
  const renderActiveComponent = () => {
    switch (activeStep) {
      case 1:
        return (
          <BasicInfo
            goNext={() => setActiveStep(2)}
            setFormRef={(ref) => setFormRefs((prev) => ({ ...prev, 1: ref }))}
          />
        );
      case 2:
        return (
          <SchoolDetailsTab
            goNext={() => setActiveStep(3)}
            onPrevious={() => setActiveStep(1)}
            setFormRef={(ref) => setFormRefs((prev) => ({ ...prev, 2: ref }))}
          />
        );
      case 3:
        return (
          <FeeDetailsTab
            onPrevious={() => setActiveStep(2)}
            setFormRef={(ref) => setFormRefs((prev) => ({ ...prev, 3: ref }))}
          />
        );
      default:
        return null;
    }
  };

  
  return (
    <>
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
                        Add Student
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
                    <div className="progress-steps">
                      <nav aria-label="Progress" className="mx-auto max-w-7xl">
                        <ol
                          role="list"
                          className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border lg:border-gray-200"
                        >
                          {steps.map((step, stepIdx) => (
                            <li
                              key={step.id}
                              className="relative overflow-hidden lg:flex-1"
                            >
                              <div
                                className={classNames(
                                  stepIdx === 0
                                    ? "rounded-t-md border-b-0"
                                    : "",
                                  stepIdx === steps.length - 1
                                    ? "rounded-b-md border-t-0"
                                    : "",
                                  "overflow-hidden border border-gray-200 lg:border-0"
                                )}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveStep(parseInt(step.id, 10))
                                  }
                                  className="group w-full"
                                >
                                  {step.status === "complete" ? (
                                    <a href={step.href} className="group">
                                      <span
                                        aria-hidden="true"
                                        className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                      />
                                      <span
                                        className={classNames(
                                          stepIdx !== 0 ? "lg:pl-9" : "",
                                          "flex items-center px-4 py-2 text-sm font-medium"
                                        )}
                                      >
                                        <span className="shrink-0">
                                          <span className="flex size-6 items-center justify-center rounded-full bg-purple-600">
                                            <CheckIcon
                                              aria-hidden="true"
                                              className="size-4 text-white"
                                            />
                                          </span>
                                        </span>
                                        <span className="ml-4 flex min-w-0 flex-col">
                                          <span className="text-sm font-medium">
                                            {step.name}
                                          </span>
                                        </span>
                                      </span>
                                    </a>
                                  ) : step.status === "current" ? (
                                    <a href={step.href} aria-current="step">
                                      <span
                                        aria-hidden="true"
                                        className="absolute left-0 top-0 h-full w-1 bg-purple-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                      />
                                      <span
                                        className={classNames(
                                          stepIdx !== 0 ? "lg:pl-9" : "",
                                          "flex items-center px-4 py-2 text-xs font-medium"
                                        )}
                                      >
                                        <span className="shrink-0">
                                          <span className="flex size-6 items-center justify-center rounded-full border-2 border-purple-600">
                                            <span className="text-purple-600">
                                              {step.id}
                                            </span>
                                          </span>
                                        </span>
                                        <span className="ml-4 flex min-w-0 flex-col">
                                          <span className="text-sm font-medium text-purple-600">
                                            {step.name}
                                          </span>
                                        </span>
                                      </span>
                                    </a>
                                  ) : (
                                    <a href={step.href} className="group">
                                      <span
                                        aria-hidden="true"
                                        className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                      />
                                      <span
                                        className={classNames(
                                          stepIdx !== 0 ? "lg:pl-9" : "",
                                          "flex items-center px-4 py-2 text-xs font-medium"
                                        )}
                                      >
                                        <span className="shrink-0">
                                          <span className="flex size-6 items-center justify-center rounded-full border-2 border-gray-300">
                                            <span className="text-gray-500">
                                              {step.id}
                                            </span>
                                          </span>
                                        </span>
                                        <span className="ml-4 flex min-w-0 flex-col">
                                          <span className="text-sm font-medium text-gray-500">
                                            {step.name}
                                          </span>
                                        </span>
                                      </span>
                                    </a>
                                  )}

                                  {stepIdx !== 0 ? (
                                    <>
                                      {/* Separator */}
                                      <div
                                        aria-hidden="true"
                                        className="absolute inset-0 left-0 top-0 hidden w-3 lg:block"
                                      >
                                        <svg
                                          fill="none"
                                          viewBox="0 0 12 82"
                                          preserveAspectRatio="none"
                                          className="size-full text-gray-300"
                                        >
                                          <path
                                            d="M0.5 0V31L10.5 41L0.5 51V82"
                                            stroke="currentcolor"
                                            vectorEffect="non-scaling-stroke"
                                          />
                                        </svg>
                                      </div>
                                    </>
                                  ) : null}
                                </button>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </nav>
                    </div>

                    {/* <div className='form-content mt-4'> <StudentAcademicDetails/></div> */}

                    <div className="form-content mt-4">
                      {renderActiveComponent()}
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
                    {activeStep !== 1 && (
                      <button
                        type="button"
                        onClick={() => setActiveStep(activeStep - 1)}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                        disabled={activeStep === 1}
                      >
                        Back
                      </button>
                    )}
                    {/* {activeStep === 3 ? (
                      <button
                        type="submit"
                        onClick={() => {
                          alert("Save clicked!"); // Replace this with your actual save logic
                        }}
                        className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                    
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        type="submit"
                        onClick={handleNext}
                        className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                        disabled={activeStep === steps.length}
                      >
                        Next
                      </button>
                    )} */}
                    <button
                  type="submit"
                  onClick={handleNext}
                  className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  {activeStep === 3 ? "Submit" : "Next"}
                </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </>
  );
}

export default Student;
