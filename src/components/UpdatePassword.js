import { XMarkIcon } from '@heroicons/react/20/solid';
import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from "yup";
import CustomInput from '../commonComponent/CustomInput';
import { LOGIN, TENANT } from '../app/url';
import { postData } from '../app/api';
import { handleApiResponse } from '../commonComponent/CommonFunctions';
const UpdatePassword = ({ onClose }) => {

	const handleSubmit = async (values) => {
		try {
			const res = await postData(TENANT+'/changePassword', values)
			handleApiResponse(res.data.message, 'success')
			// onClose()
		} catch (error) {
			handleApiResponse(error);
		}
	}

	const validationSchema = Yup.object({
		currentPassword: Yup.string()
			.required('Current password is required'),
	
		newPassword: Yup.string()
			.required('New password is required')
			.min(8, 'Password must be at least 8 characters')
			.matches(/[A-Z]/, 'Must contain an uppercase letter')
			.matches(/[a-z]/, 'Must contain a lowercase letter')
			.matches(/[0-9]/, 'Must contain a number')
			.matches(/[@$!%*?&]/, 'Must contain a special character'),
	
		confirmNewPassword: Yup.string()
			.required('Please confirm your new password')
			.test('passwords-match', 'Passwords must match', function (value) {
				return value === this.parent.newPassword;
			}),
	});

	return (<Formik
		initialValues={{ currentPassword: '', newPassword: '', confirmNewPassword: '' }}
		validationSchema={validationSchema}
		onSubmit={handleSubmit}
	>
		{({ values, setFieldValue, errors }) => {
			return (
				<Form>
					<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
						<div className="bg-white w-96 rounded-lg shadow-lg">
							{/* Modal Header */}
							<div className="flex justify-between items-center bg-purple-600 text-white p-3 rounded-t-lg">
								<h2 className="text-lg font-semibold">Change Password</h2>
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
									label="Current Password"
									name="currentPassword"	
									required={true}
									type="password"
								/>
								<div className="my-4"></div>
								<CustomInput
									label="New Password"
									name="newPassword"	
									required={true}
									type="password"
								/>
								<div className="my-4"></div>
								<CustomInput
									label="Confirm Password"
									name="confirmNewPassword"	
									required={true}
									type="password"
								/>
								<div className="my-4"></div>

							</div>

							{/* Modal Footer */}
							<div className="p-3 flex justify-end space-x-2 border-t">
								<button
									onClick={onClose}
									className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
								>
									Cancel
								</button>
								<button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500">
									Update
								</button>
							</div>
						</div>
					</div>
				</Form>
			)
		}}
	</Formik>)
}

export default UpdatePassword