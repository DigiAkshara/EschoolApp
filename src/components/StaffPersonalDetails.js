import React, { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Datepicker from "react-tailwindcss-datepicker";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import {  UserCircleIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import CustomDate from "../commonComponent/CustomDate";
import CustomRadio from "../commonComponent/CustomRadio";
import CustomFileUploader from "../commonComponent/CustomFileUploader";


function StaffPersonalDetails() {

  const notificationMethods = ["Male", "Female", "Other"];



  return (
    <form >
      <div className="">
        <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
              Staff Personal Details
            </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
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
              <CustomDate 
                  name="DOJ"
                  label="Date Of Joining"
                  required={true}
                  />
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
                  options={notificationMethods}
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
                    { value: "andhra_pradesh", label: "Andhra Pradesh" },
                    { value: "telangana", label: "Telangana" },
                    { value: "tamil_nadu", label: "Tamil Nadu" },
                  ]}
                  required={true}
                />
              
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  id="pincode"
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
                  id="permanentState"
                  name="permanentState"
                  label="State"
                  options={[
                    { value: "andhra_pradesh", label: "Andhra Pradesh" },
                    { value: "telangana", label: "Telangana" },
                    { value: "tamil_nadu", label: "Tamil Nadu" },
                  ]}
                  required={true}
                />
               
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  id="permanentPincode"
                  name="permanentPincode"
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
                  name="aadhar"
                  label="Aadhar number"
                  placeholder="Enter aadhar"
                  required={true}
                />
                
              </div>
              <div className="sm:col-span-4">
                <CustomInput
                  name="panNo"
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
                />
              </div>

              <div className="sm:col-span-4">
                <CustomFileUploader
                  label="Upload Staff PAN Card"
                  name="panCardPic"
                  required={true}
                />
              </div>

          
          </div>
          </div>

      </div>
    </form>
  );
}

export default StaffPersonalDetails;
