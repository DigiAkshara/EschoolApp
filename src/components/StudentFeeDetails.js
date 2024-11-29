import React, { useRef, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setFormData } from "../app/reducers/appConfigSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../commonComponent/CustomSelect";


function StudentFeeDetails({ onPrevious, setFormRef }) {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();

  const checkbox = useRef()
  const [checked, setChecked] = useState(false)


  


  // const formik = useFormik({
  //   initialValues: {
  //     feeName: "",
  //     feeCategory: "",
  //     },
  //   validationSchema: Yup.object({     
  //     feeName: Yup.string().required("Fee Name is required"),
  //     feeCategory: Yup.string().required("Fee Category is required"),
     
  //   }),
  //   onSubmit: (values) => {
  //     console.log("Submitting Fee Details:", values);
  //       dispatch(setFormData({ feeDetails: values }));
  //   },
  // });

  return (
    <>
      <form>
                      <div className="">
                      
                        

                        <div className="pb-4 mb-4">
                          <h2 className="text-base/7 font-semibold text-gray-900 mb-2">Fee details</h2>
                            <div className="rounded-md bg-purple-100 p-3 mb-4">
                              <div className="flex">
                                <div className="shrink-0">
                                  <InformationCircleIcon aria-hidden="true" className="size-5 text-purple-400" />
                                </div>
                                <div className="ml-3 flex-1 md:flex md:justify-between">
                                  <p className="text-sm text-blue-700">Academic Fee Details - Class: VI - Sec - A</p>
                                </div>
                              </div>
                            </div>
                          
                          
                                 

                            <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300">
                              <thead className="bg-purple-100">
                                <tr>
                                  <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                                    <input
                                      type="checkbox"
                                      className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                                      ref={checkbox}
                                      checked={checked}
                                      // onChange={toggleAll}
                                    />
                                  </th>
                                  <th scope="col" className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2">
                                    <a href="#" className="group inline-flex">
                                    Fee Name
                                    </a>
                                  </th>
                                
                                  <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48">
                                  <a href="#" className="group inline-flex">
                                    Duration
                                    </a>
                                  </th>
                                  <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48">
                                    <a href="#" className="group inline-flex">
                                    Discount
                                    </a>
                                  </th>
                                  <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48">
                                    <a href="#" className="group inline-flex">
                                    Installment Wise Fee
                                    </a>
                                  </th>
                                  <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48">
                                    <a href="#" className="group inline-flex">
                                    Total Fee
                                    </a>
                                  </th>
                                  
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                  <tr>
                                    <td className="relative px-7 sm:w-12 sm:px-6">

                                      <input
                                        type="checkbox"
                                        className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                                        value=''
                                        checked=''
                                        onChange=''
                                      />
                                    </td>
                                    
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">Admission Fee</td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                    <select
                                      id="location"
                                      name="location"
                                      defaultValue="Canada"
                                      className="block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                    >
                                      <option>One Time</option>
                                      <option>2 Installments</option>
                                      <option>3 Installments</option>
                                    </select>

                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                      
                                    <input
                                      id="email"
                                      name="email"
                                      type="text"
                                      placeholder='Enter'
                                      className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                    />

                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                      
                                    <input
                                      id="email"
                                      name="email"
                                      type="text"
                                      placeholder='Enter'
                                      className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                    />

                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                      
                                    <input
                                      id="email"
                                      name="email"
                                      type="text"
                                      placeholder='Enter'
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                    />

                                    </td>
                                    
                                  </tr>
                                  <tr>
                                    <td className="relative px-7 sm:w-12 sm:px-6">

                                      <input
                                        type="checkbox"
                                        className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                                        value=''
                                        checked=''
                                        onChange=''
                                      />
                                    </td>
                                    
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">Bus Fee</td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                    <select
                                      id="location"
                                      name="location"
                                      defaultValue="Canada"
                                      className="block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                    >
                                      <option>One Time</option>
                                      <option>2 Installments</option>
                                      <option>3 Installments</option>
                                    </select>

                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                      
                                    <input
                                      id="email"
                                      name="email"
                                      type="text"
                                      placeholder='Enter'
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                    />

                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                      
                                    <input
                                      id="email"
                                      name="email"
                                      type="text"
                                      placeholder='Enter'
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                    />

                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                      
                                    <input
                                      id="email"
                                      name="email"
                                      type="text"
                                      placeholder='Enter'
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                    />

                                    </td>
                                    
                                  </tr>
                                  <tr>
                                    <td className="relative px-7 sm:w-12 sm:px-6">

                                   
                                    </td>
                                    
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900">Special Discount</td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 max-w-10">
                                      
                                        <input
                                          id="email"
                                          name="email"
                                          type="text"
                                          placeholder='Enter'
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                        />

                                    </td>
                                  </tr>
                                  <tr className='bg-purple-100'>
                                    <td className="relative px-7 sm:w-12 sm:px-6">

                                   
                                    </td>
                                    
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900">Total Fee</td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 max-w-10">
                                      
                                    500

                                    </td>
                                  </tr>
                              
                                 
                                
                              </tbody>
                            </table>


                                
                            

                          
                        </div>
                       
                       

                      </div>  
                    </form>
    </>
  );
}

export default StudentFeeDetails;
