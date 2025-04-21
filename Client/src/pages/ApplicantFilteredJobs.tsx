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

const ApplicantFilteredJobs = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { toast } = useToast();

  const [getJobs, setJob] = useState([]);

  useEffect(() => {
    loadJob();
  }, []);

  const loadJob = async () => {
    const tok = localStorage.getItem("user");
    const token = JSON.parse(tok || "{}")?.token;

    try {
      const res = await axios.get(
        `http://www.localhost:4000/api/applicantjob/filtered-jobs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res)
      setJob(res.data?.data || []);
    } catch (error) {
      console.error("Job loading error", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
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

  if (!getJobs) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p>Job not found or loading...</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/applicant-jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="outline" className="mb-4" asChild>
          <Link to="/applicant-jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>

        {getJobs.length === 0 ? (
          <div className="text-center py-6">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No matching jobs available</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {getJobs.map((job) => (
              <Card key={job._id} className="shadow-lg border rounded-md p-4">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="font-medium text-xl">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {getPostedDate(job.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {job.experienceRequired}+ years
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
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
                          <p className="text-sm text-muted-foreground">
                            Posted On
                          </p>
                          <p className="font-medium">
                            {getPostedDate(job.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Job Description
                      </h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {job.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skillsRequired.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end space-x-2 items-center">
                  <Button asChild>
                    <Link
                      to={`/company-profile/${job.recruiter}`}
                      className="text-white"
                    >
                      Company Profile
                    </Link>
                  </Button>

                  <Button asChild>
                    <Link
                      to={`/start-chat/${job.recruiter}`}
                      className="text-white"
                    >
                      Message
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ApplicantFilteredJobs;
