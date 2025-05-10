import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../../app/api";
import { setIsLoader } from "../../../app/reducers/appConfigSlice";
import { STUDENT_FEE } from "../../../app/url";
import {
  capitalizeWords,
  handleApiResponse,
  handleDownload,
  handleDownloadPDF
} from "../../../commonComponent/CommonFunctions";
import CustomSelect from "../../../commonComponent/CustomSelect";
import FilterComponent from "../../../commonComponent/FilterComponent";
import TableComponent from "../../../commonComponent/TableComponent";

const FeeCollectionSummaryReports = () => {
  const dispatch = useDispatch();
  const { branchData, academicYears } = useSelector((state) => state.appConfig);
  const [feesData, setFeesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [netData, setNetData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [academicYear, setAcademicYear] = useState(null);

  useEffect(()=>{
    setAcademicYear(academicYears[0]._id)
  },[academicYears])

  const columns =
    [
      { key: "feeName", title: "Fee Head" },
      { key: "totalAmount", title: "Expected (₹)" },
      { key: "discountedAmount", title: "Discount (₹)" },
      { key: "dueAmount", title: "Net Due (₹)" },
      { key: "collectedAmount", title: "Collected (₹)" },
      { key: "pendingAmount", title: "Pending (₹)" },
      { key: "percentage", title: "Collection %" },
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

  const downloadList = () => {
    handleDownloadPDF(
      filteredData,
      "Fee_Details",
      [
        { key: "feeName", label: "Fee Head" },
        { key: "totalAmount", label: "Expected (₹)" },
        { key: "discountedAmount", label: "Discount (₹)" },
        { key: "dueAmount", label: "Net Due (₹)" },
        { key: "collectedAmount", label: "Collected (₹)" },
        { key: "pendingAmount", label: "Pending (₹)" },
        { key: "percentage", label: "Collection %" },
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
        { key: "feeName", label: "Fee Head" },
        { key: "totalAmount", label: "Expected (₹)" },
        { key: "discountedAmount", label: "Discount (₹)" },
        { key: "dueAmount", label: "Net Due (₹)" },
        { key: "collectedAmount", label: "Collected (₹)" },
        { key: "pendingAmount", label: "Pending (₹)" },
        { key: "percentage", label: "Collection %" },
      ],
    );
  };

  const getTransactionsData = async (selYear) => {
    try {
      dispatch(setIsLoader(true));
      const res = await getData(STUDENT_FEE + '/reports');
      const combinedFees = Object.values(
        res.data.data.feeReport.reduce((acc, curr) => {
          if (!acc[curr.name]) {
            acc[curr.name] = {
              name: curr.name,
              feeIds: [],
              totalAmount: 0,
              discountedAmount: 0,
              dueAmount: 0,
              collectedAmount: 0,
              pendingAmount: 0,
              percentage: 0 // will be calculated after accumulation
            };
          }

          acc[curr.name].feeIds.push(curr.fee);
          acc[curr.name].totalAmount += curr.totalAmount;
          acc[curr.name].discountedAmount += curr.discountedAmount;
          acc[curr.name].dueAmount += curr.dueAmount;
          acc[curr.name].collectedAmount += curr.collectedAmount;
          acc[curr.name].pendingAmount += curr.pendingAmount;
          return acc;
        }, {})
      );

      // Calculate collectedPercentage
      combinedFees.forEach(fee => {
        fee.feeName = capitalizeWords(fee.name);
        fee.percentage =
          fee.totalAmount > 0
            ? parseFloat(((fee.collectedAmount / fee.totalAmount) * 100).toFixed(2))
            : 0;
      });

      setNetData({ ...res.data.data, feeReport: null })
      setFeesData(combinedFees)
      setFilteredData(combinedFees);
    } catch (error) {
      handleApiResponse(error);
    } finally {
      dispatch(setIsLoader(false));
    }
  };

  useEffect(() => {
    getTransactionsData(academicYear);
  }, [academicYear]);

  return (
    <>
      <div className="mt-4 flex justify- between">
        {" "}
        <label>Select Criteria : </label>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-10">
          <div className="sm:col-span-2 z-30">
            <select
              name="academicYear"
              className="mt-2 block w-40 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
              onChange={(e)=>{setAcademicYear(e.target.value);}}
              value={academicYear}
            >
              {academicYears.map((year) => (
                <option key={year._id} value={year._id}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>
        </div>
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
                <p className="text-l font-semibold text-gray-900">{(netData.collectedAmount / netData.dueAmount * 100).toFixed(2)}%</p>
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
export default FeeCollectionSummaryReports;
