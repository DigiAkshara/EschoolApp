import {
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  ArrowUpTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  ChatBubbleBottomCenterTextIcon,
  FunnelIcon,
  PhoneIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import FinanceCollectFees from "./FinanceCollectFees";
import { getData } from "../app/api";
import { STUDENT, STUDENTFEE } from "../app/url";
import { useDispatch } from "react-redux";
import { setStuFees } from "../app/reducers/stuFeesSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tabs2 = [
  { name: "Unpaid", href: "#", count: "122", current: true },
  { name: "Overdue", href: "#", count: "4", current: false },
  { name: "Paid ", href: "#", count: "4", current: true },
  { name: "All", href: "#", count: "4", current: true },
];

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

function refer() {
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [studentFees, setStudentFee] = useState([])
  const [groupedFees, setGroupedFees] = useState({});
  const [open, setOpen] = useState(false);
  const [openN, setOpenN] = useState(false);

  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const dispatch = useDispatch(); 

  useEffect(() => {
    getStudentData();
  }, []);

  const getStudentData = async () => {
    try {
      const response = await getData(STUDENTFEE);
      console.log("Student fee data:", response.data);
      const feedata  = response.data.data; // Access the correct array property

      const stuFees = [];

      feedata.forEach(fee => {
        // Find the index of the student in the `stuFees` array
        let index = stuFees.findIndex(f => f.studentId.toString() === fee.student._id.toString());
      
        if (index !== -1) {
          // If the student already exists in `stuFees`, add the fee details
          stuFees[index].fees.push({
           feeInstallment: fee.feeInstallment,
              feeName: fee.fees.name,
              feeId: fee.fees._id,
              academicYear : fee.fees.academicYear,
              amount: fee.amount,
              disCount:fee.amount-fee.instalmentAmount,
              dueDate: fee.dueDate,
              instalmentAmount: fee.instalmentAmount,
              paymentStatus: fee.paymentStatus,
              status: fee.paymentStatus,
              paidAmount: fee.paidAmount,
              pendingAmount: fee.paymentStatus === 'paid' ? 0 : fee.instalmentAmount
          });
      
          // Update the total amounts based on the payment status
          if (fee.paymentStatus === 'paid') {
            stuFees[index].fees[stuFees[index].fees.length - 1].paidAmount = fee.amount;
          } else {
            stuFees[index].fees[stuFees[index].fees.length - 1].pendingAmount = fee.amount;
          }
      
        } else {
          // If the student doesn't exist in `stuFees`, add a new student object
          stuFees.push({
            studentId: fee.student._id,
            name: `${fee.student.firstName} ${fee.student.lastName}`,
            admissionNo : fee.student.admissionNumber,
            phoneNo: fee.student.fatherDetails.mobileNumber,
            fatherName : fee.student.fatherDetails.name,           
            gender: fee.student.gender,
            dob: new Date(fee.student.DOB).toLocaleDateString('en-CA'),
            fees: [{
              feeInstallment: fee.feeInstallment,
              feeName: fee.fees.name,
              feeId: fee.fees._id,
              academicYear : fee.fees.academicYear,
              amount: fee.amount,
              disCount:fee.fees?.disCount||'N/A',
              dueDate: fee.dueDate,
              instalmentAmount: fee.instalmentAmount,
              paymentStatus: fee.paymentStatus,
              status: fee.paymentStatus,
              paidAmount: fee.paidAmount,
              pendingAmount: fee.instalmentAmount-fee.paidAmount
            }]
          });
        }
      });
      
      // Now you can display the `stuFees` array which will contain each student with their associated fees
      console.log("stuFees:",stuFees);
      setStudentFee(stuFees)
      
      
    } catch (error) {
      console.error("Error fetching student fee data:", error);
    }
  };

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : people);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const handleOpen = (studentFee) => {
    setOpenN(true);
    dispatch(setStuFees(studentFee));
  }
  const handleClose = () => setOpenN(false);

  return (
    <>

      <div className="-mx-2 -my-2 mt-0 overflow-x-auto sm:-mx-6">
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
          
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <div className="relative table-tool-bar z-30">
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-4">
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative rounded-md  inline-block  ">
                      
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

              <div className="table-container-main overflow-y-auto max-h-[56vh]">
  {/* Table View */}
  <table className="table-auto min-w-full divide-y divide-gray-300">
    <thead className="sticky top-0 bg-purple-100 z-20">
      <tr>
        <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
          <input
            type="checkbox"
            className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
            ref={checkbox}
            checked={checked}
            onChange={toggleAll}
          />
        </th>
        <th
          scope="col"
          className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
        >
          <a href="#" className="group inline-flex">
            Student Name
            <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
              <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
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
              <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
            </span>
          </a>
        </th>
        <th
          scope="col"
          className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
        >
          <a href="#" className="group inline-flex">
            Total Fee
            <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
              <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
            </span>
          </a>
        </th>
       
       
          </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 bg-white z-1">
     
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
          </div>
        </div>
       
      </div>
    </>
  );
}

export default Refer;
