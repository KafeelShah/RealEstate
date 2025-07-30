import React, { useRef, useState } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import './Certificate.css';

const CertificateGenerator = () => {
  const certificateRef = useRef();
  const [showCertificate, setShowCertificate] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [certificateData, setCertificateData] = useState({
    fullName: "",
    fatherName: "",
    cnic: "",
    address: "",
    phone: "",
    projectName: "",
    plotNo: "",
    plotSize: "5 Marla",
    issueDate: new Date().toISOString().split('T')[0]
  });

  const plotSizes = ["5 Marla", "7 Marla", "10 Marla", "1 Kanal"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCertificateData(prev => ({ ...prev, [name]: value }));
  };

  const generateCertificate = () => {
    if (!certificateData.fullName || !certificateData.plotNo || !certificateData.cnic) {
      alert('Please fill in all required fields');
      return;
    }
    setShowCertificate(true);
  };

  const verificationUrl = `${window.location.origin}/verify?data=${encodeURIComponent(
    JSON.stringify(certificateData)
  )}`;

  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
    pageStyle: `
      @page { size: A4 landscape; margin: 0; }
      @media print { 
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
    `
  });

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const element = certificateRef.current;
      if (!element) {
        throw new Error('Certificate content not found');
      }

      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '210mm';
      tempContainer.style.height = '148mm';
      document.body.appendChild(tempContainer);

      // Clone the certificate and add to temp container
      const clone = element.cloneNode(true);
      tempContainer.appendChild(clone);

      const dataUrl = await toPng(clone, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#fffdfa',
        cacheBust: true
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Calculate dimensions
      const imgWidth = 297; // A4 width in mm
      const imgHeight = (element.offsetHeight * imgWidth) / element.offsetWidth;

      // Add image to PDF
      pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save PDF
      const fileName = `Plot_Allotment_${certificateData.fullName.replace(/\s+/g, '_')}_${certificateData.plotNo}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('PDF generation failed:', error);
      alert(`PDF download failed: ${error.message}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="app-container">
      {!showCertificate ? (
        <div className="form-container">
          <h2>Plot Allotment Form</h2>
          
          <div className="form-section">
            <h3>Allottee Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="fullName" value={certificateData.fullName} 
                  onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Father's Name *</label>
                <input type="text" name="fatherName" value={certificateData.fatherName} 
                  onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>CNIC *</label>
                <input type="text" name="cnic" value={certificateData.cnic} 
                  onChange={handleInputChange} required placeholder="XXXXX-XXXXXXX-X" />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" name="phone" value={certificateData.phone} 
                  onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input type="text" name="address" value={certificateData.address} 
                onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-section">
            <h3>Plot Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Project Name *</label>
                <input type="text" name="projectName" value={certificateData.projectName} 
                  onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Plot No *</label>
                <input type="text" name="plotNo" value={certificateData.plotNo} 
                  onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Plot Size *</label>
                <select name="plotSize" value={certificateData.plotSize} 
                  onChange={handleInputChange} required>
                  {plotSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Issue Date</label>
                <input type="date" name="issueDate" value={certificateData.issueDate} 
                  onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <button className="generate-btn" onClick={generateCertificate}>
            Generate Certificate
          </button>
        </div>
      ) : (
        <div className="certificate-view">
          <div className="certificate" ref={certificateRef}>
            <div className="certificate-border">
              <div className="certificate-header">
                <div className="estate-logo">Estate Arena</div>
                <h1>CERTIFICATE OF ALLOTMENT</h1>
                <div className="certificate-divider"></div>
              </div>

              <div className="certificate-body">
                <p>This is to certify that Plot No. <strong>{certificateData.plotNo}</strong></p>
                <p>in <strong>{certificateData.projectName}</strong></p>
                <h3>has been officially allotted to</h3>
                <h2>{certificateData.fullName}</h2>
                <p>S/D/W of {certificateData.fatherName}</p>
                
                <div className="qr-code-container">
                  <QRCode 
                    value={verificationUrl}
                    size={100}
                    level="H"
                    includeMargin={true}
                  />
                  <p className="scan-text">Scan to verify details</p>
                </div>
              </div>

              <div className="certificate-footer">
                <div className="signature">
                  <div className="signature-line"></div>
                  <p>Authorized Signatory</p>
                  <p>Estate Arena</p>
                </div>
                <div className="certificate-id">
                  <p>Ref: {certificateData.cnic}-{certificateData.plotNo}</p>
                  <p>{new Date(certificateData.issueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="actions no-print">
            <button onClick={handlePrint}>Print Certificate</button>
            <button 
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? 'Generating PDF...' : 'Download as PDF'}
            </button>
            <button onClick={() => setShowCertificate(false)}>Edit Information</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateGenerator;