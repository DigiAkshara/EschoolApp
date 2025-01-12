import {ErrorMessage, Field} from 'formik'

export default function CustomCheckBox(props) {
  const {name, label, required = false, options} = props

  return (
    <>
      <div className="flex h-6 items-center">
        <Field
          {...props}
          name={name}
          type="checkbox"
          className={
            label
              ? 'size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600'
              : 'absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600'
          }
        />
      </div>
      {label && (
        <div className="ml-3 text-sm/6">
          <label htmlFor="sameAsPresent" className="font-regular text-gray-900">
            {label}
          </label>
        </div>
      )}
    </>
  )
}
