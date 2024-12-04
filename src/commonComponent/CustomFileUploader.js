import { ErrorMessage, Field, useField, useFormikContext } from "formik";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
export default function CustomFileUploader(props) {
  const { name, placeholder, label, icon: Icon, required = false } = props;

  return (
    <>
      <label
        htmlFor={name}
        className="block text-sm/6 font-regular text-gray-900"
      >
        {label} {required && <span className="pl-1 text-red-500">*</span>}
      </label>
      <Field name={name}>
        {({ field, meta, form: { setFieldValue } }) => {
          return (
            <>
              <div className="mt-2">
                <div className="mt-2 flex justify-center rounded-lg bg-gray-50 border border-dashed border-gray-900/25 px-4 py-4">
                  <div className="flex items-center">
                    <PhotoIcon
                      aria-hidden="true"
                      className="mx-auto size-12 text-gray-300"
                    />
                    <div className="ml-4">
                      <div className="flex text-sm/6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                        >
                          <span>Upload a file </span>
                          <input
                            id="file-upload"
                            name={name}
                            type="file"
                            className="sr-only"
                            onChange={(file)=>setFieldValue(name, file.target.files[0])}
                            accept=".jpg,.jpeg,.png,.pdf"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs/5 text-gray-600">
                        PNG, JPG, up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {field.value && (
                <div className="text-sm text-gray-700 mt-2">{field.value.name}</div>
              )}
            </>
          );
        }}
      </Field>
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </>
  );
}
