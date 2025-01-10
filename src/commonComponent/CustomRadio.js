import { ErrorMessage, Field } from "formik";

export default function CustomRadio(props) {
  const {name, label, required = false, options, defaultValue='present'} = props

  return (
    <>
      <label htmlFor={name} className="block text-sm/6 font-regular text-gray-900">
      {label} {required&&<span className='pl-1 text-red-500'>*</span>}
      </label>
      <div className="mt-2">
        <div className="space-y-6 sm:flex sm:items-center sm:space-x-4 sm:space-y-0">
          {options.map((option, index) => (
            <div key={index} className="flex items-center">
              <Field
                {...props}
                name={name}
                type="radio"
                value={option.value}
                className="size-4 border-gray-300 text-purple-600 focus:ring-purple-600"
              />
              <label htmlFor={option} className="ml-3 block text-sm/6 font-regular text-gray-900">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </>
  );
}
