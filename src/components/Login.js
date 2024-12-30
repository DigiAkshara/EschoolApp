import React, { useEffect } from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import CustomButton from "../commonComponent/CustomButton";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { postData } from "../app/api";
import { LOGIN } from "../app/url";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../app/reducers/appConfigSlice";
import { useNavigate, useParams } from "react-router-dom";
import { roles } from "../commonComponent/CommonFunctions";

export default function Login() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialValues= {
    email: "",
    password: "",
    userType: "",
  };

  const validationSchemas = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Password is Required"),
    userType: Yup.string().required("Role is required"),
  });
  const handleSubmit = async (values) => { 
    let response = await postData(LOGIN, values); 
    if (response.status === 200 || response.status === 201) {
      localStorage.setItem("studentManagment", response.data.token);
      dispatch(setUser(jwtDecode(response.data.token)));
      navigate(id ? `/tenant/${id}` : "/");
    } else {
      alert("Login Failed, please retry again");
    }
  }
   
  
  useEffect(()=>{
    const token  = localStorage.getItem("studentManagment");
    if(token){
      navigate("/");
    }
  },[])
  

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemas}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form className="h-screen ">
          <div className="flex min-h-full flex-1">
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
              <div className="mx-auto w-full max-w-sm lg:w-96">
                <div>
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=purple&shade=600"
                    className="h-10 w-auto"
                  />
                  <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
                    Sign in to your account
                  </h2>
                </div>

                <div className="mt-10 space-y-6">
                  {/* Role Select */}
                  <CustomSelect
                    name="userType"
                    label="Role"
                    icon={UserIcon}
                    options={roles}
                    required = {true}                   
                  />

                  {/* Email Input */}
                  <CustomInput
                    name="email"
                    placeholder="you@example.com"
                    label="Email address"
                    icon={EnvelopeIcon}
                    required={true}
                  />

                  {/* Password Input */}
                  <CustomInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    label="Password"
                    icon={LockClosedIcon}
                    required
                  />

                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-3 block text-sm/6 text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm/6">
                      {/* <a
                        href="#"
                        className="font-semibold text-purple-600 hover:text-purple-500"
                      >
                        Forgot password?
                      </a> */}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <CustomButton type="submit" label="Sign in" />
                </div>
              </div>
            </div>
            <div className="relative hidden w-0 flex-1 lg:block">
              <img
                alt=""
                src={"/LoginImage.jpg"}
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
