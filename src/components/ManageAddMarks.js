import React, { useEffect, useState } from "react";


function ManageAddMarks({ subjects, values, setFieldValue }) {

  console.log("values are :", values);
  
  const students = [
    {
      rollNo: '1',
      name: 'Janet Baker',
      id: '112345',
      },
    {
      rollNo: '2',
      name: 'John Doe',
      id: '112346',
      
    },
    // More students can be added here
  ];

  

  

  return (
    <>
      <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
      Enter Marks
      </h2>

 
<div className="overflow-x-auto">
  <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300">
    <thead className="bg-purple-100">
      <tr>
        <th
          scope="col"
          className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2 w-12"
        >
          <a href="#" className="group inline-flex">
            Roll No
          </a>
        </th>
        <th
          scope="col"
          className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
        >
          <a href="#" className="group inline-flex">
            Student Name
          </a>
        </th>
        {subjects.map((subject, index) => (
          <th
            key={index}
            scope="col"
            className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
          >
            <a href="#" className="group inline-flex">
              {subject.label.toUpperCase()}
            </a>
          </th>
        ))}
               
        
        
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 bg-white">
    {students.map((student, studentIndex) => (
      <tr key={studentIndex}  className="bg-gray-50">
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{student.rollNo}</td>
        <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-0">
          <div className="flex items-center">
            <div className="size-9 shrink-0">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="size-9 rounded-full"
              />
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900 text-purple-600">
              {student.name}
              </div>
              <div className="mt-1 text-gray-500">{student.id}</div>
            </div>
          </div>
        </td>
        {subjects.map((subject, subjectIndex) => (
          <td
            key={subjectIndex}
            className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
          >
            <input
              type="text"
              className="block w-12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
            />
          </td>
        ))}
               
        
      </tr>
       ))}
    </tbody>
  </table>
</div>

    </>
  );
}

export default ManageAddMarks;
