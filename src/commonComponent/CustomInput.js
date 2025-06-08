import { ErrorMessage, Field } from 'formik'

export default function CustomInput(props) {
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
  const cls = `appearance-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${Icon ? 'pl-10' : ''
    }`

  const preventScroll = (e) => {
    e.preventDefault();
  };
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
        <Field
          onFocus={(e) => e.target.addEventListener('wheel', preventScroll, { passive: false })}
          onBlur={(e) => e.target.removeEventListener('wheel', preventScroll)}
          min="0"
          {...props}
          name={name}
          type={type ? type : 'text'}
          placeholder={placeholder}
          disabled={disabled}
          className={cls}
          required={false}
        />
      </div>
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </div>
  )
}
