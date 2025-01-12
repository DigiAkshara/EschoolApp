import {Form, Formik} from 'formik'
import {useEffect, useState} from 'react'
import navData from '../../assets/json/nav.json'
import CustomCheckBox from '../../commonComponent/CustomCheckBox'
import CustomSelect from '../../commonComponent/CustomSelect'
import { getData } from '../../app/api'
import { ROLES } from '../../app/url'
const Permissions = () => {
  const [roles, setRoles] = useState([])

  const permissionValue = ['Read', 'Write', 'Delete']
  const getRoles = async() => {
    try{
      const data = await getData(ROLES);
      if(data.status === 200|| data.status === 201){
        let roleData = data.data.data.map((item) => {
          return {
            label: item.name, // Displayed text in the dropdown
            value: item._id,
          }
        })
        setRoles(roleData)
      }else{
        throw new Error(data.message)
      }
      console.log('getRoles', data);
    }catch(error){
      console.log(error)
    }
  }
  useEffect(() => {
    getRoles()
  },[])
  return (
    <Formik>
      <Form>
        <div className="mt-4 flex justify-between">
          <div className="right-btns-blk space-x-4">
            <CustomSelect
              isRequired={true}
              label="Role"
              name="role"
              options={roles}
            />
          </div>
        </div>
        <div className="-mx-2 -my-2 mt-0 overflow-x-auto sm:-mx-6">
          <div className="inline-block min-w-full py-4 align-middle sm:px-6">
            <div className="relative">
              <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                <div className="table-container-main overflow-y-auto max-h-[56vh]">
                  {navData.map((item, ind) => (
                    <table
                      className="table-auto min-w-full divide-y divide-gray-300"
                      key={ind}
                    >
                      <thead className="sticky top-0 bg-purple-100 z-20">
                        <tr>
                          <th
                            scope="col"
                            colSpan={4}
                            className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            <div className="relative flex items-start mb-4">
                              <CustomCheckBox
                                name={item.name}
                                label={item.title}
                              />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      {item.submenu && (
                        <tbody className="divide-y divide-gray-200 bg-white z-1">
                          {item.submenu.map((menu, index) => (
                            <tr key={index} className="bg-gray-50">
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                {menu.title}
                              </td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                <div className="relative flex items-start mb-4">
                                  {' '}
                                  <CustomCheckBox name="isRead" label="Read" />
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                <div className="relative flex items-start mb-4">
                                  {' '}
                                  <CustomCheckBox
                                    name="isWrite"
                                    label="Write"
                                  />
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                <div className="relative flex items-start mb-4">
                                  {' '}
                                  <CustomCheckBox
                                    name="isDelete"
                                    label="Delete"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Formik>
  )
}
export default Permissions
