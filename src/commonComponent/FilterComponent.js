import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ListBulletIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {
  ArrowDownTrayIcon,
  FunnelIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline'
import { Form, Formik } from 'formik'
import CustomSelect from './CustomSelect'
import { capitalizeWords } from './CommonFunctions'
import DownloadDialog from './CommonDialogBox'
import { useEffect, useState } from 'react'
import CustomDate from './CustomDate'

const FilterComponent = ({
  onSearch,
  filters,
  filterForm,
  handleFilter,
  handleReset,
  isDownloadDialog,
  downloadList,
  downloadListxlsv,
  downloadDisabled=false
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getOptions = (item, value) => {
    if (item.dependency && item.filterOptions) {
      return item.options.filter(
        (option) => option[item.dependencyKey] === value,
      )
    } else {
      return item.options
    }
  }

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDownloadChoice = (choice) => {
    if (choice === "pdf") {
      downloadList(); // Direct PDF download
    } else {
      downloadListxlsv(); // Excel download
    }
    closeDialog(); // Close the dialog after the choice is made
  };



  return (
    <div className="relative table-tool-bar z-20">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-4">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <div className="relative rounded-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="size-4 text-gray-400"
                />
              </div>
              <input
                name="search"
                type="text"
                placeholder="Search"
                onChange={(e) => onSearch(e.target.value)}
                className="block w-full rounded-md border-0 py-1 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 text-sm"
              />
            </div>
          </div>
          <Formik initialValues={filterForm} onSubmit={handleFilter} enableReinitialize>
            {({ values, setFieldValue }) => (
              <Form>
                <div className="right-action-btns-blk space-x-4">
                  {/* Conditional Download Button */}
                  {isDownloadDialog ? (
                    <button
                      disabled={downloadDisabled}
                      type="button"
                      onClick={openDialog}
                      className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <ArrowDownTrayIcon aria-hidden="true" className="size-5" />
                    </button>
                  ) : (
                    <button
                      disabled={downloadDisabled}
                      type="button"
                      onClick={downloadList}
                      className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <ArrowDownTrayIcon aria-hidden="true" className="size-5" />
                    </button>
                  )}

                  {/* Include the DownloadDialog modal if needed */}
                  {isDialogOpen && isDownloadDialog && (
                    <DownloadDialog
                      onClose={closeDialog}
                      handleDownloadChoice={handleDownloadChoice}
                    />
                  )}


                  {filters && (
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <MenuButton className="inline-flex items-center rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                          <FunnelIcon aria-hidden="true" className="size-5" />
                          Filters
                        </MenuButton>
                      </div>

                      <MenuItems
                        transition
                        className="max-h-[430px] overflow-y-auto absolute right-0 z-10 mt-2 px-4 py-4 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                      >
                        <div className="grid gap-3 ">
                          <MenuItem className="group mb-2">
                            <div className="flex">
                              <FunnelIcon aria-hidden="true" className="size-5" />
                              <span className="pl-2">Select Filters</span>
                            </div>
                          </MenuItem>
                          {Object.entries(values).map(([key]) => {
                            if (key === 'date') {
                              return (
                                <CustomDate
                                  key={key}
                                  label={capitalizeWords(key)}
                                  name={key}
                                />
                              )
                            }else {
                              return (
                                <CustomSelect
                                  key={key}
                                  label={capitalizeWords(key)}
                                  name={key}
                                  options={getOptions(
                                    filters[key],
                                    values[filters[key].dependencyKey],
                                  )}
                                  disabled={
                                    filters[key].dependency &&
                                    !values[filters[key].dependencyKey]
                                  }
                                  onChange={(e) => {
                                    setFieldValue(key, e.target.value)
                                    if (key == 'category') {
                                      setFieldValue('class', '')
                                      setFieldValue('section', '')
                                    }
                                    if (key == 'class') {
                                      setFieldValue('section', '')
                                    }
                                  }}
                                />

                              )
                            }
                          })}

                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => {
                                handleReset(setFieldValue)
                              }}
                              className="w-1/2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                            >
                              Reset
                            </button>
                            <button
                              type="submit"
                              className=" w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </MenuItems>
                    </Menu>)}

                  {/* View Options  commented temporarily*/}
                  {/* <button
                    type="button"
                    className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <Squares2X2Icon aria-hidden="true" className="size-5" />
                  </button>
                  <button
                    type="button"
                    className="rounded bg-purple-600 px-2 py-1 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                  >
                    <ListBulletIcon aria-hidden="true" className="size-5" />
                  </button> */}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default FilterComponent
