import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllReports } from "../services/api";
import StatCard from "../Utils/StatCard";
import Card from "../Utils/Card";
import Loader from "../Utils/Loader";
import {
  FaUpload,
  FaChartLine,
  FaLightbulb,
  FaFileAlt,
  FaCalendarAlt,
  FaClipboardList,
  FaTint,
  FaPills,
  FaCandyCane,
  FaArrowRight,
  FaExclamationTriangle,
  FaChartBar,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchReports();
    const stored = localStorage.getItem("userData");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getAllReports();
      console.log("Fetched reports:", data.message.reports);
      setReports(data.message.reports || []);
    } catch (err) {
      // toast.info(
      //   "Showing sample reports. Connect to backend for your actual data."
      // );

      // setReports([
      //   {
      //     id: 1,
      //     name: "CBC Report",
      //     date: "2024-12-10",
      //     type: "cbc",
      //     status: "analyzed",
      //     summary: "All values within normal range",
      //   },
      //   {
      //     id: 2,
      //     name: "Lipid Profile",
      //     date: "2024-11-15",
      //     type: "lipid",
      //     status: "analyzed",
      //     summary: "Cholesterol slightly elevated",
      //   },
      //   {
      //     id: 3,
      //     name: "Blood Sugar Test",
      //     date: "2024-10-20",
      //     type: "blood_sugar",
      //     status: "analyzed",
      //     summary: "Normal glucose levels",
      //   },
      // ]);
      // toast.error(err.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
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

  const getReportTypeName = (type) => {
    switch (type) {
      case "cbc":
        return "CBC";
      case "lipid":
        return "Lipid Profile";
      case "blood_sugar":
        return "Blood Sugar";
      default:
        return type;
    }
  };

  const stats = [
    { label: "Total Reports", value: "12", icon: <FaFileAlt />, color: "blue" },
    {
      label: "This Month",
      value: "3",
      icon: <FaCalendarAlt />,
      color: "green",
    },
    {
      label: "Alerts",
      value: "1",
      icon: <FaExclamationTriangle />,
      color: "yellow",
    },
    {
      label: "Trends Tracked",
      value: "8",
      icon: <FaChartBar />,
      color: "purple",
    },
  ];

  const formatDateTime = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 bg-white rounded-xl p-6 border-l-4 border-teal-500 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Hello, {user?.data?.first_name || "Aanmaya Sharma"}{" "}
            {user?.data?.last_name || ""}
          </h1>
          <p className="text-gray-600 text-sm">
            Medical Report Analysis & Health Monitoring
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Card
            hover
            onClick={() => navigate("/upload")}
            className="bg-teal-400 text-white border-2 border-teal-600"
          >
            <div className="w-12 h-12 bg-white text-black bg-opacity-20 rounded-lg flex items-center justify-center text-2xl mb-3">
              <FaUpload />
            </div>
            <h3 className="text-xl font-bold mb-2">Upload Report</h3>
            <p className="text-teal-50 text-sm">
              Submit new medical report for analysis
            </p>
          </Card>

          <Card
            hover
            onClick={() => navigate("/trends")}
            className="bg-blue-500 text-white border-2 border-blue-600"
          >
            <div className="w-12 h-12 bg-white text-black bg-opacity-20 rounded-lg flex items-center justify-center text-2xl mb-3">
              <FaChartLine />
            </div>
            <h3 className="text-xl font-bold mb-2">Health Trends</h3>
            <p className="text-blue-50 text-sm">
              Monitor health metrics over time
            </p>
          </Card>

          <Card
            hover
            onClick={() => navigate("/health-tips")}
            className="bg-green-500 text-white border-2 border-green-600"
          >
            <div className="w-12 h-12 bg-white text-black bg-opacity-20 rounded-lg flex items-center justify-center text-2xl mb-3">
              <FaLightbulb />
            </div>
            <h3 className="text-xl font-bold mb-2">Health Tips</h3>
            <p className="text-green-50 text-sm">
              Clinical recommendations & advice
            </p>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="border-t-4 border-teal-500">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaClipboardList className="text-2xl text-teal-600" /> Recent
            Medical Reports
          </h2>

          {loading ? (
            <div className="h-64">
              <Loader text="Loading reports..." fullScreen={false} />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No Reports Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Upload your first medical report to get started
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="bg-teal-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 shadow-md flex items-center gap-2 mx-auto"
              >
                <FaUpload /> Upload First Report
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => navigate(`/report/${report.id}`)}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-teal-400 hover:bg-teal-50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">
                          {getReportIcon(report.report_type || report.type)}
                        </span>
                        <h3 className="text-base font-semibold text-gray-900">
                          {report.report_type || report.name}
                        </h3>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                          {report.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 ml-8 whitespace-pre-line">
                        {report.ai_summary || report.summary}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 ml-8">
                        <span className="flex items-center gap-1">
                          <FaClipboardList />{" "}
                          {getReportTypeName(report.report_type || report.type)}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <FaCalendarAlt />
                          {formatDateTime(report.report_date || report.date)}
                        </span>
                      </div>
                    </div>
                    <button className="text-teal-500 hover:text-teal-600 text-lg ml-4 font-bold flex items-center gap-2">
                      View <FaArrowRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
