import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase, MapPin, Building, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { JobPost } from "@/types";
import axios from "axios";

const JobListing = () => {
  const { user } = useAuth();
  const [jobsToShow, setJobsToShow] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchJobs();
  }, []);

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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-10 text-muted-foreground">
          Loading jobs...
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center py-10 text-red-500">{error}</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {jobsToShow.length == 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {user?.userType === "applicant"
                ? "We couldn't find any jobs matching your profile. Update your skills to find better matches."
                : "You haven't posted any jobs yet. Create your first job posting to attract candidates."}
            </p>
            <Button asChild variant="outline">
              <Link
                to={user?.userType === "applicant" ? "/profile" : "/jobs/new"}
              >
                {user?.userType === "applicant"
                  ? "Update Your Skills"
                  : "Post Your First Job"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {jobsToShow.map((job) => (
            <Link to={`/jobs/${job._id}`} key={job._id}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12 mt-1">
                        <AvatarFallback>
                          {job.companyName?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-xl mb-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm mb-2">
                          <Building className="h-4 w-4 mr-1" />
                          <span>{job.companyName}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.skillsRequired
                            .slice(0, 4)
                            .map((skill, index) => (
                              <Badge key={index} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          {job.skillsRequired.length > 4 && (
                            <Badge variant="outline">
                              +{job.skillsRequired.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge className="mb-2">
                        {job.experienceRequired > 1
                          ? job.experienceRequired + " Years"
                          : job.experienceRequired + " Year"}
                      </Badge>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {getPostedDate(job.createdAt)}
                      </div>
                      <Badge
                        variant={job.isActive ? "default" : "outline"}
                        className="mt-2"
                      >
                        {job.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default JobListing;
