import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import CustomInput from "../../commonComponent/CustomInput";
import { handleApiResponse} from "../../commonComponent/CommonFunctions";
import { postData } from "../../app/api";
import { BREAKTIME,  } from "../../app/url";
import { useNavigate } from "react-router-dom";

const BreakModal = ({ onClose, getBreakTime }) => {

  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
  });

  const getValidationSchema = () => {
    return Yup.object({
      name: Yup.string().required(" Subject is required"),
      startTime: Yup.string().required(" Start time is required"),
      endTime: Yup.string()
        .required("End time is required")
        .test(
          "is-after",
          "End time must be after start time",
          function (endTime) {
            const { startTime } = this.parent;
            return startTime < endTime;
          }
        ),
    });
  };

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const response = await postData(BREAKTIME, values);
      console.log("[BREAK RESPONSE]:", response);
      if (response.status === 200 || response.status === 201) {
        onClose();
        getBreakTime();
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
                  <h2 className="text-lg font-semibold">Add Break Time</h2>
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
                    label="Break Name"
                    placeholder="Enter break name"
                    required={true}
                  />
                  <CustomInput
                    name="startTime"
                    type="time"
                    label="Break Start Time"
                    placeholder="Enter Start time"
                    required={true}
                  />
                  <CustomInput
                    name="endTime"
                    type="time"
                    label="Break End Time"
                    placeholder="Enter End time"
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

export default BreakModal;
