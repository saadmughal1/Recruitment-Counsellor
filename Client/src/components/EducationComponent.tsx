import React, { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { Education } from "e:/Programming/Recruitment Counsellor/Client/src/types/index";

import axios from "axios";

function EducationComponent() {
  const tok = localStorage.getItem("user");
  const token = JSON.parse(tok)?.token;

  const { toast } = useToast();
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);

  const [getEducation, setEducation] = useState<Education[]>([]);

  // Education handlers
  const handleEducationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEducationForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEducationSubmit = async () => {
    const { institution, degree, fieldOfStudy, startDate, endDate } =
      educationForm;

    if (
      !institution.trim() ||
      !degree.trim() ||
      !fieldOfStudy.trim() ||
      !startDate.trim() ||
      !endDate.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });

      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/education/add",
        educationForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadEducation();
      toast({ title: "Education added", description: "Added successfully" });
    } catch (error) {
      console.error("Add error", error);
    }

    setEducationDialogOpen(false);
    resetEducationForm();
  };

  const resetEducationForm = () => {
    setEducationForm({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const editEducation = (education: Education) => {
    // setEducationForm(education);
    // setEducationDialogOpen(true);
  };

  const [educationForm, setEducationForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    try {
      const education = await axios.get(
        "http://localhost:4000/api/education/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEducation(education?.data?.data || []);
    } catch (error) {
      console.error("education fetch error: ", error);
    }
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Education</CardTitle>
            <Dialog
              open={educationDialogOpen}
              onOpenChange={setEducationDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Education
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {educationForm ? "Edit Education" : "Add Education"}
                  </DialogTitle>
                  <DialogDescription>
                    Add your academic qualifications and educational background
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={educationForm.institution}
                      onChange={handleEducationChange}
                      placeholder="University or School Name"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="degree">Degree</Label>
                      <Input
                        id="degree"
                        name="degree"
                        value={educationForm.degree}
                        onChange={handleEducationChange}
                        placeholder="Bachelor's, Master's, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="fieldOfStudy">Field of Study</Label>
                      <Input
                        id="fieldOfStudy"
                        name="fieldOfStudy"
                        value={educationForm.fieldOfStudy}
                        onChange={handleEducationChange}
                        placeholder="Computer Science, Business, etc."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={educationForm.startDate}
                        onChange={handleEducationChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={educationForm.endDate}
                        onChange={handleEducationChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={educationForm.description}
                      onChange={handleEducationChange}
                      placeholder="Additional information about your studies"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setEducationDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleEducationSubmit}>
                    {educationForm ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            Your academic background and qualifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {getEducation.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No education added yet. Add your academic background to enhance
                your profile.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {getEducation.map((edu, index) => (
                <div
                  key={edu.id || index}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
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
                      {edu.description && (
                        <p className="text-sm mt-2">{edu.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editEducation(edu)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default EducationComponent;
