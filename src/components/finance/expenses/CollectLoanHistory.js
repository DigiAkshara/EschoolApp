import React from 'react'

function CollectLoanHistory() {
  return (
    <>
      <div className="py-4 text-sm/6">
        <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
          <thead className="bg-purple-100">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
              >
                <a href="#" className="group inline-flex">
                  Payment Date
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
                className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Payment Mode
                </a>
              </th>

              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Bank Details
                </a>
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Payment Proof
                </a>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                22-10-2024{' '}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                5000/-
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                Bank
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                SBI(1231232312)
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                <a href="#">View</a>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </>
  )
}

export default CollectLoanHistory
