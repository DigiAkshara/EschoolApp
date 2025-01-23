import { ErrorMessage } from 'formik'
import Select from 'react-tailwindcss-select'

export default function MutliSelect(props) {
  const {
    label,
    icon: Icon,
    name,
    isLabelRequired = true,
    options = [],
    required = false,
    placeholder,
  } = props
  const cls = `mt-2 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-purple-600 sm:text-sm/6 ${
    Icon ? 'pl-10' : 'pl-3'
  }`

  return (
    <div>
      {isLabelRequired && (
        <label
          htmlFor={name}
          className="block text-sm/6 font-regular text-gray-900"
        >
          {label}
          {required && <span className="pl-1 text-red-500">*</span>}
        </label>
      )}
      <div className="relative mt-2">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon aria-hidden="true" className="size-5 text-gray-400" />
          </div>
        )}
        <Select
          {...props}
          name={name}
          className={cls}
          options={options}
          isMultiple={true}
          placeholder={placeholder}/>
      </div>
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </div>
  )
}
