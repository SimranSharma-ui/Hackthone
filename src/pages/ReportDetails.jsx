import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllReports, getReportDetails } from "../services/api";
import Card from "../Utils/Card";
import MetricCard from "../Utils/MetricCard";
import Loader from "../Utils/Loader";
import { MdTipsAndUpdates } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import {
  FaArrowDown,
  FaArrowUp,
  FaCandyCane,
  FaChartLine,
  FaClipboardList,
  FaMicroscope,
  FaPills,
  FaTint,
  FaUpload,
} from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { FaUserDoctor } from "react-icons/fa6";
import { BsHospital } from "react-icons/bs";
import {
  HiMiniArrowDownRight,
  HiMiniArrowRight,
  HiMiniArrowUpRight,
} from "react-icons/hi2";

const ReportDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("explanation");
  const [report, setReport] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allReports, setAllReports] = useState();

  useEffect(() => {
    fetchReportDetails();
    fetchReports();
  }, [id]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getAllReports();
      console.log("Fetched reports:", data.message.reports.length);
      setAllReports(data.message.reports.length || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      const data = await getReportDetails(id);
      console.log("Report details:", data.message);
      setReport(data.message.report);
      setRecommendations(data.message.recommendations || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      // toast.info("Using sample data. Connect to backend for real report.");
      // Mock data fallback
      setReport(getMockReport(id));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!report.file_url) {
      toast.error("No file available for download.");
      return;
    }

    const fileUrl = report.file_url.startsWith("http")
      ? report.file_url
      : `https://api-medilens.thesynergyworks.com/api${report.file_url}`;

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const getMockReport = (reportId) => {
    return {
      id: reportId,
      name: "CBC Report",
      date: new Date().toISOString().split("T")[0],
      type: "cbc",
      doctor: "Dr. Sarah Johnson",
      facility: "City Medical Center",
      file_url:
        "/uploads/medical-reports/1765958845829-34db50c0-da93-44d7-9b55-da853bd6536b-Untitled_document__1_.pdf",
      findings: [
        {
          parameter: "Hemoglobin",
          value: "14.2 g/dL",
          normalRange: "13.5-17.5 g/dL",
          status: "normal",
          explanation:
            "Hemoglobin carries oxygen in your blood. Your level is healthy and normal.",
          trend: "stable",
        },
        {
          parameter: "White Blood Cells",
          value: "7,200 /μL",
          normalRange: "4,000-11,000 /μL",
          status: "normal",
          explanation:
            "White blood cells fight infections. Your count is in the healthy range.",
          trend: "up",
        },
        {
          parameter: "Platelets",
          value: "250,000 /μL",
          normalRange: "150,000-400,000 /μL",
          status: "normal",
          explanation: "Platelets help your blood clot. Your count is normal.",
          trend: "stable",
        },
        {
          parameter: "Red Blood Cells",
          value: "5.2 million/μL",
          normalRange: "4.5-5.5 million/μL",
          status: "normal",
          explanation:
            "Red blood cells carry oxygen throughout your body. Your count is healthy.",
          trend: "stable",
        },
      ],
      aiSummary:
        "Your CBC test shows healthy results. All blood cell counts are within normal ranges, indicating good overall blood health. Your hemoglobin levels are optimal for oxygen transport, and your immune system markers are functioning well.",
      recommendations: [
        "Maintain a balanced diet rich in iron and vitamins",
        "Stay hydrated with 8 glasses of water daily",
        "Continue regular health checkups every 6 months",
        "Monitor for any unusual symptoms like fatigue or bruising",
      ],
    };
  };

  const getReportIcon = (type) => {
    switch (type) {
      case "cbc":
        return <FaTint className="text-red-500" />;
      case "lipid":
        return <FaPills className="text-blue-500" />;
      case "blood_sugar":
        return <FaCandyCane className="text-yellow-500" />;
      default:
        return <FaClipboardList className="text-gray-500" />;
    }
  };
  const parseCBCReport = (text = "") => {
    if (!text) return [];

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const results = [];
    let current = null;

    lines.forEach((line) => {
      const headerMatch = line.match(
        /^\d+\.\s.*?\s([A-Z\s]+):\s(.+?)\s\((NORMAL|LOW|HIGH)\)/i
      );

      if (headerMatch) {
        if (current) results.push(current);

        current = {
          name: headerMatch[1],
          value: headerMatch[2],
          status: headerMatch[3],
          description: "",
          interpretation: "",
        };
        return;
      }

      if (line.startsWith("What it is:") && current) {
        current.description = line.replace("What it is:", "").trim();
      }

      if (line.startsWith("What your result means:") && current) {
        current.interpretation = line
          .replace("What your result means:", "")
          .trim();
      }
    });

    if (current) results.push(current);
    return results;
  };

  const cbcData = useMemo(() => {
    return parseCBCReport(report?.ai_explanation);
  }, [report?.ai_explanation]);

  if (loading) {
    return <Loader text="Loading reports..." />;
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-[#156669] mb-4">Report not found</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[#7faaca] hover:text-[#7faac8] mb-4 flex items-center gap-2 text-sm font-medium"
          >
            ← Back to Dashboard
          </button>

          <Card className="border-l-4 border-[#7faac8] bg-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{getReportIcon(report.type)}</span>
                  <h1 className="text-2xl font-bold text-[#156669]">
                    {report.report_type?.toUpperCase()} Report
                  </h1>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <SlCalender className="text-base" />
                    {new Date(report.report_date).toLocaleDateString()}
                  </span>
                  {report.doctor && (
                    <span className="flex items-center gap-1">
                      <FaUserDoctor className="text-base" />
                      {report.doctor}
                    </span>
                  )}
                  {report.facility && (
                    <span className="flex items-center gap-1">
                      <BsHospital className="text-base" />
                      {report.facility}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                {report.has_previous_report && (
                  <button
                    onClick={() => navigate(`/report/${id}/compare`)}
                    className="bg-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-600 flex items-center gap-2 shadow-md"
                  >
                    <VscGraph /> Compare
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="bg-[#7faaca] flex gap-2 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#7faaca] shadow-md"
                >
                  <FaUpload /> Download
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("explanation")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "explanation"
                  ? "text-[#7faaca] border-b-2 border-teal-600"
                  : "text-gray-500 hover:text-[#7faaca]"
              }`}
            >
              AI Explanation
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "details"
                  ? "text-[#7faaca] border-b-2 border-teal-600"
                  : "text-gray-500 hover:text-[#7faaca]"
              }`}
            >
              Detailed Results
            </button>
          </div>

          <div className="p-6">
            {/* AI Explanation Tab */}
            {activeTab === "explanation" && (
              <div className="space-y-6">
                <div className="bg-teal-50 rounded-lg p-6 border-2 border-teal-200">
                  <h3 className="text-lg font-bold text-[#156669] mb-3 flex items-center gap-2">
                    <span className="flex gap-2">
                      <FaMicroscope />
                    </span>{" "}
                    Clinical AI Analysis
                  </h3>
                  {/* <p className="text-[#7faaca] leading-relaxed whitespace-pre-line">
                    {report.ai_explanation}
                  </p> */}
                  <div className="space-y-4">
                    {cbcData.map((item) => (
                      <div
                        key={item.name}
                        className="border rounded-xl p-4 flex justify-between items-start bg-white"
                      >
                        <div className="pr-4">
                          <h3 className="font-semibold text-lg capitalize">
                            {item.name}
                            <span className="ml-2 text-sm text-gray-500">
                              ({item.value})
                            </span>
                          </h3>

                          <p className="text-sm text-gray-600 mt-1">
                            {item.description}
                          </p>

                          <p className="text-sm mt-2">{item.interpretation}</p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium
          ${
            item.status === "NORMAL"
              ? "bg-green-100 text-green-700"
              : item.status === "LOW"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div>
                  <h3 className="text-lg font-bold text-[#156669] flex gap-2 mb-4">
                    <FaClipboardList /> Key Findings
                  </h3>
                  <div className="space-y-4 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {report.metrics?.map((metric) => (
                      <MetricCard
                        key={metric.id}
                        parameter={metric.metric_name
                          .replace("_", " ")
                          .toUpperCase()}
                        value={`${metric.metric_value} ${metric.metric_unit}`}
                        normalRange={metric.normal_range}
                        status={metric.status}
                        explanation={null}
                        trend="stable"
                      />
                    ))}
                  </div>
                </div> */}

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-lg font-bold text-[#156669] mb-5 flex items-center gap-2">
                    <MdTipsAndUpdates className="text-green-600 text-xl" />
                    Recommendations
                  </h3>

                  <div className="grid gap-5">
                    {recommendations?.map((rec, index) => (
                      <div
                        key={index}
                        className={`rounded-xl border p-5 shadow-sm transition hover:shadow-md ${
                          rec.type === "warning"
                            ? "bg-red-50 border-red-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-[#156669] text-base">
                            {rec.title}
                          </h4>

                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              rec.type === "warning"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {rec.type.toUpperCase()}
                          </span>
                        </div>

                        {/* Message */}
                        <p className="text-sm text-[#7faaca] mb-4">
                          {rec.message}
                        </p>

                        {/* Actions */}
                        {rec.actions?.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-[#156669] mb-2">
                              What you should do
                            </p>
                            <ul className="space-y-1 text-sm text-[#7faaca]">
                              {rec.actions.map((action, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-green-600 font-bold">
                                    ✓
                                  </span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Foods to Eat */}
                        {rec.foods_to_eat?.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-semibold text-green-700 mb-1">
                              Foods to Eat
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {rec.foods_to_eat.map((food, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700"
                                >
                                  {food}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Foods to Avoid */}
                        {rec.foods_to_avoid?.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-red-700 mb-1">
                              Foods to Avoid
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {rec.foods_to_avoid.map((food, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700"
                                >
                                  {food}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Results Tab */}
            {activeTab === "details" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-[#7faaca]">
                        Parameter
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-[#7faaca]">
                        Your Value
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-[#7faaca]">
                        Normal Range
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-[#7faaca]">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-[#7faaca]">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.metrics.map((metric) => (
                      <tr key={metric.id} className="border-b">
                        <td className="py-4 px-4 font-semibold">
                          {metric.metric_name.replace("_", " ").toUpperCase()}
                        </td>
                        <td className="py-4 px-4">
                          {metric.metric_value} {metric.metric_unit}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {metric.normal_range}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              metric.status === "normal"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {metric.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <HiMiniArrowRight className="text-green-500 text-xl" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            hover
            onClick={() => navigate(`/report/${id}/compare`)}
            className="bg-blue-500 text-white border-2 border-blue-600"
          >
            <div className="w-12 h-12 bg-white text-black bg-opacity-20 rounded-lg flex items-center justify-center text-2xl mb-2">
              <VscGraph />
            </div>
            <h3 className="font-bold mb-1">Compare Reports</h3>
            <p className="text-sm text-blue-100">Analyze changes over time</p>
          </Card>

          <Card
            hover
            onClick={() => navigate("/trends")}
            className="bg-[#7faaca] text-white border-2 border-teal-600"
          >
            <div className="w-12 h-12 bg-white text-black bg-opacity-20 rounded-lg flex items-center justify-center text-2xl mb-2">
              {" "}
              <FaChartLine />
            </div>
            <h3 className="font-bold mb-1">Health Trends</h3>
            <p className="text-sm text-teal-100">Monitor metric progression</p>
          </Card>

          <Card
            hover
            onClick={() => navigate("/upload")}
            className="bg-green-500 text-white border-2 border-green-600"
          >
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg text-black flex items-center justify-center text-2xl mb-2">
              {" "}
              <FaUpload />
            </div>
            <h3 className="font-bold mb-1">Upload New Report</h3>
            <p className="text-sm text-green-100">Submit additional reports</p>
          </Card>
        </div> */}
      </div>
    </div>
  );
};

export default ReportDetails;
