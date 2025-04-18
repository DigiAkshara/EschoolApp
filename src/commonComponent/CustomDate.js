import { ErrorMessage, Field } from 'formik'
import moment from 'moment'
import Datepicker from 'react-tailwindcss-datepicker'

export default function CustomDate(props) {
  const { 
    name, 
    label, 
    required = false, 
    maxDate = null, 
    minDate = null, 
    value, 
    placeholder,
    disabled = false } = props
  return (
    <>
      <label
        htmlFor={name}
        className="block text-sm/6 font-regular text-gray-900"
      >
        {label} {required && <span className="pl-1 text-red-500">*</span>}
      </label>
      <div className="mt-2">
        <Field name={name}>
          {({ field, meta, form: { setFieldValue } }) => {
            const value = { startDate: field.value, endDate: field.value }
            return (
              <Datepicker
                {...props}
                value={value || null}
                onChange={(newValue) => {
                  let value = newValue.startDate?moment(newValue.startDate).format('YYYY-MM-DD'):null
                  if (props.onChange) {
                    props.onChange(value)
                  } else {
                    setFieldValue(field.name, value)
                  }
                }}
                inputClassName="inline-block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                primaryColor={'purple'}
                required={false}
                id={field.name}
                disabled={disabled}
                minDate={minDate ? moment(minDate).toDate() : null}
                maxDate={maxDate ? moment(maxDate).toDate() : null}
                asSingle={true}
                displayFormat="DD/MM/YYYY"
                useRange={false}
                placeholder={placeholder}
                popoverDirection="down"
              />
            )
          }}
        </Field>
      </div>
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </>
  )
}
