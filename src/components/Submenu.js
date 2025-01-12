import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
const Submenu = ({activeTab, handleTab})=>{
    const {activeMenu, navConfig} = useSelector((state) => state.appConfig)
    const [tabs, setTabs] = useState([])

    useEffect(()=>{
        const menu = navConfig.filter(menu=>menu.name.toLowerCase() === activeMenu.toLowerCase())
        const item = menu.length>0?menu[0]:null
        if(item?.submenu&&item?.submenu.length>0){
            setTabs(item.submenu)
            handleTab(item.submenu[0].name)
        }
    },[activeMenu])

    return(
        <div>
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
              <select
                id="tabs"
                name="tabs"
                value={activeTab}
                onChange={(e) => handleTab(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
              >
                {tabs.map((tab) => (
                  <option key={tab.name} value={tab.name}>{tab.title}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => handleTab(tab.name)}
                      className={classNames(
                        activeTab === tab.name
                          ? 'border-purple-500 text-purple-600'
                          :'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
                      )}
                      
                    >
                      {tab.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

        </div>
    )
}

export default Submenu;