"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import FilterComponent from "../../../commonComponent/FilterComponent";
import TableComponent from "../../../commonComponent/TableComponent";

function LoansTab() {
    const dispatch = useDispatch();
    const [selectedPeople, setSelectedPeople] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [expenseData, setExpenseData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const columns = [
        { key: "type", title: "Type" },
        { key: "staff_name", title: "Staff Name" },
        { key: "date", title: "Date" },
        { key: "loan_amount", title: "Loan Amount" },
        { key: "paid_amount", title: "Paid Amount" },
        { key: "balance_amount", title: "Balance Amount" },
        { key: "status", title: "Status" },
        { key: "collect", title: "Collect" },
        { key: "actions", title: "Actions" },
    ];

    const filterForm = {
        type: "",
        status: "",
    };

    const filters = {
        type: { options: [] },
        status: { options: []}
    };

    const handleViewDetails = (item) => {
        console.log(item)
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
        setFilteredData(filtered);
    };

    const handleReset = (updatedValues) => {
        setFilteredData(expenseData);
        updatedValues("examName", "");
        updatedValues("class", "");
        updatedValues("section", "");
    };

    const handleModalClose = () => {
        console.log("handleModalClose")
    };

    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <>

            <div className="right-btns-blk space-x-4 float-right">
                <button
                    type="button"
                    //   onClick={() => setShowAddExamModal(true)}
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                >
                    <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
                    Add New
                </button>
            </div>
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
                            />
                            <TableComponent
                                columns={columns}
                                data={paginatedData}
                                pagination={{
                                    currentPage,
                                    totalCount: filteredData.length,
                                    onPageChange: handlePageChange,
                                }}
                                showModal={(data) => handleViewDetails(data)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoansTab;
