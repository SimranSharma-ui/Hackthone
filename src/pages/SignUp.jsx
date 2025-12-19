import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "../componants/FloatingInput";
import { useState } from "react";
import { toast } from "react-toastify";
import { signUp } from "../services/api";
import { FaHospital, FaLock } from "react-icons/fa";

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    mobile: "",
    gender: "",
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

    // Validation
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password ||
      !formData.mobile ||
      !formData.gender
    ) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    try {
      setLoading(true);
      const response = await signUp(formData);
      console.log("SignUp response:", response);
      // Store token if provided
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response) {
        localStorage.setItem("userData", JSON.stringify(response));
      }

      toast.success("Account created successfully! Welcome aboard! ");

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      toast.error(err.message || "Failed to create account. Please try again.");
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
            Patient Registration
          </h2>
          <p className="text-gray-600 text-sm">
            Create your secure medical report account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <FloatingInput
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <FloatingInput
            label="Email"
            type="email"
            value={formData.email}
            name="email"
            onChange={handleChange}
            required
          />

          <FloatingInput
            label="Mobile Number"
            type="tel"
            value={formData.mobile}
            name="mobile"
            onChange={handleChange}
            placeholder="10 digit mobile number"
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#7faaca] mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <FloatingInput
            label="Password"
            type="password"
            value={formData.password}
            name="password"
            onChange={handleChange}
            required
          />

          <div className="flex items-start gap-2 mt-2">
            <input type="checkbox" id="terms" className="mt-1" required />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

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
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#7faaca] font-bold hover:underline">
            Sign In
          </Link>
        </p>
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <FaLock className="text-[#7faaca]" /> Your data is encrypted and
            HIPAA compliant
          </p>
        </div>
      </div>
    </div>
  );
}
