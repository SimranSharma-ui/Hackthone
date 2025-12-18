// API service for medical report analysis

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Authentication APIs
export const signUp = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create account');
  }

  return response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to login');
  }

  return response.json();
};

export const uploadReport = async (file, reportType, reportDate) => {
  const formData = new FormData();
  formData.append('report', file);
  formData.append('report_type', reportType);
  if (reportDate) {
    formData.append('report_date', reportDate);
  }

  const response = await fetch(`${API_BASE_URL}/reports/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload report');
  }

  return response.json();
};

export const getReportDetails = async (reportId) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch report details');
  }

  return response.json();
};

export const getAllReports = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.report_type) queryParams.append('report_type', params.report_type);

  const response = await fetch(`${API_BASE_URL}/reports?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }

  return response.json();
};

export const compareWithPrevious = async (reportId) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/compare`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to compare reports');
  }

  return response.json();
};


export const compareReports = compareWithPrevious;

export const getHealthTrends = async (metricName, months = 6) => {
  const response = await fetch(`${API_BASE_URL}/reports/trends?metric_name=${metricName}&months=${months}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch health trends');
  }

  return response.json();
};

export const deleteReport = async (reportId) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete report');
  }

  return response.json();
};

export const getReportTypes = async () => {
  const response = await fetch(`${API_BASE_URL}/reports/types`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch report types');
  }

  return response.json();
};

export const SignUp = async () => {

}
