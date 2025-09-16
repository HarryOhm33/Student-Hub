// PortfolioPDF.jsx
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PortfolioPDF = {
  generatePDF: async (dashboardData) => {
    // Create a temporary container for the PDF content
    const pdfContainer = document.createElement("div");
    pdfContainer.style.position = "absolute";
    pdfContainer.style.left = "-9999px";
    pdfContainer.style.width = "800px";
    pdfContainer.style.padding = "20px";
    pdfContainer.style.backgroundColor = "white";
    pdfContainer.style.fontFamily = "Arial, sans-serif";

    // Add content to the container
    pdfContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #1F2937; font-size: 24px; margin-bottom: 5px;">Student Portfolio</h1>
        <p style="color: #4B5563; font-size: 16px;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      <!-- Student Information -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
        <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px;">
          <p style="color: #4B5563; margin: 0 0 5px 0; font-size: 14px;">Name</p>
          <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 16px;">${
            dashboardData.student.name
          }</p>
        </div>
        <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px;">
          <p style="color: #4B5563; margin: 0 0 5px 0; font-size: 14px;">Department</p>
          <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 16px;">${
            dashboardData.student.department
          }</p>
        </div>
        <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px;">
          <p style="color: #4B5563; margin: 0 0 5px 0; font-size: 14px;">Registration No.</p>
          <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 16px;">${
            dashboardData.student.regNumber
          }</p>
        </div>
        <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px;">
          <p style="color: #4B5563; margin: 0 0 5px 0; font-size: 14px;">Email</p>
          <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 16px;">${
            dashboardData.student.email
          }</p>
        </div>
      </div>
      
      <!-- Academic Performance -->
      <div style="border: 1px solid #E5E7EB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Academic Performance</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div style="background-color: #F9FAFB; padding: 15px; border-radius: 6px;">
            <p style="color: #4B5563; margin: 0 0 5px 0; font-size: 14px;">CGPA</p>
            <p style="color: #10B981; margin: 0; font-weight: bold; font-size: 24px;">${
              dashboardData.academics.cgpa
            }</p>
          </div>
          <div style="background-color: #F9FAFB; padding: 15px; border-radius: 6px;">
            <p style="color: #4B5563; margin: 0 0 5px 0; font-size: 14px;">Attendance</p>
            <p style="color: #10B981; margin: 0; font-weight: bold; font-size: 24px;">${
              dashboardData.academics.attendance.percentage
            }%</p>
          </div>
          <div style="background-color: #F9FAFB; padding: 15px; border-radius: 6px; text-align: center;">
            <p style="color: #4B5563; margin: 0 0 5px 0; font-size: 14px;">Classes Held</p>
            <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 18px;">${
              dashboardData.academics.attendance.totalHeld
            }</p>
          </div>
          <div style="background-color: #F9FAFB; padding: 15px; border-radius: 6px; text-align: center;">
            <p style="color: #4B5563; margin: 0 0 5px 0; font-size: 14px;">Classes Attended</p>
            <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 18px;">${
              dashboardData.academics.attendance.totalAttended
            }</p>
          </div>
        </div>
      </div>
      
      <!-- Activity Summary -->
      <div style="border: 1px solid #E5E7EB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Activity Summary</h2>
        
        <!-- Activity Status -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; font-size: 16px; margin-bottom: 10px;">Activity Status</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            <div style="background-color: #ECFDF5; padding: 15px; border-radius: 6px; text-align: center;">
              <p style="color: #047857; margin: 0 0 5px 0; font-size: 14px;">Approved</p>
              <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 20px;">${
                dashboardData.activities.approved
              }</p>
            </div>
            <div style="background-color: #FFFBEB; padding: 15px; border-radius: 6px; text-align: center;">
              <p style="color: #B45309; margin: 0 0 5px 0; font-size: 14px;">Pending</p>
              <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 20px;">${
                dashboardData.activities.pending
              }</p>
            </div>
            <div style="background-color: #FEF2F2; padding: 15px; border-radius: 6px; text-align: center;">
              <p style="color: #B91C1C; margin: 0 0 5px 0; font-size: 14px;">Rejected</p>
              <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 20px;">${
                dashboardData.activities.rejected
              }</p>
            </div>
          </div>
        </div>
        
        <!-- Activity Types -->
        <div>
          <h3 style="color: #374151; font-size: 16px; margin-bottom: 10px;">Activity Types</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            <div style="background-color: #EFF6FF; padding: 15px; border-radius: 6px; text-align: center;">
              <p style="color: #1E40AF; margin: 0 0 5px 0; font-size: 14px;">Curricular</p>
              <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 20px;">${
                dashboardData.activities.breakdown.curricular
              }</p>
            </div>
            <div style="background-color: #F5F3FF; padding: 15px; border-radius: 6px; text-align: center;">
              <p style="color: #5B21B6; margin: 0 0 5px 0; font-size: 14px;">Co-Curricular</p>
              <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 20px;">${
                dashboardData.activities.breakdown.coCurricular
              }</p>
            </div>
            <div style="background-color: #ECFDF5; padding: 15px; border-radius: 6px; text-align: center;">
              <p style="color: #047857; margin: 0 0 5px 0; font-size: 14px;">Extra-Curricular</p>
              <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 20px;">${
                dashboardData.activities.breakdown.extraCurricular
              }</p>
            </div>
          </div>
        </div>
        
        <!-- Total Activities -->
        <div style="background-color: #F9FAFB; padding: 15px; border-radius: 6px; text-align: center; margin-top: 20px;">
          <p style="color: #4B5563; margin: 0 0 5px 0; font-size: 14px;">Total Activities</p>
          <p style="color: #10B981; margin: 0; font-weight: bold; font-size: 24px;">${
            dashboardData.activities.total
          }</p>
        </div>
      </div>
      
      <!-- Charts Section -->
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Performance Charts</h2>
        
        <!-- Chart Data Representation -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <!-- Attendance Chart Data -->
          <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px;">
            <h3 style="color: #374151; font-size: 16px; margin-bottom: 10px;">Attendance Distribution</h3>
            <div>
              ${dashboardData.charts.attendanceTrend
                .map(
                  (item) => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #4B5563;">${item.label}:</span>
                  <span style="font-weight: bold;">${item.value}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
          
          <!-- Activity Status Data -->
          <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px;">
            <h3 style="color: #374151; font-size: 16px; margin-bottom: 10px;">Activity Status</h3>
            <div>
              ${dashboardData.charts.activityStatus
                .map(
                  (item) => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #4B5563;">${item.label}:</span>
                  <span style="font-weight: bold;">${item.value}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
          
          <!-- Activity Types Data -->
          <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px;">
            <h3 style="color: #374151; font-size: 16px; margin-bottom: 10px;">Activity Types</h3>
            <div>
              ${dashboardData.charts.activityTypes
                .map(
                  (item) => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #4B5563;">${item.label}:</span>
                  <span style="font-weight: bold;">${item.value}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; color: #6B7280; font-size: 12px; margin-top: 30px; padding-top: 15px; border-top: 1px solid #E5E7EB;">
        <p>This portfolio was automatically generated by the Student Activity Tracking System</p>
      </div>
    `;

    // Append the container to the body
    document.body.appendChild(pdfContainer);

    try {
      // Convert the container to canvas
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Remove the temporary container
      document.body.removeChild(pdfContainer);

      // Create PDF
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(
        imgData,
        "JPEG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      // Return the PDF as a blob
      return pdf.output("blob");
    } catch (error) {
      console.error("Error generating PDF:", error);
      document.body.removeChild(pdfContainer);
      throw error;
    }
  },
};

export default PortfolioPDF;
