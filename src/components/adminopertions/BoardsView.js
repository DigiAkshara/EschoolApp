import { PlusIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import { deleteData, getData } from "../../app/api";
import { BOARDS } from "../../app/url";
import { capitalizeWords, handleApiResponse } from "../../commonComponent/CommonFunctions";
import ConfirmationModal from "../../commonComponent/ConfirmationModal";
import TableComponent from "../../commonComponent/TableComponent";
import BoardCreation from "./BoardCreation";

function BoardsView() {
	const [filteredData, setFilteredData] = useState([]);
	const [openBoradModal, setOpenBoradModal] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [deleteConfirm, setDeleteConfirm] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 10;

	const columns = [
		{ title: "Board Name", key: "board" },
		{ title: "Actions", key: "actions" },
	];

	useEffect(() => {
		fecthInitialData();
	}, []);

	const fecthInitialData = async () => {
		try {
			const res = await getData(BOARDS)
			const data = res.data.data.map((item) => ({
				_id: item._id,
				board: capitalizeWords(item.name),
				actions: [
					{ label: "Delete", actionHandler: onDelete },
				],
			}))
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
			let res = await deleteData(BOARDS + "/" + deleteId);
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
				{/* active tab with count block */}
				<div className="sm:hidden"></div>
				<div className="hidden sm:block"></div>

				<div className="right-btns-blk space-x-4">

					<button
						type="button"
						onClick={()=>{setOpenBoradModal(true)}}
						className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
					>
						<PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
						Add Board
					</button>

				</div>
			</div>
			<div className="-mx-2 -my-2 mt-0 sm:-mx-6">
				<div className="inline-block min-w-full py-4 align-middle sm:px-6">
					<div className="relative">
						<div className="shadow ring-1 ring-black/5 sm:rounded-lg">
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
			{openBoradModal && <BoardCreation onClose={() => setOpenBoradModal(false)} updateData={fecthInitialData} />}
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

export default BoardsView;
