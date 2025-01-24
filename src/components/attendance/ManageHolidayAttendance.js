import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { getData, postData, updateData } from "../../app/api";
import { ACADEMIC_YEAR, HOLIDAYS } from "../../app/url";
import {
  capitalizeWords,
  formatDate,
} from "../../commonComponent/CommonFunctions";
import ManageHolidaySidebar from "./ManageHolidaySidebar";
import TableComponent from "../../commonComponent/TableComponent";
import FilterComponent from "../../commonComponent/FilterComponent";
import moment from "moment";
import { setSelectedHoliday } from "../../app/reducers/holidaySlice";
import { useDispatch } from "react-redux";

const ManageHolidayAttendance = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [holidayMsg, setHolidayMsg] = useState([]);
  const [holidaysData, setHolidaysData] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const dispatch= useDispatch()

  const getInitialValues = () => {
    return {
      academicYear: "",
      startDate: "",
      endDate: "",
      name: "",
    };
  };

  const getValidationSchema = () => {
    return Yup.object({
      academicYear: Yup.string().required("Academic year is required"),
      startDate: Yup.date().nullable().required(" Date  is required"),
      endDate: Yup.date().nullable().required(" Date  is required"),
      name: Yup.string().required(" Holiday name is required"),
    });
  };

  useEffect(() => {
    academicyear();
    getHolidayData();
    console.log("called useEffect");
    
  }, []);

  const columns = [
    { title: "Si.No.", key: "siNo" },
    { title: "Holiday", key: "name" },
    { title: "Date", key: "displayDate" },
    { title: "No.of Days", key: "totalDays" },
    { title: "Actions", key: "actions" },
  ];

 
  const formatHolidayDate = (startDate, endDate) => {
    const formatStartDate = moment(startDate).format('DD-MM-YYYY');
    const formatEndDate = moment(endDate).format('DD-MM-YYYY');
    return formatStartDate === formatEndDate
      ? formatStartDate
      : `${formatStartDate} to ${formatEndDate}`;
  };

  const academicyear = async () => {
    try {
      const academicYearRes = await getData(ACADEMIC_YEAR);
      if (academicYearRes.status === 200 || academicYearRes.status === 201) {
        let academicYearData = [
          {
            label: academicYearRes.data.data.year, // Displayed text in the dropdown
            value: academicYearRes.data.data._id,
          },
        ];
        setAcademicYears(academicYearData);
      } else {
        throw new Error(academicYearRes.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredData(
      holidaysData.filter((holiday) =>
        holiday.name.toLowerCase().includes(query)
      )
    );
  };

  const getHolidayData = async () => {
    try {
      const response = await getData(HOLIDAYS);
      console.log("Response - [HOLIDAY]", response.data.data);
      const holidayResonse = response.data.data;

      const holidayData = holidayResonse.map((item) => {
        const totalDays = Math.ceil(
          (new Date(item.endDate) - new Date(item.startDate)) /
            (1000 * 60 * 60 * 24)
        );
        return {
          _id: item._id,
          name: item.name,
          startDate: item.startDate,
          endDate: item.endDate,
          displayDate: formatHolidayDate(item.startDate, item.endDate),
          totalDays,
          academicYear: item.academicYear,
          status: item.status,
          actions: [
            { label: "Edit", actionHandler: onHandleEdit },
            { label: "Delete", actionHandler: onDelete },
          ],
        };
      });
      console.log("after changing format:", holidayData);

      setHolidaysData(holidayData);
      setFilteredData(holidayData);
    } catch (error) {
      console.error("Error getting data:", error);
    }
  };


  

  
  const onHandleEdit = async (holidayId) => {
    console.log("id is", holidayId);
    
    try {
      if (!holidayId) return;
      const response = await getData(HOLIDAYS + '/' + holidayId);
      console.log("Response - [HOLIDAY]", response.data.data);
      
      if (response?.data?.data) {
        dispatch(setSelectedHoliday(response.data.data));  
        console.log("Edit Holiday:", response.data.data);
      } else {
        console.error("Holiday not found for the given ID:", holidayId);
      }
    } catch (error) {
      console.error("Error fetching holiday data:", error);
    }
  };

  const onDelete = () => {
    console.log("delete");
  };

  const handleAction = {
    edit: (item) => console.log("Edit:", item),
    delete: (item) => console.log("Delete:", item),
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  ).map((item, index) => ({
    ...item,
    siNo: (currentPage - 1) * rowsPerPage + index + 1, 
  }));
  console.log("paginated data:",paginatedData );
  

  return (
    <>
     
            <div className="flex flex-col lg:flex-row gap-6 mt-4 min-h-screen">
              {/* Sidebar */}
              <ManageHolidaySidebar
                academicYears={academicYears}
                holidayMsg={holidayMsg}
                holidaysData={holidaysData}
                setHolidayMsg={setHolidayMsg}
                setHolidaysData={setHolidaysData}
              />

              {/* Main Content */}
              <div className="-mx-2 -my-2  mt-0 overflow-x-auto sm:-mx-6  w-full lg:w-3/4">
                <div className="inline-block min-w-full py-4 align-middle sm:px-6">
                  <div className="relative">
                    <div className="shadow ring-1 ring-black/5 sm:rounded-lg">
                      {/* Table View */}
                      {/* <FilterComponent 
                      onSearch={handleSearch}
                      /> */}
                      <TableComponent
                        columns={columns}
                        data={paginatedData}
                        onAction={[
                          { label: "Edit", handler: handleAction.edit },
                          { label: "Delete", handler: handleAction.delete },
                        ]}
                        pagination={{
                          currentPage,
                          totalCount: filteredData.length,
                          onPageChange: handlePageChange,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
         
    </>
  );
};

export default ManageHolidayAttendance;
