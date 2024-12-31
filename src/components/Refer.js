
import React from "react";

function ManageAddMarks({ students, subjects, values, setFieldValue }) {

    const getInitialValues = (students, subjects) => {
        return {
          board: selectedExam?.board || "",
          classCategory: selectedExam?.classCategory || "",
          class: selectedExam?.class || "",
          section: selectedExam?.section || "",
          name: selectedExam?.name || "",
          marks: students.map((student) => ({
            studentId: student.id,
            studentName: student.name,
            rollNo: student.rollNo,
            image: student.image || "", // If applicable
            subjectMarks: subjects.reduce((acc, subject) => {
              acc[subject] = ""; 
              return acc;
            }, {}),
            marksObt: 0, 
            totalMark: 0,
            percentage: 0,
            result: "Pending", // Default result
          })),
        };
      };
    
      const getValidationSchema = (subjects) => {
        return Yup.object({
          board: Yup.string().required("Board is required"),
          classCategory: Yup.string().required("Class category is required"),
          class: Yup.string().required("Class is required"),
          section: Yup.string().required("Section is required"),
          name: Yup.string().required("Exam name is required"),
          marks: Yup.array().of(
            Yup.object().shape({
              studentId: Yup.string(),
              studentName: Yup.string(),
              rollNo: Yup.string(),
              subjectMarks: Yup.object(
                subjects.reduce((schema, subject) => {
                  schema[subject] = Yup.number()
                    .min(0, `${subject} marks cannot be less than 0`)
                    .max(100, `${subject} marks cannot exceed 100`)
                    .required(`${subject} marks are required`);
                  return schema;
                }, {})
              ),
              marksObt: Yup.number().min(0),
              totalMark: Yup.number().min(0).required("Total Marks is required"),
              percentage: Yup.number()
                .min(0, "Percentage cannot be less than 0")
                .max(100, "Percentage cannot exceed 100")
                .required("Percentage is required"),
              result: Yup.string(),
            })
          ),
        });
      };
      
    
      const initialValues = getInitialValues(students, subjects);
    const validationSchema = getValidationSchema(subjects);


  // Function to update marks, calculate percentage and result
  const handleMarksChange = (studentIndex, subject, value) => {
    const updatedMarks = [...values.marks];
    updatedMarks[studentIndex].subjectMarks[subject] = value;

    // Calculate total marks obtained and percentage
    const totalMarksObt = Object.values(updatedMarks[studentIndex].subjectMarks).reduce(
      (total, mark) => total + (parseFloat(mark) || 0),
      0
    );

    const maxMarks = subjects.length * 100; // Assuming each subject has a max of 100 marks
    const percentage = (totalMarksObt / maxMarks) * 100;

    updatedMarks[studentIndex].marksObt = totalMarksObt;
    updatedMarks[studentIndex].totalMark = maxMarks;
    updatedMarks[studentIndex].percentage = percentage.toFixed(2);

    // Determine result (pass/fail based on percentage threshold, e.g., 40%)
    updatedMarks[studentIndex].result = percentage >= 40 ? "Pass" : "Fail";

    setFieldValue("marks", updatedMarks);
  };

  return (
    <>
      <h2 className="text-base/7 font-semibold text-gray-900 mb-2">Enter Marks</h2>

      <div className="overflow-x-auto">
        <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300">
          <thead className="bg-purple-100">
            <tr>
              <th className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2 w-12">
                Roll No
              </th>
              <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48">
                Student Name
              </th>
              {subjects.map((subject, index) => (
                <th key={index} className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32">
                  {subject.label.toUpperCase()}
                </th>
              ))}
              <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32">Marks Obt.</th>
              <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32">Max Marks</th>
              <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32">Per (%)</th>
              <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {values.marks.map((student, studentIndex) => (
              <tr key={studentIndex} className="bg-gray-50">
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{student.rollNo}</td>
                <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-0">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 text-purple-600">{student.studentName}</div>
                      <div className="mt-1 text-gray-500">{student.studentId}</div>
                    </div>
                  </div>
                </td>
                {subjects.map((subject, subjectIndex) => (
                  <td key={subjectIndex} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    <input
                      type="number"
                      value={student.subjectMarks[subject]}
                      onChange={(e) => handleMarksChange(studentIndex, subject, e.target.value)}
                      className="block w-12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                    />
                  </td>
                ))}
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{student.marksObt}</td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{student.totalMark}</td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{student.percentage}</td>
                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      student.result === "Pass"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {student.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageAddMarks;
