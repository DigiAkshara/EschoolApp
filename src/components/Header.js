import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearSession, setBranchData, setBranchId } from '../app/reducers/appConfigSlice'

function Header({ updateSideBar }) {
  const { branchs, user } = useSelector((state) => state.appConfig)
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branch, setBranch] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const logOut = () => {
    localStorage.removeItem('studentManagement')
    dispatch(clearSession())
    navigate('/login')
  }
  useEffect(() => {
    if (branchs.length > 0) {
      branchs.forEach((branch) => {
        if (user?.role.name == 'admin') {
          if (branch.isDefault) {
            setSelectedBranch(branch.value)
            setBranch(branch)
            dispatch(setBranchId(branch.value))
            handleBranch(branch.value)
          }
        } else {
          if (user?.role.name !== 'superadmin') {
            setSelectedBranch(user.branch)
            setBranch(branchs.find((branch) => branch.value === user.branch))
            dispatch(setBranchId(user.branch))
            handleBranch(user.branch)
          }
        }
      })
    }
  }, [branchs, user])

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);
    dispatch(setBranchId(branchId));
    handleBranch(branchId);
  };

  const handleBranch = (branchId) => {
    const selectedBranchData = branchs.find(branch => branch.value === branchId);
  console.log("BRANCH DATA:", selectedBranchData);
  
    if (selectedBranchData) {
      dispatch(
        setBranchData({
          ...selectedBranchData,
          logo: selectedBranchData.logo || null, // Ensuring `logo` is always defined
        })
      );
    }
  };
  


  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => updateSideBar(true)}
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="h-6 w-6" />
        </button>

        {/* Separator */}
        <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="relative flex flex-1 lg:items-center">
            <img
              alt=""
              src= {branch?.logo?.Location || "https://tailwindui.com/plus-assets/img/logos/mark.svg?color=purple&shade=600"}
              className="h-8 w-auto"
            />
            {/* <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            />
            <input
              id="search-field"
              name="search"
              type="search"
              placeholder="Search..."
              className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            /> */}
          </div>

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {user?.role.name !== 'superadmin' && (
              <select name="branch"
                disabled={user?.role.name !== 'admin'}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-purple-600 sm:text-sm/6 pl-6"
                onChange={handleBranchChange} value={selectedBranch}>
                <option value="">Select Branch</option>
                {branchs.map((branch) => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>)}

            {/* Separator */}
            <div
              aria-hidden="true"
              className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            />
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div
              aria-hidden="true"
              className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            />

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <img
                  alt=""
                  src={branch?.logo?.Location || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                  className="h-8 w-8 rounded-full bg-gray-50"
                />
                <span className="hidden lg:flex lg:items-center">
                  <div className="flex flex-col items-start ml-4">
                    <span
                      aria-hidden="true"
                      className="text-sm/6 font-semibold text-gray-900"
                    >
                      {branch?.label}
                    </span>
                    <span className="text-xs text-gray-500">Admin</span>
                  </div>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="ml-2 h-5 w-5 text-gray-400"
                  />
                </span>
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <span className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none cursor-pointer">
                    Your Profile
                  </span>
                </MenuItem>
                <MenuItem onClick={logOut}>
                  <span className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none cursor-pointer">
                    Sign out
                  </span>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
