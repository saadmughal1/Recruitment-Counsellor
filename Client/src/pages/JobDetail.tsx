import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  MapPin,
  Building,
  Calendar,
  Clock,
  Award,
  Edit,
  Trash,
  LinkIcon,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Users,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import axios from "axios";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const navigate = useNavigate();
  const { toast } = useToast();

  const [job, setJob] = useState<any | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  // const [getInputskills, setInputSkills] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [getInputSkills, setInputSkills] = useState<any[]>([]);

  const handleToggleActive = (checked: boolean) => {
    setEditForm({
      ...editForm,
      isActive: checked,
    });
  };

  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    location: string;
    skillsRequired: string | string[]; // Allow skillsRequired to be either a string or an array of strings
    experienceRequired: number;
    isActive: Boolean;
  }>({
    title: "",
    description: "",
    location: "",
    skillsRequired: "",
    experienceRequired: 0,
    isActive: false,
  });

  const [matchingApplicants, setMatchingApplicants] = useState<any[]>([]);

  // Initialize job data
  useEffect(() => {
    loadJob();
    loadMatchingApplicants();
    loadInputSkills();
  }, []);

  const loadJob = async () => {
    try {
      const getJob = await axios.get(
        `http://localhost:4000/api/job/getSingleJob/${id}`
      );

      setSelectedSkills(getJob.data?.data.skillsRequired);

      setEditForm({
        title: getJob.data?.data.title,
        description: getJob.data?.data.description,
        location: getJob.data?.data.location,
        skillsRequired: getJob.data?.data.skillsRequired,
        experienceRequired: getJob.data?.data.experienceRequired,
        isActive: getJob.data?.data.isActive,
      });

      setJob(getJob.data?.data || []);
    } catch (error) {
      console.error("Job loading error", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadMatchingApplicants = async () => {
    try {
      const getMatchedApplicants = await axios.get(
        `http://www.localhost:4000/api/job/matchedApplicants/${id}`
      );
      // console.log(getMatchedApplicants.data?.data);
      setMatchingApplicants(getMatchedApplicants.data?.data || []);
    } catch (error) {
      console.error("Job loading error", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      experienceRequired: parseInt(e.target.value) || 0,
    });
  };

  const handleSaveChanges = async () => {
    const { title, location, experienceRequired, description, skillsRequired } =
      editForm;

    if (
      !title.trim() ||
      !location.trim() ||
      !experienceRequired ||
      !description.trim() ||
      !skillsRequired
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    

    await axios.put(`http://localhost:4000/api/job/update/${id}`, {
      title: editForm.title,
      description: editForm.description,
      location: editForm.location,
      skillsRequired: selectedSkills,
      experienceRequired: editForm.experienceRequired,
      isActive: editForm.isActive,
    });

    toast({
      title: "Job Updated",
      description: "Your job posting has been successfully updated.",
    });
  };

  const loadInputSkills = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:4000/api/inputskills/get-input-skills"
      );
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

  function getPostedDate(dateString: string): string {
    const postedDate = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - postedDate.getTime()) / 1000); // in seconds

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;

    return postedDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (!job) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p>Job not found or loading...</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleSkillSelect = (value: string) => {
    if (!selectedSkills.includes(value)) {
      setSelectedSkills((prev) => [...prev, value]);
    }
  };

  const handleDeleteSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="outline" className="mb-4" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>

        {/* Job detail card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{job.title}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Building className="h-4 w-4 mr-1" />
                  {job.companyName}
                  <span className="mx-2">•</span>
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </CardDescription>
              </div>

              {user?.userType === "recruiter" && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Job details - non-editing view */}
            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <div className="bg-secondary/10 px-4 py-2 rounded-md flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Experience
                      </p>
                      <p className="font-medium">
                        {job.experienceRequired > 1
                          ? job.experienceRequired + " Years"
                          : job.experienceRequired + " Year"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-secondary/10 px-4 py-2 rounded-md flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Posted On</p>
                      <p className="font-medium">
                        {getPostedDate(job.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-secondary/10 px-4 py-2 rounded-md flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">
                        {job.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Job Description</h3>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {job.description}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Editing form view
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={editForm.title}
                    onChange={handleInputChange}
                    placeholder="Enter job title"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    placeholder="Enter job location (city, country or remote)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experienceRequired">
                      Required Experience (years)
                    </Label>
                    <Input
                      id="experienceRequired"
                      name="experienceRequired"
                      type="number"
                      min="0"
                      value={editForm.experienceRequired}
                      onChange={handleExperienceChange}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={editForm.isActive}
                      onCheckedChange={handleToggleActive}
                    />
                    <Label htmlFor="isActive">Active Job Posting</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editForm.description}
                    onChange={handleInputChange}
                    placeholder="Describe the job responsibilities, requirements, etc."
                    rows={8}
                  />
                </div>

                {/*  */}
                <div>
                  <Label htmlFor="skills">
                    Required Skills <span className="text-destructive">*</span>
                  </Label>
                  <Dialog
                    open={dialogOpen}
                    onOpenChange={(open) => setDialogOpen(open)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Edit Skill
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Select Skills</DialogTitle>
                        <DialogDescription>
                          Choose skills from the list
                        </DialogDescription>
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
                        <Button
                          variant="outline"
                          onClick={() => setDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => setDialogOpen(false)}>
                          Done
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* ?????????? */}

                <div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
              </div>
            )}
          </CardContent>

          {/* Tabs for recruiters to view matching applicants */}
          {user?.userType === "recruiter" && (
            <CardFooter className="flex-col border-t pt-6">
              <Tabs defaultValue="matching" className="w-full">
                <TabsList className="w-full">
                  <h3 className="text-lg font-semibold w-full py-2 text-center">
                    Matching Applicants
                  </h3>
                </TabsList>

                <TabsContent value="matching" className="pt-4">
                  {matchingApplicants.length === 0 ? (
                    <div className="text-center py-6">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">
                        No matching applicants yet
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto mt-1">
                        When applicants with matching skills register, they'll
                        appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {matchingApplicants.map((applicant) => {
                        return (
                          <Card key={applicant._id}>
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  {applicant.profilePhoto ? (
                                    <AvatarImage
                                      src={`http://localhost:4000/uploads/${applicant.profilePhoto}`}
                                      alt={applicant.fullname}
                                    />
                                  ) : (
                                    <AvatarFallback>
                                      {applicant.fullname
                                        .split(" ")
                                        .map((n: string) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .substring(0, 2)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <h4 className="font-medium text-lg">
                                    {applicant.fullname}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {applicant.email}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h5 className="font-semibold">User Skills</h5>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {applicant.userSkills.map(
                                    (skill: any, index: number) => (
                                      <Badge
                                        key={`user-${skill}-${index}`}
                                        variant="secondary"
                                      >
                                        {skill}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>

                              <div>
                                <h5 className="font-semibold">
                                  Matched Skills
                                </h5>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {applicant.matchedSkills.map(
                                    (skill: any, index: number) => (
                                      <Badge
                                        key={`matched-${skill}-${index}`}
                                        variant="default"
                                      >
                                        {skill}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>

                              <div className="text-sm mt-2">
                                <p>
                                  <strong>Total Experience:</strong>{" "}
                                  {applicant.totalExperienceYears} years
                                </p>
                              </div>

                              <div>
                                <h5 className="font-semibold mt-2">
                                  Experiences
                                </h5>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                  {applicant.experiences.map(
                                    (exp: any, index: number) => (
                                      <li key={`exp-${index}`}>
                                        {exp.company} |{" "}
                                        {formatDate(exp.startDate)} -
                                        {exp.endDate
                                          ? " " + formatDate(exp.endDate)
                                          : " Present"}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>

                              <div className="flex flex-row space-x-2 justify-end">
                                <Button
                                  onClick={() => {
                                    navigate(
                                      `/applicant-profile/${applicant._id}`
                                    );
                                  }}
                                >
                                  View Profile
                                </Button>
                                <Button
                                  onClick={() => {
                                    navigate(`/start-chat/${applicant._id}`);
                                  }}
                                >
                                  Message
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardFooter>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default JobDetail;
