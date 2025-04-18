import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { Education, Skill, Experience } from "@/types";

const ApplicantProfile = () => {
  const { id } = useParams<{ id: string }>();

  const [getEducation, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [getBasicInfo, setBasicInfo] = useState({
    fullName: "",
    email: "",
    profilePhoto: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/user/profile-applicant/${id}`);
      const { education, skill, experience, user } = res.data;

      setEducation(education || []);
      setSkills(skill || []);
      setExperiences(experience || []);
      setBasicInfo({
        fullName: user.fullname,
        email: user.email,
        profilePhoto: user.profilePhoto,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Applicant Profile</h1>

      {/* Basic Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your personal information visible to recruiters</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                {getBasicInfo.profilePhoto ? (
                  <AvatarImage
                    className="object-cover w-full h-full"
                    src={`http://localhost:4000/uploads/${getBasicInfo.profilePhoto}`}
                    alt={getBasicInfo.fullName}
                  />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {getBasicInfo.fullName
                      ? getBasicInfo.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-xl font-medium">{getBasicInfo.fullName || "Your Name"}</h3>
                <p className="text-muted-foreground">{getBasicInfo.email}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="mb-8">
      <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : getEducation.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No education added yet. Add your academic background to enhance your profile.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {getEducation.map((edu, index) => (
                <div key={edu._id || index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{edu.institution}</h3>
                      <p>
                        {edu.degree} in {edu.fieldOfStudy}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(edu.startDate).toLocaleDateString()} -{" "}
                        {new Date(edu.endDate).toLocaleDateString()}
                      </p>
                      {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="mb-8">
      <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          ) : skills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No skills added yet. Add your strengths to your profile.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 items-center">
              {skills.map((skill) => (
                <div
                  key={skill._id}
                  className="bg-primary/10 rounded-full px-4 py-1.5 flex items-center"
                >
                  <span className="text-sm font-medium">{skill.name}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="mb-8">
      <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : experiences.length === 0 ? (
            <p className="text-sm text-gray-500">No experiences added yet.</p>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp._id}
                  className="border p-4 rounded-lg shadow-sm flex justify-between items-start"
                >
                  <div>
                    <h3 className="text-lg font-medium">{exp.position}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exp.company} — {exp.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {exp.startDate.slice(0, 10)} –{" "}
                      {exp.current ? "Present" : exp.endDate?.slice(0, 10)}
                    </p>
                    {exp.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ApplicantProfile;
