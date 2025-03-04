import { XMarkIcon } from "@heroicons/react/20/solid";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { getData, postData } from "../../app/api";
import { FEE_CATEGORY, FEE_SUBCATEGORY } from "../../app/url";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";
import CustomInput from "../../commonComponent/CustomInput";
import CustomSelect from "../../commonComponent/CustomSelect";

const SubCategoryCreation = ({ onClose }) => {

  const [category, setCategory] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });

  const getValidationSchema = () => {
    return Yup.object({
      name: Yup.string().required("Sub Category name is required"),
      category: Yup.string().required(" Category is required"),
    });
  };

  const getCategory = async () => {
    try {
      const response = await getData(FEE_CATEGORY);
      const responseData = response.data.data;
      const categoryData = responseData.map((item) => {
        return {
          value: item._id,
          label: item.name,
        };
      })
      setCategory(categoryData)
    } catch (error) {
      handleApiResponse(error);
    }
  }

  const handleSubmit = async (values) => {
    try {
      const response = await postData(FEE_SUBCATEGORY, values);
      if (response.status === 200 || response.status === 201) {
        onClose();
        handleApiResponse(response.data.message, "success");
      }
    } catch (error) {
      handleApiResponse(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

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
                  <h2 className="text-lg font-semibold">Add Subcategory</h2>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <CustomInput
                    name="name"
                    label="Subcategory"
                    placeholder="Enter Subcategory"
                    required={true}
                  />

                  <CustomSelect
                    name="category"
                    label="Category"
                    options={category}
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

export default SubCategoryCreation;
