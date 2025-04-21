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

const ApplicantJob = () => {
  const { toast } = useToast();

  const [getLoadJobs, setLoadJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const tok = localStorage.getItem("user");
    const token = JSON.parse(tok || "{}")?.token;

    try {
      const jobs = await axios.get(
        `http://www.localhost:4000/api/applicantjob/load-jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(jobs)
      setLoadJobs(jobs.data?.data);
    } catch (error) {
      console.error("Job loading error", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Your Job Posts</CardTitle>
              <CardDescription>
                Manage and monitor your job listings
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {getLoadJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't posted any jobs yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getLoadJobs.map((job) => (
                  <Link
                    key={job._id}
                    to={`/applicant-filtered-jobs/${job._id}`}
                  >
                    <div className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{job.title}</h3>
                          <p className="text-muted-foreground">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <Badge>{`${job.experienceRequired}+ years`}</Badge>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ApplicantJob;
