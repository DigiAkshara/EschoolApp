import { XMarkIcon } from "@heroicons/react/20/solid";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { getData, postData } from "../../app/api";
import { CLASSES, SECTIONS } from "../../app/url";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";
import CustomInput from "../../commonComponent/CustomInput";
import CustomSelect from "../../commonComponent/CustomSelect";

const SectionModal = ({ onClose, updateData }) => {
  const [classDatas, setClassData] = useState([]);

  const formData ={
    section: "",
    class: "",
  };

  const getValidationSchema = () => {
    return Yup.object({
      section: Yup.string()
        .matches(/^[A-Z]{1,2}$/, "Only 1 or 2 capital letters are allowed")
        .required("Section name is required"),
      class: Yup.string().required(" Class is required"),
    });
  };

  const getClass = async () => {
    try {
      const response = await getData(CLASSES);
      const responseData = response.data.data;
      const classData = responseData.map((item) => {
        return {
          value: item._id,
          label: item.name,
        };
      });
      setClassData(classData);
    } catch (error) {
      handleApiResponse(error)
    }
  };

  useEffect(() => {
    getClass();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const response = await postData(SECTIONS, values);
      onClose();
      updateData();
      handleApiResponse(response.data.message, "success");
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
                {/* Modal Header */}
                <div className="flex justify-between items-center bg-purple-600 text-white p-3 rounded-t-lg">
                  <h2 className="text-lg font-semibold">Add Section</h2>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <CustomSelect
                    name="class"
                    label="Class"
                    options={classDatas}
                    required={true}
                  />
                  <CustomInput
                    name="section"
                    label="Section"
                    placeholder="Enter section"
                    required={true}
                  />
                </div>

                {/* Modal Footer */}
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

export default SectionModal;
