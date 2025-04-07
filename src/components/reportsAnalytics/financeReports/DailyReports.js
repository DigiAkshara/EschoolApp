import { useSelector } from "react-redux";
import CustomDate from '../../../commonComponent/CustomDate'
import { handleApiResponse, handleDownloadPDF } from "../../../commonComponent/CommonFunctions";
import TableComponent from "../../../commonComponent/TableComponent";
import { useState } from "react";
import CustomSelect from "../../../commonComponent/CustomSelect";
import { Form, Formik } from "formik";
import FilterComponent from "../../../commonComponent/FilterComponent";
import * as Yup from "yup";

const DailyReports = () => {
  
  const { branchData } = useSelector((state) => state.appConfig)
  const { classes: classOptions, sections: sectionOptions } = useSelector(
    (state) => state.academics
  );
  const [feesData, setFeesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const initialValues = {
    date: "",
    class: "",
    section: "",
  };
  const columns = [
    { key: "class", title: "Class" },
    { key: "feeType", title: "Fee Type" },
    { key: "todayCollectedFee", title: "Today's Collection" },
    { key: "totalCollectedFee", title: "Total Fee Collected" },
    { key: "pendingFee", title: "Total Pending Fee" }
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
    setFilteredData(filtered);
  };

  const getValidationSchema = () => {
    return Yup.object({
      date: Yup.date(),
      class: Yup.string(),
      section: Yup.string(),
    });
  };

  const handleSubmit = (values) => {
    console.log(values);
  }

  const downloadList = () => {
    handleDownloadPDF(filteredData, "Fee_Details", [
      { key: "class", label: "Class" },
      { key: "feeType", label: "Fee Type" },
      { key: "todayCollectedFee", label: "Today's Collection" },
      { key: "totalCollectedFee", label: "Total Fee Collected" },
      { key: "pendingFee", label: "Total Pending Fee" },
    ], "Fee Details Report", branchData, undefined, "portrait");
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, errors }) => (
          <Form>
            <div className="mt-4 flex justify-between"> <label>Select Criteria : </label></div>
            <div className="mt-4 flex justify-between">
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
                <div className="sm:col-span-2 z-40">
                  <CustomDate
                    name="date"
                    label="Date"

                  />
                </div>
                <div className="sm:col-span-2">
                  <CustomSelect
                    label="Class"
                    name="class"
                    options={classOptions}
                    onChange={(value) => {
                      setFieldValue("class", value);
                      setFieldValue("section", "");
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <CustomSelect
                    label="Section"
                    name="section"
                    options={sectionOptions.filter(sec => sec.class === values.class)}
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
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <div className="-mx-2 -my-2 mt-0 sm:-mx-6">
        {/* /Removed overflow-x-auto cloass */}
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            <div className="relative shadow ring-1 ring-black/5 sm:rounded-lg">
              <FilterComponent
                onSearch={handleSearch}
                downloadList={downloadList}
              />
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
  )
}
export default DailyReports;