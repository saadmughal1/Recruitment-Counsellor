import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

import { JobPost } from "@/types";
import { useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { applicant, recruiter } = useData();

  const [jobsToShow, setJobsToShow] = useState<JobPost[]>([]);
  const [isEducation, setEducation] = useState(false);
  const [isSkill, setSkill] = useState(false);
  const [isExperience, setExperience] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [matchingJobs, setMatchingJobs] = useState<any[]>([]);

  const unreadNotifications = [].length;

  const activeConnections = [].length;

  useEffect(() => {
    loadEducation();
    loadExperiences();
    loadSkills();
    fetchJobs();

    loadMatchingJobs();
  }, []);

  const loadEducation = async () => {
    const tok = localStorage.getItem("user");
    const token = JSON.parse(tok)?.token;

    try {
      const res = await axios.get("http://localhost:4000/api/education/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.data.length > 0) {
        setEducation(true);
      }
    } catch (error) {
      console.error("education fetch error: ", error);
    }
  };

  const loadExperiences = async () => {
    const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

    try {
      const res = await axios.get("http://localhost:4000/api/experience/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.data.length > 0) {
        setExperience(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadSkills = async () => {
    const tok = localStorage.getItem("user");
    const token = JSON.parse(tok)?.token;
    // console.log("skill tok:" + token);

    try {
      const res = await axios.get("http://localhost:4000/api/skill/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.data.length > 0) {
        setSkill(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchJobs = async () => {
    try {
      const tok = localStorage.getItem("user");
      const token = JSON.parse(tok || "{}")?.token;

      const response = await axios.get(
        "http://localhost:4000/api/job/getMyPostedJobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobsToShow(response.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Unable to fetch jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderApplicantDashboard = () => {
    return (
      <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.fullname}
          </p>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Profile Completion</CardTitle>
              <CardDescription>
                Complete your profile to improve matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applicant && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Basic Info</span>
                    <Badge variant={applicant.fullName ? "default" : "outline"}>
                      {applicant.fullName ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Education</span>
                    <Badge variant={isEducation ? "default" : "outline"}>
                      {isEducation ? "Added" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Skills</span>
                    <Badge variant={isSkill ? "default" : "outline"}>
                      {isSkill ? "Added" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience</span>
                    <Badge variant={isExperience ? "default" : "outline"}>
                      {isExperience ? "Added" : "Missing"}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Matching Job Opportunities</CardTitle>
              <CardDescription>
                Based on your skills and experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              {matchingJobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No matching jobs found. Update your skills to improve
                    matching.
                  </p>
                  <Button asChild>
                    <Link to="/profile">Add Skills</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchingJobs.slice(0, 3).map((job) => (
                    <div
                      key={job._id}
                      className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{job.title}</h3>
                          <p className="text-muted-foreground">
                            {job.companyName}
                          </p>
                        </div>
                        <div>
                          <Badge>{`${job.experienceRequired}+ years`}</Badge>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.skillsRequired.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                        {job.skillsRequired.length > 3 && (
                          <Badge variant="outline">
                            +{job.skillsRequired.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Details button to view job */}
                      <div className="mt-4 flex justify-end gap-4">
                        <Button asChild>
                          <Link to={`/jobs/${job._id}`} className="text-white">
                            Details
                          </Link>
                        </Button>

                        <Button>
                          <Link
                            to={`/start-chat/${job.recruiter}`}
                            className="text-white"
                          >
                            Message
                          </Link>
                        </Button>

                        <Button asChild>
                          <Link
                            to={`/company-profile/${job.recruiter}`}
                            className="text-white"
                          >
                            Company Profile
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {matchingJobs.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" asChild>
                        <Link to="/jobs">
                          View All {matchingJobs.length} Jobs
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  const renderRecruiterDashboard = () => {
    return (
      <>
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Your Job Posts</CardTitle>
                <CardDescription>
                  Manage and monitor your job listings
                </CardDescription>
              </div>
              <Button asChild>
                <Link to="/jobs/new">Post New Job</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {jobsToShow.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    You haven't posted any jobs yet.
                  </p>
                  <Button asChild>
                    <Link to="/jobs/new">Create Your First Job Post</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobsToShow.slice(0, 3).map((job) => (
                    <Link key={job._id} to={`/jobs/${job._id}`}>
                      <div className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{job.title}</h3>
                            <p className="text-muted-foreground">
                              {job.isActive ? "Active" : "Inactive"} • Posted{" "}
                              {new Date(job.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <Badge>{`${job.experienceRequired}+ years`}</Badge>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {job.skillsRequired
                            .slice(0, 3)
                            .map((skill, index) => (
                              <Badge key={index} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          {job.skillsRequired.length > 3 && (
                            <Badge variant="outline">
                              +{job.skillsRequired.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {jobsToShow.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" asChild>
                        <Link to="/jobs">
                          View All {jobsToShow.length} Jobs
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  const loadMatchingJobs = async () => {
    const tok = localStorage.getItem("user");
    const token = JSON.parse(tok || "{}")?.token;

    try {
      const getMatchingJobs = await axios.get(
        `http://www.localhost:4000/api/job/matchedJobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(getMatchingJobs.data?.data);
      // setMatchingJobs(getMatchingJobs.data?.data || []);
    
      setMatchingJobs(
        (getMatchingJobs.data?.data || []).filter((job) => job.isActive)
      );
    } catch (error) {
      console.error("Job loading error", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  // console.log(matchingJobs);

  return (
    <MainLayout>
      {user?.userType === "applicant"
        ? renderApplicantDashboard()
        : renderRecruiterDashboard()}
    </MainLayout>
  );
};

export default Dashboard;
