import { Form, Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { postData, updateData } from "../../app/api";
import { HOLIDAYS } from "../../app/url";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";
import CustomDate from "../../commonComponent/CustomDate";
import CustomInput from "../../commonComponent/CustomInput";
import CustomSelect from "../../commonComponent/CustomSelect";
import { setSelectedHoliday } from "../../app/reducers/holidaySlice";

const HolidaySidebar = ({ getHolidayData, academicYears }) => {
  const dispatch = useDispatch()
  const selectedHoliday = useSelector((state) => state.holiday.selectedHoliday);

  const getInitialValues = () => {
    return {
      academicYear: "",
      startDate: null,
      endDate: null,
      name: "",
      ...(selectedHoliday && { ...selectedHoliday })
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


  const handleSubmit = async (values) => {
    try {
      const res = values._id ? await updateData(HOLIDAYS + "/" + values._id, values) : await postData(HOLIDAYS, values);
      getHolidayData();
      handleApiResponse(res.data.message, 'success')
      dispatch(setSelectedHoliday(null))
    } catch (error) {
      handleApiResponse(error)
    }
  };

  const resetForm = () => {
    dispatch(setSelectedHoliday(null))
  }

  return (
    <>
      <div className="bg-white border  rounded-lg p-6 w-full lg:w-1/4">
        <Formik
          initialValues={getInitialValues()}
          validationSchema={getValidationSchema()}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
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
                  minDate={values.startDate}
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
              <div className="mb-4">
              <button className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600">
                {selectedHoliday ? "Update Holiday" : "Add Holiday"}
              </button>
              </div>
              <div className="mb-4">
              <button 
                className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                 type="button" onClick={() => resetForm()}>
                Reset Form
              </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default HolidaySidebar;
