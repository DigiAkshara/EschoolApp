import { UserCircleIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomDate from "../commonComponent/CustomDate";
import CustomFileUploader from "../commonComponent/CustomFileUploader";
import CustomInput from "../commonComponent/CustomInput";
import CustomRadio from "../commonComponent/CustomRadio";
import CustomSelect from "../commonComponent/CustomSelect";
import { gender } from "../commonComponent/CommonFunctions";

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
                  Passport Size Photo
                  <span className="pl-1 text-red-500">*</span>
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <UserCircleIcon
                    aria-hidden="true"
                    className="size-12 text-gray-300"
                  />
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </button>
                </div>
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
                <CustomDate 
                  name="DOB"
                  label="Date of Birth"
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

               <div className="sm:col-span-1">
                <CustomSelect
                  name="nationality"
                  label="Nationality"
                  options={[
                    { value: "", label: "Select Nationality" },
                    { value: "indian", label: "Indian" },
                    { value: "other", label: "Other" },
                  ]}
                  required={true}
                />
              </div>

             <div className="sm:col-span-1">
                <CustomInput
                  name="religion"
                  label="Religion"
                  placeholder="Enter Religion"
                  required={true}
                />
              </div>

               <div className="sm:col-span-1">
                <CustomSelect
                  id="cast"
                  name="cast"
                  label="Cast"
                  options={[
                    { value: "", label: "Select Cast" },
                    { value: "oc", label: "OC" },
                    { value: "bc", label: "BC / OBC" },
                    { value: "sc", label: "SC" },
                    { value: "st", label: "ST" },
                  ]}
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
                  options={[
                    { value: "", label: "Select Blood Group" },
                    { value: "a", label: "A+" },
                    { value: "b", label: "B+" },
                    { value: "ab", label: "AB+" },
                    { value: "o", label: "O+" },
                    { value: "aMinus", label: "A-" },
                    { value: "bMinus", label: "B-" },
                    { value: "abMinus", label: "AB-" },
                    { value: "oMinus", label: "O-" },
                  ]}
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
                  name="fatherName"
                  label="Father Full Name"
                  placeholder="Enter Name"
                  required={true}
                />
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="fatherMobileNumber"
                  label="Mobile Number"
                  placeholder="Enter mobile"
                  required={true}
                />
              </div>

              <div className="sm:col-span-2">
                <CustomSelect
                  id="fatherOccupation"
                  name="fatherOccupation"
                  label="Occupation"
                  options={[
                    { value: "", label: "Select Occupation" },
                    { value: "occupation1", label: "Occupation 1" },
                    { value: "occupation2", label: "Occupation 2" },
                    { value: "occupation3", label: "Occupation 3" },
                  ]}
                  required={true}
                />
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="fatherEmail"
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
                  name="motherName"
                  label="Mother Full Name"
                  placeholder="Enter Name"
                  required={true}
                />              
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="motherMobileNumber"
                  label="Mobile Number"
                  placeholder="Enter mobile"
                  required={true}
                />
              </div>

              <div className="sm:col-span-2">
                <CustomSelect
                  id="motherOccupation"
                  name="motherOccupation"
                  label="Occupation"
                  options={[
                    { value: "", label: "Select Occupation" },
                    { value: "occupation1", label: "Occupation 1" },
                    { value: "occupation2", label: "Occupation 2" },
                    { value: "occupation3", label: "Occupation 3" },
                  ]}
                  required={true}
                />
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="motherEmail"
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
                  name="area"
                  label="Area"
                  placeholder="Enter Area"
                  required={true}
                />
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="city"
                  label="City"
                  placeholder="Enter City"
                  required={true}
                />
              </div>

              <div className="sm:col-span-2">
                <CustomSelect
                  name="state"
                  label="State"
                  options={[
                    { value: "", label: "Select State" },
                    { value: "andhra_pradesh", label: "Andhra Pradesh" },
                    { value: "telangana", label: "Telangana" },
                    { value: "tamil_nadu", label: "Tamil Nadu" },
                  ]}
                  required={true}
                />
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="pincode"
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
              <div className="flex h-6 items-center">
                <input
                  id="sameAsPresent"
                  name="sameAsPresent"
                  type="checkbox"
                  aria-describedby="sameAsPresent-description"
                  className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                />
              </div>
              <div className="ml-3 text-sm/6">
                <label
                  htmlFor="sameAsPresent"
                  className="font-regular text-gray-900"
                >
                  Same as Present Address
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
              <div className="sm:col-span-2">
                <CustomInput
                  name="permanentArea"
                  label="Area"
                  placeholder="Enter Area"
                  required={true}
                />
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="permanentCity"
                  label="City"
                  placeholder="Enter City"
                  required={true}
                />
              </div>

              <div className="sm:col-span-2">
                <CustomSelect
                  name="permanentState"
                  label="State"
                  options={[
                    { value: "", label: "Select State" },
                    { value: "andhra_pradesh", label: "Andhra Pradesh" },
                    { value: "telangana", label: "Telangana" },
                    { value: "tamil_nadu", label: "Tamil Nadu" },
                  ]}
                  required={true}
                />
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="permanentPincode"
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
