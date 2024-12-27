import React, { useEffect, useState } from "react";
import { getData } from "../app/api";
import { SUBJECTS } from "../app/url";


function ManageAddMarks({ values, setFieldValue }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([])


  useEffect(() => {
    getSubjects();
  }, []);
  
  const getSubjects = async () => {
    try {
      const res = await getData(SUBJECTS); 
      console.log("Fetched subject data:", res.data);

          const classData = res.data.data.map((item) => ({
        label: item.name, // Displayed text in the dropdown
        value: item._id,  // Unique identifier for the subject
      }));

      setSubjects(classData); // Update the state with the fetched subjects
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };
 
  console.log("Subjects :",subjects);

  const people2 = [
    {
      name: 'Janet Baker',
      title: '12345678 | 1A',
      email: 'janecooper@example.com',
      telephone: '+1-202-555-0170',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    // More people...
  ]

  const people = [
    {
      name: 'Lindsay Walton',
      title: 'Front-end Developer',
      email: 'lindsay.walton@example.com',
      role: 'Member',
    },
    // More people...
  ]
  

  return (
    <>
      <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
      Enter Marks
      </h2>

      {/* <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300">
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
                {subject.label}
              </a>
            </th>
          ))}
          <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
            >
              <a href="#" className="group inline-flex">
              Marks Obt.
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
            >
              <a href="#" className="group inline-flex">
              Max Marks
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
            >
              <a href="#" className="group inline-flex">
              Per(%)
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
            >
              <a href="#" className="group inline-flex">
                Result
              </a>
            </th>
           
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          <FieldArray name="timeTable">
          
                      <tr  className='bg-gray-50'>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">1</td>
                        <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-0">
                        <a href="#" className="text-purple-600 hover:text-purple-900">
                        <div className="flex items-center">
                          <div className="size-9 shrink-0">
                            <img alt="" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  className="size-9 rounded-full" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 text-purple-600">Janet Baker</div>
                            <div className="mt-1 text-gray-500">112345</div>
                          </div>
                        </div>
                        </a>
                      </td>
                      {subjects.map((subject, subjectIndex) => (
          <td key={subjectIndex} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            <input
              type="type"
            //   placeholder={`Marks for ${subject.label}`}
            //   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
            //   name={`student[${studentIndex}].marks[${subject.value}]`}
             className="block w-16 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
            />
          </td>
        ))}
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                      /> 
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 ">
                                        <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                      /> 
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                      /> 
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                                            Pending
                                          </span></td>
                        

                        
                      </tr>
                    
          </FieldArray>
        </tbody>
      </table> */}

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
              {subject.label}
            </a>
          </th>
        ))}
        <th
          scope="col"
          className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
        >
          <a href="#" className="group inline-flex">
            Marks Obt.
          </a>
        </th>
        <th
          scope="col"
          className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
        >
          <a href="#" className="group inline-flex">
            Max Marks
          </a>
        </th>
        <th
          scope="col"
          className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
        >
          <a href="#" className="group inline-flex">
            Per(%)
          </a>
        </th>
        <th
          scope="col"
          className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
        >
          <a href="#" className="group inline-flex">
            Result
          </a>
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 bg-white">
      <tr className="bg-gray-50">
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">1</td>
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
                Janet Baker
              </div>
              <div className="mt-1 text-gray-500">112345</div>
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
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          <input
            type="text"
            className="block w-14 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
          />
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          <input
            type="text"
            className="block w-14 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
          />
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          <input
            type="text"
            className="block w-14 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
          />
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
            Pending
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

    </>
  );
}

export default ManageAddMarks;
