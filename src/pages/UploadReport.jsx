import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadReport } from "../services/api";
import {
  FaBolt,
  FaCheck,
  FaFileAlt,
  FaLock,
  FaMicroscope,
  FaPills,
} from "react-icons/fa";
import { GiCandyCanes } from "react-icons/gi";

import { MdBloodtype } from "react-icons/md";

const UploadReport = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [reportType, setReportType] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile || !reportType) {
      toast.error("Please select a file and report type");
      return;
    }

    setAnalyzing(true);

    try {
      const result = await uploadReport(uploadedFile, reportType);
      toast.success("Report uploaded successfully! Analyzing... 🔍");

      setTimeout(() => {
        navigate(`/report/${result.reportId || result.report?.id || 1}`);
      }, 1000);
    } catch (err) {
      toast.error(err.message || "Failed to analyze report. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const reportTypes = [
    {
      id: "cbc",
      name: "CBC (Complete Blood Count)",
      icon: <MdBloodtype className="text-red-600 text-xl" />,
    },
    {
      id: "lipid",
      name: "Lipid Profile",
      icon: <FaPills className="text-purple-600 text-xl" />,
    },
    {
      id: "blood_sugar",
      name: "Blood Sugar",
      icon: <GiCandyCanes className="text-pink-500 text-xl" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-teal-600 hover:text-teal-700 mb-4 flex items-center gap-2 font-medium"
          >
            ← Back to Dashboard
          </button>
          <div className="bg-white rounded-xl p-6 border-l-4 border-teal-500 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Medical Report Upload
            </h1>
            <p className="text-gray-600 text-sm">
              Submit your clinical report for AI-powered analysis
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* File Upload Area */}
          <div
            className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all ${
              dragActive
                ? "border-teal-500 bg-teal-50"
                : "border-gray-300 hover:border-teal-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploadedFile ? (
              <div className="space-y-4">
                <div className="flex justify-center items-center text-6xl text-green-600">
                  <FaCheck />
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-800">
                    {uploadedFile.name}
                  </p>
                  <p className="text-gray-500">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-red-500 hover:text-red-600 font-medium"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center items-center text-6xl text-gray-600">
                  <FaFileAlt />
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    Drag and drop your report here
                  </p>
                  <p className="text-gray-500 mb-4">or</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <span className="bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 cursor-pointer inline-block shadow-md">
                      Browse Files
                    </span>
                  </label>
                </div>
                <p className="text-sm text-gray-400">
                  Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Report Type Selection */}
          {uploadedFile && (
            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-4 text-lg">
                  Select Report Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reportTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setReportType(type.id)}
                      className={`p-6 rounded-xl border-3 transition-all ${
                        reportType === type.id
                          ? "border-teal-500 bg-teal-50 shadow-lg"
                          : "border-gray-300 hover:border-teal-300 bg-white"
                      }`}
                    >
                      <div className="text-4xl mb-3">{type.icon}</div>
                      <div className="font-bold text-gray-800">{type.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!reportType || analyzing}
                className="w-full bg-teal-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-teal-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="h-8 w-8 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
                    Analyzing Report with AI...
                  </span>
                ) : (
                  "Analyze Report with AI"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 border-2 border-teal-100">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-2xl mb-3">
              <FaLock className="text-yellow-500 text-xl" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">HIPAA Compliant</h3>
            <p className="text-sm text-gray-600">
              256-bit encryption ensures your medical data stays private and
              secure
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-teal-100">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-2xl mb-3">
              <FaMicroscope />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Clinical AI Engine</h3>
            <p className="text-sm text-gray-600">
              Advanced algorithms analyze and explain complex medical
              terminology
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-teal-100">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-2xl mb-3">
              <FaBolt className="text-yellow-500 text-xl" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Rapid Processing</h3>
            <p className="text-sm text-gray-600">
              Receive detailed analysis and insights within seconds of upload
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;
