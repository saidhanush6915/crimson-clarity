import jsPDF from "jspdf";
import type { PatientRecord } from "./blood-prediction";

export function generatePdfReport(rec: PatientRecord) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(180, 35, 45);
  doc.rect(0, 0, W, 80, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Smart Blood Group Detection", 40, 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("AI-Assisted Clinical Report", 40, 58);

  // Patient
  doc.setTextColor(30);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Information", 40, 120);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const rows: [string, string][] = [
    ["Name", rec.name],
    ["Patient ID", rec.patientId],
    ["Age", String(rec.age)],
    ["Gender", rec.gender],
    ["Date", new Date(rec.createdAt).toLocaleString()],
  ];
  rows.forEach(([k, v], i) => {
    doc.setTextColor(110);
    doc.text(k, 40, 145 + i * 18);
    doc.setTextColor(30);
    doc.text(v, 160, 145 + i * 18);
  });

  // Result box
  doc.setDrawColor(230);
  doc.setFillColor(252, 246, 246);
  doc.roundedRect(40, 250, W - 80, 110, 10, 10, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(110);
  doc.text("PREDICTED BLOOD GROUP", 60, 280);
  doc.setFontSize(48);
  doc.setTextColor(180, 35, 45);
  doc.text(rec.result.bloodGroup, 60, 335);
  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.setFont("helvetica", "normal");
  doc.text(`Confidence: ${(rec.result.confidence * 100).toFixed(1)}%`, 220, 320);
  doc.text(`Anti-A: ${(rec.result.agglutination.antiA * 100).toFixed(0)}%`, 220, 335);
  doc.text(`Anti-B: ${(rec.result.agglutination.antiB * 100).toFixed(0)}%`, 220, 348);
  doc.text(`Anti-D: ${(rec.result.agglutination.antiD * 100).toFixed(0)}%`, 320, 335);

  // Image
  try {
    doc.addImage(rec.imageDataUrl, "JPEG", 40, 390, 200, 200);
  } catch {
    // ignore unsupported formats
  }
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text("Sample image analyzed by AI model", 40, 605);

  // Disclaimer
  doc.setFontSize(9);
  doc.setTextColor(140);
  doc.text(
    "Disclaimer: This AI-generated result is for assistive screening only and must be confirmed by a qualified medical professional.",
    40,
    790,
    { maxWidth: W - 80 }
  );

  doc.save(`BloodReport_${rec.patientId || rec.id}.pdf`);
}
