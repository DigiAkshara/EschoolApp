import { ErrorMessage, Field } from "formik";

export default function CustomMultiSelect(props) {
  const { name, title, description, placeholder, label, required = false } = props;

  return (
    <>
      <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
        {title}{required && <span className="pl-1 text-red-500">*</span>}
      </h2>
      <p className="text-base font-regular text-gray-900">{description}</p>
      <Field name={name}>
        {({ field, form }) => {
          const { value } = field; // Get the array of selected items from Formik's field value
          const { setFieldValue } = form; // For updating Formik's field value

          const handleAdd = (event) => {
            event.preventDefault();
            const input = event.target.previousSibling.value.trim();
            if (input && !value.includes(input)) {
              setFieldValue(name, [...value, input]);
              event.target.previousSibling.value = ""; // Clear the input field
            }
          };

          const handleRemove = (item) => {
            setFieldValue(name, value.filter((i) => i !== item));
          };

          return (
            <div className="flex items-center mt-4 gap-4">
              <div className="filter-badges-blk flex flex-wrap gap-4">
                {value.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                  >
                    {item}
                    <button
                      type="button"
                      className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
                      onClick={() => handleRemove(item)}
                    >
                      <span className="sr-only">Remove</span>
                      <svg
                        viewBox="0 0 14 14"
                        className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                      >
                        <path d="M4 4l6 6m0-6l-6 6" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex add-sub-input-blk">
                <input
                  type="text"
                  placeholder={placeholder}
                  className="block w-52 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                />
                <button
                  type="button"
                  className="w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                  onClick={handleAdd}
                >
                  Add
                </button>
              </div>
            </div>
          );
        }}
      </Field>
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </>
  );
}
