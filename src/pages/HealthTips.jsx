import { useState } from "react";
import { BsHospital } from "react-icons/bs";
import {
  FaBan,
  FaBed,
  FaClock,
  FaDumbbell,
  FaLeaf,
  FaMoon,
  FaRunning,
  FaShieldAlt,
  FaSpa,
  FaTint,
  FaUsers,
  FaWalking,
} from "react-icons/fa";
import { GiWheat } from "react-icons/gi";
import { MdTipsAndUpdates } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

const HealthTips = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Tips", icon: <MdTipsAndUpdates /> },
    {
      id: "nutrition",
      name: "Nutrition",
      icon: <FaLeaf className="text-green-500 text-4xl" />,
    },
    {
      id: "exercise",
      name: "Exercise",
      icon: <FaRunning className="text-green-500 text-4xl" />,
    },
    {
      id: "sleep",
      name: "Sleep",
      icon: <FaBed className="text-blue-500 text-4xl" />,
    },
    {
      id: "mental",
      name: "Mental Health",
      icon: <FaSpa className="text-green-500 text-4xl" />,
    },
    {
      id: "preventive",
      name: "Preventive Care",
      icon: <FaShieldAlt className="text-teal-500 text-4xl" />,
    },
  ];

  const tips = [
    {
      id: 1,
      category: "nutrition",
      title: "Stay Hydrated",
      description:
        "Drink at least 8 glasses of water daily to maintain optimal body function and help flush out toxins.",
      icon: <FaTint className="text-blue-500 text-4xl" />,
      priority: "high",
    },
    {
      id: 2,
      category: "nutrition",
      title: "Eat More Fiber",
      description:
        "Include whole grains, fruits, and vegetables in your diet to improve digestion and lower cholesterol.",
      icon: <GiWheat className="text-yellow-500 text-4xl" />,
      priority: "high",
    },
    {
      id: 3,
      category: "exercise",
      title: "Daily Movement",
      description:
        "Aim for at least 30 minutes of moderate exercise 5 days a week to maintain cardiovascular health.",
      icon: <FaWalking className="text-yellow-400 text-4xl" />,
      priority: "high",
    },
    {
      id: 4,
      category: "exercise",
      title: "Strength Training",
      description:
        "Include resistance exercises 2-3 times per week to build muscle mass and bone density.",
      icon: <FaDumbbell className="text-yellow-500 text-4xl" />,
      priority: "medium",
    },
    {
      id: 5,
      category: "sleep",
      title: "Consistent Sleep Schedule",
      description:
        "Go to bed and wake up at the same time every day to regulate your body's internal clock.",
      icon: <FaClock className="text-black text-4xl" />,
      priority: "high",
    },
    {
      id: 6,
      category: "sleep",
      title: "Quality Sleep Environment",
      description:
        "Keep your bedroom cool, dark, and quiet for better sleep quality. Aim for 7-9 hours nightly.",
      icon: <FaMoon className="text-yellow-500 text-4xl" />,
      priority: "medium",
    },
    {
      id: 7,
      category: "mental",
      title: "Practice Mindfulness",
      description:
        "Spend 10-15 minutes daily on meditation or deep breathing to reduce stress and anxiety.",
      icon: <FaSpa className="text-yellow-500 text-4xl" />,
      priority: "medium",
    },
    {
      id: 8,
      category: "mental",
      title: "Social Connections",
      description:
        "Maintain regular contact with friends and family to support mental and emotional wellbeing.",
      icon: <FaUsers className="text-indigo-500 text-4xl" />,
      priority: "medium",
    },
    {
      id: 9,
      category: "preventive",
      title: "Regular Checkups",
      description:
        "Schedule annual health screenings and follow your doctor's recommendations for preventive care.",
      icon: <BsHospital />,
      priority: "high",
    },
    {
      id: 10,
      category: "preventive",
      title: "Monitor Your Health",
      description:
        "Keep track of your vital signs and health metrics regularly to catch potential issues early.",
      icon: <VscGraph />,
      priority: "high",
    },
    {
      id: 11,
      category: "nutrition",
      title: "Reduce Processed Foods",
      description:
        "Limit intake of processed foods high in sugar, salt, and unhealthy fats.",
      icon: <FaBan className="text-red-500 text-4xl" />,
      priority: "medium",
    },
    {
      id: 12,
      category: "exercise",
      title: "Take Walking Breaks",
      description:
        "Stand up and walk for 5 minutes every hour if you have a sedentary job.",
      icon: <FaRunning className="text-green-500 text-4xl" />,
      priority: "medium",
    },
  ];

  const filteredTips =
    selectedCategory === "all"
      ? tips
      : tips.filter((tip) => tip.category === selectedCategory);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
              Clinical Health Guidelines
            </h1>
            <p className="text-gray-600 text-sm">
              Evidence-based recommendations for optimal wellness
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border-t-4 border-teal-500">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Health Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? "border-teal-500 bg-teal-50 shadow-md"
                    : "border-gray-200 hover:border-teal-300"
                }`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-semibold text-gray-800 text-sm">
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-teal-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{tip.icon}</div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getPriorityColor(
                    tip.priority
                  )}`}
                >
                  {tip.priority}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {tip.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{tip.description}</p>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-8 bg-teal-400 text-white rounded-xl border-2 border-teal-600 shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">
            Personalized Clinical Recommendations
          </h2>
          <p className="mb-6 text-teal-50">
            Upload your medical reports to receive AI-powered health
            recommendations tailored to your specific clinical parameters and
            health metrics.
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="bg-white text-teal-600 px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Upload Medical Report
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <p className="text-sm text-gray-700 text-center">
            <strong>⚠️ Medical Disclaimer:</strong> These guidelines are for
            informational purposes only and do not constitute medical advice,
            diagnosis, or treatment. Always consult qualified healthcare
            professionals before making changes to your health regimen or
            treatment plan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthTips;
