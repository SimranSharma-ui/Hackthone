import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import Header from "./componants/Header";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import UploadReport from "./pages/UploadReport";
import ReportDetails from "./pages/ReportDetails";
import TrendsAnalysis from "./pages/TrendsAnalysis";
import CompareReports from "./pages/CompareReports";
import HealthTips from "./pages/HealthTips";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadReport />} />
          <Route path="/report/:id" element={<ReportDetails />} />
          <Route path="/report/:reportId/compare" element={<CompareReports />} />
          <Route path="/trends" element={<TrendsAnalysis />} />
          <Route path="/health-tips" element={<HealthTips />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </>
  );
}

export default App;
