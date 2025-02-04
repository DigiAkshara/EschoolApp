import React from 'react'
import { postData } from '../../app/api'
import { UPLOAD } from '../../app/url'
import { banks, handleApiResponse } from '../../commonComponent/CommonFunctions'
import CustomFileUploader from '../../commonComponent/CustomFileUploader'
import CustomInput from '../../commonComponent/CustomInput'
import CustomRadio from '../../commonComponent/CustomRadio'
import CustomSelect from '../../commonComponent/CustomSelect'

function StaffCTCDetails({ values, setFieldValue }) {
  const handleFileChange = async (e) => {
    try {
      const formData = new FormData()
      formData.append('file', e.target.files[0])
      let response = await postData(UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setFieldValue(e.target.name, response.data)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const paymentModes = [
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
  ]

  return (
    <>
      <div className="border-b border-gray-900/10 pb-4 mb-4">
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
            <CustomRadio
              name="paymentMode"
              label="Payment Mode"
              required={true}
              options={paymentModes}
              onChange={(e) => {
                setFieldValue('paymentMode', e.target.value)
                setFieldValue('accountNumber', '')
                setFieldValue('confirmAccountNumber', '')
                setFieldValue('ifscCode', '')
                setFieldValue('bankName', '')
                setFieldValue('bankPassbook', '')
                setFieldValue('amount', '')
              }}
            />
          </div>
        </div>
        {values.paymentMode === 'online' &&
          <div>
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
                  name="confirmAccountNumber"
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
                  options={banks}
                />
              </div>

              <div className="sm:col-span-4">
                <CustomFileUploader
                  label="Upload Bank Passbook "
                  name="bankPassbook"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>}
      </div>
      {values.paymentMode !== '' &&
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
        </div>}
    </>
  )
}

export default StaffCTCDetails
