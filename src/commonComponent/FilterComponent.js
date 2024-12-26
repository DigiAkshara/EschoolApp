import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ListBulletIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { ArrowDownTrayIcon, FunnelIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

const FilterComponent = ({ onSearch }) => {
  return (
    <div className="relative table-tool-bar z-30">
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
                onChange={onSearch}
                className="block w-full rounded-md border-0 py-1 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 text-sm"
              />
            </div>
          </div>

          <div className="right-action-btns-blk space-x-4">
            <button
              type="button"
              className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <ArrowDownTrayIcon aria-hidden="true" className="size-5" />
            </button>

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
                  <MenuItem>
                    <div className="">
                      <label
                        htmlFor="street-address"
                        className="block text-sm/6 font-regular text-gray-900"
                      >
                        Fee Name
                      </label>
                      <div className="mt-2">
                        <select
                          id="location"
                          name="location"
                          defaultValue="Fee Name Title"
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                        >
                          <option>Fee Name Title</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                        </select>
                      </div>
                    </div>
                  </MenuItem>

                  <MenuItem>
                    <div className="">
                      <label
                        htmlFor="street-address"
                        className="block text-sm/6 font-regular text-gray-900"
                      >
                        Class
                      </label>
                      <div className="mt-2">
                        <select
                          id="location"
                          name="location"
                          defaultValue="Fee Name Title"
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                        >
                          <option>Fee Name Title</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                        </select>
                      </div>
                    </div>
                  </MenuItem>

                  <MenuItem>
                    <div className="">
                      <label
                        htmlFor="street-address"
                        className="block text-sm/6 font-regular text-gray-900"
                      >
                        Section
                      </label>
                      <div className="mt-2">
                        <select
                          id="location"
                          name="location"
                          defaultValue="Fee Name Title"
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                        >
                          <option>Fee Name Title</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                        </select>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem>
                    <div className="">
                      <label
                        htmlFor="street-address"
                        className="block text-sm/6 font-regular text-gray-900"
                      >
                        Gender
                      </label>
                      <div className="mt-2">
                        <select
                          id="location"
                          name="location"
                          defaultValue="Fee Name Title"
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                        >
                          <option>Fee Name Title</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                        </select>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem>
                    <div className="">
                      <label
                        htmlFor="street-address"
                        className="block text-sm/6 font-regular text-gray-900"
                      >
                        Religion
                      </label>
                      <div className="mt-2">
                        <select
                          id="location"
                          name="location"
                          defaultValue="Fee Name Title"
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                        >
                          <option>Fee Name Title</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                        </select>
                      </div>
                    </div>
                  </MenuItem>

                  <MenuItem>
                    <div className="">
                      <label
                        htmlFor="street-address"
                        className="block text-sm/6 font-regular text-gray-900"
                      >
                        Cast
                      </label>
                      <div className="mt-2">
                        <select
                          id="location"
                          name="location"
                          defaultValue="Fee Name Title"
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                        >
                          <option>Fee Name Title</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                        </select>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem>
                    <div className="flex">
                      <button
                        type="button"
                        // onClick={() => setOpen(false)}
                        className="w-1/2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className=" w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                      >
                        Apply
                      </button>
                    </div>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>

            <button
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
