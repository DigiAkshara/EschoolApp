import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getData } from "../../app/api";
import { setSelectedHoliday } from "../../app/reducers/holidaySlice";
import { ACADEMIC_YEAR, HOLIDAYS } from "../../app/url";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";
import TableComponent from "../../commonComponent/TableComponent";
import ManageHolidaySidebar from "./ManageHolidaySidebar";

const ManageHolidayAttendance = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [holidaysData, setHolidaysData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const dispatch = useDispatch();

  useEffect(() => {
    getHolidayData();
    academicyear();
  }, []);

  const columns = [
    { title: "Si.No.", key: "siNo" },
    { title: "Holiday", key: "name" },
    { title: "Date", key: "displayDate" },
    { title: "No.of Days", key: "totalDays" },
    { title: "Actions", key: "actions" },
  ];

  const formatHolidayDate = (startDate, endDate) => {
    const formatStartDate = moment(startDate).format("DD-MM-YYYY");
    const formatEndDate = moment(endDate).format("DD-MM-YYYY");
    return formatStartDate === formatEndDate
      ? formatStartDate
      : `${formatStartDate} to ${formatEndDate}`;
  };

  const academicyear = async () => {
    try {
      const academicYearRes = await getData(ACADEMIC_YEAR);
      let academicYearData = [
        {
          label: academicYearRes.data.data.year, // Displayed text in the dropdown
          value: academicYearRes.data.data._id,
        },
      ];
      setAcademicYears(academicYearData);
    } catch (error) {
      handleApiResponse(error);
    }
  };
  const getHolidayData = async () => {
    try {
      const response = await getData(HOLIDAYS);
      const holidayResonse = response.data.data;
      const holidayData = holidayResonse.map((item) => {
        const academicYearLabel = academicYears.find(
          (year) => year.value === item.academicYear
        )?.label;
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
          academicYear: academicYearLabel || item.academicYear,
          status: item.status,
          actions: [
            { label: "Edit", actionHandler: onHandleEdit },
            { label: "Delete", actionHandler: onDelete },
          ],
        };
      });
      setHolidaysData(holidayData);
      setFilteredData(holidayData);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = holidaysData.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
    setFilteredData(filtered)
  }



  const onHandleEdit = async (holidayId) => {
    try {
      const response = await getData(HOLIDAYS + "/" + holidayId);
      const holiday = response.data.data;
      const academicYearLabel = academicYears.find(
        (year) => year.value === holiday.academicYear
      )?.label;
      const updatedHoliday = {
        ...holiday,
        academicYear: academicYearLabel || holiday.academicYear,
      };
      dispatch(setSelectedHoliday(updatedHoliday));
    } catch (error) {
      handleApiResponse(error);
    }
  };


  const onDelete = () => {
    console.log("delete");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = filteredData
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((item, index) => ({
      ...item,
      siNo: (currentPage - 1) * rowsPerPage + index + 1,
    }));

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 mt-4 min-h-screen">
        {/* Sidebar */}
        <ManageHolidaySidebar
          setHolidaysData={setHolidaysData}
          getHolidayData={getHolidayData}
          academicYears={academicYears}
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
