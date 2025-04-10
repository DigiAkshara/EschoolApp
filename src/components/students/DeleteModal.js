import { XMarkIcon } from '@heroicons/react/24/outline';
import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from "yup";
import { handleApiResponse } from '../../commonComponent/CommonFunctions';
import CustomSelect from '../../commonComponent/CustomSelect';
import { deleteData } from '../../app/api';
import { ACADEMICS } from '../../app/url';

const DeleteModal = ({ students, onClose }) => {

	const handleSubmit = async (values) => {
		try {
			const payload = {
				status: values.status,
				studentIds: students,
			}
			const res = await deleteData(ACADEMICS, payload)
			handleApiResponse(res.data.message, 'success')
			onClose({ refresh: true })
		} catch (error) {
			handleApiResponse(error);
		}
	}


	const getValidationSchema = () => {
		return Yup.object({
			status: Yup.string().required("Status is required"),
		})
	}
	return (<Formik
		initialValues={{ status: '' }}
		validationSchema={getValidationSchema()}
		onSubmit={handleSubmit}
	>
		{({ values, setFieldValue, errors }) => {
			return (
				<Form>
					<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
						<div className="bg-white w-96 rounded-lg shadow-lg">
							{/* Modal Header */}
							<div className="flex justify-between items-center bg-purple-600 text-white p-3 rounded-t-lg">
								<h2 className="text-lg font-semibold">Delete Students</h2>
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
									name="status"
									label="Status"
									options={[{ label: 'Remove', value: 'remove' }, { label: 'Tranfer', value: 'transfer' }]}
									required={true}
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
									Continue
								</button>
							</div>
						</div>
					</div>
				</Form>
			)
		}}
	</Formik>)
}

export default DeleteModal