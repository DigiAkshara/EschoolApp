import { ErrorMessage, Field } from "formik";

export default function CustomCheckBox(props) {
  const {name, label, required = false, options} = props

  return (
    <>
      <Field
        name={name}
        type="checkbox"
        className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
      />      
    </>
  );
}
