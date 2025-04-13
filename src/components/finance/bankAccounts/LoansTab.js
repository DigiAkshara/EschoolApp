"use client";
import { Dialog } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoan } from "../../../app/reducers/feeSlice";
import FilterComponent from "../../../commonComponent/FilterComponent";
import TableComponent from "../../../commonComponent/TableComponent";
import ViewLoanModal from "./ViewLoanModal";
import { capitalizeWords, handleApiResponse, handleDownloadPDF } from "../../../commonComponent/CommonFunctions";
import { getData } from "../../../app/api";
import { LOANS } from "../../../app/url";
import moment from "moment";

function LoansTab() {
	const dispatch = useDispatch();
	const { branchData } = useSelector((state) => state.appConfig)
	const [selectedPeople, setSelectedPeople] = useState([])
	const [filteredData, setFilteredData] = useState([])
	const [expenseData, setExpenseData] = useState([])
	const [selectedLoan, setSelectedLoan] = useState(null)
	const [showLoanDetailsModal, setShowLoanDetailsModal] = useState(false)
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 10;
	const columns = [
		{ key: "type", title: "Type" },
		{ key: "staffName", title: "Staff Name" },
		{ key: "date", title: "Date" },
		{ key: "loanAmount", title: "Loan Amount" },
		{ key: "paidAmount", title: "Paid Amount" },
		{ key: "balanceAmount", title: "Balance Amount" },
		{ key: "status", title: "Status" },
		{ key: "view", title: "More Details" },
	];

	const filterForm = {
		date: "",
		type: "",
		status: "",
	};

	const filters = {
		type: { options: [{ label: "Offline", value: "offline" }, { label: "Online", value: "online" }] },
		status: { options: [{ label: "Paid", value: "paid" }, { label: "Unpaid", value: "active" }] }
	};


	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handleSearch = (term) => {
		const filtered = expenseData.filter((item) =>
			columns.some((col) =>
				String(item[col.key]).toLowerCase().includes(term.toLowerCase())
			)
		);
		setCurrentPage(1)
		setFilteredData(filtered);
	};

	const handleFilter = (values) => {
		let filtered = expenseData;
		Object.entries(values).forEach(([key, value]) => {
			if (value) {
				filtered = filtered.filter((rec) =>
					rec[key].toLowerCase().includes(value.toLowerCase())
				);
			}
		});
		setCurrentPage(1)
		setFilteredData(filtered);
	};

	const handleReset = (updatedValues) => {
		setFilteredData(expenseData);
		updatedValues("type", "");
		updatedValues("status", "");
		setCurrentPage(1)
	};

	const handleClose = () => {
		setShowLoanDetailsModal(false)
		dispatch(setLoan(null));
	};

	const paginatedData = filteredData.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

	const getLoans = async () => {
		try {
			const res = await getData(LOANS)
			let list = res.data.data.map((item) => ({
				...item,
				type: capitalizeWords(item.transactionMode),
				staffName: capitalizeWords(item.staff?.firstName + " " + item.staff?.lastName),
				date: item.issuedDate,
				balanceAmount: (item.loanAmount * 1) - (item.paidAmount * 1),
				status: capitalizeWords(item.status),
				view: "View"
			}))
			setExpenseData(list)
			setFilteredData(list)
		} catch (e) {
			handleApiResponse(e)
		}
	}

	const downloadList = () => {
		handleDownloadPDF(filteredData, "loan_details", [
			{ key: 'type', label: 'Type' },
			{ key: 'staffName', label: 'Staff Name' },
			{ key: 'date', label: 'Date' },
			{ key: 'loanAmount', label: 'Loan Amount' },
			{ key: 'paidAmount', label: 'Paid Amount' },
			{ key: 'balanceAmount', label: 'Balance Amount' },
			{ key: 'status', label: 'Status' },
		], "Loan Details", branchData, undefined, "landscape");
	};

	const handleViewDetails = (data) => {
		setSelectedLoan({ ...data, actions: null });
		setShowLoanDetailsModal(true);
	};

	useEffect(() => {
		getLoans()
	}, [])

	return (
		<>
			<div className="-mx-2 -my-2 mt-0 sm:-mx-6">
				{/* /Removed overflow-x-auto cloass */}
				<div className="inline-block min-w-full py-4 align-middle sm:px-6">
					<div className="relative">
						{selectedPeople.length > 0 && (
							<div className="absolute left-20 top-0 flex h-12 items-center space-x-3 bg-white sm:left-72">
								<button
									type="button"
									className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
								>
									Delete
								</button>
							</div>
						)}
						<div className="relative shadow ring-1 ring-black/5 sm:rounded-lg">
							<FilterComponent
								onSearch={handleSearch}
								filters={filters}
								filterForm={filterForm}
								handleFilter={handleFilter}
								handleReset={handleReset}
								downloadList={downloadList}
							/>
							<TableComponent
								checkColumn={false}
								columns={columns}
								data={paginatedData}
								pagination={{
									currentPage,
									totalCount: filteredData.length,
									onPageChange: handlePageChange,
								}}
								modalColumn={["view"]}
								showModal={(data) => handleViewDetails(data)}
							/>
						</div>
					</div>
				</div>
			</div>
			<Dialog open={showLoanDetailsModal} onClose={handleClose} className="relative z-50">
				<ViewLoanModal onClose={handleClose} data={selectedLoan} />
			</Dialog>
		</>
	);
}

export default LoansTab;
