import { Dialog } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInitialAppData } from '../app/reducers/appConfigSlice'
import { updateTenant } from '../app/reducers/TenantConfigSlice'
import TableComponent from '../commonComponent/TableComponent'
import Tenant from './tenants/Tenant'

export default function Tenants() {
  const dispatch = useDispatch()
  const tenants = useSelector((state) => state.appConfig.allTenants);
  const [tenantList, setTenantList] = useState([])
  const [open, setOpen] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  useEffect(() => {
    if (tenants.length > 0) {
      let data = tenants.filter((tenant) => tenant.isDefault).map((item) => {
        return {
          _id: item._id,
          tenantId: item.tenant._id,
          name: item.name,
          email: item.tenant.email,
          adminName: item.contactPerson || 'N/A',
          mobileNumber: item.tenant.mobileNumber,
          actions: [
            { label: "Edit", actionHandler: onHandleEdit },
            { label: "Delete", actionHandler: onDelete },
          ],
        }
      })
      setFilteredData(data)
      setTenantList(tenants.filter((item) => item.isDefault))
    }
  }, [tenants])

  const columns = [
    { title: 'School Name', key: 'name' },
    { title: 'Email', key: 'email' },
    { title: 'Admin Name', key: 'adminName' },
    { title: 'Mobile Number', key: 'mobileNumber' },
    { title: 'Actions', key: 'actions' },
  ]

  const handleOpen = () => setOpen(true)
  const handleClose = () => { setOpen(false); dispatch(updateTenant(null)) }


  const onHandleEdit = async (tenantId) => {
    dispatch(updateTenant(tenantId))
    setTimeout(() => {
      setOpen(true)
    }, 100)
  }

  const onDelete = async (tenantId) => {
    console.log("deleted", tenantId);
  }

  const filters = [
    {
      key: 'age',
      label: 'Age Filter',
      options: [
        { value: '20-30', label: '20-30' },
        { value: '30-40', label: '30-40' },
      ],
    },
  ]

  const handleSearch = (term) => {
    const filtered = tenantList.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase()),
      ),
    )
    setFilteredData(filtered)
  }

  const handleFilter = (key, value) => {
    let filtered = tenantList
    if (key === 'age' && value) {
      const [min, max] = value.split('-')
      filtered = tenantList.filter(
        (item) => item.age >= parseInt(min) && item.age <= parseInt(max),
      )
    }
    setFilteredData(filtered)
  }


  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const getTenants = () => {
    dispatch(fetchInitialAppData(true))
  }

  return (
    <div className="flow-root">
      {/* Secondary Tabs */}
      <div className="mt-4 flex justify-between">
        <div className="sm:hidden">
        </div>
        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            onClick={handleOpen}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Tenant
          </button>
        </div>
      </div>

      <div className="-mx-2 -my-2 mt-0 overflow-x-auto sm:-mx-6">
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            <div className="shadow ring-1 ring-black/5 sm:rounded-lg">
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

      {/* Tenant Onboarding Modal */}

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <div className="fixed inset-0" />
        <Tenant onClose={handleClose} loadTenants={getTenants} />
      </Dialog>
    </div>
  )
}
