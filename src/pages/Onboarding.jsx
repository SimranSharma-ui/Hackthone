import { Link } from "react-router-dom";
import { FaHospital, FaUpload, FaMicroscope, FaChartLine, FaLock, FaShieldAlt, FaClock, FaArrowRight, FaCheckCircle, FaExclamationTriangle, FaClipboardList } from "react-icons/fa";

export default function Onboarding() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>
          <div className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-lg text-sm font-semibold mb-6 flex items-center gap-2">
            <FaMicroscope /> Professional Medical Analysis
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Clinical Report
            <span className="text-teal-600"> Analysis Platform</span>
          </h1>

          <p className="text-gray-600 text-xl mb-8 leading-relaxed">
            Secure medical report upload with AI-powered analysis. Get detailed explanations 
            of your test results and track health metrics over time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-500 text-white rounded-lg font-bold text-lg hover:bg-teal-600 transition-all shadow-md"
            >
              Create Account
              <FaArrowRight />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-lg font-bold text-lg border-2 border-gray-300 hover:border-teal-500 transition-all"
            >
              Patient Login
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center bg-white rounded-lg p-4 border border-teal-100">
              <FaMicroscope className="text-3xl text-teal-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">AI Analysis</p>
            </div>
            <div className="text-center bg-white rounded-lg p-4 border border-teal-100">
              <FaChartLine className="text-3xl text-teal-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Health Trends</p>
            </div>
            <div className="text-center bg-white rounded-lg p-4 border border-teal-100">
              <FaLock className="text-3xl text-teal-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">HIPAA Secure</p>
            </div>
          </div>
        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="relative flex justify-center">
          <div className="relative w-96 h-80 bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
              <div>
                <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-2 w-24 bg-gray-100 rounded" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 mb-4">
              <div className="h-2 w-20 bg-teal-300 rounded mb-2" />
              <div className="h-2 w-full bg-gray-200 rounded mb-1" />
              <div className="h-2 w-3/4 bg-gray-200 rounded" />
            </div>

            <div className="h-32 bg-gradient-to-r from-teal-100 to-blue-100 rounded-xl flex items-end p-4 gap-3">
              <div className="w-8 h-16 bg-teal-400 rounded-lg" />
              <div className="w-8 h-24 bg-teal-500 rounded-lg" />
              <div className="w-8 h-20 bg-blue-400 rounded-lg" />
              <div className="w-8 h-28 bg-blue-500 rounded-lg" />
            </div>
          </div>

          {/* floating cards */}
          <div className="absolute -bottom-4 -left-8 w-56 h-28 bg-white rounded-xl shadow-xl p-4 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <FaCheckCircle className="text-2xl text-green-500" />
              <div className="h-3 w-24 bg-green-200 rounded" />
            </div>
            <div className="h-2 w-full bg-gray-100 rounded mb-1" />
            <div className="h-2 w-3/4 bg-gray-100 rounded" />
          </div>

          <div className="absolute -top-4 -right-8 w-48 h-24 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl shadow-xl p-4 border-2 border-yellow-300">
            <div className="flex items-center gap-2 mb-2">
              <FaExclamationTriangle className="text-xl text-yellow-600" />
              <div className="h-3 w-20 bg-yellow-300 rounded" />
            </div>
            <div className="h-2 w-full bg-yellow-200 rounded" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Clinical Workflow</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 border-2 border-teal-100 hover:border-teal-300 transition-all">
            <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center text-3xl mb-4">
              <FaClipboardList className="text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">1. Upload Medical Reports</h3>
            <p className="text-gray-600 text-sm">
              Securely upload CBC, Lipid Profile, and Blood Sugar reports in PDF or image format
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 border-2 border-teal-100 hover:border-teal-300 transition-all">
            <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center text-3xl mb-4">
              <FaMicroscope className="text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">2. Clinical AI Analysis</h3>
            <p className="text-gray-600 text-sm">
              Advanced AI processes your reports and provides detailed explanations of test results
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 border-2 border-teal-100 hover:border-teal-300 transition-all">
            <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center text-3xl mb-4">
              <FaChartLine className="text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">3. Monitor Health Trends</h3>
            <p className="text-gray-600 text-sm">
              Track changes in your health metrics over time with visual analytics and comparisons
            </p>
          </div>
        </div>
      </div>

      {/* Security & Compliance */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border-2 border-teal-200 p-8 mb-6">
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <FaShieldAlt className="text-4xl text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-teal-600 mb-1">HIPAA</div>
              <div className="text-xs text-gray-600">Compliant</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <FaLock className="text-4xl text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-teal-600 mb-1">256-bit</div>
              <div className="text-xs text-gray-600">Encryption</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <FaClock className="text-4xl text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-teal-600 mb-1">24/7</div>
              <div className="text-xs text-gray-600">Secure Access</div>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <p className="text-sm text-gray-700 text-center flex items-center justify-center gap-2">
            <FaExclamationTriangle className="text-yellow-600" />
            <strong>Medical Disclaimer:</strong> This platform provides informational analysis only and does not constitute medical advice, diagnosis, or treatment. 
            Always consult qualified healthcare professionals for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
