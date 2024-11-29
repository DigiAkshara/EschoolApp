import React from 'react';

export default function CustomSelect({
  label,
  icon: Icon,
  id,
  name,
  options = [],
  value,
  onChange,
  onBlur,
  required = false
}) {
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
        <select
          id={id}
          name={name}
          value={value} // Controlled value
          onChange={onChange} // Pass formik's handler
          onBlur={onBlur} // Pass formik's handler
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
