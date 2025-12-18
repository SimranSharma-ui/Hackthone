import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getHealthTrends } from "../services/api";
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
  const [selectedMetric, setSelectedMetric] = useState("Hemoglobin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trendsData, setTrendsData] = useState(null);

  const metrics = [
    {
      id: "Hemoglobin",
      name: "Hemoglobin",
      unit: "g/dL",
      icon: <MdBloodtype className="text-red-600 text-xl" />,
    },
    {
      id: "White Blood Cells",
      name: "White Blood Cells",
      unit: "/μL",
      icon: <MdOutlineBloodtype className="text-blue-600 text-xl" />,
    },
    {
      id: "Total Cholesterol",
      name: "Total Cholesterol",
      unit: "mg/dL",
      icon: <FaBalanceScale className="text-yellow-600 text-xl" />,
    },
    {
      id: "Blood Sugar",
      name: "Blood Sugar",
      unit: "mg/dL",
      icon: <MdBloodtype className="text-red-600 text-xl" />,
    },
    {
      id: "Platelets",
      name: "Platelets",
      unit: "/μL",
      icon: <MdBloodtype className="text-red-600 text-xl" />,
    },
    {
      id: "LDL Cholesterol",
      name: "LDL Cholesterol",
      unit: "mg/dL",
      icon: <FaBalanceScale className="text-yellow-600 text-xl" />,
    },
  ];

  useEffect(() => {
    if (selectedMetric) {
      fetchTrends();
    }
  }, [selectedMetric]);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHealthTrends(selectedMetric, 6);
      setTrendsData(data);
    } catch (err) {
      setError(err.message);
      toast.info(
        "Using sample trends data. Connect to backend for real trends."
      );
      // Use mock data as fallback
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
  const currentMetric = metrics.find((m) => m.id === selectedMetric);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-teal-600 hover:text-teal-700 mb-4 flex items-center gap-2 text-sm font-medium"
          >
            ← Back to Dashboard
          </button>
          <div className="bg-white rounded-xl p-6 border-l-4 border-teal-500 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Health Metrics Trend Analysis
            </h1>
            <p className="text-gray-600 text-sm">
              Monitor longitudinal changes in your clinical parameters
            </p>
          </div>
        </div>

        {/* Metric Selector */}
        <Card className="mb-8 border-t-4 border-teal-500">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Select Clinical Parameter
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMetric === metric.id
                    ? "border-teal-500 bg-teal-50 shadow-md"
                    : "border-gray-200 hover:border-teal-300"
                }`}
              >
                <div className="text-2xl mb-2">{metric.icon}</div>
                <div className="font-semibold text-gray-800 text-sm">
                  {metric.name}
                </div>
                <div className="text-xs text-gray-500">{metric.unit}</div>
              </button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Area */}
          <Card className="lg:col-span-2">
            <h2 className="flex items-center text-lg font-bold text-gray-900 mb-4 gap-2">
              {currentMetric?.icon} {currentMetric?.name} Over Time
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">
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
                color="#0d9488"
                  unit={trendsData?.unit || currentMetric?.unit}
                />

                {/* Comparison */}
                {currentData.length >= 2 && (
                  <div className="bg-teal-50 rounded-lg p-5 border-2 border-teal-200 mt-6">
                    <h2 className="flex items-center text-lg font-bold text-gray-900 mb-4 gap-2">
                      <VscGraph className="text-xl" />
                      Clinical Change Analysis
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          First Reading
                        </p>
                        <p className="text-xl font-bold text-gray-800">
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
                        <p className="text-xl font-bold text-gray-800">
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
                      <p className="text-lg font-bold text-gray-800">
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
              <h2 className="flex items-center text-lg font-bold text-gray-900 mb-4 gap-2">
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
                          <h3 className="font-bold text-gray-800 mb-1">
                            Trend Analysis
                          </h3>
                          <p className="text-sm text-gray-600">
                            {currentMetric?.name} has{" "}
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
                        <h3 className="font-bold text-gray-800 mb-1">
                          Data Points
                        </h3>
                        <p className="text-sm text-gray-600">
                          Tracking {currentData.length} measurements for{" "}
                          {currentMetric?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card className="bg-teal-500 text-white border-2 border-teal-600">
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
                className="w-full bg-white text-teal-600 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
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
