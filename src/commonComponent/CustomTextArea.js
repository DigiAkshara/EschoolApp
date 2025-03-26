import {ErrorMessage} from 'formik'

export default function CustomTextArea(props) {
  const {
    value = '',
    name,
    placeholder,
    type,
    label,
    icon: Icon,
    required = false,
    disabled = false,
  } = props
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm/6 font-regular text-gray-900"
      >
        {label}
        {required && <span className="pl-1 text-red-500">*</span>}
      </label>
      <div className="relative mt-2">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon aria-hidden="true" className="size-5 text-gray-400" />
          </div>
        )}
        <textarea {...props}
        name={name}
        id={name}
        rows="3"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 sm:text-sm"
        placeholder={placeholder}
        disabled={disabled}
        required={required}></textarea>
      </div>
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </div>
  )
}
