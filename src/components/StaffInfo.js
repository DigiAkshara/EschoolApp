import React, { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import { useDispatch, useSelector } from "react-redux";
import CustomDate from "../commonComponent/CustomDate";
import { SUBJECTS } from "../app/url";
import { getData } from "../app/api";


function StaffInfo() {

  const [subjects, setSubjects] = useState()

  useEffect(() => {
    getSubjects();
  }, []);
  
  const getSubjects = async () => {
    const res = await getData(SUBJECTS);
    console.log("comming subject data is:",res.data );
    
     const classData = res.data.map((item) => {
      return {
        label: item.name, // Displayed text in the dropdown
        value: item._id, 
      }
    })
    setSubjects(classData);
  };

  return (
    <form >
      <div className="">
        <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
              Staff Employment Details
            </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
                <CustomInput
                  name="firstName"
                  label="Staff First Name"
                  placeholder="Enter First Name"
                  required={true}
                />
                
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="lastName"
                  label="Staff Last Name"
                  placeholder="Enter last Name"
                  required={true}
                />
             
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="empId"
                  label="Emp ID"
                  placeholder="Enter EmpID"
                  required={true}
                />
               
              </div>

              <div className="sm:col-span-2">
              <CustomDate 
                  name="DOJ"
                  label="Date Of Joining"
                  required={true}
                  />
              </div>
           
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-4 mb-4">

          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
                      <CustomInput
                  name="workEmail"
                  label="Work Email"
                  placeholder="Enter email"
                  required={true}
                />
               
              </div>
          

            

              <div className="sm:col-span-2">
                <CustomSelect
                  id="designation"
                  name="designation"
                  label="Designation"
                  options={[
                    { value: "designation1", label: "Designation 1" },
                    { value: "designation2", label: "Designation 2" },
                    { value: "designation3", label: "Designation 3" },
                  ]}
                  required={true}

                />
              
              </div>

              <div className="sm:col-span-2">
                <CustomSelect
                  id="subjects"
                  name="subjects"
                  label="Dealing Subjects"
                  options={subjects}
                  required={true}
                />
              
              </div>

           
          </div>
        </div>
        

      </div>
    </form>
  );
}

export default StaffInfo;
