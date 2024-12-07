import React, { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Datepicker from "react-tailwindcss-datepicker";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import { useDispatch, useSelector } from "react-redux";
import CustomFileUploader from "../commonComponent/CustomFileUploader";


function StaffCTCDetails({ goNext, onPrevious, setFormRef }) {
  const [file, setFile] = useState(null);

  return (
    <form >
      <div className="">
        <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
        Bank Details
            </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
                <CustomInput
                  name="accountNumber"
                  label="Account number"
                  placeholder="Enter Account number"
                  required={true}
                />
                
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="reAccountNumber"
                  label="Re-Enter Account number"
                  placeholder="Enter Account number"
                  required={true}
                />
               
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="ifscCode"
                  label="IFSC code"
                  placeholder="Enter IFSC"
                  required={true}
                />
                
              </div>

              <div className="sm:col-span-2">
                <CustomSelect
                  id="bankName"
                  name="bankName"
                  label="Bank Name"
                  required={true}
                  options={[
                    { value: "bankName1", label: "Bank Name 1" },
                    { value: "bankName2", label: "Bank Name 2" },
                    { value: "bankName3", label: "Bank Name 3" },
                  ]}
                />
                
               
              </div>

              <div className="sm:col-span-4">
              <CustomFileUploader
                  label="Upload Bank Passbook "
                  name="passBookPic"
                  required={true}
                />
                                
              </div>

                         
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
          Payroll Details
            </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          
            <div className="sm:col-span-4">
                <CustomSelect
                  name="payroll"
                  label="Payroll "

                  required={true}
                  options={[
                    { value: "payroll1", label: "Payroll 1" },
                    { value: "payroll2", label: "Payroll 2" },
                    { value: "payroll3", label: "Payroll 3" },
                  ]}
                />
               
              </div>
          </div>
        </div>

      </div>
    </form>
  );
}

export default StaffCTCDetails;
