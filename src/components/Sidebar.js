import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Staff", href: "/staff", icon: UsersIcon },
  { name: "Students", href: "/students", icon: FolderIcon },
  { name: "Attendance", href: "/attendance", icon: CalendarIcon },
  { name: "Academics", href: "/academics", icon: DocumentDuplicateIcon },
  { name: "Finance", href: "/finance", icon: DocumentDuplicateIcon },

  { name: "Reports and Analytics", href: "#", icon: ChartPieIcon },
  { name: "Transportation", href: "#", icon: ChartPieIcon },
  { name: "Hostel Management", href: "#", icon: ChartPieIcon },
  { name: "Admin Operations", href: "#", icon: ChartPieIcon },
  { name: "Notice Board", href: "#", icon: ChartPieIcon },
];
const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H" },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T" },
  { id: 3, name: "Workcation", href: "#", initial: "W" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ sidebarOpen, updateSideBar }) {
  //   const [sidebarOpen, setSidebarOpen] = useState(sidebarOpen)
  const location = useLocation();
  const navigate = useNavigate();
  
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
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
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
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        // href={item.href}
                        onClick={() => navigate(item.href)}
                        className={classNames(
                          location.pathname === item.href
                            ? "bg-purple-700 text-white"
                            : "text-purple-200 hover:bg-purple-700 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer"
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={classNames(
                            location.pathname === item.href
                              ? "text-white"
                              : "text-purple-200 group-hover:text-white",
                            "h-6 w-6 shrink-0"
                          )}
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
