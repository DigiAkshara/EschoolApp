import React, { useEffect, useMemo, useRef, useState } from "react";
import CustomDate from "../../commonComponent/CustomDate";
import CustomInput from "../../commonComponent/CustomInput";
import CustomSelect from "../../commonComponent/CustomSelect";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { getData, postData, updateData } from "../../app/api";
import { ACADEMIC_YEAR, HOLIDAYS } from "../../app/url";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";

const ManageHolidaySidebar = ({ setHolidaysData, getHolidayData }) => {
  const [academicYears, setAcademicYears] = useState([]);
  const [holidayMsg, setHolidayMsg] = useState([]);
  const selectedHoliday = useSelector((state) => state.holiday.selectedHoliday);
  console.log("selectedHoliday", selectedHoliday);

  const data = [
    {
      id: 1,
      academicYear: "2023-2024",
      startDate: "2023-06-01",
      endDate: "2024-03-31",
      name: "Term 1",
    },
    {
      id: 2,
      academicYear: "2023-2024",
      startDate: "2024-04-01",
      endDate: "2024-06-30",
      name: "Term 2",
    },
    {
      id: 3,
      academicYear: "2024-2025",
      startDate: "2024-07-01",
      endDate: "2025-03-31",
      name: "Term 3",
    },
  ];

  const [formData, setFormData] = useState({
    academicYear: selectedHoliday?.academicYear || "",
    startDate: selectedHoliday?.startDate || "",
    endDate: selectedHoliday?.endDate || "",
    name: selectedHoliday?.name || "",
    // ...(selectedHoliday && selectedHoliday),
  });

  useEffect(() => {
    academicyear();
  }, []);

  const getValidationSchema = () => {
    return Yup.object({
      academicYear: Yup.string().required("Academic year is required"),
      startDate: Yup.date().nullable().required(" Date  is required"),
      endDate: Yup.date().nullable().required(" Date  is required"),
      name: Yup.string().required(" Holiday name is required"),
    });
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

  const handleEdit = (id) => {
    const selectedData = data.find((item) => item.id === id);
    if (selectedData) {
      setFormData({
        academicYear: selectedData.academicYear,
        startDate: selectedData.startDate,
        endDate: selectedData.endDate,
        name: selectedData.name,
      });
    }
  };

  const handleSubmit = (values) => {
    console.log("entered values", values);
  };

  // const handleSubmit = async (values,resetForm) => {
  //   console.log("{HOLIDAY-haandle submit}", values);

  //   try {
  //     if (values._id) {
  //       const response = await updateData(HOLIDAYS + "/" + values._id, values);
  //       if (response.status === 200) {
  //         resetForm()
  //         getHolidayData();
  //         setHolidayMsg("Holiday updated successfully.");
  //       }
  //     } else {
  //       const response = await postData(HOLIDAYS, values);
  //       if (response.data) {
  //         resetForm()
  //         getHolidayData();
  //         setHolidayMsg("Holiday marked successfully.");
  //       }
  //     }
  //   } catch (error) {
  //     handleApiResponse(error)
  //     console.error("Error submitting form:", error);
  //   } finally {
  //     setTimeout(() => setHolidayMsg(""), 5000);
  //   }
  // };

  return (
    <>
      <div className="bg-white border  rounded-lg p-6 w-full lg:w-1/4">
        <Formik
          initialValues={formData}
          validationSchema={getValidationSchema()}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, resetForm }) => (
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

              {/* <button
                className="mt-2 w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600"
                onClick={() => handleEdit(1)}
              >
                EDIT
              </button> */}
              {/* Attendance Marked */}

              {holidayMsg && (
                <div
                  className={`mt-4 p-2 rounded-md ${
                    holidayMsg === "Holiday Marked"
                      ? "bg-green-100 text-green-600"
                      : "" 
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
