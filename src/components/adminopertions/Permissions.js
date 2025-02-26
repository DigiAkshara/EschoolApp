import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { getData, postData } from "../../app/api";
import { BRANCH, PERMISSIONS, ROLES } from "../../app/url";
import navData from "../../assets/json/nav.json";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";
import CustomCheckBox from "../../commonComponent/CustomCheckBox";
import CustomSelect from "../../commonComponent/CustomSelect";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoader } from "../../app/reducers/appConfigSlice";
const Permissions = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.appConfig);
  const [roles, setRoles] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [mainPermissions, setMainPermissions] = useState(navData);
  const [adminRole, setAdminRole] = useState(null);
  const initialValues = {
    role: "",
    tenant: user?.role.name === "superadmin" ? "" : user?.tenant,
    permissions: mainPermissions.map((item) => {
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
      };
    }),
  };
  const getValidationSchema = () => {
    return Yup.object({
      role: Yup.string().required("Role is required"),
      tenant: Yup.string().required("Tenant is required"),
      permissions: Yup.array().of(
        Yup.object({
          name: Yup.string(),
          title: Yup.string(),
          read: Yup.boolean(),
          submenu: Yup.array().of(
            Yup.object().shape({
              delete: Yup.boolean(),
              edit: Yup.boolean(),
              read: Yup.boolean(),
              write: Yup.boolean(),
              name: Yup.string(),
              title: Yup.string(),
            })
          ),
          // .test(
          //   "submenu-permission-check",
          //   "At least one permission (delete, edit, read, write) must be true in the submenu when menu is checked",
          //   function (submenu) {
          //     const { read } = this.parent; // Access 'menu.read'
          //     if (!read || submenu.length === 0) return true; // Skip validation if 'menu.read' is false
          //     return submenu.some(
          //       (item) => item.delete || item.edit || item.read || item.write
          //     );
          //   }
          // ),
        })
      ),
    });
  };
  const handleSubmit = async (values) => {
    try {
      let res = await postData(PERMISSIONS, values);
      handleApiResponse(res.data.message, "success");
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const handleMenuPermissions = (e, index, values, setFieldValue) => {
    let dumpList = [...values.permissions];
    dumpList[index].read = e.target.checked;
    dumpList[index].submenu.forEach((item) => {
      item.read = false;
      item.write = false;
      item.edit = false;
      item.delete = false;
    });
    setFieldValue("permissions", dumpList);
  };

  const getRoles = async (user) => {
    try {
      const res = await getData(ROLES);
      let roleData = res.data.data
        .filter((item) => item.name !== "superadmin")
        .map((item) => {
          if (item.name === "admin") {
            setAdminRole(item._id);
          }
          return {
            label: item.name, // Displayed text in the dropdown
            value: item._id,
          };
        });
      if (user?.role.name === "admin") {
        roleData = roleData.filter((item) => item.label !== "admin");
      }
      setRoles(roleData);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const getBraches = async () => {
    try {
      const data = await getData(BRANCH + "?isDefault=true");
      let branchData = data.data.data.map((item) => {
        return {
          label: item.name, // Displayed text in the dropdown
          value: item.tenant._id,
        };
      });
      setTenants(branchData);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const handleChange = async (e, setFieldValue, values) => {
    setFieldValue(e.target.name, e.target.value);
    let role = values.role;
    let tenant = values.tenant;
    if (e.target.name === "role") {
      role = e.target.value;
    } else {
      tenant = values.tenant;
    }
    if (tenant) {
      getPermissions(role, tenant, setFieldValue);
    }
  };

  const getPermissions = async (role, tenant, setFieldValue) => {
    try {
      dispatch(setIsLoader(true));
      let res = {data:{data:null}};
      if(role) res = await getData(PERMISSIONS + "/" + role + "/" + tenant);
      let dumpLIst = [];
      mainPermissions.forEach((item) => {
        let obj = {
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
        };
        if (res.data.data) {
          let index = res.data.data.permissions.findIndex(
            (i) => i.name === item.name
          );
          if (index != -1) {
            obj.read = true;
            obj.submenu.forEach((submenu) => {
              let subIndex = res.data.data.permissions[index].submenu.findIndex(
                (i) => i.name === submenu.name
              );
              if (subIndex != -1) {
                submenu.read =
                  res.data.data.permissions[index].submenu[subIndex].read;
                submenu.write =
                  res.data.data.permissions[index].submenu[subIndex].write;
                submenu.edit =
                  res.data.data.permissions[index].submenu[subIndex].edit;
                submenu.delete =
                  res.data.data.permissions[index].submenu[subIndex].delete;
              }
            });
          }
        }
        dumpLIst.push(obj);
      });
      setFieldValue("permissions", dumpLIst);
    } catch (error) {
      handleApiResponse(error);
    } finally {
      dispatch(setIsLoader(false));
    }
  };

  const getAdminPermissions = async (role, tenant) => {
    try {
      dispatch(setIsLoader(true));
      let res = await getData(PERMISSIONS + "/" + role + "/" + tenant);
      if (res.data.data) {
        let permissions = [];
        res.data.data.permissions.forEach((item) => {
          if (item.read) {
            let submenus = item.submenu.filter((submenu) => {
              if (submenu.read) {
                return submenu;
              }
            });
            permissions.push({
              ...item,
              submenu: submenus,
            });
          }
        });
        setMainPermissions(permissions);
      }
    } catch (error) {
      handleApiResponse(error);
    } finally {
      dispatch(setIsLoader(false));
    }
  };

  useEffect(() => {
    getRoles(user);
    getBraches();
  }, [user]);

  useEffect(() => {
    if (user?.role.name !== "superadmin") {
      let tenant = user?.tenant;
      if (adminRole && tenant) getAdminPermissions(adminRole, tenant);
    }
  }, [user, adminRole]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, errors }) => (
        <Form>
          <div className="mt-4 flex justify-between">
            <div className=" grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
              {user?.role.name === "superadmin" && (
                <div className="sm:col-span-2">
                  <CustomSelect
                    required={true}
                    label="Tenant"
                    name="tenant"
                    options={tenants}
                    onChange={(e) => {
                      handleChange(e, setFieldValue, values);
                    }}
                  />
                </div>
              )}
              <div className="sm:col-span-2">
                <CustomSelect
                  required={true}
                  label="Role"
                  name="role"
                  options={roles}
                  onChange={(e) => {
                    handleChange(e, setFieldValue, values);
                  }}
                />
              </div>
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
                                {user?.role.name !== "superadmin" ? (
                                  item.title
                                ) : (
                                  <CustomCheckBox
                                    name={`permissions[${ind}].read`}
                                    checked={item.read}
                                    label={item.title}
                                    disabled={user?.role.name !== "superadmin"}
                                    onChange={(e) =>
                                      handleMenuPermissions(
                                        e,
                                        ind,
                                        values,
                                        setFieldValue
                                      )
                                    }
                                  />
                                )}
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
                                  {user?.role.name !== "superadmin" ? (
                                    menu.title
                                  ) : (
                                    <div className="relative flex items-start mb-4">
                                      <CustomCheckBox
                                        name={`permissions[${ind}].submenu[${index}].read`}
                                        label={menu.title}
                                        checked={menu.read}
                                        // disabled={!item.read}
                                      />
                                    </div>
                                  )}
                                </td>
                                {user?.role.name !== "superadmin" ? (
                                  <>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      <div className="relative flex items-start mb-4">
                                        <CustomCheckBox
                                          name={`permissions[${ind}].submenu[${index}].read`}
                                          label="Read"
                                          checked={menu.read}
                                          // disabled={!item.read}
                                        />
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      <div className="relative flex items-start mb-4">
                                        <CustomCheckBox
                                          name={`permissions[${ind}].submenu[${index}].write`}
                                          checked={menu.write}
                                          label="Write"
                                          // disabled={!item.read}
                                        />
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      <div className="relative flex items-start mb-4">
                                        {" "}
                                        <CustomCheckBox
                                          name={`permissions[${ind}].submenu[${index}].edit`}
                                          checked={menu.edit}
                                          label="Edit"
                                          // disabled={!item.read}
                                        />
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      <div className="relative flex items-start mb-4">
                                        {" "}
                                        <CustomCheckBox
                                          name={`permissions[${ind}].submenu[${index}].delete`}
                                          checked={menu.delete}
                                          label="Delete"
                                          // disabled={!item.read}
                                        />
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td
                                      className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                                      colSpan={4}
                                    ></td>
                                  </>
                                )}
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
  );
};
export default Permissions;
