import React from "react";

function FinancCollectFeesDetails() {
  return (
    <>
      <div className="px-4 py-4 text-sm/6">
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
                  One Time Discount
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                Admission Fee
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                2 Installments
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                1000
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                0
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                500
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                500
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                22-10-2024
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                  Pending
                </span>
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                1000
              </td>
            </tr>

            <tr>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                Book Fee
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                One TIme
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                1000
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                200 Discount
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                800
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                0
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                -
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  Paid
                </span>
              </td>
            </tr>

            <tr>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                Tution Fee
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                2 Installments
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                1000
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                0
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                500
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                500
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                22-10-2024
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                  Pending
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default FinancCollectFeesDetails;
