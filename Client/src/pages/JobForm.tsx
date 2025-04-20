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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function JobForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const tok = localStorage.getItem("user");
  const token = JSON.parse(tok)?.token;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    experienceRequired: 1,
  });

  const [skills, setSkills] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [getInputSkills, setInputSkills] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:4000/api/skill/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(res?.data?.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load skills.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadInputSkills = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/inputskills/get-input-skills");
      setInputSkills(res?.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load input skills.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
    loadInputSkills();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSkillSelect = (value: string) => {
    if (!selectedSkills.includes(value)) {
      setSelectedSkills((prev) => [...prev, value]);
    }
  };

  const handleDeleteSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      selectedSkills.length === 0
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    const skills = selectedSkills;

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
    <div>
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
              <Label htmlFor="title">Job Title <span className="text-destructive">*</span></Label>
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
              <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Remote"
                required
              />
            </div>

            <div>
              <Label htmlFor="experienceRequired">
                Required Experience (years) <span className="text-destructive">*</span>
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
              <Label htmlFor="description">Job Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the job"
                rows={6}
                required
              />
            </div>

            <div>
              <Label htmlFor="skills">Required Skills <span className="text-destructive">*</span></Label>
              <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Skills</DialogTitle>
                    <DialogDescription>Choose skills from the list</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Select onValueChange={handleSkillSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {getInputSkills.map((skill) => (
                          <SelectItem key={skill._id} value={skill.name}>
                            {skill.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center"
                        >
                          {skill}
                          <button
                            type="button"
                            className="ml-2"
                            onClick={() => handleDeleteSkill(skill)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>Done</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
  );
}

export default JobForm;
