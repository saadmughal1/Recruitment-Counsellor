import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { useAuth } from "@/contexts/AuthContext";
import Education from "@/components/EducationComponent";

const ApplicantProfile = () => {
  const { user } = useAuth();

  const {
    applicant,

    addSkill,
    updateSkill,
    deleteSkill,
    addExperience,
    updateExperience,
    deleteExperience,
    addLanguage,
    updateLanguage,
    deleteLanguage,
  } = useData();

  const [isEditingBasic, setIsEditingBasic] = useState(false);

  const [basicInfo, setBasicInfo] = useState({
    fullName: user?.fullname || "",
    email: user?.email || "",
    profilePhoto: user?.profilePhoto || "",
  });

  // Form states for adding/editing items

  const [skillForm, setSkillForm] = useState({
    id: "",
    name: "",
    level: "Intermediate",
  });

  const [experienceForm, setExperienceForm] = useState({
    id: "",
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const [languageForm, setLanguageForm] = useState({
    id: "",
    name: "",
    proficiency: "Conversational",
  });

  // Dialog control states

  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);

  // Basic Info handlers
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

  // Skill handlers
  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillForm({
      ...skillForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillLevelChange = (value: string) => {
    setSkillForm({
      ...skillForm,
      level: value as "Beginner" | "Intermediate" | "Advanced" | "Expert",
    });
  };

  const handleSkillSubmit = () => {
    if (skillForm.id) {
      updateSkill(skillForm);
    } else {
      // Remove the id field before adding
      const { id, ...rest } = skillForm;
      addSkill(rest);
    }
    setSkillDialogOpen(false);
    resetSkillForm();
  };

  const editSkill = (skill: any) => {
    setSkillForm(skill);
    setSkillDialogOpen(true);
  };

  const resetSkillForm = () => {
    setSkillForm({
      id: "",
      name: "",
      level: "Intermediate",
    });
  };

  // Experience handlers
  const handleExperienceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setExperienceForm({
      ...experienceForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleExperienceCurrentChange = (checked: boolean) => {
    setExperienceForm({
      ...experienceForm,
      current: checked,
      endDate: checked ? "" : experienceForm.endDate,
    });
  };

  const handleExperienceSubmit = () => {
    if (experienceForm.id) {
      updateExperience(experienceForm);
    } else {
      // Remove the id field before adding
      const { id, ...rest } = experienceForm;
      addExperience(rest);
    }
    setExperienceDialogOpen(false);
    resetExperienceForm();
  };

  const editExperience = (experience: any) => {
    setExperienceForm(experience);
    setExperienceDialogOpen(true);
  };

  const resetExperienceForm = () => {
    setExperienceForm({
      id: "",
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
  };

  // Language handlers
  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLanguageForm({
      ...languageForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLanguageProficiencyChange = (value: string) => {
    setLanguageForm({
      ...languageForm,
      proficiency: value as "Basic" | "Conversational" | "Fluent" | "Native",
    });
  };

  const handleLanguageSubmit = () => {
    if (languageForm.id) {
      updateLanguage(languageForm);
    } else {
      // Remove the id field before adding
      const { id, ...rest } = languageForm;
      addLanguage(rest);
    }
    setLanguageDialogOpen(false);
    resetLanguageForm();
  };

  const editLanguage = (language: any) => {
    setLanguageForm(language);
    setLanguageDialogOpen(true);
  };

  const resetLanguageForm = () => {
    setLanguageForm({
      id: "",
      name: "",
      proficiency: "Conversational",
    });
  };

  // console.log(basicInfo);

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
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Skills</CardTitle>
            <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Skill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {skillForm.id ? "Edit Skill" : "Add Skill"}
                  </DialogTitle>
                  <DialogDescription>
                    Add technical or soft skills that you possess
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="skillName">Skill Name</Label>
                    <Input
                      id="skillName"
                      name="name"
                      value={skillForm.name}
                      onChange={handleSkillChange}
                      placeholder="JavaScript, Project Management, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="skillLevel">Proficiency Level</Label>
                    <Select
                      value={skillForm.level}
                      onValueChange={handleSkillLevelChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select proficiency level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSkillDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSkillSubmit}>
                    {skillForm.id ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            Technical and soft skills that you possess
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applicant.skills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No skills added yet. Add skills to help match you with relevant
                job opportunities.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {applicant.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-secondary/10 rounded-full px-3 py-1.5 flex items-center"
                >
                  <span className="mr-2">{skill.name}</span>
                  <Badge variant="secondary">{skill.level}</Badge>
                  <div className="flex ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0"
                      onClick={() => editSkill(skill)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0 text-destructive"
                      onClick={() => deleteSkill(skill.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Experience</CardTitle>
            <Dialog
              open={experienceDialogOpen}
              onOpenChange={setExperienceDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Experience
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {experienceForm.id ? "Edit Experience" : "Add Experience"}
                  </DialogTitle>
                  <DialogDescription>
                    Add your work experience and professional background
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={experienceForm.company}
                      onChange={handleExperienceChange}
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        name="position"
                        value={experienceForm.position}
                        onChange={handleExperienceChange}
                        placeholder="Job Title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={experienceForm.location}
                        onChange={handleExperienceChange}
                        placeholder="City, Country or Remote"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="current"
                      checked={experienceForm.current}
                      onCheckedChange={handleExperienceCurrentChange}
                    />
                    <label
                      htmlFor="current"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Currently working here
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={experienceForm.startDate}
                        onChange={handleExperienceChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={experienceForm.endDate}
                        onChange={handleExperienceChange}
                        disabled={experienceForm.current}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={experienceForm.description}
                      onChange={handleExperienceChange}
                      placeholder="Describe your responsibilities and achievements"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setExperienceDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleExperienceSubmit}>
                    {experienceForm.id ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            Your work history and professional experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applicant.experience.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No experience added yet. Add your work history to showcase your
                professional background.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {applicant.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{exp.position}</h3>
                      <p>
                        {exp.company} • {exp.location}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(exp.startDate).toLocaleDateString()} -{" "}
                        {exp.current
                          ? "Present"
                          : new Date(exp.endDate!).toLocaleDateString()}
                      </p>
                      {exp.description && (
                        <p className="text-sm mt-2">{exp.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editExperience(exp)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteExperience(exp.id)}
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

      {/* Languages */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Languages</CardTitle>
            <Dialog
              open={languageDialogOpen}
              onOpenChange={setLanguageDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Language
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {languageForm.id ? "Edit Language" : "Add Language"}
                  </DialogTitle>
                  <DialogDescription>
                    Add languages you can communicate in
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="languageName">Language</Label>
                    <Input
                      id="languageName"
                      name="name"
                      value={languageForm.name}
                      onChange={handleLanguageChange}
                      placeholder="English, Spanish, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="proficiency">Proficiency Level</Label>
                    <Select
                      value={languageForm.proficiency}
                      onValueChange={handleLanguageProficiencyChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select proficiency level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Conversational">
                          Conversational
                        </SelectItem>
                        <SelectItem value="Fluent">Fluent</SelectItem>
                        <SelectItem value="Native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setLanguageDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleLanguageSubmit}>
                    {languageForm.id ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>Languages you can communicate in</CardDescription>
        </CardHeader>
        <CardContent>
          {applicant.languages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No languages added yet. Add languages to showcase your
                communication skills.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {applicant.languages.map((lang) => (
                <div
                  key={lang.id}
                  className="bg-primary/10 rounded-full px-3 py-1.5 flex items-center"
                >
                  <span className="mr-2">{lang.name}</span>
                  <Badge variant="outline">{lang.proficiency}</Badge>
                  <div className="flex ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0"
                      onClick={() => editLanguage(lang)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0 text-destructive"
                      onClick={() => deleteLanguage(lang.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
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
