import {Form, Formik} from 'formik'
import * as Yup from 'yup'
import {useEffect, useState} from 'react'
import navData from '../../assets/json/nav.json'
import CustomCheckBox from '../../commonComponent/CustomCheckBox'
import CustomSelect from '../../commonComponent/CustomSelect'
import {getData, postData} from '../../app/api'
import {PERMISSIONS, ROLES} from '../../app/url'
const Permissions = () => {
  const [roles, setRoles] = useState([])
  const initialValues = {
    role: '',
    permissions: navData.map((item) => {
      return {
        name: item.name,
        title: item.title,
        read: false,
        submenu: item.submenu
          ? item.submenu.map((menu) => ({
              title: menu.title,
              name: menu.name,
              read: false,
              write: false,
              delete: false,
              edit: false,
            }))
          : [],
      }
    }),
  }
  const getValidationSchema = () => {
    return Yup.object({
      role: Yup.string().required('Role is required'),
      permissions: Yup.array().of(
        Yup.object({
          name: Yup.string(),
          title: Yup.string(),
          read: Yup.boolean(),
          submenu: Yup.array()
            .of(
              Yup.object().shape({
                delete: Yup.boolean(),
                edit: Yup.boolean(),
                read: Yup.boolean(),
                write: Yup.boolean(),
                name: Yup.string(),
                title: Yup.string(),
              }),
            )
            .test(
              'submenu-permission-check',
              'At least one permission (delete, edit, read, write) must be true in the submenu when menu is checked',
              function (submenu) {
                const {read} = this.parent // Access 'menu.read'
                if (!read || submenu.length === 0) return true // Skip validation if 'menu.read' is false
                return submenu.some(
                  (item) => item.delete || item.edit || item.read || item.write,
                )
              },
            ),
        }),
      ),
    })
  }
  const handleSubmit = async (values) => {
    try {
      let res = await postData(PERMISSIONS, values)
      if (res.status === 200 || res.status === 201) {
        alert('Permissions added successfully!')
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleMenuPermissions = (e, index, values, setFieldValue) => {
    let dumpList = [...values.permissions]
    dumpList[index].read = e.target.checked
    dumpList[index].submenu.forEach((item) => {
      item.read = false
      item.write = false
      item.edit = false
      item.delete = false
    })
    setFieldValue('permissions', dumpList)
  }

  const getRoles = async () => {
    try {
      const data = await getData(ROLES)
      if (data.status === 200 || data.status === 201) {
        let roleData = data.data.data.map((item) => {
          return {
            label: item.name, // Displayed text in the dropdown
            value: item._id,
          }
        })
        setRoles(roleData)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleRoleChange = async (e, setFieldValue) => {
    setFieldValue('role', e.target.value)
    try {
      let res = await getData(PERMISSIONS + '/' + e.target.value)
      if (res.status === 200 || res.status === 201) {
        if (res.data.data) {
          setFieldValue('permissions', res.data.data.permissions)
        } else {
          const permissions = navData.map((item) => {
            return {
              name: item.name,
              title: item.title,
              read: false,
              submenu: item.submenu
                ? item.submenu.map((menu) => ({
                    title: menu.title,
                    name: menu.name,
                    read: false,
                    write: false,
                    delete: false,
                    edit: false,
                  }))
                : [],
            }
          })
          setFieldValue('permissions', permissions)
        }
      } else {
        throw new Error(res.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getRoles()
  }, [])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      onSubmit={handleSubmit}
    >
      {({values, setFieldValue, errors}) => (
        <Form>
          <div className="mt-4 flex justify-between">
            <div className="right-btns-blk space-x-4">
              <CustomSelect
                isRequired={true}
                label="Role"
                name="role"
                options={roles}
                onChange={(e) => handleRoleChange(e, setFieldValue)}
              />
            </div>
          </div>
          <div className="-mx-2 -my-2 mt-0 overflow-x-auto sm:-mx-6">
            <div className="inline-block min-w-full py-4 align-middle sm:px-6">
              <div className="relative">
                <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                  <div className="table-container-main overflow-y-auto max-h-[56vh]">
                    {values.permissions.map((item, ind) => (
                      <table
                        className="table-auto min-w-full divide-y divide-gray-300"
                        key={ind}
                      >
                        <thead className="sticky top-0 bg-purple-100 z-20">
                          <tr>
                            <th
                              scope="col"
                              colSpan={5}
                              className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              <div className="relative flex items-start mb-4">
                                <CustomCheckBox
                                  name={`permissions[${ind}].read`}
                                  checked={item.read}
                                  label={item.title}
                                  onChange={(e) =>
                                    handleMenuPermissions(
                                      e,
                                      ind,
                                      values,
                                      setFieldValue,
                                    )
                                  }
                                />
                              </div>
                              {item.submenu.length > 0 &&
                                errors?.permissions?.[ind]?.submenu && (
                                  <span className="text-red-500">
                                    {errors?.permissions?.[ind]?.submenu}
                                  </span>
                                )}
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
                                    <CustomCheckBox
                                      name={`permissions[${ind}].submenu[${index}].read`}
                                      label="Read"
                                      checked={menu.read}
                                      disabled={!item.read}
                                    />
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                  <div className="relative flex items-start mb-4">
                                    <CustomCheckBox
                                      name={`permissions[${ind}].submenu[${index}].write`}
                                      checked={menu.write}
                                      label="Write"
                                      disabled={!item.read}
                                    />
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                  <div className="relative flex items-start mb-4">
                                    {' '}
                                    <CustomCheckBox
                                      name={`permissions[${ind}].submenu[${index}].edit`}
                                      checked={menu.edit}
                                      label="Edit"
                                      disabled={!item.read}
                                    />
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                  <div className="relative flex items-start mb-4">
                                    {' '}
                                    <CustomCheckBox
                                      name={`permissions[${ind}].submenu[${index}].delete`}
                                      checked={menu.delete}
                                      label="Delete"
                                      disabled={!item.read}
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
          <div className="flex shrink-0 justify-between px-4 py-4">
            <button
              type="button"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
            >
              Cancel
            </button>

            <div>
              <button
                type="submit"
                className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
              >
                Save
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}
export default Permissions
