import {Dialog} from '@headlessui/react'
import {PlusIcon} from '@heroicons/react/20/solid'
import {useEffect, useState} from 'react'
import {getData} from '../app/api'
import {TENANT} from '../app/url'
import TableComponent from '../commonComponent/TableComponent'
import Tenant from './tenants/Tenant'

export default function Tenants() {
  const [tenantList, setTenantList] = useState([])
  const [open, setOpen] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  useEffect(() => {
    getTenants()
  }, [])

  const columns = [
    {title: 'School Name', key: 'name'},
    {title: 'Email', key: 'email'},
    {title: 'Phone Number', key: 'phoneNumber'},
    {title: 'Admin Name', key: 'adminName'},
    {title: 'Mobile Number', key: 'mobileNumber'},
    {title: 'Email', key: 'email'},
    {title: 'Actions', key: 'actions'},
  ]

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const getTenants = async () => {
    const response = await getData(TENANT)
  }

  const filters = [
    {
      key: 'age',
      label: 'Age Filter',
      options: [
        {value: '20-30', label: '20-30'},
        {value: '30-40', label: '30-40'},
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

  return (
    <div className="flow-root">
      {/* Secondary Tabs */}
      <div className="mt-4 flex justify-between">
        {/* <div className="sm:hidden">
          <label htmlFor="tabs2" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. 
          <select
            id="tabs2"
            name="tabs2"
            defaultValue={tabs2.find((tab) => tab.current).name}
            className="block w-full rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          >
            {tabs2.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav aria-label="Tabs2" className="flex space-x-4">
            {tabs2.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                aria-current={tab.current ? "page" : undefined}
                className={classNames(
                  tab.current
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-500 hover:text-gray-700",
                  "rounded-full px-3 py-2 text-sm font-medium"
                )}
              >
                {tab.name}
                {tab.count ? (
                  <span
                    className={classNames(
                      tab.current
                        ? "bg-white text-purple-600"
                        : "bg-gray-300 text-gray-900",
                      "ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block"
                    )}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </a>
            ))}
          </nav>
        </div> */}
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
                  filters={filters}
                  onSearch={handleSearch}
                  onFilter={handleFilter}
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
        <Tenant onClose={handleClose} />
      </Dialog>
    </div>
  )
}
