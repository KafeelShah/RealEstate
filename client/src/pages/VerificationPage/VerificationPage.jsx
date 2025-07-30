import React from 'react';
import { useLocation } from 'react-router-dom';
import './VerificationPage.css';

const VerificationPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dataParam = searchParams.get('data');
  
  let certificateData = null;
  try {
    certificateData = JSON.parse(decodeURIComponent(dataParam));
  } catch (e) {
    console.error('Invalid verification data', e);
  }

  if (!certificateData) {
    return (
      <div className="verification-container">
        <div className="verification-error">
          <h2>Invalid Certificate</h2>
          <p>The QR code could not be verified. Please ensure you scanned the correct code.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <h2>Plot Allotment Verification</h2>
          <div className="verification-id">
            <span>Certificate ID:</span>
            <strong>{certificateData.cnic}-{certificateData.plotNo}</strong>
          </div>
        </div>

        <div className="verification-section">
          <h3>Allottee Details</h3>
          <div className="verification-grid">
            <div className="verification-row">
              <span className="verification-label">Full Name:</span>
              <span className="verification-value">{certificateData.fullName || "Not specified"}</span>
            </div>
            <div className="verification-row">
              <span className="verification-label">Father's Name:</span>
              <span className="verification-value">{certificateData.fatherName || "Not specified"}</span>
            </div>
            <div className="verification-row">
              <span className="verification-label">CNIC:</span>
              <span className="verification-value">{certificateData.cnic || "Not specified"}</span>
            </div>
            <div className="verification-row">
              <span className="verification-label">Phone:</span>
              <span className="verification-value">{certificateData.phone || "Not specified"}</span>
            </div>
            <div className="verification-row">
              <span className="verification-label">Address:</span>
              <span className="verification-value">{certificateData.address || "Not specified"}</span>
            </div>
          </div>
        </div>

        <div className="verification-section">
          <h3>Plot Details</h3>
          <div className="verification-grid">
            <div className="verification-row">
              <span className="verification-label">Project Name:</span>
              <span className="verification-value">{certificateData.projectName || "Not specified"}</span>
            </div>
            <div className="verification-row">
              <span className="verification-label">Plot No:</span>
              <span className="verification-value">{certificateData.plotNo || "Not specified"}</span>
            </div>
            <div className="verification-row">
              <span className="verification-label">Plot Size:</span>
              <span className="verification-value">{certificateData.plotSize || "Not specified"}</span>
            </div>
            <div className="verification-row">
              <span className="verification-label">Issue Date:</span>
              <span className="verification-value">{formatDate(certificateData.issueDate)}</span>
            </div>
          </div>
        </div>

        <div className="verification-footer">
          <div className="verification-meta">
            <p><strong>Verified on:</strong> {new Date().toLocaleDateString()}</p>
          </div>
          <div className="verification-authenticity">
            <div className="authenticity-badge">✓ Verified</div>
            <p>This is an authentic certificate issued by Estate Arena</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;