import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'
import CustomFileUploader from '../../commonComponent/CustomFileUploader'
import CustomButton from "../../commonComponent/CustomButton";
import { handleApiResponse, uploadFile } from '../../commonComponent/CommonFunctions'
import {CONTACTUS, BRANCH} from '../../app/url'
import * as Yup from 'yup'
import {getData, postData} from '../../app/api'
function Contactus({ values, setFieldValue }) {
  const [schoolDetails, setSchoolDetails] = useState([])
  // const [IssueFacingwith, setIssueFacingwith] = useState([])
  // const [issueSubject, setissueSubject] = useState([])
  // const [issueDetails, setissueDetails] = useState([])
  const getInitialValues = () => {
    return {
      schoolDetails: '',
      IssueFacingwith: '',
      issueSubject: '',
      issueDetails: ''
    }
  }
  useEffect(() => {
    getSchoolDetails()
    }, [])
  const getSchoolDetails = async () => {
      try {
        const [schoolDetailList] = await Promise.all([
          getData(BRANCH),
        ])
          let schoolDetailListvalues = schoolDetailList.data.data.map((item) => {
            return {
              label: item.name, // Displayed text in the dropdown
              value: item._id,
            }
          })
          setSchoolDetails(schoolDetailListvalues)
      } catch (error) {
        handleApiResponse(error)
      }
    }
  const getValidationSchema = () => {
      return Yup.object({
        SchoolDetails: Yup.string().required('School Details is required'),
        IssueFacingwith: Yup.string().required('Issue Facing with is required'),
        issueSubject: Yup.string().required('Issue Subject is required'),
        issueDetails: Yup.string().required('Issue Details is required')
      })
    }
  const handleSubmit = async (values) => {
      try {
        const response = await postData(CONTACTUS, values)
        handleApiResponse(response.data.message, 'success')
      } catch (error) {
        handleApiResponse(error)
      }
    }
  const handleFileChange = async (e, setFieldValue) => {
      try {
        const fileResponse = await uploadFile(e.target.files[0])
        setFieldValue(e.target.name, fileResponse)
      } catch (error) {
        handleApiResponse(error)
      }
    }  
  return (

    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-purple-100 p-3 text-center rounded-md flex items-center gap-2">
      <span class="material-symbols-outlined text-purple-600">
        info
      </span> If you are facing any issues while using this support form, feel free to report them to us via email or phone And whatsapp.
      </div>
      <div className="flex justify-between my-4 grid grid-cols-3 gap-4">
        <div className="p-3 text-center border border-gray-300 rounded-md w-100">
          <a href="mailto:support@digiakshara.com" className="flex items-center text-purple-600 gap-2">
          <span class="material-symbols-outlined">
            mail
          </span> support@digiakshara.com
          </a>
        </div>
        <div className="p-3 text-center border border-gray-300 rounded-md">
          <a href="tel:+918861578747" className="flex items-center gap-2 text-purple-600">
          <span class="material-symbols-outlined">
            call
          </span> +91 8861578747
          </a>
        </div>
        <div className="p-3 text-center border border-gray-300 rounded-md pl-2">
          <a href="https://wa.me/8861578747" target="_blank" className="flex items-center gap-2 text-purple-600">
          <img
                alt=""
                src={'/whatsapp-icon.svg'}
                
              /> +91 8861578747
          </a>
        </div>
        </div>
        <div className="p-6 max-w-5xl mx-auto border border-gray-300 rounded-md">
          <Formik
            initialValues={getInitialValues()}
            enableReinitialize
            validationSchema={getValidationSchema()}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                <div className="border-b border-gray-900/10 pb-4 mb-4 add-sub-input-blk">
                    <div className="flex items-center text-purple-600 gap-2 w-500 h-500">
                    <span class="material-symbols-outlined text-[200px]">
                      contact_mail
                    </span>
                    </div>
                    <br></br>
                    <div>
                      <h1 className='text-3xl'><b>Submit a Request</b></h1>
                    </div>
                    <br></br>
                    <div className="gap-4"> 
                      <CustomSelect 
                        label="School Details"
                        name="SchoolDetails"
                        required
                        options={schoolDetails}
                                        onChange={(e) => {
                                          let dumpList = []
                                          values.fees.forEach((item) => {
                                            dumpList.push({
                                              ...item,
                                              checked: false,
                                              amount: '',
                                            })
                                          })
                                          setFieldValue('SchoolDetails', dumpList)
                                        }}
                      />
                    </div>
                    <br></br>
                    <div className="gap-4">
                      <CustomSelect 
                        label="Where are you facing an issue with?"
                        name="IssueFacingwith"
                        required
                        onChange={(e) => {
                          setFieldValue('IssueFacingwith', e.target.value)
                        }}
                      />
                    </div>
                    <br></br>
                    <div className="gap-4">
                      <CustomInput 
                          label="Issue Subject"
                          name="issueSubject"
                          required  
                          onChange={(e) => {
                            setFieldValue('issueSubject', e.target.value)
                          }}  
                      />
                    </div>
                    <br></br>
                    <div className="gap-4">
                      <CustomInput 
                          label="Issue Details"
                          name="issueDetails"
                          required  
                          onChange={(e) => {
                            setFieldValue('issueDetails', e.target.value)
                          }}  
                      />
                    </div>
                    <br></br>
                    <div className="gap-4">
                      <CustomFileUploader
                        label="Attach File"
                        name="attachFile"
                        onChange={(e)=>handleFileChange(e,setFieldValue)}
                      />
                    </div>
                    <br></br>
                    <div className="gap-4">
                      <CustomButton
                        type="submit"
                        label="Submit"
                      />
                    </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
    </div>
     );
}

export default Contactus;
