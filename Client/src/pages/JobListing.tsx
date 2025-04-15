
import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, MapPin, Search, Building, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { JobPost } from "@/types";

const JobListing = () => {
  const { user } = useAuth();
  const { applicant, jobPosts, getMatchingJobPosts } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<JobPost[]>([]);
  
  // For applicants, show matching jobs by default
  // For recruiters, show their own job posts
  useEffect(() => {
    if (user?.userType === "applicant" && applicant) {
      const matchingJobs = getMatchingJobPosts(applicant.id);
      setFilteredJobs(matchingJobs);
    } else if (user?.userType === "recruiter") {
      const recruiterJobs = jobPosts.filter(job => job.recruiterId === user.id);
      setFilteredJobs(recruiterJobs);
    } else {
      // Fallback to all jobs if something goes wrong
      setFilteredJobs(jobPosts);
    }
  }, [user, applicant, jobPosts, getMatchingJobPosts]);
  
  const handleSearch = () => {
    let results: JobPost[];
    
    if (searchTerm.trim() === "") {
      // Reset to default view
      if (user?.userType === "applicant" && applicant) {
        results = getMatchingJobPosts(applicant.id);
      } else if (user?.userType === "recruiter") {
        results = jobPosts.filter(job => job.recruiterId === user.id);
      } else {
        results = jobPosts;
      }
    } else {
      // Search in all jobs or just the user's subset
      const jobsToSearch = user?.userType === "recruiter" 
        ? jobPosts.filter(job => job.recruiterId === user.id) 
        : jobPosts;
        
      results = jobsToSearch.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skillsRequired.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredJobs(results);
  };
  
  // Format the posted date to "X days ago" format
  const getPostedDate = (dateString: string) => {
    const posted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };
  
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {user?.userType === "applicant" ? "Matching Jobs" : "Your Job Postings"}
        </h1>
        
        {user?.userType === "recruiter" && (
          <Button asChild>
            <Link to="/jobs/new">
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Link>
          </Button>
        )}
      </div>
      
      {/* Search bar */}
      <div className="flex mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search jobs by title, company, or skills..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} className="ml-2">
          Search
        </Button>
      </div>
      
      {/* Job listings */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {user?.userType === "applicant"
                ? "We couldn't find any jobs matching your profile or search criteria. Try adjusting your search or update your skills."
                : "You haven't posted any jobs yet. Create your first job posting to attract candidates."}
            </p>
            {user?.userType === "applicant" ? (
              <Button variant="outline" asChild>
                <Link to="/profile">Update Your Skills</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/jobs/new">Post Your First Job</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Link to={`/jobs/${job.id}`} key={job.id}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12 mt-1">
                        <AvatarFallback>
                          {job.companyName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-xl mb-1">{job.title}</h3>
                        <div className="flex items-center text-muted-foreground text-sm mb-2">
                          <Building className="h-4 w-4 mr-1" />
                          <span>{job.companyName}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.skillsRequired.slice(0, 4).map((skill, index) => (
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
                        {job.experienceRequired}+ Years
                      </Badge>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {getPostedDate(job.postedDate)}
                      </div>
                      {user?.userType === "recruiter" && job.recruiterId === user.id && (
                        <Badge variant={job.isActive ? "default" : "outline"} className="mt-2">
                          {job.isActive ? "Active" : "Inactive"}
                        </Badge>
                      )}
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
