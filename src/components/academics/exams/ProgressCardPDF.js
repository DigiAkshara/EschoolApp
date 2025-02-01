import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  header: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#0000ff',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tableCell: {
    borderWidth: 1,
    padding: 5,
    fontSize: 10,
    textAlign: 'center',
  },
});

const ProgressCardPDF = ({ student, selectedExamDetails }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>INSTITUTE NAME HERE</Text>
          <Text>Affiliated To: CBSE Board / Affiliation No: 2512A4S200</Text>
          <Text>Ph: +91 8808498469 | Email: info@schoolname.com</Text>
          <Text>Visit us: www.yourschoolwebsite.com</Text>
        </View>

        {/* Student Details Section */}
        <View style={styles.section}>
          <Text>
            Name of Student: {student.firstName} {student.lastName}
          </Text>
          <Text>Exam: {selectedExamDetails.exam.name}</Text>
          <Text>Academic Year: {selectedExamDetails.academicYear.year}</Text>
        </View>

        {/* Scholastic Areas Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Subject</Text>
            <Text style={styles.tableCell}>Marks Obtained</Text>
            <Text style={styles.tableCell}>Total Marks</Text>
            <Text style={styles.tableCell}>Grade</Text>
          </View>

          {selectedExamDetails.exam.timeTable.map((subject, index) => {
            const mark = student.marks[index]?.marks || 'N/A';
            const grade = student.marks[index]?.grade || 'N/A';
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{subject.subject}</Text>
                <Text style={styles.tableCell}>{mark}</Text>
                <Text style={styles.tableCell}>{subject.totalMark}</Text>
                <Text style={styles.tableCell}>{grade}</Text>
              </View>
            );
          })}
        </View>

        {/* Attendance and Result Section */}
        <View style={styles.section}>
          <Text>Attendance: {student.attendance} / {student.totalAttendance}</Text>
          <Text>Total Marks: {student.marksObtained} / {student.maxMarks}</Text>
          <Text>Percentage: {student.percentage}%</Text>
          <Text>Result: {student.result}</Text>
        </View>

        {/* Footer Section */}
        <View style={styles.section}>
          <Text>Sign of Class Teacher</Text>
          <Text>Sign of Principal</Text>
          <Text>Sign of Manager</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ProgressCardPDF;
