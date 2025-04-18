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

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { connections, createConnection } = useData();

  const navigate = useNavigate();
  const { toast } = useToast();

  const [job, setJob] = useState<any | null>(null);

  const [isEditing, setIsEditing] = useState(false);

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

  const [confirmDelete, setConfirmDelete] = useState(false);

  const [matchingApplicants, setMatchingApplicants] = useState<any[]>([]);

  const [connectionStatus, setConnectionStatus] = useState<
    "none" | "pending" | "accepted" | "rejected"
  >("none");

  // Initialize job data
  useEffect(() => {
    loadJob();
    loadMatchingApplicants();
  }, []);

  const loadJob = async () => {
    try {
      const getJob = await axios.get(
        `http://localhost:4000/api/job/getSingleJob/${id}`
      );

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

    const skills =
      typeof editForm.skillsRequired === "string"
        ? editForm.skillsRequired
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0)
        : editForm.skillsRequired;

    await axios.put(`http://localhost:4000/api/job/update/${id}`, {
      title: editForm.title,
      description: editForm.description,
      location: editForm.location,
      skillsRequired: skills,
      experienceRequired: editForm.experienceRequired,
      isActive: editForm.isActive,
    });

    toast({
      title: "Job Updated",
      description: "Your job posting has been successfully updated.",
    });
  };

  // const handleDelete = () => {
  //   if (id) {
  //     deleteJobPost(id);
  //     toast({
  //       title: "Job Deleted",
  //       description: "Your job posting has been successfully deleted.",
  //     });
  //     navigate("/jobs");
  //   }
  // };

  const handleRequestConnection = () => {
    if (!user || !job) return;

    createConnection(user.id, job.recruiterId, job.id, "applicant");
    setConnectionStatus("pending");

    toast({
      title: "Connection Requested",
      description: "Your connection request has been sent to the recruiter.",
    });
  };

  const handleConnectWithApplicant = (applicantId: string) => {
    if (!user || !job) return;

    createConnection(applicantId, user.id, job.id, "recruiter");

    toast({
      title: "Connection Requested",
      description: "Your connection request has been sent to the applicant.",
    });

    // Update UI
    setMatchingApplicants(
      matchingApplicants.map((applicant) =>
        applicant.id === applicantId
          ? { ...applicant, connectionRequested: true }
          : applicant
      )
    );
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

  // Check if a connection request has already been sent to this applicant
  // const hasConnectionRequest = (applicantId: string) => {
  //   return connections.some(
  //     (conn) =>
  //       conn.applicantId === applicantId &&
  //       conn.recruiterId === user?.id &&
  //       conn.jobPostId === id
  //   );
  // };

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
          <Link to="/jobs">
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

              {user?.userType === "recruiter" &&
                job.recruiterId === user.id && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {/* <Dialog
                      open={confirmDelete}
                      onOpenChange={setConfirmDelete}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Deletion</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this job posting?
                            This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setConfirmDelete(false)}
                          >
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDelete}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog> */}
                  </div>
                )}

              {user?.userType === "applicant" &&
                connectionStatus === "none" && (
                  <Button onClick={handleRequestConnection}>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Connect with Recruiter
                  </Button>
                )}

              {user?.userType === "applicant" &&
                connectionStatus === "pending" && (
                  <Badge variant="outline" className="px-3 py-1">
                    <Clock className="h-4 w-4 mr-2" />
                    Connection Pending
                  </Badge>
                )}

              {user?.userType === "applicant" &&
                connectionStatus === "accepted" && (
                  <Badge
                    variant="outline"
                    className="px-3 py-1 border-green-500 bg-green-50 text-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Connected
                  </Badge>
                )}

              {user?.userType === "applicant" &&
                connectionStatus === "rejected" && (
                  <Badge
                    variant="outline"
                    className="px-3 py-1 border-red-500 bg-red-50 text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Connection Declined
                  </Badge>
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

                <div>
                  <Label htmlFor="skillsRequired">Required Skills</Label>
                  <Textarea
                    id="skillsRequired"
                    name="skillsRequired"
                    value={editForm.skillsRequired}
                    onChange={handleInputChange}
                    placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    List skills separated by commas, e.g., "JavaScript, React,
                    Communication"
                  </p>
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
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="matching">
                    Matching Applicants
                  </TabsTrigger>
                  <TabsTrigger value="connected">
                    Connected Applicants
                  </TabsTrigger>
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
                        // const hasRequested = hasConnectionRequest(applicant.id);

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

                              <div className="flex justify-end pt-2">
                                <Button
                                  onClick={() =>
                                    handleConnectWithApplicant(applicant._id)
                                  }
                                >
                                  Request
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>

                {/* connections tab */}
                <TabsContent value="connected" className="pt-4">
                  {connections.filter(
                    (conn) =>
                      conn.jobPostId === id &&
                      conn.recruiterId === user.id &&
                      conn.status === "accepted"
                  ).length === 0 ? (
                    <div className="text-center py-6">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">
                        No connected applicants yet
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto mt-1">
                        When applicants accept your connection requests or you
                        accept theirs, they'll appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {connections
                        .filter(
                          (conn) =>
                            conn.jobPostId === id &&
                            conn.recruiterId === user.id &&
                            conn.status === "accepted"
                        )
                        .map((connection) => {
                          const applicant = getMatchingApplicants(id).find(
                            (a) => a.id === connection.applicantId
                          );
                          if (!applicant) return null;

                          return (
                            <Card key={connection.id}>
                              <CardContent className="p-4 flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    {applicant.profilePhoto ? (
                                      <AvatarImage
                                        src={applicant.profilePhoto}
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
                                    <h4 className="font-medium">
                                      {applicant.fullname}
                                    </h4>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {applicant.skills
                                        .slice(0, 3)
                                        .map((skill: any) => (
                                          <Badge
                                            key={skill.id}
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {skill.name}
                                          </Badge>
                                        ))}
                                      {applicant.skills.length > 3 && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          +{applicant.skills.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <Button asChild>
                                  <Link to={`/connections/${connection.id}`}>
                                    Message
                                  </Link>
                                </Button>
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
