import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import MainLayout from "@/components/layout/MainLayout";

import { useAuth } from "@/contexts/AuthContext";

import Education from "@/components/EducationComponent";
import Skill from "@/components/SkillComponent";
import Experience from "@/components/ExperienceComponent";
import BasicInformation from "@/components/BasicInformationComponent";

const ApplicantProfile = () => {
  

  const { applicant } = useData();

  if (!applicant) {
    return (
      <MainLayout>
        <div className="text-center py-12">Loading profile...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Applicant Profile
      </h1>

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
