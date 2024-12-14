import { UserCircleIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomDate from "../commonComponent/CustomDate";
import CustomFileUploader from "../commonComponent/CustomFileUploader";
import CustomInput from "../commonComponent/CustomInput";
import CustomRadio from "../commonComponent/CustomRadio";
import CustomSelect from "../commonComponent/CustomSelect";
import { bloodGroup, caste, gender, nationality, occupation, religion, states } from "../commonComponent/CommonFunctions";
import CustomCheckBox from "../commonComponent/CustomCheckBox";

function BasicInfo() {
  return (
    <>
      <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
          Personal Details
        </h2>
        <div className=" grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="col-span-full">
            <label
              htmlFor="first-name"
              className="block text-sm/6 font-regular text-gray-900"
            >
              Passport Size Photo<span className="pl-1 text-red-500">*</span>
            </label>
            <CustomFileUploader isProfile={true} name="profilePic" />
            {/* <div className="mt-2 flex items-center gap-x-3">
              <img
                alt=""
                src={"/LoginImage.jpg"}
                className="w-12 h-12 object-cover rounded-full"
              />

              <label
                htmlFor="file-upload"
                type="button"
                className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <span>Change</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                />
              </label>
            </div> */}
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="firstName"
              label="Student First Name"
              placeholder="Enter First Name"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="lastName"
              label="Student last Name"
              placeholder="Enter Last Name"
              required={true}
            />
          </div>
          <div className="sm:col-span-2">
            <CustomDate name="DOB" label="Date of Birth" required={true} />
          </div>

          <div className="sm:col-span-2">
            <CustomRadio
              name="gender"
              label="Gender"
              required={true}
              options={gender}
            />
          </div>

          <div className="sm:col-span-1">
            <CustomSelect
              name="nationality"
              label="Nationality"
              options={nationality}
              required={true}
            />
          </div>

          <div className="sm:col-span-1">
            <CustomSelect
              name="religion"
              label="Religion"
              options={religion}
              required={true}
            />
          </div>

          <div className="sm:col-span-1">
            <CustomSelect
              name="cast"
              label="Cast"
              options={caste}
              required={true}
            />
          </div>

          <div className="sm:col-span-1">
            <CustomInput
              name="subCast"
              label="Sub Caste"
              placeholder="Enter Sub Caste"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomSelect
              id="bloodGroup"
              name="bloodGroup"
              label="Blood Group"
              options={bloodGroup}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="aadharNumber"
              label="Aadhar number"
              placeholder="Enter aadhar"
              required={true}
            />
          </div>

          <div className="sm:col-span-4">
            <CustomFileUploader
              label="Upload Student Aadhar Card"
              name="aadharPic"
              required={true}
            />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
          Father Details
        </h2>
        <div className=" grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
            <CustomInput
              name="fatherDetails.name"
              label="Father Full Name"
              placeholder="Enter Name"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="fatherDetails.mobileNumber"
              label="Mobile Number"
              placeholder="Enter mobile"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomSelect
              name="fatherDetails.occupation"
              label="Occupation"
              options={occupation}
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="fatherDetails.email"
              label="Father Email"
              placeholder="Enter email"
              required={true}
            />
          </div>
        </div>
      </div>
      <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
          Mother Details
        </h2>
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
            <CustomInput
              name="motherDetails.name"
              label="Mother Full Name"
              placeholder="Enter Name"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="motherDetails.mobileNumber"
              label="Mobile Number"
              placeholder="Enter mobile"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomSelect
              name="motherDetails.occupation"
              label="Occupation"
              options={occupation}
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="motherDetails.email"
              label="Mother Email"
              placeholder="Enter email"
              required={true}
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
              name="presentAdress.area"
              label="Area"
              placeholder="Enter Area"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="presentAdress.city"
              label="City"
              placeholder="Enter City"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomSelect
              name="presentAdress.state"
              label="State"
              options={states}
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="presentAdress.pincode"
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
          <CustomCheckBox name="isSameAsPresent" label="Same as Present Address" />
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

          <div className="sm:col-span-4">
            <CustomFileUploader
              name="uploadParentID"
              label="Upload Parents ID Proofs"
              required={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default BasicInfo;
