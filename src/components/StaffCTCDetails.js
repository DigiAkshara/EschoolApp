import React, { useState } from "react";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import CustomFileUploader from "../commonComponent/CustomFileUploader";
import { postData } from "../app/api";
import { UPLOAD } from "../app/url";
import { banks } from "../commonComponent/CommonFunctions";

function StaffCTCDetails({ values, setFieldValue }) {

   const handleFileChange = async (e) => {
        try {
          const formData = new FormData();
          formData.append('file', e.target.files[0]);
          let response = await postData(UPLOAD, formData, {headers: {
            'Content-Type': 'multipart/form-data',
          }});
          if (response.status === 200 || response.status === 201) {
            setFieldValue(e.target.name, response.data);
          } else {
            alert(response.message);
          }
        } catch (error) {
          console.log(error);
        }
      }

  return (
    <>
      <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
          Bank Details
        </h2>
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
            <CustomInput
              name="bankDetails.accountNumber"
              label="Account number"
              placeholder="Enter Account number"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="bankDetails.reAccountNumber"
              label="Re-Enter Account number"
              placeholder="Enter Account number"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomInput
              name="bankDetails.ifscCode"
              label="IFSC code"
              placeholder="Enter IFSC"
              required={true}
            />
          </div>

          <div className="sm:col-span-2">
            <CustomSelect
              id="bankName"
              name="bankDetails.bankName"
              label="Bank Name"
              required={true}
              options={banks}
            />
          </div>

          <div className="sm:col-span-4">
            <CustomFileUploader
              label="Upload Bank Passbook "
              name="bankDetails.passBookPic"
              required={true}
              onChange={handleFileChange}
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
            <CustomInput
              name="amount"
              type="number"
              label="Payment Amount"
              placeholder="Enter Amount"
              required={true}
            />

          </div>
        </div>
      </div>
    </>
  );
}

export default StaffCTCDetails;
