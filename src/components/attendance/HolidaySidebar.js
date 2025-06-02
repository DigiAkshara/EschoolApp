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
import CustomCheckBox from "../../commonComponent/CustomCheckBox";

const HolidaySidebar = ({ getHolidayData, academicYears }) => {
  const dispatch = useDispatch()
  const selectedHoliday = useSelector((state) => state.holiday.selectedHoliday);

  const getInitialValues = () => {
    return {
      academicYear: "",
      startDate: null,
      endDate: null,
      name: "",
      sendSms:true,
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


  const handleSubmit = async (values, { resetForm }) => {
    try {
      const res = values._id ? await updateData(HOLIDAYS + "/" + values._id, values) : await postData(HOLIDAYS, values);
      dispatch(setSelectedHoliday(null))
      resetForm()
      getHolidayData();
      handleApiResponse(res.data.message, 'success')
    } catch (error) {
      handleApiResponse(error)
    }
  };

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
                  onChange={(newValue) => {
                    setFieldValue("startDate", newValue);
                    setFieldValue("endDate", null);
                  }}
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
              <div className="mb-4">
                <div className="flex items-center">
                  <CustomCheckBox
                    name="sendSms"
                    label="Send Holiday SMS"
                    onChange={(e) => setFieldValue("sendSms", e.target.checked)}
                  />
                </div>
              </div>
              {/* Save Button */}
              <div className="mb-4">
                <button className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600">
                  {selectedHoliday ? "Update Holiday" : "Add Holiday"}
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
