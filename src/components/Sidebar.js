import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react'
import * as Icons from '@heroicons/react/24/outline'
import {XMarkIcon} from '@heroicons/react/24/outline'

import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {setActiveMenu} from '../app/reducers/appConfigSlice'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar({sidebarOpen, updateSideBar}) {
  const {activeMenu, navConfig} = useSelector((state) => state.appConfig)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleMenuClick = (menu) => {
    updateSideBar(false)
    dispatch(setActiveMenu(menu.name))
    navigate(menu.path)
  }

  const getIcon = (item) => {
    const IconComponent = Icons[item.icon]
    return IconComponent ? (
      <IconComponent
        aria-hidden="true"
        className={classNames(
          activeMenu.toLowerCase() === item.name.toLowerCase()
            ? 'text-white'
            : 'text-purple-200 group-hover:text-white',
          'h-6 w-6 shrink-0',
        )}
      />
    ) : null
  }

  const navMenu = ()=>{
    return(
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-purple-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              alt="Your Company"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=white"
              className="h-8 w-auto"
            />
            <h5 className="px-4 text-white">DigiAkshara</h5>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navConfig.map((item) => (
                    <li key={item.name}>
                      <a
                        onClick={() => handleMenuClick(item)}
                        className={classNames(
                          activeMenu?.toLowerCase() === item.name?.toLowerCase()
                            ? 'bg-purple-700 text-white'
                            : 'text-purple-200 hover:bg-purple-700 hover:text-white',
                          'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer',
                        )}
                      >
                        {getIcon(item)}
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
    )
  }

  return (
    <>
      <Dialog
        open={sidebarOpen}
        onClose={() => updateSideBar(false)}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button
                  type="button"
                  onClick={() => updateSideBar(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-white"
                  />
                </button>
              </div>
            </TransitionChild>
            
            {/* Sidebar component, swap this element with another sidebar if you like */}
            {navMenu()}
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        {navMenu()}
      </div>
    </>
  )
}
