import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function DownloadStudentsList() {
  const [data, setData] = useState([])

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
  
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  
        const importedData = jsonData.map((item) => ({
          _id: item._id || "",
          pic: item.pic || null,
          name: item.name || "",
          admissionNo: item.admissionNo || "",
          className: item.className || "",
          class: item.class || "",
          section: item.section || "",
          sectionName: item.sectionName || "",
          phoneNumber: item.phoneNumber || "",
          dateOfBirth: item.dateOfBirth || "",
          aadharNumber: item.aadharNumber || "",
          gender: item.gender || "",
          fatherName: item.fatherName || "",
          fatherMobile: item.fatherMobile || "",
          fatherOccupation: item.fatherOccupation || "N/A",
          presentAddress: item.presentAddress || "",
          permanentAddress: item.permanentAddress || "",
          actions: [
            { label: "Edit", actionHandler: onHandleEdit },
            { label: "Delete", actionHandler: onDelete },
          ],
        }));
  
        setStudentList(importedData); // Update state with imported data
        setFilteredData(importedData); // Update filtered data
      };
  
      reader.readAsArrayBuffer(file);
    }
  };
  

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {data && (
        <div>
          <h2>Imported Data:</h2>
          <input
  type="file"
  accept=".xlsx, .xls"
  onChange={handleFileUpload}
/>
        </div>
      )}
    </div>
  );
}

export default DownloadStudentsList;