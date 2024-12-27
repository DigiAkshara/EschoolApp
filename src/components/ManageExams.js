
'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { PlusIcon } from '@heroicons/react/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid'
import { ListBulletIcon } from '@heroicons/react/20/solid'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import { FunnelIcon } from '@heroicons/react/24/outline'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { PhoneIcon } from '@heroicons/react/24/outline'


import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'


import Datepicker from "react-tailwindcss-datepicker";
import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend, Label, legendType } from 'recharts';
import Select from "react-tailwindcss-select";
import CreateExam from './CreateExam'
import { getData } from '../app/api'
import { EXAM } from '../app/url'
import ExamDetailsPage from './ExamDetailsPage'
import { useDispatch, useSelector } from 'react-redux'
import { selectExam, setExams } from '../app/reducers/examSlice'
import ManageExamSchedules from './ManageExamSchedules'
import ManageExamResults from './ManageExamResults'


const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  // More people...
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


// const tabs2 = [
//   { name: 'Exams Schedules', href: '#',  current: true },
//   { name: 'Exams Results', href: '#',  current: false },
// ]



export default function ManageExams() {

  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)

  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState([])
  const [examData , setExamData] = useState([])
  const dispatch = useDispatch()
  const exams = useSelector((state) => state.exams.exams);
  const [activeTab, setActiveTab] = useState(0);

  const tabs2 = [
    {
      name: "Exams Schedules",
      component: <ManageExamSchedules />,
      current: true,
    },
    {
      name: "Exams Results ",
      component: <ManageExamResults />,
      current: false,
    },
  ];


useEffect(()=>{
  getExamData()
},[])


const getExamData = async () => {
  try {
    const response = await getData(EXAM);
    console.log("response is:", response.data);
    
    if (response.status === 200) {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const data = response.data.data.map((item, index) => {
        // Formatting the timeTable data
        const timeTableFormatted = item.timeTable.map(t => ({
          subject: t.subject,
          examDate: formatter.format(new Date(t.examDate)),
          startTime: t.startTime,
          endTime: t.endTime,
          passMark: t.passMark,
          totalMark: t.totalMark,
          syllabus : t.syllabus
        }));
      
        return {
          id: index + 1,
          name: item.name,
          section: item.section,
          examDates: `${formatter.format(new Date(item.startDate))} - ${formatter.format(new Date(item.endDate))}`,
          board: item.board,
          classCategory: item.classCategory,
          timeTable: timeTableFormatted // Add the formatted timeTable data
        };
      });
      setExamData(data);
      dispatch(setExams(data));
    }
  } catch (error) {
    console.error('Error fetching exam data:', error);
  }
};

const handleViewDetails = (exam) => {
  dispatch(selectExam(exam)); 
  setOpen2(true); 
};



  // useLayoutEffect(() => {
  //   const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < people.length
  //   setChecked(selectedPeople.length === people.length)
  //   setIndeterminate(isIndeterminate)
  //   checkbox.current.indeterminate = isIndeterminate
  // }, [selectedPeople])

  // function toggleAll() {
  //   setSelectedPeople(checked || indeterminate ? [] : people)
  //   setChecked(!checked && !indeterminate)
  //   setIndeterminate(false)
  // }

  const [animal, setAnimal] = useState(null);

  const handleChange = value => {
      console.log("value:", value);
      setAnimal(value);
  };

  const handleClose = () =>setOpen(false)
  const handleClose2 = () => setOpen2(false)

  const handleTabChange = (index) => {
    setActiveTab(index); // Update activeTab when a tab is clicked
  };


  return (
    
    
      
      <div className="flow-root">
        {/* Primary Tabs */}
                 
         <div className='mt-4 flex justify-between'>
           <div className='text-lg text-gray-900 font-medium'>
            
           <div className="sm:hidden">
                <label htmlFor="tabs2" className="sr-only">
                  Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
              id="tabs2"
              name="tabs2"
              value={activeTab}
              onChange={(e) => handleTabChange(Number(e.target.value))}
              className="block w-full rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            >
                  {tabs2.map((tab) => (
                    <option key={tab.name}>{tab.name}</option>
                  ))}
                   {tabs2.map((tab, index) => (
                <option key={tab.name} value={index}>
                  {tab.name}
                </option>
              ))}
                </select>
              </div>
              <div className="hidden sm:block">
                <nav aria-label="Tabs2" className="flex space-x-4">
                {tabs2.map((tab, index) => (
                <button
                  key={tab.name}
                  onClick={() => handleTabChange(index)}
                  className={classNames(
                    activeTab === index
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-500 hover:text-gray-700",
                    "rounded-full px-3 py-2 text-sm font-medium"
                  )}
                >
                  {tab.name}
                </button>
              ))}
                </nav>
              </div>
            
            
            </div>   
          
           <div className='right-btns-blk space-x-4'>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                >
                  <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
                  Add New Exam
                </button>
            </div>   

        </div>
        {tabs2[activeTab].component}

         {/* <ManageExamSchedules/> */}

{/* Add Class */}
        
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      
      <CreateExam onClose={handleClose} />
    </Dialog>

    <Dialog open={open2} onClose={setOpen2} className="relative z-50">
      <ExamDetailsPage onClose2={handleClose2} />
    </Dialog>                

   

  </div>
    
  )
}



