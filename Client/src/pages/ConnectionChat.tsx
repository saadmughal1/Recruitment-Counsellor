
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow, format } from "date-fns";
import { ArrowLeft, Send } from "lucide-react";

const ConnectionChat = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { 
    getConnectionById, 
    getApplicantById, 
    getRecruiterById,
    getJobPostById,
    messages,
    sendMessage,
    markMessageAsRead
  } = useData();
  
  const [messageText, setMessageText] = useState("");
  const [connectionDetails, setConnectionDetails] = useState<any>(null);
  const [connectionMessages, setConnectionMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load connection data and messages
  useEffect(() => {
    if (id) {
      const connection = getConnectionById(id);
      
      if (connection && connection.status === "accepted") {
        const job = getJobPostById(connection.jobPostId);
        const applicant = getApplicantById(connection.applicantId);
        const recruiter = getRecruiterById(connection.recruiterId);
        
        // Set the other party based on current user
        const otherParty = user?.userType === "applicant" ? recruiter : applicant;
        const otherPartyId = user?.userType === "applicant" ? connection.recruiterId : connection.applicantId;
        
        setConnectionDetails({
          connection,
          job,
          otherParty,
          otherPartyId,
          otherPartyName: user?.userType === "applicant" ? recruiter?.companyName : applicant?.fullName,
          otherPartyImage: user?.userType === "applicant" ? recruiter?.profilePhoto : applicant?.profilePhoto,
          initials: user?.userType === "applicant" 
            ? (recruiter?.companyName?.substring(0, 2).toUpperCase() || "??") 
            : (applicant?.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2) || "??")
        });
        
        // Filter messages for this connection
        const relevantMessages = messages.filter(msg => msg.connectionId === id);
        
        // Mark unread messages as read
        relevantMessages.forEach(msg => {
          if (msg.recipientId === user?.id && !msg.read) {
            markMessageAsRead(msg.id);
          }
        });
        
        setConnectionMessages(relevantMessages);
      }
    }
  }, [id, user, getConnectionById, getApplicantById, getRecruiterById, getJobPostById, messages, markMessageAsRead]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [connectionMessages]);
  
  const handleSendMessage = () => {
    if (messageText.trim() && connectionDetails) {
      sendMessage(id!, connectionDetails.otherPartyId, messageText);
      setMessageText("");
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatMessageTime = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, "h:mm a");
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(messageDate, "h:mm a")}`;
    } else {
      return format(messageDate, "MMM d, h:mm a");
    }
  };
  
  if (!connectionDetails) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p>Connection not found or loading...</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/connections">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Connections
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Button variant="outline" className="mb-4" asChild>
        <Link to="/connections">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Connections
        </Link>
      </Button>
      
      <Card className="h-[75vh] flex flex-col">
        <CardHeader className="border-b px-6 py-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              {connectionDetails.otherPartyImage ? (
                <AvatarImage 
                  src={connectionDetails.otherPartyImage} 
                  alt={connectionDetails.otherPartyName} 
                />
              ) : (
                <AvatarFallback>{connectionDetails.initials}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle>{connectionDetails.otherPartyName}</CardTitle>
              <CardDescription>
                {connectionDetails.job?.title || "Regarding job position"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow overflow-y-auto p-6">
          {connectionMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="mb-4">
                <Avatar className="h-16 w-16 mx-auto">
                  {connectionDetails.otherPartyImage ? (
                    <AvatarImage 
                      src={connectionDetails.otherPartyImage} 
                      alt={connectionDetails.otherPartyName} 
                    />
                  ) : (
                    <AvatarFallback className="text-xl">{connectionDetails.initials}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              <h3 className="text-lg font-medium mb-2">Start a conversation with {connectionDetails.otherPartyName}</h3>
              <p className="text-muted-foreground max-w-md">
                You can now communicate directly about the job opportunity. Send a message to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {connectionMessages.map((message) => {
                const isSentByMe = message.senderId === user?.id;
                
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        isSentByMe 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <div className="break-words">{message.content}</div>
                      <div 
                        className={`text-xs mt-1 ${
                          isSentByMe ? "text-primary-foreground/80" : "text-secondary-foreground/80"
                        }`}
                      >
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t p-4">
          <div className="flex space-x-2 w-full">
            <Input
              className="flex-grow"
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </CardFooter>
      </Card>
    </MainLayout>
  );
};

export default ConnectionChat;
