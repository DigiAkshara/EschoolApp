import React from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'


function ManageClassSyllabus() {
  return (
    <>
    <h2 className="text-base/7 font-semibold text-gray-900 mb-2">Syllabus</h2>
                            
                            <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300">
                              <thead className="bg-purple-100">
                                <tr>
                                  
                                  <th scope="col" className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2 w-12">
                                    <a href="#" className="group inline-flex">
                                    S. No
                                    </a>
                                  </th>
                                
                                  <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48">
                                  <a href="#" className="group inline-flex">
                                  Academic Year
                                    </a>
                                  </th>
                                  <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48">
                                    <a href="#" className="group inline-flex">
                                    Subject
                                    </a>
                                  </th>
                                  <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48">
                                    <a href="#" className="group inline-flex">
                                    Upload Syllabus
                                    </a>
                                  </th>
                                  <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-12">
                                    
                                  </th>
                                  
                                  
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                              <tr>
                                    <td className="relative px-7 sm:w-12 sm:px-6">

                                      1
                                    </td>
                                    
                                    
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          <select
                                            id="location"
                                            name="location"
                                            defaultValue="Academic Year"
                                            className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                          >
                                          <option>2023-2024</option>
                                        </select>

                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          <select
                                            id="location"
                                            name="location"
                                            defaultValue="Subject"
                                            className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                          >
                                          <option>Englisha</option>
                                          <option>Telugu</option>
                                          <option>Social</option>
                                        </select>

                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 text-right">
                                      <div className='flex items-center'>
                                        <PlusIcon aria-hidden="true" className="text-purple-500 size-5" />
                                        <label
                                          htmlFor="file-upload"
                                          className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                                        >
                                          <span>Choose a file </span>
                                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                        </label>
                                      </div> 
                                    </td>
                                   
                                    
                                    
                                  </tr>
                                  <tr>
                                    <td className="relative px-7 sm:w-12 sm:px-6">

                                      1
                                    </td>
                                    
                                    
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          <select
                                            id="location"
                                            name="location"
                                            defaultValue="Academic Year"
                                            className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                          >
                                          <option>2023-2024</option>
                                        </select>

                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          <select
                                            id="location"
                                            name="location"
                                            defaultValue="Subject"
                                            className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                          >
                                          <option>Englisha</option>
                                          <option>Telugu</option>
                                          <option>Social</option>
                                        </select>

                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 text-right">
                                      <div className='flex items-center'>
                                        <PlusIcon aria-hidden="true" className="text-purple-500 size-5" />
                                        <label
                                          htmlFor="file-upload"
                                          className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                                        >
                                          <span>Choose a file </span>
                                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                        </label>
                                      </div> 
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <a href='#'><XMarkIcon aria-hidden="true" className="text-red-500 size-5" /></a>
                                    </td>
                                    
                                    
                                  </tr>

                                  
                                  
                              </tbody>
                            </table>
                            <div className='flex items-center mt-2 w-full justify-end'>
                              <PlusIcon aria-hidden="true" className="text-purple-500 size-5" />
                              <a href="#" className="text-purple-600 font-medium hover:text-purple-900">
                              Add Another Subject <span className="sr-only">add new period</span>
                              </a>  
                            </div> 
    </>
  )
}

export default ManageClassSyllabus