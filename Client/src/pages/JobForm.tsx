import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import axios from "axios";

const JobForm = () => {
  // const { createJobPost, recruiter } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const tok = localStorage.getItem("user");
  const token = JSON.parse(tok)?.token;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    skillsRequired: "",
    experienceRequired: 1,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

    // Validate form data
    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.skillsRequired
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Parse skills from comma-separated string to array
    const skills = formData.skillsRequired
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

      // console.log(skills)

    await axios.post(
      "http://localhost:4000/api/job/add",
      {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        skillsRequired: skills,
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

    navigate("/jobs");
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Post a New Job</h1>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Create a new job posting to find qualified candidates
          </CardDescription>
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
                placeholder="e.g., Frontend Developer, Project Manager"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., New York, NY or Remote"
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

            <div>
              <Label htmlFor="description">
                Job Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the job responsibilities, requirements, company culture, etc."
                rows={8}
                required
              />
            </div>

            <div>
              <Label htmlFor="skillsRequired">
                Required Skills <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="skillsRequired"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleInputChange}
                placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                rows={3}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                List skills separated by commas, e.g., "JavaScript, React,
                Communication"
              </p>
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
    </MainLayout>
  );
};

export default JobForm;
