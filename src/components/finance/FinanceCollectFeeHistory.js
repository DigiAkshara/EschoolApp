import React from 'react'

function FinanceCollectFeeHistory() {
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
                  Transaction ID
                </a>
              </th>

              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Paid Date
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
                  Fee Types & Paid Amount
                </a>
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Special Discount
                </a>
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Total Paid
                </a>
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
              >
                <a href="#" className="group inline-flex">
                  Invoice
                </a>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                1234546789966
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                22-10-2024{' '}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                UPI- Phonepay
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                Admission fee: 100, Bus Fee, 100,
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                200
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                200
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                <a href="#">View</a>
              </td>
            </tr>

            <tr>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                1234546789966
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                22-10-2024{' '}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                UPI- Phonepay
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                Admission fee: 100, Bus Fee, 100,
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                200
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                200
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                <a href="#">View</a>
              </td>
            </tr>

            <tr>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                1234546789966
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                22-10-2024{' '}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                UPI- Phonepay
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                Admission fee: 100, Bus Fee, 100,
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                200
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                200
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

export default FinanceCollectFeeHistory
