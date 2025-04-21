import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

function ApplicantJobForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const tok = localStorage.getItem("user");
  const token = JSON.parse(tok)?.token;

  const [formData, setFormData] = useState({
    title: "",
    experienceRequired: 1,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      experienceRequired: parseInt(e.target.value) || 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      formData.experienceRequired === null ||
      formData.experienceRequired <= 0 ||
      isNaN(formData.experienceRequired)
    ) {
      toast({
        title: "Missing or Invalid Information",
        description:
          "Please enter a job title and a valid experience (greater than 0).",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/api/applicantjob/add-applicant-job",
        {
          title: formData.title.trim(),
          experienceRequired: formData.experienceRequired,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Job Posted",
        description: "Your job has been successfully posted.",
      });

      navigate("/applicant-jobs");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while posting the job.",
        variant: "destructive",
      });
      console.error("Error posting job:", error);
    }
  };

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Find a New Job
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">
                  Job Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Frontend Developer"
                  required
                />
              </div>

              <div>
                <Label htmlFor="experienceRequired">
                  Required Experience (years){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="experienceRequired"
                  name="experienceRequired"
                  type="number"
                  min="0"
                  value={formData.experienceRequired}
                  onChange={handleExperienceChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/jobs")}>
                Cancel
              </Button>
              <Button type="submit">Post Job</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}

export default ApplicantJobForm;
