import { Form, Formik } from 'formik'
import moment from 'moment'
import React from 'react'
import * as Yup from 'yup'
import {
  banks,
  handleApiResponse,
  payments,
  uploadFile
} from '../../../commonComponent/CommonFunctions'
import CustomDate from '../../../commonComponent/CustomDate'
import CustomFileUploader from '../../../commonComponent/CustomFileUploader'
import CustomInput from '../../../commonComponent/CustomInput'
import CustomSelect from '../../../commonComponent/CustomSelect'
import CustomRadio from '../../../commonComponent/CustomRadio'

function CollectLoanDetails({ onClose }) {
  const getInitialValues = () => {
    return {
      paymentType: '',
      amount: '',
      paymentMode: '',
      bankDetails: '',
      paidDate: '',
      transactionProof: null,
    }
  }
  const getValidationSchema = () => {
    return Yup.object({
      paymentType: Yup.string().required('Payment Type is required'),
      amount: Yup.string().required('Amount is required'),
      paymentMode: Yup.string().required('Payment Mode is required'),
      bankDetails: Yup.string().test(
        "is-bank-is-not-cash",
        "Bank details are required",
        function (value) {
          const { paymentMode } = this.parent; // Access sibling field 'paymentMode'
          if (paymentMode !== 'cash' && !value) {
            return false; // Fail validation if paymentMode is not 'cash' but value is invalid
          }
          return true; // Pass validation otherwise
        }
      ),
      paidDate: Yup.date().required('Paid Date is required'),
      transactionProof: Yup.object().required('Transaction Proof is required'),
    })
  }


  const handleFileChange = async (e, setFieldValue) => {
    try {
      const file = e.target.files[0] // Get the first selected file
      if (file) {
        const fileResponse = await uploadFile(file) // Upload the file
        setFieldValue(e.target.name, fileResponse) // Update the form field with the response
      }
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const handleSubmit = async (values) => {
    console.log(values)
    // try {
    //   const res = await postData(STUDENT_FEE, values)
    //   handleApiResponse(res.data.message, "success")
    //   onClose()
    // } catch (error) {
    //   handleApiResponse(error)
    // }
  }

  const paymentTypes = [
    { value: 'full', label: 'Total Ouststanding' },
    { value: 'partial', label: 'Other Amount' },
  ]


  return (
    <Formik
      initialValues={getInitialValues()}
      validationSchema={getValidationSchema()}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors }) => (
        <Form>
          <div className="py-4 text-sm/6">
            <div className="flex-1 truncate">
              <div className="student-hdr-info-items-blk mt-2">
                <dl className="grid grid-flow-col auto-cols-min gap-8">
                  <div className="sm:col-span-1">
                    <dt className="text-sm/6 text-gray-500">
                      Loan Issued Date
                    </dt>
                    <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                      {moment().format('DD-MM-YYYY')}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm/6 text-gray-500">
                      Issued Loan Amount
                    </dt>
                    <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                      10000/-
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm/6 text-gray-500">
                      Paid Loan Amount
                    </dt>
                    <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                      1000/-
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm/6 text-gray-500">
                      Total Outstanding Loan Amount
                    </dt>
                    <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                      9000/-
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm/6 text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                      Unpaid
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <hr className="my-4"/>
            <div className=" pb-4 mb-4 mt-4">
              <div className=" grid grid-cols-4 gap-x-4 gap-y-4">
                <div className="sm:col-span-full">
                  <CustomRadio
                    name="paymentType"
                    label="Collect Loan or Advance Amount"
                    required={true}
                    options={paymentTypes}
                  />
                </div>
                <div className="sm:col-span-2">
                  <CustomInput
                    label="Amount"
                    name="amount"
                    required
                  />
                </div>


                <div className="sm:col-span-2">
                  <CustomSelect
                    label="Payment Mode"
                    name="paymentMode"
                    options={payments}
                    required
                  />
                </div>

                {values.paymentMode !== 'cash' && (
                  <div className="sm:col-span-2">
                    <CustomSelect
                      label="Received Bank Details"
                      name="bankDetails"
                      options={banks}
                      required
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <CustomDate
                    label="Paid Date"
                    name="paidDate"
                    required
                    maxDate={moment().format('YYYY-MM-DD')}
                  />
                </div>

                <div className="sm:col-span-2">
                  <CustomFileUploader
                    required={true}
                    label="Upload Transaction Proof"
                    name="transactionProof"
                    onChange={(e) =>
                      handleFileChange(e, setFieldValue)
                    }
                  />
                </div>

              </div>
            </div>
          </div>
          <div className="flex shrink-0 px-4 py-4 bg-gray-100 w-full justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default CollectLoanDetails
