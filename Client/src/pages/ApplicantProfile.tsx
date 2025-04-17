import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/contexts/AuthContext";

import Education from "@/components/EducationComponent";
import Skill from "@/components/SkillComponent";
import Experience from "@/components/ExperienceComponent";

import { Label } from "@/components/ui/label";
import { Pencil, Save } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

const ApplicantProfile = () => {
  const { user } = useAuth();

  const { applicant } = useData();

  const [isEditingBasic, setIsEditingBasic] = useState(false);

  const [basicInfo, setBasicInfo] = useState({
    fullName: user?.fullname || "",
    email: user?.email || "",
    profilePhoto: user?.profilePhoto || "",
  });

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBasicInfo({
      ...basicInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleBasicInfoSubmit = () => {
    // updateApplicant(basicInfo);
    // setIsEditingBasic(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // console.log(file);

    setBasicInfo({
      ...basicInfo,
      profilePhoto: file,
    });
  };

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
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Basic Information</CardTitle>
            {/* {!isEditingBasic && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingBasic(true)}
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </Button>
            )} */}
          </div>
          <CardDescription>
            Your personal information visible to recruiters
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditingBasic ? (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={basicInfo.fullName}
                    onChange={handleBasicInfoChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    required
                    id="email"
                    name="email"
                    value={basicInfo.email}
                    onChange={handleBasicInfoChange}
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="profilePhoto">Profile Photo </Label>
                <Input
                  required
                  id="profile-photo"
                  name="profilePhoto"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingBasic(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleBasicInfoSubmit}>
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                {basicInfo.profilePhoto ? (
                  <AvatarImage
                    className="object-cover w-full h-full"
                    src={`http://localhost:4000/uploads/${basicInfo.profilePhoto}`}
                    alt={basicInfo.fullName}
                  />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {basicInfo.fullName
                      ? basicInfo.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-xl font-medium">
                  {basicInfo.fullName || "Your Name"}
                </h3>
                <p className="text-muted-foreground">{basicInfo.email}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
