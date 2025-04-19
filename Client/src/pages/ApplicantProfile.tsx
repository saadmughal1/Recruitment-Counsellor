import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import MainLayout from "@/components/layout/MainLayout";

import { useAuth } from "@/contexts/AuthContext";

import Education from "@/components/EducationComponent";
import Skill from "@/components/SkillComponent";
import Experience from "@/components/ExperienceComponent";
import BasicInformation from "@/components/BasicInformationComponent";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ApplicantProfile = () => {
  const { toast } = useToast();
  const { applicant } = useData();

  if (!applicant) {
    return (
      <MainLayout>
        <div className="text-center py-12">Loading profile...</div>
      </MainLayout>
    );
  }

  const myId = JSON.parse(localStorage.getItem("user")).id;

  const getCircularImageBase64 = (
    url: string,
    sizeInMM: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // For local/dev servers

      img.onload = () => {
        const dpi = 300; // High-quality DPI for PDF
        const mmToInch = 1 / 25.4;
        const sizeInPixels = sizeInMM * mmToInch * dpi;

        const canvas = document.createElement("canvas");
        canvas.width = sizeInPixels;
        canvas.height = sizeInPixels;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas not supported");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        // Draw circular mask
        ctx.beginPath();
        ctx.arc(
          sizeInPixels / 2,
          sizeInPixels / 2,
          sizeInPixels / 2,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();

        // Draw image inside the mask
        ctx.drawImage(img, 0, 0, sizeInPixels, sizeInPixels);

        ctx.restore();

        const base64 = canvas.toDataURL("image/png");
        resolve(base64);
      };

      img.onerror = () => reject("Image load error");
      img.src = url;
    });
  };

  const createPdfAndDownload = async (data: any) => {
    const doc = new jsPDF();

    const profileUrl =
      "http://localhost:4000/uploads/" + data.user?.profilePhoto;
    const profileImage = await getCircularImageBase64(profileUrl, 50); // 50mm = about 2in
    doc.addImage(profileImage, "PNG", 80, 10, 50, 50); // x, y, width(mm), height(mm)

    const centerX = 105;
    const centerY = 40;

    let currentY = centerY + 30;

    doc.setFontSize(16);
    doc.text(data.user.fullname, 105, currentY, { align: "center" });
    currentY += 10;

    doc.setFontSize(12);
    doc.text(data.user.email, 105, currentY, { align: "center" });
    currentY += 10;

    doc.setLineWidth(0.5);
    doc.line(10, currentY, 200, currentY);
    currentY += 10;

    // Education Section
    doc.setFontSize(14);
    doc.text("Education", 14, currentY);
    currentY += 6;

    autoTable(doc, {
      startY: currentY,
      head: [["Institution", "Degree", "Field", "Start", "End", "Description"]],
      body: data.education.map((edu: any) => [
        edu.institution,
        edu.degree,
        edu.fieldOfStudy,
        edu.startDate,
        edu.endDate,
        edu.description || "-",
      ]),
    });

    currentY = doc.lastAutoTable.finalY + 10;

    doc.line(10, currentY, 200, currentY);
    currentY += 10;

    doc.setFontSize(14);
    doc.text("Skills", 14, currentY);
    currentY += 6;

    autoTable(doc, {
      startY: currentY,
      head: [["Skill"]],
      body: data.skill.map((sk: any) => [sk.name]),
    });

    currentY = doc.lastAutoTable.finalY + 10;

    doc.line(10, currentY, 200, currentY);
    currentY += 10;

    doc.setFontSize(14);
    doc.text("Experience", 14, currentY);
    currentY += 6;

    autoTable(doc, {
      startY: currentY,
      head: [
        ["Company", "Position", "Location", "Start", "End", "Description"],
      ],
      body: data.experience.map((exp: any) => [
        exp.company,
        exp.position,
        exp.location,
        exp.startDate?.split("T")[0],
        exp.current ? "Present" : exp.endDate?.split("T")[0],
        exp.description || "-",
      ]),
    });

    doc.save(`${data.user.fullname}-CV.pdf`);
  };

  const downloadCv = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/user/profile-applicant/${myId}`
      );

      const data = res?.data;

      if ((data.education || []).length === 0) {
        toast({
          title: "Education is missing",
          variant: "destructive",
        });
        return;
      }

      if ((data.skill || []).length === 0) {
        toast({
          title: "Skill is missing",
          variant: "destructive",
        });
        return;
      }

      if ((data.experience || []).length === 0) {
        toast({
          title: "Experience is missing",
          variant: "destructive",
        });
        return;
      }

      createPdfAndDownload(data); // ✅ generate and download PDF
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Applicant Profile
        </h1>

        <Button onClick={downloadCv}>Download Cv</Button>
      </div>

      {/* Basic Information */}
      <BasicInformation />

      {/* Education */}
      <Education />

      {/* Skills */}
      <Skill />

      {/* Experience */}
      <Experience />
    </MainLayout>
  );
};

export default ApplicantProfile;
