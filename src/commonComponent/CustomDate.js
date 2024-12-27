import { ErrorMessage, Field } from "formik";
import Datepicker from "react-tailwindcss-datepicker";

export default function CustomDate(props) {
  const { name, label, icon: Icon, required = false } = props;
  const MAX_DATE = new Date();
  MAX_DATE.setDate(MAX_DATE.getDate() - 4);
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
        const value = {startDate: field.value, endDate: field.value}
        return (
          <Datepicker
            value={value || null}
            onChange={(newValue) => {
              setFieldValue(field.name, newValue.startDate);
            }}
            inputClassName="inline-block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
            primaryColor={"purple"}
            asSingle={true}
            useRange={false}
            required={false}
            displayFormat="DD/MM/YYYY"
            id={field.name}
            // maxDate={MAX_DATE}
          />
        );
      }}
    </Field>
        
      </div>
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </>
  );
}
