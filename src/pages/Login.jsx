import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "../componants/FloatingInput";
import { useState } from "react";
import { toast } from "react-toastify";
import { login } from "../services/api";
import { FaHospital, FaLock } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const response = await login(formData);

      // Store token
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response) {
        localStorage.setItem("userData", JSON.stringify(response));
      }

      toast.success("Login successful! Welcome back! ");

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      toast.error(
        err.message || "Failed to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-b from-teal-50 to-white p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border-2 border-teal-100">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-[#7faaca] rounded-lg flex items-center justify-center text-white shadow-md">
              <FaHospital className="text-3xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#156669] mb-2">
            Patient Login
          </h2>
          <p className="text-gray-600 text-sm">
            Access your medical reports securely
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FloatingInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FloatingInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#7faaca] text-white p-4 rounded-lg font-bold text-lg hover:bg-[#7faaca] transition-all shadow-md hover:shadow-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="relative">
                  <div className=" h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                </div>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="#" className="text-[#7faaca] text-sm hover:underline">
            Forgot password?
          </a>
        </div>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#7faaca] font-bold hover:underline"
          >
            Register Now
          </Link>
        </p>
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <FaLock className="text-[#7faaca]" /> Secure login with 256-bit
            encryption
          </p>
        </div>
      </div>
    </div>
  );
}
