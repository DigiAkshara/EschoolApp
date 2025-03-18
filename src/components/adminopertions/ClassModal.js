import { XMarkIcon } from "@heroicons/react/20/solid";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { postData } from "../../app/api";
import { CLASSES } from "../../app/url";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";
import CustomInput from "../../commonComponent/CustomInput";

const ClassModal = ({ onClose, updateData }) => {

  const formData = {
    name: "",
  };

  const getValidationSchema = () => {
    return Yup.object({
      name: Yup.string().required(" Class name is required"),
    });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await postData(CLASSES, values);
      updateData();
      handleApiResponse(response.data.message, "success");
      handleApiResponse("Add section for the created class then only it display on table.", "info");
      onClose(true);
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
                  <h2 className="text-lg font-semibold">Add Class</h2>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-6">
                  <CustomInput
                    name="name"
                    label="Class "
                    placeholder="Eg. 2ndclass"
                    required={true}
                  />
                </div>
                <div className="p-3 flex justify-end space-x-2 border-t">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500">
                    Add
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

export default ClassModal;
