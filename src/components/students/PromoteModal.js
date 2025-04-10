import { XMarkIcon } from '@heroicons/react/24/outline';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from "yup";
import { postData } from '../../app/api';
import { ACADEMICS } from '../../app/url';
import { handleApiResponse } from '../../commonComponent/CommonFunctions';
import CustomSelect from '../../commonComponent/CustomSelect';

const PromoteModal = ({ students, onClose }) => {
	const { academicYears } = useSelector((state) => state.appConfig)
	const { classes: clsOptions, sections: sectionOptions } = useSelector(
		(state) => state.students
	);
	const [academicYearOptions, setAcademicYearOptons] = React.useState([])
	const initialValues = {
		academicYear: academicYears.find((year) => year.status === "upcoming")?._id,
		class: "",
		section: "",
	}

	const getValidationSchema = () => {
		return Yup.object({
			academicYear: Yup.string().required("Academic Year is required"),
			class: Yup.string().required("Class is required"),
			section: Yup.string().required("Section is required")
		})
	}

	useEffect(() => {
		if (academicYears.length > 0) {
			setAcademicYearOptons(academicYears.map((year) => ({ label: year.year, value: year._id })));
		}
	}, [academicYears])


	const handleSubmit = async (values) => {
		try {
			const payload = {
				academicYear: values.academicYear,
				studentIds: students,
				classId: values.class,
				sectionId: values.section,
			};
			const res = await postData(ACADEMICS, payload);
			handleApiResponse(res.data.message, "success");
			onClose({ refresh: true });
		} catch (error) {
			handleApiResponse(error);
		}
	}
	return (<Formik
		initialValues={initialValues}
		validationSchema={getValidationSchema()}
		onSubmit={handleSubmit}
		enableReinitialize
	>
		{({ values, setFieldValue, errors }) => {
			return (
				<Form>
					<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
						<div className="bg-white w-96 rounded-lg shadow-lg">
							{/* Modal Header */}
							<div className="flex justify-between items-center bg-purple-600 text-white p-3 rounded-t-lg">
								<h2 className="text-lg font-semibold">Promote Students</h2>
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
									name="academicYear"
									label="Academic Year"
									options={academicYearOptions}
									disabled={true}
								/>
								<div className="my-4"></div>
								<CustomSelect
									name="class"
									label="Class to be promoted"
									options={clsOptions}
									required={true}
								/>
								<div className="my-4"></div>
								<CustomSelect
									name="section"
									label="Section to be promoted"
									disabled={!values.class}
									options={sectionOptions.filter((item) => item.class === values.class)}
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
								<button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500">
									Promote
								</button>
							</div>
						</div>
					</div>
				</Form>
			)
		}}
	</Formik>)
}

export default PromoteModal