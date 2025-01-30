import { PlusIcon } from '@heroicons/react/20/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FieldArray, Form, Formik } from 'formik'
import moment, { duration } from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'
import { getData, postData } from '../../app/api'
import { FEES, STUDENT_FEE } from '../../app/url'
import {
  banks,
  capitalizeWords,
  feeduration,
  handleApiResponse,
  payments,
  uploadFile,
} from '../../commonComponent/CommonFunctions'
import CustomDate from '../../commonComponent/CustomDate'
import CustomFileUploader from '../../commonComponent/CustomFileUploader'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'

function FinancCollectFeesDetails({ onClose }) {
  const [allFees, setAllFees] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const selectedData = useSelector((state) => state.fees.selectedFee)
  const classId = selectedData?.academic.class._id
  const selectedFee = selectedData?.fees
  const getInitialValues = () => {
    return {
      fees: selectedFee?.feeList.map((item) => {
        const pendingAmount = item.paybalAmount * 1 - (item.paidAmount * 1 || 0)
        return ({
          _id: item.fee._id,
          feeName: item.fee.name,
          duration: item.duration,
          totalAmount: item.paybalAmount,
          disCount: item.discount,
          paidAmount: item.paidAmount * 1 || 0,
          pendingAmount: pendingAmount,
          dueDate: item.dueDate || null,
          status: item.fee.paymentStatus ? capitalizeWords(item.fee.paymentStatus) : 'Pending',
          paymentAmount: ""
        })
      }),
      transactionDate: '',
      paymentMode: '',
      bank: '',
      transactionId: '',
      transactionProof: '',
      totalPaymentAmount: ""
    }
  }
  const getValidationSchema = () => {
    return Yup.object({
      fees: Yup.array().of(
        Yup.object({
          disCount: Yup.number().test(
            'if-value-is-exist-must-be-less-than-or-equalto-total-amount',
            'Discount cannot be greater than total amount',
            function (value) {
              const { totalAmount } = this.parent; // Access sibling field 'total amount'
              if (value && value * 1 > ((totalAmount * 1)/4)) {
                return false; // Fail validation if discount is greater than total amount
              }
              return true; // Pass validation otherwise
            }),
          duration: Yup.string().required('Duration is required'),
          totalAmount: Yup.number().required('Total Amount is required'),
          dueDate: Yup.date().nullable().required('Due Date is required'),
          paymentAmount: Yup.number().test(
            'if-value-is-exist-must-be-less-than-or-equalto-pending-amount',
            'Amount cannot be greater than pending amount',
            function (value) {
              const { pendingAmount } = this.parent; // Access sibling field 'pending amount'
              if (value && value * 1 > pendingAmount * 1) {
                return false; // Fail validation if paymentMode is not 'cash' but value is invalid
              }
              return true; // Pass validation otherwise
            }),
        }),
      ).test(
        "at-least-one-amount-must-be-entered",
        "At least one amount must be pay",
        (items) => items.some((item) => item.paymentAmount && item.paymentAmount > 0),
      ),
      transactionDate: Yup.date()
        .nullable()
        .required('Transaction Date is required'),
      paymentMode: Yup.string().required('Payment Mode is required'),
      bank: Yup.string().test(
        "is-bank-is-not-cash",
        "School Credit Bank is required",
        function (value) {
          const { paymentMode } = this.parent; // Access sibling field 'paymentMode'
          if (paymentMode !== 'cash' && !value) {
            return false; // Fail validation if paymentMode is not 'cash' but value is invalid
          }
          return true; // Pass validation otherwise
        }
      ),
      transactionId: Yup.string().test(
        "is-bank-is-not-cash",
        "Transaction Id is required",
        function (value) {
          const { paymentMode } = this.parent; // Access sibling field 'paymentMode'
          if (paymentMode !== 'cash' && !value) {
            return false; // Fail validation if paymentMode is not 'cash' but value is invalid
          }
          return true; // Pass validation otherwise
        }
      ),
      transactionProof: Yup.object().nullable()
    })
  }
  const getFeesData = async () => {
    try {
      const res = await getData(FEES)
      const feeRes = res.data.data
      let dummyList = feeRes.filter((item) => (item.isGlobal || item.class?._id === classId))
      setAllFees(dummyList)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const handleAddFee = (item, fees, setFieldValue) => {
    const newFee = {
      _id: item._id,
      feeName: item.name,
      duration: item.duration,
      totalAmount: item.amount,
      disCount: item.discount,
      paidAmount: "-",
      pendingAmount: item.amount,
      dueDate: item.dueDate || null,
      status: 'Pending',
      paymentAmount: "",
      isAdded: true
    }

    let dummyList = [...fees, newFee]
    setFieldValue('fees', dummyList)
    setShowDropdown(false)
  }

  const handleRemove = (feeId, fees, setFieldValue) => {
    const updatedFees = fees.filter((fee) => fee._id !== feeId)
    setFieldValue('fees', updatedFees) // Update Formik state
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
    try {
      const res = await postData(STUDENT_FEE, values)
      handleApiResponse(res.data.message, "success")
      onClose()
    } catch (error) {
      handleApiResponse(error)
    }
  }

  useEffect(() => {
    if (selectedData) {
      const classId = selectedData?.academic.class._id
      getFeesData(classId)
    }
  }, [selectedData])

  const checkDisabled = (values) => {
    return allFees
      .filter((fee) => !values.fees.some((selectedFee) => selectedFee._id === fee._id)).length === 0
  }

  const getTotalAmount = (values, key) => {
    return values.fees.reduce((total, fee) => total + fee[key] * 1, 0)
  }

  return (
    <Formik
      initialValues={getInitialValues()}
      validationSchema={getValidationSchema()}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors }) => (
        <Form>
          <div className="py-4 text-sm/6">
            <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
              <thead className="bg-purple-100">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                  >
                    <a href="#" className="group inline-flex">
                      Fee Name
                    </a>
                  </th>

                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Duration
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Total Fee
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Discount
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Paid Amount
                    </a>
                  </th>

                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Pending Balance
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Due Date
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Status
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Now Paid
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                  ></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <FieldArray name="fees">
                  {() =>
                    values.fees.map((fee, index) => (
                      <tr key={fee._id}>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {capitalizeWords(fee.feeName)}
                        </td>

                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {fee.isAdded ? (
                            <CustomSelect
                              name={`fees.${index}.duration`} // Dynamically bind the name
                              placeholder="Duration"
                              options={feeduration} />
                          ) : capitalizeWords(fee.duration)}
                        </td>

                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {fee.isAdded ? (
                            <CustomInput
                              name={`fees.${index}.totalAmount`} // Dynamically bind the name
                              placeholder="Fee Amount"
                              onChange={(e) => {
                                setFieldValue(`fees.${index}.totalAmount`, e.target.value)
                                setFieldValue(`fees.${index}.pendingAmount`, e.target.value)
                              }} />
                          ) : fee.totalAmount}
                        </td>

                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {fee.isAdded ? (
                            <CustomInput
                              name={`fees.${index}.disCount`} // Dynamically bind the name
                              placeholder="Discount Amount" />
                          ) : fee.disCount}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {fee.paidAmount}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {fee.pendingAmount}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <CustomDate
                            name={`fees.${index}.dueDate`}
                            minDate={moment().format('YYYY-MM-DD')}
                          />
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {fee.status ?
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                              {fee.status}
                            </span> : fee.status}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <div className="sm:col-span-1">
                            <CustomInput
                              name={`fees[${index}].paymentAmount`}
                              className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                            />
                          </div>
                        </td>
                        {fee.isAdded && (
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            <button onClick={() => handleRemove(fee._id, values.fees, setFieldValue)}>
                              <XMarkIcon
                                aria-hidden="true"
                                className="text-red-500 size-5"
                              />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  }
                </FieldArray>

                <tr>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500" colSpan={8}>
                    <button
                      type="button"
                      className="inline-flex items-center  px-3 py-2 text-sm font-semibold text-purple-500  "
                      onClick={() => setShowDropdown(!showDropdown)}
                      disabled={checkDisabled(values)}
                    >
                      <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
                      Add New
                    </button>

                    {showDropdown && (
                      <ul className="border rounded shadow-md mt-2 bg-white">
                        {allFees
                          .filter((fee) => !values.fees.some((selectedFee) => selectedFee._id === fee._id))
                          .map((fee, index) => (
                            <li
                              key={index}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                              onClick={() => handleAddFee(fee, values.fees, setFieldValue)}
                            >
                              {fee.name}
                            </li>
                          ))}
                      </ul>
                    )}
                  </td>
                  <td>
                    {errors.fees && typeof errors.fees === 'string' && (
                      <div className="text-red-500">{errors.fees}</div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-right">
                    Total Pending:
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-left">
                    ₹ {getTotalAmount(values, "pendingAmount")}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-right">
                    Total Paid:
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 text-left">
                    ₹ {getTotalAmount(values, "paymentAmount")}
                  </td>
                </tr>

              </tbody>
            </table>


            <div className=" pb-4 mb-4 mt-4">
              <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                Transaction Details
              </h2>

              <div className=" grid grid-cols-4 gap-x-4 gap-y-4">
                <div className="sm:col-span-1">
                  <CustomDate
                    name="transactionDate"
                    label="Paid Date"
                    required={true}
                    maxDate={moment().format('YYYY-MM-DD')}
                  />
                </div>

                <div className="sm:col-span-1">
                  <CustomSelect
                    label="Payment Mode"
                    name="paymentMode"
                    options={payments}
                    required
                  />
                </div>

                {values.paymentMode !== 'cash' && (
                  <>
                    <div className="sm:col-span-1">
                      <CustomSelect
                        label="School Credit Bank"
                        name="bank"
                        options={banks}
                        required
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <CustomInput
                        label="Transaction ID"
                        placeholder="Enter Transaction ID"
                        name="transactionId"
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-x-4 gap-y-4">
              <div className="sm:col-span-1">
                <CustomFileUploader
                  label="Upload Transaction Proof"
                  name="transactionProof"
                  onChange={(e) =>
                    handleFileChange(e, setFieldValue)
                  }
                />
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

export default FinancCollectFeesDetails
