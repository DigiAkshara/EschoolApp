import { XMarkIcon } from "@heroicons/react/20/solid";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { updateData } from '../../app/api';
import { capitalizeWords, handleApiResponse } from "../../commonComponent/CommonFunctions";
import CustomInput from "../../commonComponent/CustomInput";

const EditModal = ({ data, onClose, refreshData }) => {
  console.log(data)
  const formData = {
    [data.name?.toLowerCase()]: data[data.name?.toLowerCase()],
  };

  const getValidationSchema = () => {
    return Yup.object({
      [data.name?.toLowerCase()]: Yup.string().required(capitalizeWords(data?.name) + " field is Required"),
    });
  };

  const handleSubmit = async (values) => {
    try {
      let payload = { ...values }
      if (data?.name?.toLowerCase() === 'class') {
        payload = { name: values.class }
      }
      const response = await updateData(data?.url + '/' + data._id, payload);
      refreshData();
      handleApiResponse(response.data.message, "success");
      onClose();
    } catch (error) {
      handleApiResponse(error);
    }
  };

  return (
    <>
      <Formik
        initialValues={formData}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors }) => (
          <Form>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white w-96 rounded-lg shadow-lg">
                <div className="flex justify-between items-center bg-purple-600 text-white p-3 rounded-t-lg">
                  <h2 className="text-lg font-semibold">Edit {capitalizeWords(data?.name)}</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-white hover:text-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-6">
                  <CustomInput
                    name={data?.name.toLowerCase()}
                    label={capitalizeWords(data?.name)}
                    required={true}
                  />
                </div>
                <div className="p-3 flex justify-end space-x-2 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EditModal;
