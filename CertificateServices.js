import { jsPDF } from "jspdf";

class CertificateServices {
  // Generates a simple landscape certificate PDF and triggers a browser download.
  download({ studentName, courseName, percent, completedAt }) {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Border
    doc.setDrawColor(11, 92, 254);
    doc.setLineWidth(4);
    doc.rect(24, 24, pageWidth - 48, pageHeight - 48);
    doc.setLineWidth(1);
    doc.rect(34, 34, pageWidth - 68, pageHeight - 68);

    doc.setTextColor(11, 92, 254);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("LEARNINGGAINTS", pageWidth / 2, 90, { align: "center" });

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(30);
    doc.text("Certificate of Completion", pageWidth / 2, 140, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("This certifies that", pageWidth / 2, 190, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(11, 92, 254);
    doc.text(studentName || "Student", pageWidth / 2, 230, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text("has successfully completed the course", pageWidth / 2, 265, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(courseName || "Course", pageWidth / 2, 300, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(90, 90, 90);
    const dateStr = completedAt ? new Date(completedAt).toLocaleDateString() : new Date().toLocaleDateString();
    doc.text(`Final Score: ${percent ?? "—"}%   •   Date: ${dateStr}`, pageWidth / 2, 335, { align: "center" });

    doc.save(`Certificate - ${courseName || "Course"}.pdf`);
  }
}

export default new CertificateServices();
