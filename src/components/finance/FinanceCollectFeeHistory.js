import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getData } from '../../app/api'
import { TRANSACTIONS } from '../../app/url'
import { capitalizeWords, handleApiResponse } from '../../commonComponent/CommonFunctions'
import TableComponent from '../../commonComponent/TableComponent'

function FinanceCollectFeeHistory() {
  const selectedData = useSelector((state) => state.fees.selectedFee)
  const [transactions, setTransactions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const rowsPerPage = 10

  const columns = [
    { title: 'Transaction Id', key: 'transactionId' },
    { title: 'Paid Date', key: 'paidDate' },
    { title: 'Paid Mode', key: 'paidMode' },
    { title: 'Fee Types & Paid Amount', key: 'feeAmounts' },
    { title: 'Total Paid', key: 'totalPaid' },
    { title: 'Invoice', key: 'invoice' },
  ]
  const getHistoryData = async (Id) => {
    try {
      let res = await getData(TRANSACTIONS + '/' + Id)
      let list = res.data.map(trans =>({
        transactionId:trans.transactionId||'N/A',
        paidDate:moment(trans.date).format('DD-MM-YYYY'),
        paidMode:trans.transactionType.toUpperCase(),
        feeAmounts: trans.fees.map((fee,index)=>(<span>{capitalizeWords(fee.fee.name)} : {fee.amount}{index + 1 === trans.fees.length ? "." : ", "}</span>)),
        totalPaid:trans.amount,
        invoice:'View'
      }))
      setTransactions(list)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const showInvoice = () =>{
    setShowInvoiceModal(true)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const paginatedData = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  useEffect(() => {
    if (selectedData) {
      getHistoryData(selectedData.fees.student)
    }
  }, [selectedData])
  return (
    <>
      <div className="py-4 text-sm/6">
        <TableComponent
          columns={columns}
          data={paginatedData}
          pagination={{
            currentPage,
            totalCount: transactions.length,
            onPageChange: handlePageChange,
          }}
          showModal={showInvoice}
          modalColumn={['invoice']}
          checkColumn={false}
        />
      </div>
    </>
  )
}

export default FinanceCollectFeeHistory
