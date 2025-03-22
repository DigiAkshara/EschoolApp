import { useDispatch, useSelector } from "react-redux";
import CustomDate from '../../../commonComponent/CustomDate'
import { capitalizeWords, handleApiResponse, handleDownloadPDF } from "../../../commonComponent/CommonFunctions";
import TableComponent from "../../../commonComponent/TableComponent";
import { useEffect, useState } from "react";
import CustomSelect from "../../../commonComponent/CustomSelect";
import { Form, Formik } from "formik";
import FilterComponent from "../../../commonComponent/FilterComponent";
import * as Yup from "yup";
import { getData } from "../../../app/api";
import { TRANSACTIONS } from "../../../app/url";
import moment from "moment";
import { setIsLoader } from "../../../app/reducers/appConfigSlice";

const FeeCollectionReports = () => {
	const dispatch = useDispatch();
	const { branchData } = useSelector((state) => state.appConfig)
	const { classes: classOptions, sections: sectionOptions } = useSelector(
		(state) => state.academics
	);
	const [feesData, setFeesData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 10;

	const initialValues = {
		fromDate: "",
		toDate: "",
		class: "",
		section: "",
	};
	const columns = [
		{ key: "studentName", title: "Student Name" },
		{ key: "classSection", title: "Class &Section" },
		{ key: "transactionNo", title: "Transaction ID" },
		{ key: "paidDate", title: "Paid Date" },
		{ key: "feeTypes", title: "Fee Types & Paid Amount" },
		{ key: "totalPaidAmount", title: "Total Paid" }
	];

	const paginatedData = filteredData.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handleSearch = (term) => {
		const filtered = feesData.filter((item) =>
			columns.some((col) =>
				String(item[col.key]).toLowerCase().includes(term.toLowerCase())
			)
		);
		setFilteredData(filtered);
	};

	const getValidationSchema = () => {
		return Yup.object({
			fromDate: Yup.date(),
			toDate: Yup.date(),
			class: Yup.string(),
			section: Yup.string(),
		});
	};

	const handleSubmit = (values) => {
		let { fromDate, toDate, class: classId, section: sectionId } = values;
		const from = fromDate ? moment(fromDate, 'DD-MM-YYYY').startOf('day') : null;
		const to = toDate ? moment(toDate, 'DD-MM-YYYY').endOf('day') : null;

		const filtered = feesData.filter((txn) => {
			const paidDate = moment(txn.paidDate, "YYYY-MM-DD");
			return paidDate.isBetween(moment(fromDate, "YYYY-MM-DD"), moment(toDate, "YYYY-MM-DD"), null, "[]");
		  });
		setFilteredData(filtered);
	}

	const downloadList = () => {
		handleDownloadPDF(filteredData, "Fee_Details", [
			{ key: "studentName", label: "Student Name" },
			{ key: "classSection", label: "Class &Section" },
			{ key: "transactionNo", label: "Transaction ID" },
			{ key: "paidDate", label: "Paid Date" },
			{ key: "feeTypes", label: "Fee Types & Paid Amount" },
			{ key: "totalPaidAmount", label: "Total Paid" },
		], "Fee Details Report", branchData, undefined, "portrait");
	};

	const getTransactionsData = async () => {
		try {
			dispatch(setIsLoader(true))
			const res = await getData(TRANSACTIONS)
			let data = res.data.map((item) => {
				return {
					studentName: item.academic.student.firstName + " " + item.academic.student.lastName,
					classSection: item.academic.class.name + " " + item.academic.section.section,
					transactionNo: item.transaction.transactionNo||"N/A",
					paidDate: moment(item.transaction.date).format("DD-MM-YYYY"),
					feeTypes: item.transaction.fees.map((fee, index) => (
						<span key={index}>
							{capitalizeWords(fee.fee.name)} : {fee.amount}
							{index + 1 === item.transaction.fees.length ? "." : ", "}
						</span>
					)),
					totalPaidAmount: item.transaction.amount,
					class: item.academic.class._id,
					section: item.academic.section._id,
				}
			}
			);
			setFeesData(data)
			setFilteredData(data)
		} catch (error) {
			handleApiResponse(error)
		}
		finally {
			dispatch(setIsLoader(false))
		}
	}

	useEffect(() => {
		getTransactionsData()
	}, [])


	return (
		<>
			<Formik
				initialValues={initialValues}
				alidationSchema={getValidationSchema()}
				onSubmit={handleSubmit}
				enableReinitialize
			>
				{({ values, setFieldValue, errors }) => (
					<Form>
						<div className="mt-4 flex justify- between"> <label>Select Criteria : </label></div>
						<div className="mt-4 flex justify-between">
							<div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-10">
								<div className="sm:col-span-2 z-30">
									<CustomDate
										name="fromDate"
										label="From Date"
										onChange={(value) => {
											setFieldValue("fromDate", value);
											setFieldValue("toDate", "");
										}}
									/>
								</div>
								<div className="sm:col-span-2 z-30">
									<CustomDate
										name="toDate"
										label="End Date"
										disabled={!values.fromDate}
										minDate={values.fromDate}
									/>
								</div>
								<div className="sm:col-span-2">
									<CustomSelect
										label="Class"
										name="class"
										options={classOptions}
										onChange={(e) => {
											setFieldValue("class", e.target.value);
											setFieldValue("section", "");
										}}
									/>
								</div>
								<div className="sm:col-span-2">
									<CustomSelect
										label="Section"
										name="section"
										options={sectionOptions.filter(sec => sec.class._id === values.class)}
										disabled={!values.class}
									/>
								</div>

								<div className="sm:col-span-2">
									<div className="mt-8">
										<button
											type="submit"
											className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
										>
											Search
										</button>
									</div>
								</div>
							</div>
						</div>
					</Form>
				)}
			</Formik>

			<div className="-mx-2 -my-2 mt-0 sm:-mx-6">
				{/* /Removed overflow-x-auto cloass */}
				<div className="inline-block min-w-full py-4 align-middle sm:px-6">
					<div className="relative">
						<div className="relative shadow ring-1 ring-black/5 sm:rounded-lg">
							<FilterComponent
								onSearch={handleSearch}
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
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
export default FeeCollectionReports;