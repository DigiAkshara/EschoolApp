import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { FieldArray } from "formik";
import React, { useEffect, useState } from "react";
import { getData } from "../app/api";
import { FEES } from "../app/url";
import {
  capitalizeWords,
  feeDiscount,
  feeduration,
} from "../commonComponent/CommonFunctions";
import CustomCheckBox from "../commonComponent/CustomCheckBox";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";

function StudentFeeDetails({ values, setFieldValue }) {
  const [checked, setChecked] = useState(false);
  const [fees, setFees] = useState([]);

  const handleFeeChange = (e, index) => {
    let dumpLIst = values.feesData
    if (e.target.name.includes("duration")) {
      let calAmount = calculateFees(e.target.value*1, values.feesData[index].discount*1, values.feesData[index].totalFee*1)
      dumpLIst[index].duration = e.target.value*1
      dumpLIst[index].installmentAmount = calAmount/e.target.value*1
    }else{
      let calAmount = calculateFees(values.feesData[index].duration*1, e.target.value*1, values.feesData[index].totalFee*1)
      dumpLIst[index].discount = e.target.value*1
      dumpLIst[index].installmentAmount = Math.round(calAmount/values.feesData[index].duration*1)
    }
    setFieldValue("feesData", dumpLIst)
  };

  useEffect(() => {
    getfees();
  }, []);

  const calculateFees = (duration, discount,FeeAmount) => {
    return FeeAmount - (duration === 1 ? (FeeAmount * discount)/100 : 0)
  };

  const getfees = async () => {
    const res = await getData(FEES + "/" + values.academicDetails.class);
    let dumpList = []
    res.data.forEach(item => {
      dumpList.push({
          id: item._id,
          isChecked: false,
          feeName: item.name ,
          duration:  item.feeInstallment*1,
          discount: item.disCount*1 ,
          installmentAmount: calculateFees(item.feeInstallment*1, item.disCount*1, item.amount*1), //installment fee
          totalFee: item.amount*1 //total fee
      })
    });
    setFieldValue("feesData", dumpList);
    setFees(res.data)
  };

  return (
    <>
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
                  {`Academic Fee Details - Class: ${fees[0]?.class?.name} - Sec - ${values?.section}`}
                </p>
              </div>
            </div>
          </div>

          <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300">
            <thead className="bg-purple-100">
              <tr>
                <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                  <CustomCheckBox
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                    name="selectAll"
                    // onChange={toggleAll}
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
                    Installment Wise Fee
                  </a>
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                >
                  <a href="#" className="group inline-flex">
                    Total Fee
                  </a>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <FieldArray name="feesData">
                {() =>
                  values.feesData.map((item, index) => (
                    <tr key={item.id}>
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        <CustomCheckBox name={item.feeName} />
                      </td>

                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        {capitalizeWords(item.feeName)}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        <CustomSelect
                          name={`feesData.${index}.duration`}
                          options={feeduration}
                          value={item.duration}
                          onChange={(e) => handleFeeChange(e, index)}
                          // disabled = {!item.isChecked}
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                        <CustomSelect
                          name={`feesData.${index}.discount`}
                          options={feeDiscount}
                          value={item.discount}
                          onChange={(e) => handleFeeChange(e, index)}
                          // disabled = {!item.isChecked}
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                        <CustomInput
                          name={`feesData.${index}.installmentAmount`}
                          type="number"
                          value={item.installmentAmount}
                          // disabled
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 max-w-10">
                        <CustomInput
                          name={`feesData.${index}.totalFee`}
                          placeholder="Enter Total Fee"
                          type="number"
                          value={item.amount}
                          // disabled
                        />
                      </td>
                    </tr>
                  ))
                }
              </FieldArray>
              <tr>
                <td className="relative px-7 sm:w-12 sm:px-6"></td>

                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900">
                  Special Discount
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 max-w-10">
                  <CustomInput
                    name="specialDiscount"
                    type="number"
                    placeholder="Enter Special Discount"
                  />
                </td>
              </tr>
              <tr className="bg-purple-100">
                <td className="relative px-7 sm:w-12 sm:px-6"></td>

                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900">
                  Total Fee
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900 max-w-10">
                  500
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default StudentFeeDetails;
