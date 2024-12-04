import { ErrorMessage, Field } from "formik";

export default function CustomInput(props) {
  const {name, placeholder, label, icon: Icon, required = false} = props

  return (
    <div>
      <label htmlFor={name} className="block text-sm/6 font-regular text-gray-900">
        {label}{required&&<span className="pl-1 text-red-500">*</span>}
      </label>
      <div className="relative mt-2">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon aria-hidden="true" className="size-5 text-gray-400" />
          </div>
        )}
        <Field
          name={name}
          placeholder={placeholder}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
        />
      </div>
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </div>
  );
}
