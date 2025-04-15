
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building, UserCircle, MessageSquare, School, Code, Clock, Globe } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { applicant, recruiter, connections, notifications, jobPosts, getMatchingJobPosts } = useData();
  
  const unreadNotifications = notifications.filter(
    (notif) => notif.userId === user?.id && !notif.read
  ).length;
  
  const activeConnections = connections.filter(
    (conn) =>
      (user?.userType === "applicant" && conn.applicantId === user?.id && conn.status === "accepted") ||
      (user?.userType === "recruiter" && conn.recruiterId === user?.id && conn.status === "accepted")
  ).length;
  
  const renderApplicantDashboard = () => {
    const matchingJobs = applicant ? getMatchingJobPosts(applicant.id) : [];
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Profile Completion</CardTitle>
              <CardDescription>Complete your profile to improve matching</CardDescription>
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
                    <Badge variant={applicant.education.length > 0 ? "default" : "outline"}>
                      {applicant.education.length > 0 ? "Added" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Skills</span>
                    <Badge variant={applicant.skills.length > 0 ? "default" : "outline"}>
                      {applicant.skills.length > 0 ? "Added" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience</span>
                    <Badge variant={applicant.experience.length > 0 ? "default" : "outline"}>
                      {applicant.experience.length > 0 ? "Added" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Languages</span>
                    <Badge variant={applicant.languages.length > 0 ? "default" : "outline"}>
                      {applicant.languages.length > 0 ? "Added" : "Missing"}
                    </Badge>
                  </div>
                </div>
              )}
              <Button className="w-full mt-4" asChild>
                <Link to="/profile">Update Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Matching Jobs</CardTitle>
              <CardDescription>Jobs that match your skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-semibold text-2xl">{matchingJobs.length}</div>
                <p className="text-muted-foreground">matching job opportunities</p>
              </div>
              <Button className="w-full mt-4" asChild>
                <Link to="/jobs">View Jobs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Connections</CardTitle>
              <CardDescription>Network with recruiters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-semibold text-2xl">{activeConnections}</div>
                <p className="text-muted-foreground">active connections</p>
                <div className="font-semibold text-md mt-2">{unreadNotifications} unread notifications</div>
              </div>
              <Button className="w-full mt-4" asChild>
                <Link to="/connections">Manage Connections</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Matching Job Opportunities</CardTitle>
              <CardDescription>Based on your skills and experience</CardDescription>
            </CardHeader>
            <CardContent>
              {matchingJobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No matching jobs found. Update your skills to improve matching.
                  </p>
                  <Button asChild>
                    <Link to="/profile">Add Skills</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchingJobs.slice(0, 3).map((job) => (
                    <Link key={job.id} to={`/jobs/${job.id}`}>
                      <div className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{job.title}</h3>
                            <p className="text-muted-foreground">{job.companyName}</p>
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
                            <Badge variant="outline">+{job.skillsRequired.length - 3}</Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {matchingJobs.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" asChild>
                        <Link to="/jobs">View All {matchingJobs.length} Jobs</Link>
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
    const postedJobs = jobPosts.filter(job => job.recruiterId === user?.id);
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Company Profile</CardTitle>
              <CardDescription>Manage your company details</CardDescription>
            </CardHeader>
            <CardContent>
              {recruiter && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Company Name</span>
                    <Badge variant={recruiter.companyName ? "default" : "outline"}>
                      {recruiter.companyName ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Company Info</span>
                    <Badge variant={recruiter.companyInfo ? "default" : "outline"}>
                      {recruiter.companyInfo ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Recruiter Name</span>
                    <Badge variant={recruiter.recruiterName ? "default" : "outline"}>
                      {recruiter.recruiterName ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>
                </div>
              )}
              <Button className="w-full mt-4" asChild>
                <Link to="/profile">Update Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Job Posts</CardTitle>
              <CardDescription>Manage your job listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-semibold text-2xl">{postedJobs.length}</div>
                <p className="text-muted-foreground">active job posts</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button asChild>
                  <Link to="/jobs/new">Post Job</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/jobs">View All Jobs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Connections</CardTitle>
              <CardDescription>Network with applicants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-semibold text-2xl">{activeConnections}</div>
                <p className="text-muted-foreground">active connections</p>
                <div className="font-semibold text-md mt-2">{unreadNotifications} unread notifications</div>
              </div>
              <Button className="w-full mt-4" asChild>
                <Link to="/connections">Manage Connections</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Your Job Posts</CardTitle>
                <CardDescription>Manage and monitor your job listings</CardDescription>
              </div>
              <Button asChild>
                <Link to="/jobs/new">Post New Job</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {postedJobs.length === 0 ? (
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
                  {postedJobs.slice(0, 3).map((job) => (
                    <Link key={job.id} to={`/jobs/${job.id}`}>
                      <div className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{job.title}</h3>
                            <p className="text-muted-foreground">
                              {job.isActive ? "Active" : "Inactive"} • Posted{" "}
                              {new Date(job.postedDate).toLocaleDateString()}
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
                            <Badge variant="outline">+{job.skillsRequired.length - 3}</Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {postedJobs.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" asChild>
                        <Link to="/jobs">View All {postedJobs.length} Jobs</Link>
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

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.userType === "applicant" ? applicant?.fullName || "Applicant" : recruiter?.companyName || "Recruiter"}!
        </p>
      </div>
      
      {user?.userType === "applicant" ? renderApplicantDashboard() : renderRecruiterDashboard()}
    </MainLayout>
  );
};

export default Dashboard;
