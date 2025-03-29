import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronDownIcon
} from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getData } from "../app/api";
import {
  logout,
  setAcademicYear,
  setAcademicYears,
  setBranchData,
  setBranchId
} from "../app/reducers/appConfigSlice";
import { ACADEMIC_YEAR } from "../app/url";
import { capitalizeWords, handleApiResponse } from "../commonComponent/CommonFunctions";

function Header({ updateSideBar }) {
  let academicId = localStorage.getItem("academicYear");
  let branchId = localStorage.getItem("branchId");
  const { branchs, user, academicYears, academicYear, branchData } = useSelector((state) => state.appConfig);
  const [selectedBranch, setSelectedBranch] = useState(branchId || null);
  const [branch, setBranch] = useState(branchData || null);
  const [academic, setAcademic] = useState(academicId || null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logOut = () => {
    localStorage.removeItem("studentManagement");
    localStorage.removeItem("branchId");
    localStorage.removeItem("academicYear");
    dispatch(logout());
    navigate("/login");
  };
  useEffect(() => {
    setBranch(branchData);
  }, [branchData]);

  const handleAcademicChange = (e) => {
    const academicYear = e.target.value;
    setAcademic(academicYear);
    localStorage.setItem("academicYear", academicYear);
    let academic = academicYears.find((year) => year._id === academicYear);
    dispatch(setAcademicYear(academic));
    window.location.reload();
  };

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    localStorage.setItem("branchId", branchId);
    setSelectedBranch(branchId);
    dispatch(setBranchId(branchId));
    branchs.forEach(branch => {
      if (branch.value === branchId) {
        setBranch(branch)
        dispatch(
          setBranchData({
            ...branch,
            logo: branch.logo || null, // Ensuring `logo` is always defined
          })
        );
      }
    })
    updateAcademicYear()
  };

  const updateAcademicYear = async () => {
    try {
      const res = await getData(ACADEMIC_YEAR + "/all");
      dispatch(setAcademicYears(res.data.data));
      let academic = res.data.data.find((year) => year.year === academicYear?.year);
      localStorage.setItem('academicYear', academic._id)
      window.location.reload();
    } catch (error) {
      handleApiResponse(error)
    }
  }

  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-6">
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

        <div className="flex flex-1 justify-between items-center gap-x-4 self-stretch lg:gap-x-6 ">
          <div className="flex items-center h-full py-1">
            <img
              alt={branch?.logo?.Location || "Logo not found"}
              src={branch?.logo?.Location || "/schoolLogo.jpg"}
              className="h-full mr-2"
            />
            <h3 className="font-medium text-xl w-64 truncate">
              {branch?.label || "Branch Name"}
            </h3>
          </div>

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {user?.role.name !== "superadmin" && (
              <>
                <select
                  name="branch"
                  disabled={user?.role.name !== "admin"}
                  className="mt-2 block w-40 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                  onChange={handleBranchChange}
                  value={selectedBranch}
                >
                  {branchs.map((branch) => (
                    <option key={branch.value} value={branch.value}>
                      {branch.label}
                    </option>
                  ))}
                </select>
                <select
                  name="academicYear"
                  disabled={user?.role.name !== "admin"}
                  className="mt-2 block w-40 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                  onChange={handleAcademicChange}
                  value={academic}
                >
                  {academicYears.map((year) => (
                    <option key={year._id} value={year._id}>
                      {year.year}
                    </option>
                  ))}
                </select>
              </>
            )}
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
            {user && (
              <Menu as="div" className="relative">
                <MenuButton className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src={user?.profilePic?.Location || "/default-profile.png"}
                    className="h-8 w-8 rounded-full bg-gray-50"
                  />
                  <span className="hidden lg:flex lg:items-center">
                    <div className="flex flex-col items-start ml-4">
                      <span
                        aria-hidden="true"
                        className="text-sm/6 font-semibold text-gray-900 w-24 truncate"
                      >
                        {capitalizeWords(user?.firstname)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {capitalizeWords(user?.role.name)}
                      </span>
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
