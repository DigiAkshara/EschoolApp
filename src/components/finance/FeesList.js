"use client";
import { Dialog } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import { getData } from "../../app/api";
import { FEES } from "../../app/url";
import {
  formatDate,
  handleApiResponse,
} from "../../commonComponent/CommonFunctions";
import FilterComponent from "../../commonComponent/FilterComponent";
import TableComponent from "../../commonComponent/TableComponent";
import FeeCreation from "./FeeCreation";

export default function FeesList() {
  const [open, setOpen] = useState(false);
  const [fees, setFees] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const columns = [
    { title: "Academic Year", key: "academicYear" },
    { title: "Fee Group", key: "feeGroup" },
    { title: "Fee Name", key: "feeName" },
    { title: "Class", key: "class" },
    { title: "Applicable To", key: "applicableTo" },
    { title: "Fee Amount", key: "feeAmount" },
    { title: "Creation Date", key: "creationDate" },
    { title: "Actions", key: "actions" },
  ];

  useEffect(() => {
    getFees();
  }, []);

  const getFees = async () => {
    try {
      const res = await getData(FEES);
      const feeResponse = res.data.data.map((item) => {
        return {
          _id: item._id,
          academicYear: item.academicYear?.year,
          feeGroup: item.feeGroup?.name,
          feeName: item.name,
          class: item.class?.name || "-",
          applicableTo: item.isGlobal ? "All" : "Class Wise",
          feeAmount: item.amount,
          creationDate: formatDate(item.createdAt),
          actions: [
            { label: "Edit", actionHandler: onHandleEdit },
            { label: "Delete", actionHandler: onDelete },
          ],
        };
      });
      setFees(feeResponse);
      setFilteredData(feeResponse);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const handleSearch = (term) => {
    const filtered = fees.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const filterForm = {
    class: "",
    section: "",
    gender: "",
  };

  const filters = {
    class: { options: [] },
    section: {
      options: [],
      dependency: true,
      dependencyKey: "class",
      filterOptions: true,
    },
    gender: { options: [] },
  };

  const handleFilter = (values) => {
    let filtered = fees;
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((rec) => {
          return rec[key].toLowerCase().includes(value.toLowerCase());
        });
      }
    });
    setFilteredData(filtered);
  };

  const handleReset = (updatedValues) => {
    setFilteredData(fees);
    updatedValues("gender", "");
    updatedValues("class", "");
    updatedValues("section", "");
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const onHandleEdit = async () => {
    console.log("edit");
  };

  const onDelete = () => {
    console.log("delete");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClose = () => setOpen(false);

  return (
    <div className="flow-root">
      {/* Primary Tabs */}

      <div className="mt-4 flex justify-between">
        <div className="text-lg text-gray-900 font-medium">Fee Structure</div>

        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Fee Structure
          </button>
        </div>
      </div>

      <div className="-mx-2 -my-2 mt-0 overflow-x-auto sm:-mx-6">
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <FilterComponent
                onSearch={handleSearch}
                filters={filters}
                filterForm={filterForm}
                handleFilter={handleFilter}
                handleReset={handleReset}
                // downloadList={downloadList}
              />
              {/* Table View */}
              <TableComponent
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
      {/* Student Onboarding Modal */}
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <div className="fixed inset-0" />
        <FeeCreation onClose={handleClose} getFees={getFees} />
      </Dialog>
    </div>
  );
}
