
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MessageSquare, User, Users, Briefcase, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";

const Connections = () => {
  const { user } = useAuth();
  const { 
    connections, 
    getApplicantById, 
    getRecruiterById, 
    getJobPostById,
    updateConnectionStatus
  } = useData();
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter connections based on user type
  const pendingConnections = connections.filter(conn => {
    // For applicants, show only connections where they are the applicant
    // For recruiters, show only connections where they are the recruiter
    const isUserConnection = 
      (user?.userType === "applicant" && conn.applicantId === user.id) ||
      (user?.userType === "recruiter" && conn.recruiterId === user.id);
    
    // Only show pending connections that were not initiated by the current user
    return isUserConnection && 
           conn.status === "pending" &&
           ((user?.userType === "applicant" && conn.initiatedBy === "recruiter") ||
            (user?.userType === "recruiter" && conn.initiatedBy === "applicant"));
  });
  
  const activeConnections = connections.filter(conn => {
    const isUserConnection = 
      (user?.userType === "applicant" && conn.applicantId === user.id) ||
      (user?.userType === "recruiter" && conn.recruiterId === user.id);
    
    return isUserConnection && conn.status === "accepted";
  });
  
  const sentRequests = connections.filter(conn => {
    const isUserConnection = 
      (user?.userType === "applicant" && conn.applicantId === user.id) ||
      (user?.userType === "recruiter" && conn.recruiterId === user.id);
    
    return isUserConnection && 
           conn.status === "pending" &&
           ((user?.userType === "applicant" && conn.initiatedBy === "applicant") ||
            (user?.userType === "recruiter" && conn.initiatedBy === "recruiter"));
  });
  
  // Helper to get user name and image based on user type and connection
  const getConnectionDetails = (connection: any) => {
    if (user?.userType === "applicant") {
      const recruiter = getRecruiterById(connection.recruiterId);
      const job = getJobPostById(connection.jobPostId);
      
      return {
        id: connection.id,
        name: recruiter?.companyName || "Unknown Company",
        image: recruiter?.profilePhoto,
        role: job?.title || "Unknown Position",
        initials: recruiter?.companyName
          ? recruiter.companyName.substring(0, 2).toUpperCase()
          : "??",
      };
    } else {
      const applicant = getApplicantById(connection.applicantId);
      const job = getJobPostById(connection.jobPostId);
      
      return {
        id: connection.id,
        name: applicant?.fullName || "Unknown Applicant",
        image: applicant?.profilePhoto,
        role: job?.title || "Unknown Position",
        initials: applicant?.fullName
          ? applicant.fullName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
          : "??",
      };
    }
  };
  
  const handleAcceptConnection = (connectionId: string) => {
    updateConnectionStatus(connectionId, "accepted");
  };
  
  const handleRejectConnection = (connectionId: string) => {
    updateConnectionStatus(connectionId, "rejected");
  };
  
  const getTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  const filterConnections = (connections: any[], searchTerm: string) => {
    if (!searchTerm.trim()) return connections;
    
    return connections.filter(conn => {
      const details = getConnectionDetails(conn);
      return (
        details.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        details.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };
  
  // Apply search filter to active connections
  const filteredActiveConnections = filterConnections(activeConnections, searchTerm);
  
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Connections</h1>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="active">
            Active Connections {activeConnections.length > 0 && `(${activeConnections.length})`}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Requests {pendingConnections.length > 0 && `(${pendingConnections.length})`}
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent Requests {sentRequests.length > 0 && `(${sentRequests.length})`}
          </TabsTrigger>
        </TabsList>
        
        {/* Active Connections Tab */}
        <TabsContent value="active">
          <div className="mb-4">
            <Input
              placeholder="Search connections by name or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {filteredActiveConnections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No active connections</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {searchTerm 
                    ? "No connections match your search. Try different keywords."
                    : `You don't have any active connections yet. Connections are established when ${
                        user?.userType === "applicant" 
                          ? "you or recruiters" 
                          : "you or applicants"
                      } send and accept connection requests.`}
                </p>
                {!searchTerm && (
                  <Button variant="outline" asChild>
                    <Link to={user?.userType === "applicant" ? "/jobs" : "/jobs/new"}>
                      {user?.userType === "applicant" ? "Browse Jobs" : "Post a Job"}
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActiveConnections.map((connection) => {
                const details = getConnectionDetails(connection);
                


                
                return (
                  <Card key={connection.id} className="h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-10 w-10 mr-3">
                          {details.image ? (
                            <AvatarImage src={details.image} alt={details.name} />
                          ) : (
                            <AvatarFallback>{details.initials}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-lg">{details.name}</h3>
                          <p className="text-sm text-muted-foreground">{details.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <Badge variant="outline" className="border-green-500 bg-green-50 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-2">
                          {getTimeAgo(connection.createdAt)}
                        </span>
                      </div>
                      
                      <div className="mt-auto">
                        <Button variant="default" className="w-full" asChild>
                          <Link to={`/connections/${connection.id}`}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        {/* Pending Requests Tab */}
        <TabsContent value="pending">
          {pendingConnections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  You don't have any pending connection requests requiring your action.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingConnections.map((connection) => {
                const details = getConnectionDetails(connection);
                
                return (
                  <Card key={connection.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                          <Avatar className="h-10 w-10 mr-3">
                            {details.image ? (
                              <AvatarImage src={details.image} alt={details.name} />
                            ) : (
                              <AvatarFallback>{details.initials}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-lg">{details.name}</h3>
                            <div className="flex items-center">
                              <p className="text-sm text-muted-foreground">{details.role}</p>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground">
                                {getTimeAgo(connection.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            className="border-red-500 hover:bg-red-50 text-red-700"
                            onClick={() => handleRejectConnection(connection.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                          <Button 
                            variant="default"
                            onClick={() => handleAcceptConnection(connection.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        {/* Sent Requests Tab */}
        <TabsContent value="sent">
          {sentRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No sent requests</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  You haven't sent any connection requests that are still pending.
                </p>
                <Button variant="outline" asChild>
                  <Link to={user?.userType === "applicant" ? "/jobs" : "/jobs/new"}>
                    {user?.userType === "applicant" ? "Browse Jobs" : "Post a Job"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sentRequests.map((connection) => {
                const details = getConnectionDetails(connection);
                
                return (
                  <Card key={connection.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            {details.image ? (
                              <AvatarImage src={details.image} alt={details.name} />
                            ) : (
                              <AvatarFallback>{details.initials}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-lg">{details.name}</h3>
                            <div className="flex items-center">
                              <p className="text-sm text-muted-foreground">{details.role}</p>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground">
                                {getTimeAgo(connection.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Connections;
