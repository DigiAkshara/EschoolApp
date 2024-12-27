import React, { useState } from "react";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import CustomDate from "../commonComponent/CustomDate";
import CustomRadio from "../commonComponent/CustomRadio";
import CustomFileUploader from "../commonComponent/CustomFileUploader";
import { gender, states, uploadFile } from "../commonComponent/CommonFunctions";
import { postData } from "../app/api";
import { UPLOAD } from "../app/url";
import CustomCheckBox from "../commonComponent/CustomCheckBox";


function StaffPersonalDetails({ values, setFieldValue }) {
  
  const handlechecked = (e) => {
    setFieldValue("permanentAddress", {...values.presentAddress});
    setFieldValue("isSameAsPresent", e.target.checked);
  }

  const handleFileChange = async (e) => {
      try {
        const fileResponse = await uploadFile(e.target.files[0]);
        setFieldValue(e.target.name, fileResponse);
      } catch (error) {
        console.log(error);
      }
    }

  return (
    <>
      <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
          Staff Personal Details
        </h2>
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="col-span-full">
            <CustomFileUploader
              label="Passport Size Photo"
              name="profilePic"
              required={true}
              isProfile={true}
              onChange={handleFileChange}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomDate name="DOB" label="Date Of Birth" required={true} />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="email"
              label="Personal Email"
              placeholder="Enter email"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="guardian"
              label="Father / Guardian "
              placeholder="Enter Guardian "
              required={true}
            />
          </div>
          <div className="sm:col-span-2">
            <CustomRadio
              name="gender"
              label="Gender"
              required={true}
              options={gender}
            />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
          Present Address Details
        </h2>
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
            <CustomInput
              name="presentAddress.area"
              label="Area"
              placeholder="Enter Area"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="presentAddress.city"
              label="City"
              placeholder="Enter City"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomSelect
              name="presentAddress.state"
              label="State"
              options={states}
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="presentAddress.pincode"
              label="Pincode"
              placeholder="Enter Pincode"
              required={true}
            />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
          Permanent Address Details
        </h2>
        <div className="relative flex items-start mb-4">
            <CustomCheckBox name="isSameAsPresent" label="Same as Present Address" onChange={handlechecked}/>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
            <CustomInput
              name="permanentAddress.area"
              label="Area"
              placeholder="Enter Area"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="permanentAddress.city"
              label="City"
              placeholder="Enter City"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomSelect
              id="permanentState"
              name="permanentAddress.state"
              label="State"
              options={states}
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="permanentAddress.pincode"
              label="Pincode"
              placeholder="Enter Pincode"
              required={true}
            />
          </div>
        </div>
      </div>
      <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
          Staff ID Proofs
        </h2>

        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-4">
            <CustomInput
              name="aadharNumber"
              label="Aadhar number"
              placeholder="Enter aadhar"
              required={true}
            />
          </div>
          <div className="sm:col-span-4">
            <CustomInput
              name="panNumber"
              label="Pan"
              placeholder="Enter pan"
              required={true}
            />
          </div>
          <div className="sm:col-span-4">
            <CustomFileUploader
              label="Upload Staff Aadhar Card"
              name="aadharPic"
              required={true}
              onChange={handleFileChange}
            />
          </div>

          <div className="sm:col-span-4">
            <CustomFileUploader
              label="Upload Staff PAN Card"
              name="panCardPic"
              required={true}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default StaffPersonalDetails;
