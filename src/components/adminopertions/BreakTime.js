import React, { useEffect, useState } from 'react'
import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/20/solid";
import TableComponent from '../../commonComponent/TableComponent';
import BreakModal from './BreakModal';
import { deleteData, getData } from '../../app/api';
import { BREAKTIME } from '../../app/url';
import { handleApiResponse } from '../../commonComponent/CommonFunctions';
import ConfirmationModal from '../../commonComponent/ConfirmationModal';

function BreakTime() {
  const [breakData, setBreakData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
      const [deleteId, setDeleteId] = useState(null);
      const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [isSectionModal, setIsSectionModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;


  const columns = [
    { title: "Break Name", key: "breakName" },
    { title: "Break Time", key: "timeRange" },
    { title: 'Actions', key: 'actions' },
  ];

    useEffect(() => {
      getBreakTime();
    }, []);
  
    const getBreakTime = async () => {
      try {
        const response = await getData(BREAKTIME);
        const breakResponse = response.data.data;
        const BreakData = breakResponse.map((item, index) => {
          return {
            _id: item._id,
            breakName: item.name,
            timeRange: `${item.startTime} - ${item.endTime}`, 
            actions: [
              { label: "Edit", actionHandler: onHandleEdit },
              { label: "Delete", actionHandler: onDelete },
            ],
          };
        });
        setBreakData(BreakData);
        setFilteredData(BreakData);
      } catch (error) {
        handleApiResponse(error)
      }
    };

      const onHandleEdit = async (Id) => {
        console.log("Edited");
      };
    
      const onDelete = (Id) => {
        setDeleteId(Id);
        setDeleteConfirm(true);
      };
    
      const deleteRecord = async () => {
         try {
           let res = await deleteData(BREAKTIME + '/' + deleteId)
           handleApiResponse(res.data.message, 'success')
           getBreakTime()
           setDeleteConfirm(false)
           setDeleteId(null)
         } catch (error) {
           handleApiResponse(error)
         }
      };

  const handleOpen = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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
            Add Break Time
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

      {isModalOpen && <BreakModal onClose={handleCloseModal} getBreakTime={getBreakTime}  />}
 <ConfirmationModal
        showModal={deleteConfirm}
        onYes={deleteRecord}
        onCancel={() => {
          setDeleteConfirm(false);
        }}
      />

    </>
  )
}

export default BreakTime