import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import axios from "axios";

import { Education } from "@/types"; // Adjust path if needed

function EducationComponent() {
  const tok = localStorage.getItem("user");
  const token = JSON.parse(tok)?.token;

  const { toast } = useToast();
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [getEducation, setEducation] = useState<Education[]>([]);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(
    null
  );

  const [educationForm, setEducationForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleEducationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEducationForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
    setEditingEducationId(null);
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
      if (editingEducationId) {
        await axios.put(
          `http://localhost:4000/api/education/update/${editingEducationId}`,
          educationForm,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast({
          title: "Education updated",
          description: "Updated successfully",
        });
      } else {
        await axios.post(
          "http://localhost:4000/api/education/add",
          educationForm,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast({
          title: "Education added",
          description: "Added successfully",
        });
      }

      loadEducation();
      setEducationDialogOpen(false);
      resetEducationForm();
    } catch (error) {
      console.error("Education submission error", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const editEducation = (education: Education) => {
    setEducationForm({
      institution: education.institution,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy,
      startDate: education.startDate.slice(0, 10),
      endDate: education.endDate.slice(0, 10),
      description: education.description || "",
    });
    setEditingEducationId(education._id);
    setEducationDialogOpen(true);
  };

  const deleteEducation = async (id: string) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this education?"
      );
      if (!confirmed) return;

      await axios.delete(`http://localhost:4000/api/education/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Education deleted",
        description: "The record was successfully removed.",
      });

      loadEducation();
    } catch (error) {
      console.error("Delete error", error);
      toast({
        title: "Error deleting education",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  useEffect(() => {
    loadEducation();
  }, []);

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Education</CardTitle>
            <Dialog
              open={educationDialogOpen}
              onOpenChange={(open) => {
                if (!open) resetEducationForm();
                setEducationDialogOpen(open);
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingEducationId ? "Edit Education" : "Add Education"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingEducationId
                      ? "Update your educational background"
                      : "Add your academic qualifications"}
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
                    {editingEducationId ? "Update" : "Add"}
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
                  key={edu._id || index}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">
                        {edu.institution}
                      </h3>
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
                        onClick={() => deleteEducation(edu._id)}
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
