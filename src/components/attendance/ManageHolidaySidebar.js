import React, { useEffect, useState } from "react";
import CustomDate from "../../commonComponent/CustomDate";
import CustomInput from "../../commonComponent/CustomInput";
import CustomSelect from "../../commonComponent/CustomSelect";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { postData, updateData } from "../../app/api";
import { HOLIDAYS } from "../../app/url";

const ManageHolidaySidebar = ({ academicYears, holidayMsg,holidaysData, setHolidaysData, setHolidayMsg,getHolidayData }) => {
  const selectedHoliday = useSelector((state) => state.holiday.selectedHoliday);
  console.log("selectedHoliday", selectedHoliday);
  

  const [formData, setFormData] = useState({
    academicYear: "",
    startDate: "",
    endDate: "",
    name: "",
    ...(selectedHoliday && selectedHoliday),
  });

  const getValidationSchema = () => {
    return Yup.object({
      academicYear: Yup.string().required("Academic year is required"),
      startDate: Yup.date().nullable().required(" Date  is required"),
      endDate: Yup.date().nullable().required(" Date  is required"),
      name: Yup.string().required(" Holiday name is required"),
    });
  };



  const handleSubmit = async (values) => {
    console.log("{HOLIDAY-haandle submit}", values);
    
    const isDuplicate = holidaysData.some((holiday) => {
      const holidayStartDate = moment(holiday.startDate).format("YYYY-MM-DD");
      const holidayEndDate = moment(holiday.endDate).format("YYYY-MM-DD");
      const enteredStartDate = moment(values.startDate).format("YYYY-MM-DD");
      const enteredEndDate = moment(values.endDate).format("YYYY-MM-DD");
      return (
        holiday._id !== values._id && // Exclude the same holiday during editing
        ((enteredStartDate >= holidayStartDate && enteredStartDate <= holidayEndDate) ||
          (enteredEndDate >= holidayStartDate && enteredEndDate <= holidayEndDate) ||
          (enteredStartDate <= holidayStartDate && enteredEndDate >= holidayEndDate))
      );
    });

    if (isDuplicate) {
      setHolidayMsg("Holiday for the selected date range already exists.");
      setTimeout(() => {
        setHolidayMsg("");
      }, 5000);
      return;
    }

    try {
      if (values._id) {
        const response = await updateData(HOLIDAYS + "/" + values._id, values);
        if (response.data) {
          setHolidaysData((prevData) =>
            prevData.map((holiday) =>
              holiday._id === values._id ? { ...holiday, ...values } : holiday
            )
          );
          setHolidayMsg("Holiday updated successfully.");
        }
      } else {
        const response = await postData(HOLIDAYS, values);
        if (response.data) {
          getHolidayData();
          // setHolidaysData((prevData) => [...prevData, response.data.data]);
          setHolidayMsg("Holiday marked successfully.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setTimeout(() => setHolidayMsg(""), 5000);
    }
  };


  return (
    <>
    <div className="bg-white border  rounded-lg p-6 w-full lg:w-1/4">
      <Formik
        initialValues={formData}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue  }) => (
          <Form>
            
              {/* <h2 className="text-xl font-semibold mb-4">Holiday Entry</h2> */}
              <h2 className="text-xl font-semibold mb-4">
                {selectedHoliday ? "Edit Holiday" : "Holiday Entry"}
              </h2>

              {/* Date Picker */}
              <div className="mb-4">
                <CustomSelect
                  name="academicYear"
                  label="Academic year"
                  options={academicYears}
                  required={true}
                />
              </div>

              <div className="mb-4">
                <CustomDate
                  name="startDate"
                  label="Holiday From Date"
                  required={true}
                />
              </div>
              <div className="mb-4">
                <CustomDate
                  name="endDate"
                  label="Holiday To Date"
                  required={true}
                />
              </div>

              <div className="mb-4">
                <CustomInput
                  name="name"
                  label="Holiday Title"
                  placeholder="Enter Holiday Title"
                  required={true}
                />
              </div>

              {/* Save Button */}
              <button className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600">
                {selectedHoliday ? "Update Holiday" : "Add Holiday"}
              </button>

              {/* Attendance Marked */}

              {holidayMsg && (
                <div
                  className={`mt-4 p-2 rounded-md ${
                    holidayMsg === "Holiday Marked"
                      ? "bg-green-100 text-green-600"
                      : holidayMsg ===
                        "Holiday for the selected date range already exists."
                      ? "bg-red-100 text-red-600"
                      : "" // Handle any other message types
                  }`}
                >
                  {holidayMsg}
                </div>
              )}
            
          </Form>
        )}
      </Formik>
      </div>
    </>
  );
};

export default ManageHolidaySidebar;
