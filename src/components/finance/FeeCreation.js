import { DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FieldArray, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'
import { getData, postData } from '../../app/api'
import { CLASSES, FEE_GROUP, FEES } from '../../app/url'
import { handleApiResponse } from '../../commonComponent/CommonFunctions'
import CustomCheckBox from '../../commonComponent/CustomCheckBox'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'

function FeeCreation({ onClose, getFees }) {
  const { academicYear } = useSelector((state) => state.appConfig);
  const [classList, setClassList] = useState([])
  const [academicYears, setAcademicYears] = useState([])
  const [feeGroups, setFeeGroups] = useState([])

  const getInitialValues = () => {
    return {
      academicYear: '',
      feeGroup: '',
      feeTitle: '',
      fees: classList.map((item) => ({
        name: item.name,
        _id: item._id,
        checked: false,
        amount: '',
      })),
    }
  }

  const getValidationSchema = () => {
    return Yup.object({
      academicYear: Yup.string().required('Academic year is required'),
      feeGroup: Yup.string().required('Fee Group is required'),
      feeTitle: Yup.string().required('Fee Title is required'),
      fees: Yup.array().of(
        Yup.object().shape({
          checked: Yup.boolean(),
          amount: Yup.string().test(
            'is-required-if-checked',
            'Amount is required',
            function (value) {
              const { checked } = this.parent // Access sibling field 'checked'
              if (checked && (!value || isNaN(value))) {
                return false // Fail validation if checked but amount is invalid
              }
              return true // Pass validation otherwise
            },
          ),
        }),
      ),
    })
  }

  const handleSubmit = async (values) => {
    try {
      const response = await postData(FEES, values)
      getFees()
      handleApiResponse(response.data.message, 'success')
      onClose()
    } catch (error) {
      handleApiResponse(error)
    }
  }

  useEffect(() => {
    if (academicYear) {
      setAcademicYears([{
        label: academicYear.year,
        value: academicYear._id
      }])
    }
  }, [academicYear])

  useEffect(() => {
    getFeeDetails()
  }, [])

  const getFeeDetails = async () => {
    try {
      const [classRes, feeGroupRes] = await Promise.all([
        getData(CLASSES),
        getData(FEE_GROUP),
      ])
      setClassList(classRes.data.data)
      let feeGroupData = feeGroupRes.data.data.map((item) => {
        return {
          label: item.name, // Displayed text in the dropdown
          value: item._id,
        }
      })
      setFeeGroups(feeGroupData)
    } catch (error) {
      handleApiResponse(error)
    }
  }



  const findTransportFee = (value) => {
    let transportFee = false
    feeGroups.forEach((item) => {
      if (item.value === value) {
        transportFee = item.label.toLowerCase() === "transport fee"
      }
    })
    return transportFee
  }

  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        enableReinitialize
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Form>
              <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <DialogPanel
                      transition
                      className="pointer-events-auto w-screen max-w-3xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                    >
                      <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                        <div className="flex min-h-0 flex-1 flex-col">
                          <div className="bg-purple-900 px-3 py-3 sm:px-6">
                            <div className="flex items-start justify-between">
                              <DialogTitle className=" text-base font-semibold text-white">
                                Fee Structure
                              </DialogTitle>
                              <div className="ml-3 flex h-7 items-center">
                                <button
                                  type="button"
                                  onClick={onClose}
                                  className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                  <span className="absolute -inset-2.5" />
                                  <span className="sr-only">Close panel</span>
                                  <XMarkIcon
                                    aria-hidden="true"
                                    className="size-6"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="relative flex-1 px-6 py-6 sm:px-6 overflow-y-auto">
                            <div className="form-content">
                              {/* Basic details form */}
                              <div className="">
                                <div className="pb-4 mb-4">
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                    <div className="sm:col-span-1">
                                      <CustomSelect
                                        name="academicYear"
                                        label="Academic year"
                                        required={true}
                                        options={academicYears}
                                      />
                                    </div>

                                    <div className="sm:col-span-1">
                                      <CustomSelect
                                        name="feeGroup"
                                        label="Fee Group"
                                        required={true}
                                        options={feeGroups}
                                        onChange={(e) => {
                                          let dumpList = []
                                          values.fees.forEach((item) => {
                                            dumpList.push({
                                              ...item,
                                              checked: false,
                                              amount: '',
                                            })
                                          })
                                          setFieldValue('fees', dumpList)
                                          setFieldValue('feeGroup', e.target.value)
                                          setFieldValue('allClasses', '')
                                          if (findTransportFee(e.target.value)) {
                                            setFieldValue('feeTitle', "Bus Fee")
                                          } else {
                                            setFieldValue('feeTitle', '')
                                          }
                                        }}
                                      />
                                    </div>

                                    <div className="sm:col-span-1">
                                      <CustomInput
                                        name="feeTitle"
                                        label="Fee Title"
                                        placeholder="Enter Fee Title"
                                        required={true}
                                        disabled={findTransportFee(values.feeGroup)}
                                      />
                                    </div>
                                  </div>
                                  <div className="grid">
                                    <div className='mt-4 sm:col text-sm/6'>
                                      <label htmlFor="sameAsPresent" className="font-regular text-yellow-500">
                                        Note: To hide the fee amount on the receipt, add the fee type under 'Miscellaneous' in the fee group.
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                                  <thead className="bg-purple-100">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="relative px-7 sm:w-12 sm:px-6"
                                      >
                                        <CustomCheckBox
                                          name="allClasses"
                                          checked={values.allClasses}
                                          onChange={() => {
                                            let dumpList = []
                                            values.fees.forEach((item) => {
                                              dumpList.push({
                                                ...item,
                                                checked: !values.allClasses,
                                              })
                                            })
                                            setFieldValue('fees', dumpList)
                                            setFieldValue(
                                              'allClasses',
                                              !values.allClasses,
                                            )
                                          }}
                                          disabled={findTransportFee(values.feeGroup)}
                                        />
                                      </th>
                                      <th
                                        scope="col"
                                        className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                      >
                                        <a
                                          href="#"
                                          className="group inline-flex"
                                        >
                                          Class
                                        </a>
                                      </th>

                                      <th
                                        scope="col"
                                        className="px-2 py-2 text-left text-sm font-semibold text-gray-900 max-w-10"
                                      >
                                        <a
                                          href="#"
                                          className="group inline-flex"
                                        >
                                          Fees
                                        </a>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 bg-white">
                                    {values.fees.length >= 0 ? (
                                      <FieldArray name="fees">
                                        {() =>
                                          values.fees.map((fee, index) => (
                                            <tr key={fee._id}>
                                              <td className="relative px-7 sm:w-12 sm:px-6">
                                                <CustomCheckBox
                                                  name={`fees[${index}].checked`}
                                                  checked={
                                                    values.fees[index].checked
                                                  }
                                                  disabled={findTransportFee(values.feeGroup)}
                                                  onChange={(e) => {
                                                    let dumpList = values.fees
                                                    dumpList[index].checked =
                                                      !dumpList[index].checked
                                                    let isAllChecked =
                                                      dumpList.every(
                                                        (item) => item.checked,
                                                      )
                                                    setFieldValue(
                                                      'fees',
                                                      dumpList,
                                                    )
                                                    setFieldValue(
                                                      'allClasses',
                                                      isAllChecked,
                                                    )
                                                  }}
                                                />
                                              </td>
                                              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                {fee.name}
                                              </td>
                                              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                                <CustomInput
                                                  name={`fees[${index}].amount`}
                                                  disabled={
                                                    !values.fees[index].checked
                                                  }
                                                  placeholder="Enter Fee Amount"
                                                  type="number"
                                                />
                                              </td>
                                            </tr>
                                          ))
                                        }
                                      </FieldArray>
                                    ) : (
                                      <tr>
                                        <td colSpan={3} className="text-center">
                                          No Classes Found, Please create class first.
                                        </td>
                                      </tr>
                                    )}
                                    <tr className="bg-purple-100">
                                      <td className="relative px-7 sm:w-12 sm:px-6"></td>
                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                      <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 max-w-10"></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex shrink-0 justify-between px-4 py-4">
                          <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                          >
                            Cancel
                          </button>

                          <div>
                            <button
                              type="submit"
                              className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </DialogPanel>
                  </div>
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default FeeCreation
