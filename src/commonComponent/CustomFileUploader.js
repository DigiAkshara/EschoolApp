import {PhotoIcon} from '@heroicons/react/24/solid'
import {ErrorMessage, Field} from 'formik'
import {useState} from 'react'
export default function CustomFileUploader(props) {
  const {name, label, required = false, isProfile = false, onChange} = props
  const [preview, setPreview] = useState('/LoginImage.jpg')
  // console.log(props)
  return (
    <>
      <label
        htmlFor={name}
        className="block text-sm/6 font-regular text-gray-900"
      >
        {label} {required && <span className="pl-1 text-red-500">*</span>}
      </label>
      <Field name={name}>
        {({field, form: {setFieldValue}}) => {
          return (
            <>
              {isProfile ? (
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm/6 font-regular text-gray-900"
                  ></label>
                  <div className="mt-2 flex items-center gap-x-3">
                    <img
                      alt=""
                      src={field.value?.Location || preview}
                      className="w-12 h-12 object-cover rounded-full"
                    />

                    <label
                      htmlFor={name}
                      type="button"
                      className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <span>Change</span>
                      <input
                        id={name}
                        name={name}
                        type="file"
                        className="sr-only"
                        accept=".jpg,.jpeg,.png"
                        onChange={onChange}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="mt-2 flex justify-center rounded-lg bg-gray-50 border border-dashed border-gray-900/25 px-4 py-4">
                    <div className="flex items-center">
                      <PhotoIcon
                        aria-hidden="true"
                        className="mx-auto size-12 text-gray-300"
                      ></PhotoIcon>
                      <div className="ml-4">
                        <div className="flex text-sm/6 text-gray-600">
                          <label
                            htmlFor={name}
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                          >
                            <span>Upload a file </span>
                            <input
                              id={name}
                              name={name}
                              type="file"
                              className="sr-only"
                              accept=".jpg,.jpeg,.png"
                              onChange={onChange}
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
              )}

              {field.value && (
                <div className="text-sm text-gray-700 mt-2">
                  {field.value.name || field.value.key}
                </div>
              )}
            </>
          )
        }}
      </Field>
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </>
  )
}
