import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ReportPDF = {
  generatePDF: async (dashboardData, reportForm) => {
    // Create a temporary container for the PDF content
    const pdfContainer = document.createElement("div");
    pdfContainer.style.position = "absolute";
    pdfContainer.style.left = "-9999px";
    pdfContainer.style.width = "800px";
    pdfContainer.style.padding = "20px";
    pdfContainer.style.backgroundColor = "white";
    pdfContainer.style.fontFamily = "Arial, sans-serif";

    // Get current date
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Add content to the container
    pdfContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #E5E7EB; padding-bottom: 20px;">
        <h1 style="color: #1F2937; font-size: 28px; margin-bottom: 10px; font-weight: bold;">${
          reportForm.title
        }</h1>
        <p style="color: #4B5563; font-size: 16px; margin-bottom: 5px;">${
          reportForm.description
        }</p>
        <p style="color: #6B7280; font-size: 14px;">Report Type: ${
          reportForm.type
        } | Generated on: ${currentDate}</p>
      </div>
      
      <!-- Institutional Overview -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1F2937; font-size: 22px; margin-bottom: 15px; border-bottom: 1px solid #E5E7EB; padding-bottom: 10px;">Institutional Overview</h2>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
          <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="color: #4B5563; margin: 0 0 5px 0; font-size: 14px;">Total Students</p>
            <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 24px;">${
              dashboardData.students
            }</p>
          </div>
          <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="color: #4B5563; margin: 0 0 5px 0; font-size: 14px;">Total Faculties</p>
            <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 24px;">${
              dashboardData.faculties
            }</p>
          </div>
        </div>
      </div>
      
      <!-- Academic Performance -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1F2937; font-size: 22px; margin-bottom: 15px; border-bottom: 1px solid #E5E7EB; padding-bottom: 10px;">Academic Performance</h2>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="color: #4B5563; margin: 0 0 5px 0; font-size: 14px;">Average Attendance</p>
            <p style="color: #10B981; margin: 0; font-weight: bold; font-size: 24px;">${
              dashboardData.academics.avgAttendance
            }%</p>
          </div>
          <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="color: #4B5563; margin: 0 0 5px 0; font-size: 14px;">Average CGPA</p>
            <p style="color: #3B82F6; margin: 0; font-weight: bold; font-size: 24px;">${
              dashboardData.academics.avgCGPA
            }</p>
          </div>
        </div>
      </div>
      
      <!-- Activity Summary -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1F2937; font-size: 22px; margin-bottom: 15px; border-bottom: 1px solid #E5E7EB; padding-bottom: 10px;">Activity Summary</h2>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
          <div style="background-color: #ECFDF5; padding: 15px; border-radius: 6px; text-align: center;">
            <p style="color: #047857; margin: 0 0 5px 0; font-size: 14px;">Total Activities</p>
            <p style="color: #1F2937; margin: 0; font-weight: bold; font-size: 20px;">${
              dashboardData.activities.total
            }</p>
          </div>
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
      
      <!-- Detailed Statistics -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1F2937; font-size: 22px; margin-bottom: 15px; border-bottom: 1px solid #E5E7EB; padding-bottom: 10px;">Detailed Statistics</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Activity Status -->
          <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px;">
            <h3 style="color: #374151; font-size: 16px; margin-bottom: 10px;">Activity Status Distribution</h3>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px; background-color: #F9FAFB; border-radius: 4px;">
                <span style="color: #4B5563;">Approved:</span>
                <span style="font-weight: bold; color: #10B981;">${
                  dashboardData.activities.approved
                } (${(
      (dashboardData.activities.approved / dashboardData.activities.total) *
      100
    ).toFixed(1)}%)</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px; background-color: #F9FAFB; border-radius: 4px;">
                <span style="color: #4B5563;">Pending:</span>
                <span style="font-weight: bold; color: #F59E0B;">${
                  dashboardData.activities.pending
                } (${(
      (dashboardData.activities.pending / dashboardData.activities.total) *
      100
    ).toFixed(1)}%)</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px; background-color: #F9FAFB; border-radius: 4px;">
                <span style="color: #4B5563;">Rejected:</span>
                <span style="font-weight: bold; color: #EF4444;">${
                  dashboardData.activities.rejected
                } (${(
      (dashboardData.activities.rejected / dashboardData.activities.total) *
      100
    ).toFixed(1)}%)</span>
              </div>
            </div>
          </div>
          
          <!-- User Distribution -->
          <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px;">
            <h3 style="color: #374151; font-size: 16px; margin-bottom: 10px;">User Distribution</h3>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px; background-color: #F9FAFB; border-radius: 4px;">
                <span style="color: #4B5563;">Students:</span>
                <span style="font-weight: bold; color: #3B82F6;">${
                  dashboardData.students
                }</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px; background-color: #F9FAFB; border-radius: 4px;">
                <span style="color: #4B5563;">Faculties:</span>
                <span style="font-weight: bold; color: #8B5CF6;">${
                  dashboardData.faculties
                }</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px; background-color: #F9FAFB; border-radius: 4px;">
                <span style="color: #4B5563;">Student:Faculty Ratio:</span>
                <span style="font-weight: bold; color: #1F2937;">${(
                  dashboardData.students / dashboardData.faculties
                ).toFixed(1)}:1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; color: #6B7280; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
        <p>This report was automatically generated by the Institutional Management System</p>
        <p>© ${new Date().getFullYear()} - All rights reserved</p>
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

export default ReportPDF;
