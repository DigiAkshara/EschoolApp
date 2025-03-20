import { Dialog } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { deleteData, getData, postData } from "../../app/api";
import { ACADEMIC_YEAR } from "../../app/url";
import { capitalizeWords, handleApiResponse } from "../../commonComponent/CommonFunctions";
import ConfirmationModal from "../../commonComponent/ConfirmationModal";
import CustomDate from "../../commonComponent/CustomDate";
import TableComponent from "../../commonComponent/TableComponent";
function AcademicYearView() {
	const [filteredData, setFilteredData] = useState([]);
	const [openAcademicModal, setOpenAcademicModal] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [deleteConfirm, setDeleteConfirm] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 10;

	const columns = [
		{ title: "Academic Year", key: "year" },
		{title: "Status", key: "status"},
	];

	useEffect(() => {
		fecthInitialData();
	}, []);

	const fecthInitialData = async () => {
		try {
			const res = await getData(ACADEMIC_YEAR + '/all')
			let data = []
			const curYear = moment().year()
			res.data.data.forEach(item => {
				let start = item.year.split("-")[0].trim()
				if (start * 1 <= curYear * 1) {
					data.push({
						_id: item._id,
						year: item.year,
						status:capitalizeWords(item.status)
					})
				}
			})
			setFilteredData(data);
		} catch (error) {
			handleApiResponse(error);
		}
	};

	const onDelete = (Id) => {
		setDeleteId(Id);
		setDeleteConfirm(true);
	};

	const deleteRecord = async () => {
		try {
			let res = await deleteData(ACADEMIC_YEAR+"/"+deleteId);
			handleApiResponse(res.data.message, "success");
			fecthInitialData();
			setDeleteConfirm(false);
			setDeleteId(null);
		} catch (error) {
			handleApiResponse(error);
		}
	};

	const paginatedData = filteredData.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	return (
		<>
			<div className="mt-4 flex justify-between">
				<div className="sm:hidden"></div>
				<div className="hidden sm:block"></div>
				<div className="right-btns-blk space-x-4">
					<button
						type="button"
						onClick={() => { setOpenAcademicModal(true) }}
						className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
					>
						<PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
						Add New Academic Year
					</button>
				</div>
			</div>
			<div className="-mx-2 -my-2 mt-0 sm:-mx-6">
				<div className="inline-block min-w-full py-4 align-middle sm:px-6">
					<div className="relative">
						<div className="shadow ring-1 ring-black/5 sm:rounded-lg">
							<TableComponent
								columns={columns}
								data={paginatedData}
								pagination={{
									currentPage,
									totalCount: filteredData.length,
									onPageChange: handlePageChange,
								}}
								checkColumn={false}
							/>
						</div>
					</div>
				</div>
			</div>
			<Dialog open={openAcademicModal} onClose={() => setOpenAcademicModal(false)} className="relative z-50">
				<div className="fixed inset-0" />
				<AcademicYearModal onClose={() => setOpenAcademicModal(false)} updateData={fecthInitialData} />
			</Dialog>
			<ConfirmationModal
				showModal={deleteConfirm}
				onYes={deleteRecord}
				onCancel={() => {
					setDeleteConfirm(false);
				}}
			/>
		</>
	);
}


const AcademicYearModal = ({ onClose, updateData }) => {

	const initialValues = {
		startDate: null,
		endDate: null,
	}

	const getValidationSchema = () => {
		return Yup.object({
			startDate: Yup.date().required("Start date is required"),
			endDate: Yup.date().nullable()
				.min(Yup.ref("startDate"), "End date must be after start date")
				.required("End date is required")
				.test("is-within-valid-range", "Not Allowed to create academic year for next year", function (value) {
					if (!value) return false;
					const currentYear = moment().year();
					const endYear = moment(value).year();
					return endYear === currentYear + 1;
				}),
		})
	}

	const handleSubmit = async (values) => {
		let payload = {
			startDate: values.startDate,
			endDate: values.endDate,
			year: moment(values.startDate).format("YYYY") + "-" + moment(values.endDate).format("YYYY")
		};
		try {
			let res = await postData(ACADEMIC_YEAR, payload);
			handleApiResponse(res.data.message, "success");
			updateData();
			onClose();
		} catch (error) {
			handleApiResponse(error);
		}
	}

	const handleStartYearChange = (startDate, setFieldValue) => {
		if (startDate) {
			const selectedDate = moment(startDate);
			setFieldValue("startDate", selectedDate.format("YYYY-MM-DD"));
			// Automatically set End Date (12 months ahead)
			const newEndDate = selectedDate.add(12, "months");
			setFieldValue("endDate", newEndDate.format("YYYY-MM-DD"));
		} else {
			setFieldValue("endDate", null);
		}
	};




	return (
		<>
			<Formik
				initialValues={initialValues}
				validationSchema={getValidationSchema()}
				onSubmit={handleSubmit}
			>
				{({ values, setFieldValue, errors }) => {
					const minDate = values.startDate ? moment(values.startDate).add(9, "months").format("YYYY-MM-DD") : null;
					const maxDate = values.startDate ? moment(values.startDate).add(12, "months").format("YYYY-MM-DD") : null;
					return (
						<Form>
							<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
								<div className="bg-white w-96 rounded-lg shadow-lg">
									{/* Modal Header */}
									<div className="flex justify-between items-center bg-purple-600 text-white p-3 rounded-t-lg">
										<h2 className="text-lg font-semibold">Add New Academic Year</h2>
										<button
											onClick={onClose}
											className="text-white hover:text-gray-200"
										>
											<XMarkIcon className="h-6 w-6" />
										</button>
									</div>

									{/* Modal Body */}
									<div className="p-6">
										<CustomDate
											name="startDate"
											label="Academic Starting Date"
											placeholder="Enter Academic Starting Date"
											required={true}
											minDate={moment().format("YYYY-MM-DD")}
											maxDate={moment().endOf("year").format("YYYY-MM-DD")}
											onChange={(value) => { handleStartYearChange(value, setFieldValue) }}
										/>
										<div className="my-4"></div>
										<CustomDate
											name="endDate"
											label="Academic Ending Date"
											placeholder="Enter Academic Ending Date"
											required={true}
											disabled={!values.startDate}
											minDate={minDate}
											maxDate={maxDate}
										/>
									</div>

									{/* Modal Footer */}
									<div className="p-3 flex justify-end space-x-2 border-t">
										<button
											onClick={onClose}
											className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
										>
											Cancel
										</button>
										<button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500">
											Add
										</button>
									</div>
								</div>
							</div>
						</Form>
					)
				}}
			</Formik>
		</>
	);
};




export default AcademicYearView;
