import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getHealthTrends, getTrends } from "../services/api";
import LineChart from "../Utils/LineChart";
import Card from "../Utils/Card";
import Loader from "../Utils/Loader";
import {
  MdBloodtype,
  MdOutlineBloodtype,
  MdTipsAndUpdates,
} from "react-icons/md";
import {
  FaBalanceScale,
  FaBullseye,
  FaChartLine,
  FaPills,
} from "react-icons/fa";
import { GiCandyCanes } from "react-icons/gi";
import { BsGraphDownArrow } from "react-icons/bs";
import { VscGraph } from "react-icons/vsc";

const TrendsAnalysis = () => {
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState("hemoglobin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [allTrends, setAllTrends] = useState([]);

  // const metrics = [
  //   {
  //     id: "Hemoglobin",
  //     name: "Hemoglobin",
  //     unit: "g/dL",
  //     icon: <MdBloodtype className="text-red-600 text-xl" />,
  //   },
  //   {
  //     id: "White Blood Cells",
  //     name: "White Blood Cells",
  //     unit: "/μL",
  //     icon: <MdOutlineBloodtype className="text-blue-600 text-xl" />,
  //   },
  //   {
  //     id: "Total Cholesterol",
  //     name: "Total Cholesterol",
  //     unit: "mg/dL",
  //     icon: <FaBalanceScale className="text-yellow-600 text-xl" />,
  //   },
  //   {
  //     id: "Blood Sugar",
  //     name: "Blood Sugar",
  //     unit: "mg/dL",
  //     icon: <MdBloodtype className="text-red-600 text-xl" />,
  //   },
  //   {
  //     id: "Platelets",
  //     name: "Platelets",
  //     unit: "/μL",
  //     icon: <MdBloodtype className="text-red-600 text-xl" />,
  //   },
  //   {
  //     id: "LDL Cholesterol",
  //     name: "LDL Cholesterol",
  //     unit: "mg/dL",
  //     icon: <FaBalanceScale className="text-yellow-600 text-xl" />,
  //   },
  // ];

  const fetchAllTrends = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTrends();
      console.log("Fetched trends:", response);
      setAllTrends(response.message.metrics || []);
      // Process and set trends data as needed
    } catch (err) {
      setError(err.message);
      // toast.info("Using sample trends data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTrends();
  }, []);

  useEffect(() => {
    if (selectedMetric) {
      fetchTrends();
    }
  }, [selectedMetric]);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getHealthTrends(selectedMetric, 6);

      const normalizedData = {
        metric_name: response.message.metric_name,
        unit: response.message.data_points[0]?.unit,
        data: response.message.data_points.map((item) => ({
          date: new Date(item.date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          value: Number(item.value.replace(/,/g, "")),

          status: item.status,
        })),
      };

      setTrendsData(normalizedData);
    } catch (err) {
      setError(err.message);
      // toast.info("Using sample trends data");
      setTrendsData(getMockTrendsData());
    } finally {
      setLoading(false);
    }
  };

  const getMockTrendsData = () => {
    return {
      metric_name: selectedMetric,
      data: [
        { date: "2024-06-15", value: 13.8, status: "normal" },
        { date: "2024-08-20", value: 14.0, status: "normal" },
        { date: "2024-10-20", value: 14.1, status: "normal" },
        { date: "2024-12-10", value: 14.2, status: "normal" },
      ],
      unit: "g/dL",
    };
  };

  const currentData = trendsData?.data || [];
  console.log("Current Data:", trendsData);
  const currentMetric = allTrends.find((m) => m.metric_name === selectedMetric);

  const formatLabel = (value = "") => {
    if (!value) return "";

    return value
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[#7faaca] hover:text-teal-700 mb-4 flex items-center gap-2 text-sm font-medium"
          >
            ← Back to Dashboard
          </button>
          <div className="bg-white rounded-xl p-6 border-l-4 border-[#7faaca] shadow-sm">
            <h1 className="text-3xl font-bold text-[#156669] mb-2">
              Health Metrics Trend Analysis
            </h1>
            <p className="text-gray-600 text-sm">
              Monitor longitudinal changes in your clinical parameters
            </p>
          </div>
        </div>

        {/* Metric Selector */}
        <Card className="mb-8 border-t-4 border-[#7faaca] bg-[#b8d2e4]">
          <h2 className="text-lg font-bold text-[#156669] mb-4">
            Clinical Metrics Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allTrends.map((metric) => {
              const isSelected = selectedMetric === metric.metric_name;

              return (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.metric_name)}
                  className={`
        p-4 rounded-lg border transition-all text-center
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${
          isSelected
            ? "border-blue-600 bg-blue-50 shadow-sm"
            : "border-gray-200 bg-white hover:border-blue-400 hover:bg-gray-50"
        }
      `}
                >
                  <div
                    className={`text-2xl mb-2 ${
                      isSelected ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {metric.icon}
                  </div>

                  <div
                    className={`font-semibold  text-sm ${
                      isSelected ? "text-blue-900" : "text-[#156669]"
                    }`}
                  >
                    {formatLabel(metric.metric_name)}
                  </div>

                  <div
                    className={`text-xs ${
                      isSelected ? "text-blue-700" : "text-gray-500"
                    }`}
                  >
                    {metric.unit}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Area */}
          <Card className="lg:col-span-2">
            <h2 className="flex items-center text-lg font-bold text-[#156669] mb-4 gap-2">
              {currentMetric?.icon} {formatLabel(currentMetric?.metric_name)}{" "}
              Over Time
            </h2>

            {loading ? (
              <div className="h-64">
                <Loader text="Loading trends" fullScreen={false} />
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {" "}
                  <VscGraph />
                </div>
                <h3 className="text-xl font-bold text-[#156669] mb-2">
                  No Data Available
                </h3>
                <p className="text-gray-600">
                  Upload more reports to see trends for this metric
                </p>
              </div>
            ) : (
              <>
                {/* Recharts Line Chart */}
                <LineChart
                  data={currentData}
                  dataKey="value"
                  xAxisKey="date"
                  color="#7faac8"
                  unit={trendsData?.unit || currentMetric?.unit}
                />

                {/* Comparison */}
                {currentData.length >= 2 && (
                  <div className="bg-teal-50 rounded-lg p-5 border-2 border-teal-200 mt-6">
                    <h2 className="flex items-center text-lg font-bold text-[#156669] mb-4 gap-2">
                      <VscGraph className="text-xl" />
                      Clinical Change Analysis
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          First Reading
                        </p>
                        <p className="text-xl font-bold text-[#156669]">
                          {currentData[0].value}{" "}
                          {trendsData?.unit || currentMetric?.unit}
                        </p>
                        <p className="text-xs text-gray-500">
                          {currentData[0].date}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          Latest Reading
                        </p>
                        <p className="text-xl font-bold text-[#156669]">
                          {currentData[currentData.length - 1].value}{" "}
                          {trendsData?.unit || currentMetric?.unit}
                        </p>
                        <p className="text-xs text-gray-500">
                          {currentData[currentData.length - 1].date}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-teal-200">
                      <p className="text-xs text-gray-600 mb-1">Net Change</p>
                      <p className="text-lg font-bold text-[#156669]">
                        {currentData[currentData.length - 1].value -
                          currentData[0].value >
                        0
                          ? "+"
                          : ""}
                        {(
                          currentData[currentData.length - 1].value -
                          currentData[0].value
                        ).toFixed(2)}{" "}
                        {trendsData?.unit || currentMetric?.unit}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>

          {/* Insights Panel */}
          <div className="space-y-5">
            <Card>
              <h2 className="flex items-center text-lg font-bold text-[#156669] mb-4 gap-2">
                <MdTipsAndUpdates className="text-xl" />
                Insights
              </h2>

              {loading ? (
                <div className="h-64">
                  <Loader text="Loading insights..." fullScreen={false} />
                </div>
              ) : currentData.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No insights available yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentData.length >= 2 && (
                    <div
                      className={`p-4 rounded-lg border-2 ${
                        currentData[currentData.length - 1].value >
                        currentData[0].value
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-green-50 border-green-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {currentData[currentData.length - 1].value >
                          currentData[0].value ? (
                            <FaChartLine />
                          ) : (
                            <BsGraphDownArrow />
                          )}
                        </span>
                        <div>
                          <h3 className="font-bold text-[#156669] mb-1">
                            Trend Analysis
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatLabel(currentMetric?.metric_name)} has{" "}
                            {currentData[currentData.length - 1].value >
                            currentData[0].value
                              ? "increased"
                              : "decreased"}{" "}
                            over the tracked period
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {" "}
                        <VscGraph />
                      </span>
                      <div>
                        <h3 className="font-bold text-[#156669] mb-1">
                          Data Points
                        </h3>
                        <p className="text-sm text-gray-600">
                          Tracking {currentData.length} measurements for{" "}
                          {formatLabel(currentMetric?.metric_name)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card className="bg-[#7faaca] text-white border-2 border-teal-600">
              <h3 className="text-lg flex gap-2 font-bold mb-3">
                <FaBullseye className="text-indigo-600 text-xl" /> Continuous
                Monitoring
              </h3>
              <p className="text-sm mb-4 text-teal-50">
                Regular tracking enables early detection of health changes and
                supports data-driven clinical decisions.
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="w-full bg-white text-[#7faaca] py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Upload New Report
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsAnalysis;
