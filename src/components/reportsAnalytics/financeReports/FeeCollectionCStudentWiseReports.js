import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../../app/api";
import { setIsLoader } from "../../../app/reducers/appConfigSlice";
import { FEES, STUDENT_FEE } from "../../../app/url";
import * as Yup from "yup";
import {
  capitalizeWords,
  handleApiResponse,
  handleDownload,
  handleDownloadPDF
} from "../../../commonComponent/CommonFunctions";
import FilterComponent from "../../../commonComponent/FilterComponent";
import TableComponent from "../../../commonComponent/TableComponent";
import { Form, Formik } from "formik";
import CustomDate from "../../../commonComponent/CustomDate";
import CustomSelect from "../../../commonComponent/CustomSelect";
import moment from "moment";

const FeeCollectionCStudentWiseReports = () => {
  const dispatch = useDispatch();
  const { branchData, academicYears, academicYear } = useSelector((state) => state.appConfig);
  const { classes: classOptions, sections: sectionOptions } = useSelector(
    (state) => state.academics
  );
  const [feesData, setFeesData] = useState([]);
  const [allFees, setAllFees] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [netData, setNetData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [yearOptions, setYearOptions] = useState([]);
  const rowsPerPage = 10;

  const initialValues = {
    academicYear: academicYear?._id,
    class: "",
    section: "",
    feeType: "",
  };

  const getValidationSchema = () => {
    return Yup.object({
      class: Yup.string(),
      section: Yup.string(),
      feeType: Yup.string(),
    });
  };

  const handleSubmit = (values) => {
    let { class: classId, section: sectionId, feeType } = values;

    const filtered = feesData.filter((record) => {
      let isValid = true;

      // Apply class and section filters
      if (classId) {
        isValid = isValid && record.classId === classId;
      }
      if (sectionId) {
        isValid = isValid && record.sectionId === sectionId;
      }
      if (feeType) {
        isValid = isValid && record.feeId === feeType;
      }
      return isValid;
    });
    setCurrentPage(1);
    formatData(filtered)
  };

  useEffect(() => {
    const options = []
    academicYears.forEach(year => {
      options.push({ label: year.year, value: year._id })
    })
    setYearOptions(options)
  }, [academicYears])

  const columns =
    [
      { key: "studentName", title: "Student" },
      { key: "rollNumber", title: "Roll Number" },
      { key: "class", title: "Class" },
      { key: "feeName", title: "Fee Head" },
      { key: "totalAmount", title: "Expected (₹)" },
      { key: "discountedAmount", title: "Discount (₹)" },
      { key: "dueAmount", title: "Net Due (₹)" },
      { key: "collectedAmount", title: "Collected (₹)" },
      { key: "pendingAmount", title: "Pending (₹)" },
      { key: "collectedPercentage", title: "Collection %" },
    ];

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (term) => {
    const filtered = feesData.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase())
      )
    );
    formatData(filtered)
  };

  const downloadList = () => {
    handleDownloadPDF(
      filteredData,
      "Fee_Details",
      [
        { key: "studentName", label: "Student" },
        { key: "rollNumber", label: "Roll Number" },
        { key: "class", label: "Class" },
        { key: "feeName", label: "Fee Head" },
        { key: "totalAmount", label: "Expected (₹)" },
        { key: "discountedAmount", label: "Discount (₹)" },
        { key: "dueAmount", label: "Net Due (₹)" },
        { key: "collectedAmount", label: "Collected (₹)" },
        { key: "pendingAmount", label: "Pending (₹)" },
        { key: "collectedPercentage", label: "Collection %" },
      ],
      "Fee Details Report",
      branchData,
      undefined,
      "portrait"
    );
  };

  const downloadListxlsx = () => {
    const schoolName = branchData?.label || "Unknown School";
    const schoolAddress = `${branchData?.address?.area || ""}, ${branchData?.address?.city || ""}, ${branchData?.address?.state || ""}, ${branchData?.address?.pincode || ""}`.trim();
    const phoneNumber = branchData.mobileNumber || "N/A";
    const email = branchData.email || "N/A";

    handleDownload(
      filteredData,
      "Fee Details Report",
      schoolName,
      phoneNumber,
      email,
      schoolAddress,
      [
        { key: "studentName", label: "Student" },
        { key: "rollNumber", label: "Roll Number" },
        { key: "class", label: "Class" },
        { key: "feeName", label: "Fee Head" },
        { key: "totalAmount", label: "Expected (₹)" },
        { key: "discountedAmount", label: "Discount (₹)" },
        { key: "dueAmount", label: "Net Due (₹)" },
        { key: "collectedAmount", label: "Collected (₹)" },
        { key: "pendingAmount", label: "Pending (₹)" },
        { key: "collectedPercentage", label: "Collection %" },
      ],
    );
  };

  const getTransactionsData = async (selectedYear) => {
    try {
      dispatch(setIsLoader(true));
      const res = await getData(STUDENT_FEE + '?academicYear=' + selectedYear);
      const formattedData = [];
      res.data.data.forEach(studentData => {
        const studentId = studentData.student._id;
        const studentName = `${studentData.student.firstName} ${studentData.student.lastName}`;
        const rollNumber = studentData.student.rollNumber;
        const className = studentData.academics.class.name;
        const classId = studentData.academics.class._id;
        const sectionId = studentData.academics.section;

        studentData.feeList.forEach((fee) => {
          const feeName = fee.fee?.name || fee.feeName || "N/A";
          const expected = fee.fee?.isGlobal ? fee.paybalAmount*1+fee.discount*1 : fee.fee?.amount * 1 || 0;
          const discount = +fee.discount || 0;
          const netDue = expected - discount;
          const paid = +fee.paidAmount || 0;
          const pending = +fee.paidAmount > 0 ? fee.pendingAmount : netDue || 0;
          const lastPaymentDate = fee.dueDate
            ? moment(fee.dueDate).format("DD-MM-YYYY")
            : '—';

          const collectionPercent = netDue > 0
            ? (((paid / netDue) * 100).toFixed(2) + "%")
            : "0%";
          let obj = {
            studentId,
            classId,
            sectionId,
            studentName: studentName, // Only first row
            rollNumber: rollNumber,
            class: className,
            feeId: fee.fee._id,
            feeName,
            lastPaymentDate,
            totalAmount: expected,
            discountedAmount: discount,
            dueAmount: netDue,
            collectedAmount: paid,
            pendingAmount: pending,
            collectedPercentage: collectionPercent,
          }
          formattedData.push(obj); // deep copyobj});
        });
      });
      setFeesData(formattedData)
      formatData(formattedData);
    } catch (error) {
      handleApiResponse(error);
    } finally {
      dispatch(setIsLoader(false));
    }
  };


  const formatData = (data) => {
    const grouped = {};
    data.forEach((row) => {
      const key = row.studentId;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(row);
    });

    const formatted = [];
    Object.values(grouped).forEach((group) => {
      group.forEach((row, index) => {
        formatted.push({
          ...row,
          studentName: index === 0 ? row.studentName : "",
          class: index === 0 ? row.class : "",
          rollNumber: index === 0 ? row.rollNumber : "",
        });
      });
    });
    calculateNetData(formatted)
    setFilteredData(formatted);
  };

  const calculateNetData = (data) => {
    let totalAmount = 0, discountedAmount = 0, dueAmount = 0, collectedAmount = 0, pendingAmount = 0;
    data.forEach(record => {
      totalAmount += record.totalAmount
      discountedAmount += record.discountedAmount
      dueAmount += record.dueAmount
      collectedAmount += record.collectedAmount
      pendingAmount += record.pendingAmount
    })
    setNetData({ totalAmount, discountedAmount, dueAmount, collectedAmount, pendingAmount })
  }

  const getFees = async () => {
    try {
      const res = await getData(FEES)
      let options = res.data.data.map((fee) => ({
        label: fee.name,
        value: fee._id,
        class: fee.class?._id,
        isGlobal: fee.isGlobal
      }))
      setAllFees(options)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  useEffect(() => {
    if (academicYear) getTransactionsData(academicYear._id);
  }, [academicYear]);

  useEffect(() => {
    getFees()
  }, []);

  return (
    <>
      <div className="mt-4 flex justify-between">
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema()}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, errors, resetForm }) => (
            <Form>
              <div className="mt-4 flex justify- between">
                {" "}
                <label>Select Criteria : </label>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-10">
                  <div className="sm:col-span-2">
                    <CustomSelect
                      label="Academic Year"
                      name="academicYear"
                      options={yearOptions}
                      onChange={(e) => {
                        setFieldValue("academicYear", e.target.value);
                        getTransactionsData(e.target.value)
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <CustomSelect
                      label="Class"
                      name="class"
                      options={classOptions}
                      onChange={(e) => {
                        setFieldValue("class", e.target.value);
                        setFieldValue("section", "");
                        setFieldValue("feeType", "")
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <CustomSelect
                      label="Section"
                      name="section"
                      options={sectionOptions.filter(
                        (sec) => sec.class === values.class
                      )}
                      disabled={!values.class}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <CustomSelect
                      label="Fee Head"
                      name="feeType"
                      options={values.class ? allFees.filter(
                        (fee) => fee.class === values.class || fee.isGlobal
                      ) : allFees}
                      disabled={!values.class}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="mt-8">
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                      >
                        Search
                      </button>
                      <button
                        onClick={() => {
                          resetForm();
                          formatData(feesData)
                          setCurrentPage(1);
                        }}
                        className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>

      </div>

      {netData &&
        <div className="mt-4 flex justify-between">
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 sm:grid-cols-12">
            <div className="sm:col-span-2 z-30">
              <dt>
                <p className="text-l font-sm text-gray-500">Total Expected (₹)</p>
              </dt>
              <dd className="flex items-baseline">
                <p className="text-l font-semibold text-gray-900">₹{netData.totalAmount}</p>
              </dd>
            </div>
            <div className="sm:col-span-2 z-30">
              <dt>
                <p className="text-l font-sm text-gray-500">Total Discount (₹)</p>
              </dt>
              <dd className="flex items-baseline">
                <p className="text-l font-semibold text-gray-900">₹{netData.discountedAmount}</p>
              </dd>
            </div>
            <div className="sm:col-span-2 z-30">
              <dt>
                <p className="text-l font-sm text-gray-500">Total Net Due (₹)</p>
              </dt>
              <dd className="flex items-baseline">
                <p className="text-l font-semibold text-gray-900">₹{netData.dueAmount}</p>
              </dd>
            </div>
            <div className="sm:col-span-2 z-30">
              <dt>
                <p className="text-l font-sm text-gray-500">Total Collected (₹)</p>
              </dt>
              <dd className="flex items-baseline">
                <p className="text-l font-semibold text-gray-900">₹{netData.collectedAmount}</p>
              </dd>
            </div>
            <div className="sm:col-span-2 z-30">
              <dt>
                <p className="text-l font-sm text-gray-500">Total Pending (₹)</p>
              </dt>
              <dd className="flex items-baseline">
                <p className="text-l font-semibold text-gray-900">₹{netData.pendingAmount}</p>
              </dd>
            </div>
            <div className="sm:col-span-2 z-30">
              <dt>
                <p className="text-l font-sm text-gray-500">Collection %</p>
              </dt>
              <dd className="flex items-baseline">
                <p className="text-l font-semibold text-gray-900">{netData.dueAmount > 0 ? (netData.collectedAmount / netData.dueAmount * 100).toFixed(2) : 0}%</p>
              </dd>
            </div>
          </div>
        </div>}

      <div className="-mx-2 -my-2 mt-0 sm:-mx-6">
        {/* /Removed overflow-x-auto cloass */}
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            <div className="relative shadow ring-1 ring-black/5 sm:rounded-lg">
              {feesData.length > 0 && <FilterComponent
                filterForm={{}}
                onSearch={handleSearch}
                downloadList={downloadList}
                downloadListxlsv={downloadListxlsx}
                isDownloadDialog={true}
              />}
              <TableComponent
                checkColumn={false}
                columns={columns}
                data={paginatedData}
                pagination={{
                  currentPage,
                  totalCount: filteredData.length,
                  onPageChange: handlePageChange,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FeeCollectionCStudentWiseReports;
