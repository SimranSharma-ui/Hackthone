import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getReportDetails } from "../services/api";
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
import { HiMiniArrowDownRight, HiMiniArrowRight, HiMiniArrowUpRight } from "react-icons/hi2";

const ReportDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("explanation");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      const data = await getReportDetails(id);
      setReport(data.report || data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.info("Using sample data. Connect to backend for real report.");
      // Mock data fallback
      setReport(getMockReport(id));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!report?.file_url) {
      toast.error("No file available for download.");
      return;
    }

    // Ensure full URL if backend URL is relative
    const fileUrl = report.file_url.startsWith("http")
      ? report.file_url
      : `${import.meta.env.VITE_API_BASE_URL}${report.file_url}`;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = report.name + ".pdf"; // optional: custom filename
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getMockReport = (reportId) => {
    return {
      id: reportId,
      name: "CBC Report",
      date: new Date().toISOString().split("T")[0],
      type: "cbc",
      doctor: "Dr. Sarah Johnson",
      facility: "City Medical Center",
     file_url  : "/uploads/medical-reports/1765958845829-34db50c0-da93-44d7-9b55-da853bd6536b-Untitled_document__1_.pdf",
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

  if (loading) {
    return <Loader text="Loading reports..." />;
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-gray-800 mb-4">Report not found</p>
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
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-teal-600 hover:text-teal-700 mb-4 flex items-center gap-2 text-sm font-medium"
          >
            ← Back to Dashboard
          </button>

          <Card className="border-l-4 border-teal-500">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{getReportIcon(report.type)}</span>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {report.name}
                  </h1>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <SlCalender className="text-base" />
                    {report.date}
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
                <button
                  onClick={() => navigate(`/report/${id}/compare`)}
                  className="bg-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-600 flex items-center gap-2 shadow-md"
                >
                  <VscGraph /> Compare
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-teal-500 flex gap-2 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-600 shadow-md"
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
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              AI Explanation
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "details"
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-gray-500 hover:text-gray-700"
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
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="flex gap-2">
                      <FaMicroscope />
                    </span>{" "}
                    Clinical AI Analysis
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {report.aiSummary}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex gap-2 mb-4">
                    <FaClipboardList /> Key Findings
                  </h3>
                  <div className="space-y-4">
                    {report.findings.map((finding, index) => (
                      <MetricCard
                        key={index}
                        parameter={finding.parameter}
                        value={finding.value}
                        normalRange={finding.normalRange}
                        status={finding.status}
                        explanation={finding.explanation}
                        trend={finding.trend}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span>
                      <MdTipsAndUpdates />
                    </span>{" "}
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {report.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✓</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Detailed Results Tab */}
            {activeTab === "details" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-gray-700">
                        Parameter
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">
                        Your Value
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">
                        Normal Range
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.findings.map((finding, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 font-semibold text-gray-900">
                          {finding.parameter}
                        </td>
                        <td className="py-4 px-4 text-gray-900">
                          {finding.value}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {finding.normalRange}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              finding.status === "normal"
                                ? "bg-green-100 text-green-700"
                                : finding.status === "warning"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {finding.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-2xl">
                          {finding.trend === "up"
                            ? <HiMiniArrowUpRight className="bg-green-400 p-1 rounded-md text-white text-4xl"/>
                            : finding.trend === "down"
                            ? <HiMiniArrowDownRight className="bg-green-400 p-1 rounded-md text-white text-4xl"/>
                            : <HiMiniArrowRight className="bg-green-400 p-1 rounded-md text-white text-4xl"/>}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            className="bg-teal-500 text-white border-2 border-teal-600"
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
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
