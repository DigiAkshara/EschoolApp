import { DialogPanel, DialogTitle } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FieldArray, Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from "yup";
import { getData, postData } from '../../app/api';
import { updateFees } from '../../app/reducers/studentSlice';
import { FEES, STOPS, STUDENT } from '../../app/url';
import { capitalizeWords, feeduration, handleApiResponse } from '../../commonComponent/CommonFunctions';
import CustomCheckBox from '../../commonComponent/CustomCheckBox';
import CustomDate from '../../commonComponent/CustomDate';
import CustomInput from '../../commonComponent/CustomInput';
import CustomSelect from '../../commonComponent/CustomSelect';

const BulkFeeModal = ({ data, students, onClose }) => {
  const dispatch = useDispatch()
  const { fees: allFees } = useSelector((state) => state.students);
  const { classes, sections } = useSelector((state) => state.students)
  const [checked, setChecked] = useState(false)
  const [busRoutes, setBusRoutes] = useState([])
  const [busRouteOpts, setBusRouteOpts] = useState([])
  const [fees, setFees] = useState([])
  const initialValues = {
    fees: fees,
    busRoute: '',
  }

  const getBusRoutes = async () => {
    try {
      let res = await getData(STOPS)
      let routes = res.data.data.map((item) => ({
        value: item._id,
        label: `${item.name} - ${item.route.name}`,
      }))
      setBusRoutes(res.data.data)
      setBusRouteOpts(routes)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const getFees = async () => {
    try {
      let res = await getData(FEES)
      dispatch(updateFees(res.data.data))
    } catch (error) {
      handleApiResponse(error)
    }
  }

  useEffect(() => {
    getFees(FEES)
    getBusRoutes()
  }, [])

  useEffect(() => {
    let dumpLIst = []
    allFees.forEach(item => {
      if (item.isGlobal || item.class?._id === data.class) {
        let discount = 0
        dumpLIst.push({
          id: item._id,
          isChecked: false,
          feeName: item.name,
          feeType: '',
          dueDate: null,
          discount: discount,
          installmentAmount: item.amount - discount, //installment fee
          totalFee: item.amount * 1, //total fee
        })
      }
    })
    setFees(dumpLIst)
  }, [allFees, data])

  const handleFeeChange = (e, index, setFieldValue, values) => {
    let dumpLIst = values.fees
    if (e.target.name.includes('feeType')) {
      dumpLIst[index].feeType = e.target.value
    } else {
      if (e.target.value * 1 <= values.fees[index].totalFee * 1) {
        dumpLIst[index].discount = e.target.value
        dumpLIst[index].installmentAmount =
          values.fees[index].totalFee - e.target.value
      }
    }
    setFieldValue('fees', dumpLIst)
  }

  const getTotalFee = (values) => {
    return values.fees
      .filter((item) => item.isChecked)
      .reduce((acc, curr) => acc + curr.installmentAmount, 0)
  }

  const selectAllFees = (e, setFieldValue) => {
    let dumpList = []
    fees.forEach((item) => {
      dumpList.push({
        ...item,
        isChecked: e.target.checked,
      })
    })
    setFieldValue('fees', dumpList)
    setChecked(e.target.checked)
  }

  const handleFeeChecked = (e, index, setFieldValue, values) => {
    let dumpList = values.fees
    dumpList[index].isChecked = e.target.checked
    dumpList[index].feeType = ''
    dumpList[index].discount = 0
    dumpList[index].dueDate = null
    let isAllChecked = dumpList.every((item) => item.isChecked)
    setFieldValue('fees', dumpList)
    setChecked(isAllChecked)
    if (dumpList[index].feeName === 'Bus Fee') {
      setFieldValue('busRoute', '')
    }
  }

  const getClassName = () => {
    const cls = classes.find(item => item.value === data.class)
    return capitalizeWords(cls?.label) || "N/A"
  }

  const getSectionName = () => {
    if (data.section === '') return 'All Sections'
    const sec = sections.find(item => item.value === data.section)
    return capitalizeWords(sec?.label) || 'N/A'
  }


  const isSelectedBusFee = (values) => {
    let isBusFee = false
    values.fees.forEach((item) => {
      if (item.feeName === 'Bus Fee' && item.isChecked) {
        isBusFee = true
      }
    })
    return isBusFee
  }

  const disableRouteField = (values) => {
    let isDisabled = false
    if (isSelectedBusFee(values) && values._id) {
      isDisabled = true
    }
    return isDisabled
  }

  const handleRouteChange = (e, values, setFieldValue) => {
    let dumpList = values.fees
    const index = dumpList.findIndex((item) => item.feeName === 'Bus Fee')
    const selectedRoute = busRoutes.find((item) => item._id === e.target.value)
    if (selectedRoute) {
      dumpList[index].discount = 0
      dumpList[index].totalFee = selectedRoute?.amount || 0
      dumpList[index].installmentAmount = selectedRoute.amount * 1 || 0
      setFieldValue('fees', dumpList)
    }
    setFieldValue('busRoute', e.target.value)
  }

  const getValidationSchema = () => {
    return Yup.object({
      fees: Yup.array()
        .of(
          Yup.object().shape({
            isChecked: Yup.boolean(),
            discount: Yup.number()
              .min(0, "Discount must be at least 0")
              .max(9999, "Discount must be a numeric value up to 4 digits"),
            feeName: Yup.string(),
            installmentAmount: Yup.number(),
            totalFee: Yup.number(),
            feeType: Yup.string().test(
              "is-required-if-checked",
              "Duration is required",
              function (value) {
                const { isChecked } = this.parent;
                if (isChecked && !value) {
                  return false;
                }
                return true;
              }
            ),
            dueDate: Yup.date().nullable().test(
              "is-required-if-checked",
              "Due date is required",
              function (value) {
                const { isChecked } = this.parent; // Access sibling field 'checked'
                if (isChecked && !value) {
                  return false; // Fail validation if checked but amount is invalid
                }
                return true; // Pass validation otherwise
              }
            ),
          })
        )
        .test(
          "at-least-one-checked",
          "At least one fee must be selected",
          (items) => items.some((item) => item.isChecked)
        ),
      busRoute: Yup.string().nullable().test(
        "is-required-if-busfee-checked",
        "Bus route is required",
        function (value) {
          const { fees } = this.parent;
          const index = fees.findIndex((item) => item.feeName === "Bus Fee" && item.isChecked);
          if (index !== -1 && !value) {
            return false;
          }
          return true;
        }
      ),
    })
  }

  const handleSubmit = async (values) => {
    let payload = {
      studentIds: students,
      fees: values.fees,
      busRoute: values.busRoute,
    }
    try {
      let res = await postData(STUDENT + '/addFees', payload)
      handleApiResponse(res.data.message, 'success')
      onClose({ refresh: true });
    } catch (e) {
      handleApiResponse(e)
    }
  }

  return (<Formik
    initialValues={initialValues}
    validationSchema={getValidationSchema()}
    onSubmit={handleSubmit}
    enableReinitialize
  >
    {({ values, setFieldValue, errors }) => {
      return (
        <Form>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <DialogPanel
                  transition
                  className="pointer-events-auto w-screen max-w-6xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                >
                  <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col ">
                      <div className="bg-purple-900 px-3 py-3 sm:px-6">
                        <div className="flex items-start justify-between">
                          <DialogTitle className=" text-base font-semibold text-white">
                            Add Bulk Fees
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
                      <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto">
                        <div className="p-3">

                          <div className="">
                            <div className="pb-4 mb-4">
                              <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                                Fee details
                              </h2>
                              <div className="rounded-md bg-purple-100 p-3 mb-4">
                                <div className="flex">
                                  <div className="shrink-0">
                                    <InformationCircleIcon
                                      aria-hidden="true"
                                      className="size-5 text-purple-400"
                                    />
                                  </div>
                                  <div className="ml-3 flex-1 md:flex md:justify-between">
                                    <p className="text-sm text-blue-700">
                                      {`Academic Fee Details - Class: ${getClassName()} - Sec - ${getSectionName()}`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {errors.fees && typeof errors.fees === 'string' && (
                                <div className="text-red-500">{errors.fees}</div>
                              )}

                              <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300">
                                <thead className="bg-purple-100">
                                  <tr>
                                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                                      <CustomCheckBox
                                        checked={checked}
                                        type="checkbox"
                                        className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                                        name="selectAll"
                                        onChange={(e) => { selectAllFees(e, setFieldValue) }}
                                      // disabled={values._id ? true : false}
                                      />
                                    </th>
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
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Duration
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Discount
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Due Date
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Actual Amount
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Amount After Discount
                                      </a>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                  <FieldArray name="fees">
                                    {() =>
                                      values.fees.map((item, index) => (
                                        <tr key={item.id}>
                                          <td className="relative px-7 sm:w-12 sm:px-6">
                                            <CustomCheckBox
                                              name={item.feeName}
                                              checked={item.isChecked}
                                              onChange={(e) => handleFeeChecked(e, index, setFieldValue, values)}
                                            />
                                          </td>

                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            {capitalizeWords(item.feeName)}
                                          </td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            <CustomSelect
                                              name={`fees.${index}.feeType`}
                                              options={feeduration}
                                              value={item.feeType}
                                              onChange={(e) => handleFeeChange(e, index, setFieldValue, values)}
                                              disabled={!item.isChecked}
                                              label="Duration"
                                              isLabelRequired={false}
                                            />
                                          </td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                            <CustomInput
                                              name={`fees.${index}.discount`}
                                              type="number"
                                              value={item.discount}
                                              onChange={(e) => handleFeeChange(e, index, setFieldValue, values)}
                                              disabled={!item.isChecked}
                                            />
                                          </td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                            <CustomDate
                                              name={`fees.${index}.dueDate`}
                                              value={item.dueDate}
                                              minDate={moment().format('MM-DD-YYYY')}
                                              disabled={!item.isChecked}
                                            />
                                          </td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                            <CustomInput
                                              name={`fees.${index}.totalFee`}
                                              placeholder="Enter Total Fee"
                                              type="number"
                                              value={item.totalFee}
                                              disabled
                                            />
                                          </td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                                            <CustomInput
                                              name={`fees.${index}.installmentAmount`}
                                              type="number"
                                              value={item.isChecked ? item.installmentAmount : ''}
                                              disabled
                                            />
                                          </td>
                                        </tr>
                                      ))
                                    }
                                  </FieldArray>
                                  <tr className="bg-purple-100">
                                    <td className="relative px-7 sm:w-12 sm:px-6"></td>

                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900">
                                      Total Fee
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 max-w-10">
                                      {getTotalFee(values)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              {isSelectedBusFee(values) && (
                                <div className="border-b border-gray-900/10 pb-4 mb-4 mt-4">
                                  <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                                    Bus Stop Details
                                  </h2>
                                  <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
                                    <div className="sm:col-span-2">
                                      <CustomSelect
                                        name="busRoute"
                                        options={busRouteOpts}
                                        value={values.busRoute}
                                        label="Bus Route"
                                        required={true}
                                        onChange={(e) => handleRouteChange(e, values, setFieldValue)}
                                      // disabled={disableRouteField(values)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
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
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                        >
                          Apply
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
  </Formik>)
}

export default BulkFeeModal