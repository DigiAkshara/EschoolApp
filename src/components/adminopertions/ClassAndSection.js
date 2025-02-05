import React, { useState } from 'react'
import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/20/solid";
import TableComponent from '../../commonComponent/TableComponent';
import ClassModal from './ClassModal';
import SectionModal from './SectionModal';

function ClassAndSection() {
  const [classData, setClassData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSectionModal, setIsSectionModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;


  const columns = [
    { title: "Si. No", key: "siNo" },
    { title: "Class and Section", key: "class" },
    { title: 'Actions', key: 'actions' },
  ];

  const handleOpen = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenSection = () => setIsSectionModal(true);
  const handleCloseSectionModal = () => setIsSectionModal(false);

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
            onClick={handleOpen}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Class
          </button>

          <button
            type="button"
            onClick={handleOpenSection}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Setion
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
              />
            
            </div>
          </div>
        </div>
      </div>
      <ClassModal isOpen={isModalOpen} onClose={handleCloseModal}  />
      <SectionModal isOpen={isSectionModal} onClose={handleCloseSectionModal} />

    </>
  )
}

export default ClassAndSection