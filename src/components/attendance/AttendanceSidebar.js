import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../app/api";
import { ACADEMICS, ATTENDANCE } from "../../app/url";
import {
  attendanceOptions,
  handleApiResponse,
} from "../../commonComponent/CommonFunctions";
import CustomButton from "../../commonComponent/CustomButton";
import CustomDate from "../../commonComponent/CustomDate";
import CustomRadio from "../../commonComponent/CustomRadio";
import CustomSelect from "../../commonComponent/CustomSelect";
import { updateStudents } from "../../app/reducers/attendanceSlice";
import { use } from "react";
import CustomCheckBox from "../../commonComponent/CustomCheckBox";

const AttendanceSidebar = ({
  values,
  setFieldValue,
  updateList,
  user,
  handleSelectChange,
  handleClassChange,
  handleSectionChange,
  classes = [],
  sections = [],
  attendanceMarkedValue,
}) => {
  const { staff, students, holidays } = useSelector((state) => state.attendance);
  const dispatch = useDispatch();
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [holiday, setHoliday] = useState(false);
  const [holidayReason, setHolidayReason] = useState("");
  const statusOptions = user === "staff" ?
    [...attendanceOptions, { value: "holiday", label: "Holiday" }, { value: "paid-leave", label: "Paid Leave" }] :
    [...attendanceOptions];


  const getStudents = async (classId, sectionID) => {
    try {
      const res = await getData(ACADEMICS + "/" + classId + "/" + sectionID);
      const stuData = res.data.data.map((item) => {
        return {
          _id: item.student._id,
          pic: item.student.profilePic?.Location || "",
          name: `${item.student.firstName} ${item.student.lastName}`,
          admissionNo: item.student.admissionNumber,
          className: item.class?.name || "N/A",
          class: item.class?._id || null,
          section: item.section || "N/A",
          attendanceStatus: "",
        }
      });
      dispatch(updateStudents(stuData));
      setFieldValue("attendance", stuData);
      setAttendanceMarked(false)
    } catch (error) {
      handleApiResponse(error);
    }
  };

  useEffect(() => {
    if (values.class && values.section) {
      getStudents(values.class, values.section);
    }
  }, [values.class, values.section]);

  useEffect(() => {
    if (values.date || (values.class && values.section)) {
      checkHoliday(values.date);
      checkDayAttendance(values.date);
    }
  }, [values.date, staff, students]);


  const checkHoliday = (dateToCheck) => {
    setHoliday(false);
    setHolidayReason("");
    const selected = moment(dateToCheck).startOf('day');

    return holidays.find(holiday => {
      const start = moment.utc(holiday.startDate).local().startOf('day');
      const end = moment.utc(holiday.endDate).local().endOf('day');
      if (selected.isBetween(start, end, null, "[]")) {
        // '[]' includes boundary dates
        setHoliday(true);
        setHolidayReason(holiday.name);
      }
    });
  };


  const checkDayAttendance = async (date) => {
    setAttendanceMarked(false);
    try {
      let URL = ATTENDANCE + "?date=" + date + "&userType=" + user;
      let data = [...staff]
      if (user === "student") {
        data = [...students]
        URL = URL + "&classId=" + values.class + "&sectionId=" + values.section;
      }
      const res = await getData(URL);
      setAttendanceMarked(res.data.data.length > 0 ? true : false);
      let updatedData = data.map((item) => {
        let obj = { ...item };
        if (res.data.data.length > 0) {
          let index = res.data.data[0].attendance.findIndex(
            (att) => att.userId._id === item._id
          );
          if (index !== -1)
            obj.attendanceStatus =
              res.data.data[0].attendance[index].attendanceStatus;
        }
        return obj;
      });
      updateList && updateList(updatedData);
      setFieldValue("attendance", updatedData);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const attendanceCounts = values.attendance.reduce(
    (acc, entry) => {
      switch (entry.attendanceStatus) {
        case "present":
          acc.present += 1;
          break;
        case "absent":
          acc.absent += 1;
          break;
        case "half-day":
          acc["half-day"] += 1;
          break;
        case "paid-leave":
          acc['paid-leave'] += 1;
          break;
        case "holiday":
          acc.holiday += 1;
          break;
        default:
          break;
      }
      return acc;
    },
    { present: 0, absent: 0, "half-day": 0, "paid-leave": 0, holiday: 0 }
  );
  useEffect(() => {
    setAttendanceMarked(attendanceMarkedValue)
  }, [attendanceMarkedValue]);


  return (
    <div className="bg-white border  rounded-lg p-6 w-full lg:w-1/4">
      <h2 className="text-xl font-semibold mb-4">
        {user === "staff"
          ? "Staff Attendance"
          : user === "student"
            ? "Student Attendance"
            : "Attendance"}
      </h2>

      {/* Date Picker */}
      <div className="mb-4">
        <CustomDate
          name="date"
          label="Date"
          required={true}
          maxDate={moment().format("MM-DD-YYYY")}
          onChange={(value) => {
            setFieldValue("date", value);
            setFieldValue("allAttendance", "");
          }}
        />
      </div>

      {!attendanceMarked && (user === "student" ? (!holiday) && (
        <>
          <div className="mb-4">
            {/* Heading */}
            <h2 className="block text-sm/6 font-regular text-gray-900">
              Select Class and Section
            </h2>
            <div className="flex flex-col lg:flex-row mb-4 gap-2">
              <div className="w-full lg:w-1/2">
                <CustomSelect
                  name="class"
                  placeholder="Class"
                  value={values.class}
                  options={classes}
                  onChange={(e) => {
                    handleClassChange(e, setFieldValue);
                  }}
                />
              </div>

              <div className="w-full lg:w-1/2">
                <CustomSelect
                  name="section"
                  placeholder="Section"
                  value={values.section}
                  options={sections.filter(
                    (section) => section.class === values.class
                  )}
                  onChange={(e) => {
                    handleSectionChange(e, values, setFieldValue);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <CustomSelect
              name="allAttendance"
              label={
                user === "staff"
                  ? "Attendance for all Staffs"
                  : "Attendance for all Students"
              }
              options={statusOptions}
              value={values.allAttendance}
              onChange={(e) => handleSelectChange(e, values, setFieldValue)}
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center">
              <CustomCheckBox
                name="sendSms"
                label="Send SMS"
                onChange={(e) => setFieldValue("sendSms", e.target.checked)}
              />
            </div>
          </div>
          <CustomButton
            type="submit"
            label="Save Attendance"
            disabled={values.attendance.length === 0}
          />
        </>) :
        <>
          <div className="mb-4">
            <CustomSelect
              name="allAttendance"
              label={
                user === "staff"
                  ? "Attendance for all Staffs"
                  : "Attendance for all Students"
              }
              options={statusOptions}
              value={values.allAttendance}
              onChange={(e) => handleSelectChange(e, values, setFieldValue)}
            />
          </div>

          <CustomButton
            type="submit"
            label="Save Attendance"
            disabled={values.attendance.length === 0}
          />
        </>
      )}

      <div className="mt-6">
        <ul>
          <li className="flex justify-between border-b border-gray-300 pb-2">
            <span>{user === "staff" ? "Total Teachers:" : "Strength:"}</span>{" "}
            <span>{values.attendance.length} </span>
          </li>
          {statusOptions.map((option) => (
            <li
              key={option.value}
              className="flex justify-between border-b border-gray-300 pb-2"
            >
              <span>{option.label}:</span> <span>{attendanceCounts[option.value]}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Attendance Marked */}
      {holiday && user === "student" ? (
        <div className="mt-4 p-2 rounded-md bg-red-100 text-red-600">
          {holidayReason}
        </div>
      ) : (
        attendanceMarked && (
          <div className={`mt-4 p-2 rounded-md bg-red-100 text-red-600`}>
            Attendance Marked
          </div>
        )
      )}
    </div>
  );
};

export default AttendanceSidebar;
