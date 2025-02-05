import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteData, getData } from "../../app/api";
import { setSelectedHoliday } from "../../app/reducers/holidaySlice";
import { ACADEMIC_YEAR, HOLIDAYS } from "../../app/url";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";
import TableComponent from "../../commonComponent/TableComponent";
import HolidaySidebar from "./HolidaySidebar";
import ConfirmationModal from "../../commonComponent/ConfirmationModal";

const HolidayAttendance = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [holidaysData, setHolidaysData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const dispatch = useDispatch();

  useEffect(() => {
    getHolidayData();
    academicyear();
  }, []);

  const columns = [
    { title: "S.No.", key: "siNo" },
    { title: "Holiday", key: "name" },
    { title: "Date", key: "displayDate" },
    { title: "No.of Days", key: "totalDays" },
    { title: "Actions", key: "actions" },
  ];

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
      const res = await getData(HOLIDAYS);
      const holidayResonse = res.data.data;
      const holidayData = holidayResonse.map((item) => {
        let start = moment(item.startDate, "YYYY-MM-DD");
        let end = moment(item.endDate, "YYYY-MM-DD");
        const totalDays = end.diff(start, "days") + 1;
        return {
          _id: item._id,
          name: item.name,
          startDate: item.startDate,
          endDate: item.endDate,
          displayDate: `${moment(item.startDate).format('DD-MM-YYYY')} to  ${moment(item.endDate).format('DD-MM-YYYY')}`,
          totalDays,
          academicYear: item.academicYear,
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

  const onHandleEdit = async (holidayId) => {
    try {
      const res = await getData(HOLIDAYS + "/" + holidayId);
      dispatch(setSelectedHoliday(res.data.data));
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const onDelete = (Id) => {
    setDeleteId(Id)
    setDeleteConfirm(true);
  }


  const holidayDelete = async () => {
    try {
      let res = await deleteData(HOLIDAYS + "/" + deleteId)
      handleApiResponse(res.data.message, 'success')
      getHolidayData()
      setDeleteConfirm(false)
      setDeleteId(null)
    } catch (error) {
      handleApiResponse(error)
    }
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
        <HolidaySidebar
          getHolidayData={getHolidayData}
          academicYears={academicYears}
        />

        {/* Main Content */}
        <div className="-mx-2 -my-2  mt-0 overflow-x-auto sm:-mx-6  w-full lg:w-3/4">
          <div className="inline-block min-w-full py-4 align-middle sm:px-6">
            <div className="relative">
              <div className="shadow ring-1 ring-black/5 sm:rounded-lg">
                {/* Table View */}
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
      <ConfirmationModal
        showModal={deleteConfirm}
        onYes={holidayDelete}
        onCancel={() => { setDeleteConfirm(false) }}
      />

    </>
  );
};

export default HolidayAttendance;
