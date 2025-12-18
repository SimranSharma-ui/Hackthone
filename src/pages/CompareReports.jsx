import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { compareWithPrevious, getReportDetails } from "../services/api";
import ComparisonChart from "../Utils/ComparisonChart";
import Card from "../Utils/Card";
import Loader from "../Utils/Loader";
import { VscGraph } from "react-icons/vsc";
import { SlCalender } from "react-icons/sl";
import { FaChartLine, FaClipboardList, FaMicroscope } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { BsGraphDownArrow } from "react-icons/bs";
import { GiClockwork } from "react-icons/gi";

const CompareReports = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [currentReport, setCurrentReport] = useState(null);

  const getMockComparison = () => {
    return {
      current_report: {
        id: reportId,
        name: "CBC Report",
        date: "2024-12-16",
        type: "cbc",
      },
      previous_report: {
        id: "prev-1",
        name: "CBC Report",
        date: "2024-09-16",
        type: "cbc",
      },
      comparison: {
        time_difference: "3 months",
        summary:
          "Overall blood parameters remain stable. Mild anemia indicators persist with low hemoglobin, MCH, and MCHC values. No significant deterioration or improvement noted.",
        overall_trend: "stable",

        metrics: [
          {
            name: "Hemoglobin",
            previous_value: "13.2 g/dL",
            current_value: "13.2 g/dL",
            change: "0.0",
            change_percentage: "0%",
            trend: "stable",
            interpretation:
              "Hemoglobin remains slightly below normal range, suggesting persistent mild anemia. Monitoring is recommended.",
          },
          {
            name: "MCH",
            previous_value: "26 pg",
            current_value: "26 pg",
            change: "0.0",
            change_percentage: "0%",
            trend: "stable",
            interpretation:
              "Mean corpuscular hemoglobin is below normal, indicating reduced hemoglobin per red blood cell.",
          },
          {
            name: "MCHC",
            previous_value: "31 g/dL",
            current_value: "31 g/dL",
            change: "0.0",
            change_percentage: "0%",
            trend: "stable",
            interpretation:
              "Low MCHC suggests red blood cells have reduced hemoglobin concentration.",
          },
          {
            name: "White Blood Cells",
            previous_value: "8,200 cells/µL",
            current_value: "8,200 cells/µL",
            change: "0",
            change_percentage: "0%",
            trend: "stable",
            interpretation:
              "White blood cell count remains within normal range, indicating a stable immune response.",
          },
          {
            name: "Platelets",
            previous_value: "230,000 cells/µL",
            current_value: "230,000 cells/µL",
            change: "0",
            change_percentage: "0%",
            trend: "stable",
            interpretation:
              "Platelet count is normal and unchanged, indicating healthy clotting ability.",
          },
        ],
      },
    };
  };

  const getTimeDifference = (currentDate, previousDate) => {
    const diffMs = Math.abs(currentDate - previousDate);
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  };

  const fetchComparison = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current report details
      const reportData = await getReportDetails(reportId);
      setCurrentReport(reportData.report);

      // Fetch comparison with previous report
      const comparisonResponse = await compareWithPrevious(reportId);

      const currentDate = new Date(
        comparisonResponse.message.current_report.report_date
      );
      const previousDate = new Date(
        comparisonResponse.message.previous_report.report_date
      );

      const comparisonPayload = {
        current_report: {
          id: comparisonResponse.message.current_report.id,
          name: "CBC Report",
          date: new Date(
            comparisonResponse.message.current_report.report_date
          ).toLocaleDateString(),
          type: comparisonResponse.message.current_report.report_type,
        },
        previous_report: {
          id: comparisonResponse.message.previous_report.id,
          name: "CBC Report",
          date: new Date(
            comparisonResponse.message.previous_report.report_date
          ).toLocaleDateString(),
          type: comparisonResponse.message.previous_report.report_type,
        },
        comparison: {
          time_difference: getTimeDifference(currentDate, previousDate),
          summary:
            comparisonResponse.message.comparison.key_changes.join(". ") + ".",
          overall_trend: comparisonResponse.message.comparison.overall_trend,
          metrics: buildMetricComparison(
            comparisonResponse.message.current_report.metrics,
            comparisonResponse.message.previous_report.metrics
          ),
        },
      };

      setComparisonData(comparisonPayload);

      toast.success("Comparison loaded successfully! ");
    } catch (err) {
      console.error("Comparison error:", err);
      setError(err.message);
      toast.info(
        "Using sample comparison data. Connect to backend for real comparison."
      );
      // Always show mock data for development/demo
      setComparisonData(getMockComparison());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [reportId]);

  const formatMetricName = (key) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getTrend = (prev, curr) => {
    const p = parseFloat(prev);
    const c = parseFloat(curr);

    if (isNaN(p) || isNaN(c)) return "stable";
    if (c > p) return "improved";
    if (c < p) return "worsened";
    return "stable";
  };

  const getChange = (prev, curr) => {
    const p = parseFloat(prev);
    const c = parseFloat(curr);

    if (isNaN(p) || isNaN(c)) {
      return { change: "0", percentage: "0%" };
    }

    const diff = (c - p).toFixed(1);
    const percent = p !== 0 ? ((diff / p) * 100).toFixed(1) : 0;

    return {
      change: diff > 0 ? `+${diff}` : `${diff}`,
      percentage: `${percent}%`,
    };
  };

  const buildMetricComparison = (currentMetrics, previousMetrics) => {
    if (!currentMetrics || !previousMetrics) return [];

    return currentMetrics.map((curr) => {
      const prev = previousMetrics.find(
        (p) => p.metric_name === curr.metric_name
      );

      const { change, percentage } = getChange(
        prev?.metric_value,
        curr.metric_value
      );

      return {
        name: formatMetricName(curr.metric_name),
        previous_value: prev
          ? `${prev.metric_value} ${prev.metric_unit}`
          : "N/A",
        current_value: `${curr.metric_value} ${curr.metric_unit}`,
        change,
        change_percentage: percentage,
        trend: getTrend(prev?.metric_value, curr.metric_value),
        interpretation:
          curr.status === "low"
            ? "Value is below normal range. Monitoring is recommended."
            : curr.status === "high"
            ? "Value is above normal range. Consult your doctor."
            : "Value is within the normal range.",
      };
    });
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "improved":
        return "bg-green-50 border-green-300 text-green-700";
      case "worsened":
        return "bg-red-50 border-red-300 text-red-700";
      case "stable":
        return "bg-blue-50 border-blue-300 text-blue-700";
      default:
        return "bg-gray-50 border-gray-300 text-gray-700";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improved":
        return <FaChartLine />;
      case "worsened":
        return <BsGraphDownArrow />;
      case "stable":
        return "➡️";
      default:
        return "➡️";
    }
  };

  const getReportIcon = (type) => {
    switch (type) {
      case "cbc":
        return <MdBloodtype className="text-red-600 text-xl" />;
      case "lipid":
        return <FaPills className="text-purple-600 text-xl" />;
      case "blood_sugar":
        return <GiCandyCanes className="text-pink-500 text-xl" />;
      default:
        return <FaClipboardList className="text-green-600 text-lg" />;
    }
  };

  if (loading) {
    return <Loader text="Comparing reports..." />;
  }

  // Always show comparison data (real or mock)
  if (!loading && !comparisonData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Previous Report Found
          </h2>
          <p className="text-gray-600 mb-6">
            There's no previous report of the same type to compare with.
          </p>
          <button
            onClick={() => navigate(`/report/${reportId}`)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            Back to Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/report/${reportId}`)}
            className="text-teal-600 hover:text-teal-700 mb-4 flex items-center gap-2 text-sm font-medium"
          >
            ← Back to Report
          </button>

          <Card className="border-l-4 border-teal-500">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span>
                <VscGraph />
              </span>{" "}
              Report Comparison
            </h1>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Previous Report */}
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">
                    {getReportIcon(comparisonData.previous_report?.type)}
                  </span>
                  <h3 className="font-bold text-gray-800">Previous Report</h3>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {comparisonData.previous_report?.name}
                </p>
                <p className="text-xs flex gap-2 text-gray-500">
                  <SlCalender /> {comparisonData.previous_report?.date}
                </p>
              </div>

              {/* Current Report */}
              <div className="bg-teal-50 rounded-lg p-4 border-2 border-teal-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">
                    {getReportIcon(comparisonData.current_report?.type)}
                  </span>
                  <h3 className="font-bold text-gray-800">Current Report</h3>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {comparisonData.current_report?.name}
                </p>
                <p className="text-xs flex gap-2 text-gray-500">
                  <SlCalender /> {comparisonData.current_report?.date}
                </p>
              </div>
            </div>

            {comparisonData.comparison?.time_difference && (
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-lg text-xs font-semibold border border-teal-300">
                  <GiClockwork className="text-sm text-black" />
                  <span>
                    Time Period: {comparisonData.comparison.time_difference}
                  </span>
                </span>
              </div>
            )}
          </Card>
        </div>

        {/* AI Summary */}
        <Card className="mb-6 border-t-4 border-teal-500">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex gap-2">
              <FaMicroscope />
            </span>{" "}
            Clinical Comparison Analysis
          </h2>
          <div className="bg-teal-50 rounded-lg p-5 border-2 border-teal-200">
            <p className="text-gray-700 leading-relaxed">
              {comparisonData.comparison?.summary}
            </p>
          </div>
        </Card>

        {/* Comparison Chart */}
        {comparisonData.comparison?.metrics && (
          <Card className="mb-6">
            <ComparisonChart metrics={comparisonData.comparison.metrics} />
          </Card>
        )}

        {/* Metrics Comparison */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Parameter Changes
          </h2>

          <div className="space-y-5">
            {comparisonData.comparison?.metrics?.map((metric, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-5 ${getTrendColor(
                  metric.trend
                )}`}
              >
                {/* Metric Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{metric.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {getTrendIcon(metric.trend)}
                    </span>
                    <span className="text-xs font-semibold uppercase">
                      {metric.trend}
                    </span>
                  </div>
                </div>

                {/* Values Comparison */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <p className="text-xs font-semibold mb-1 opacity-75">
                      Previous
                    </p>
                    <p className="text-xl font-bold">{metric.previous_value}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {comparisonData.previous_report?.date}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <p className="text-xs font-semibold mb-1 opacity-75">
                      Current
                    </p>
                    <p className="text-xl font-bold">{metric.current_value}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {comparisonData.current_report?.date}
                    </p>
                  </div>
                </div>

                {/* Change Details */}
                <div className="bg-white bg-opacity-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Change:</span>
                    <div className="text-right">
                      <span className="text-lg font-bold">{metric.change}</span>
                      <span className="text-xs ml-2 opacity-75">
                        ({metric.change_percentage})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interpretation */}
                <div className="bg-white bg-opacity-50 rounded-lg p-3">
                  <p className="text-xs font-semibold mb-2">
                    {" "}
                    What this means:
                  </p>
                  <p className="text-sm leading-relaxed">
                    {metric.interpretation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate(`/report/${reportId}`)}
            className="flex-1 bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition shadow-md"
          >
            View Current Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareReports;
