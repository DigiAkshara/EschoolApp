import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  handleApiResponse,
  staffType,
} from "../../commonComponent/CommonFunctions";
import CustomDate from "../../commonComponent/CustomDate";
import CustomInput from "../../commonComponent/CustomInput";
import CustomSelect from "../../commonComponent/CustomSelect";
import MutliSelect from "../../commonComponent/MultiSelect";
import { DESIGNATION } from "../../app/url";
import { getData } from "../../app/api";
function StaffInfo({ values, setFieldValue }) {
  const subjects = useSelector((state) => state.staff?.subjects);
  const [designations, setDesignations] = useState([]);
  const getDesignations = async (value) => {
    try {
      const response = await getData(
        DESIGNATION + "?staffType=" +value
      );
      let desigList = response.data.data.map((item) => {
        return {
          label: item.name,
          value: item._id,
        };
      });
      setDesignations(desigList);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  useEffect(() => {
    if (values._id&&values.staffType) {
      getDesignations(values.staffType);
    }
  }, []);

  return (
    <>
      <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
          Staff Employment Details
        </h2>
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
            <CustomSelect
              name="staffType"
              label="Staff Type"
              options={staffType}
              required={true}
              onChange={(e) => {
                setFieldValue("staffType", e.target.value);
                getDesignations(e.target.value, setFieldValue);
              }}
            />
          </div>
          <div className="sm:col-span-2">
            <CustomInput
              name="firstName"
              label="First Name"
              placeholder="Enter First Name"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="lastName"
              label="Last Name"
              placeholder="Enter last Name"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="empId"
              label="Emp ID"
              placeholder="Enter EmpID"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomDate
              name="DOJ"
              label="Date Of Joining"
              required={true}
              maxDate={new Date()}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomSelect
              name="designation"
              label="Designation"
              options={designations}
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              type="number"
              name="mobileNumber"
              label="Mobile Number"
              placeholder="Enter Mobile Number"
              required={true}
            />
          </div>
          <div className="sm:col-span-2">
            <CustomInput
              name="workEmail"
              label="Work Email"
              placeholder="Enter email"
            />
          </div>
          {values.staffType === "teaching" && (
            <div className="sm:col-span-2">
              <MutliSelect
                name="subjects"
                label="Dealing Subjects"
                options={subjects}
                required={values.staffType === "teaching"}
                value={values.subjects}
                onChange={(value) => {
                  setFieldValue("subjects", value ? value : []);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default StaffInfo;
