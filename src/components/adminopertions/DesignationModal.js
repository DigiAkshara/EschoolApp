import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import CustomInput from "../../commonComponent/CustomInput";
import CustomSelect from "../../commonComponent/CustomSelect";
import { staffType } from "../../commonComponent/CommonFunctions";
import { postData } from "../../app/api";
import { DESIGNATION } from "../../app/url";
import { useNavigate } from "react-router-dom";

const DesignationModal = ({ isOpen, onClose, onSubmit }) => {
    const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    staffType: "",
  });

  const getValidationSchema = () => {
    return Yup.object({
      name: Yup.string().required(" Designation name is required"),
      staffType: Yup.string().required(" Staff type is required"),
    });
  };

  if (!isOpen) return null; 

  const handleSubmit = async (values)=>{
    console.log(values)
    try {
        const response = await postData(DESIGNATION , values)  
        console.log("[RESPONSE]:",response) 
        if(response.status === 200 || response.status === 201){
            onClose()
        }
    } catch (error) {
        console.log(error)
    }
  }


  return (
    <>
      <Formik initialValues={formData}
      validationSchema={getValidationSchema()}
      onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors }) => (
          <Form>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white w-96 rounded-lg shadow-lg">
                {/* Modal Header */}
                <div className="flex justify-between items-center bg-purple-600 text-white p-3 rounded-t-lg">
                  <h2 className="text-lg font-semibold">Add Designation</h2>
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
                  label="Designation Name"
                  placeholder="Enter Designation"
                  required={true}
                  />

                   <CustomSelect
                                name="staffType"
                                label="Staff Type"
                                options={staffType}
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

export default DesignationModal;
