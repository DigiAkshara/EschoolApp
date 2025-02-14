import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import CustomInput from "../../commonComponent/CustomInput";
import CustomSelect from "../../commonComponent/CustomSelect";
import { getData, postData } from "../../app/api";
import { CLASS_CATEGORIES, CLASSES, DESIGNATION } from "../../app/url";
import { useNavigate } from "react-router-dom";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";

const ClassModal = ({ onClose , getClasses}) => {

  const [classCategory , setClassCategory] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    classCategory: "",
  });

  const getValidationSchema = () => {
    return Yup.object({
      name: Yup.string().required(" Class name is required"),
      classCategory: Yup.string().required(" Class Category is required"),
    });
  };



const getClassCategories = async ()=>{
  try {
    const response = await getData(CLASS_CATEGORIES)
    console.log("CLASS CATEGOTY:",response.data );
    const categoryResponse = response.data.data;
    const CategoryData = categoryResponse.map((item) => {
      return{
        value: item._id,
        label : item.name
      }
    })
    setClassCategory(CategoryData)
  } catch (error) {
    
  }
}

useEffect(() => {
  getClassCategories()
}, [])

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const response = await postData(CLASSES, values);
      console.log("[RESPONSE]:", response);
      if (response.status === 200 || response.status === 201) {
        onClose();
        getClasses();
        handleApiResponse(response.data.message, "success");
        
      }
    } catch (error) {
      console.log(error);
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
                  <h2 className="text-lg font-semibold">Add Class</h2>
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
                    name="classCategory"
                    label="Class Category"
                    options={classCategory}
                    required={true}
                  />
                  <CustomInput
                    name="name"
                    label="Class "
                    placeholder="Eg. 2ndclass"
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

export default ClassModal;
