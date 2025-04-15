
import { useState } from "react";
import { Notification } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Check, X, MessageSquare } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface NotificationCardProps {
  notification: Notification;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const { markNotificationAsRead, deleteNotification, updateConnectionStatus } = useData();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    deleteNotification(notification.id);
  };

  const handleMarkAsRead = () => {
    markNotificationAsRead(notification.id);
  };

  const handleAcceptConnection = () => {
    if (notification.relatedId) {
      updateConnectionStatus(notification.relatedId, 'accepted');
      markNotificationAsRead(notification.id);
    }
  };

  const handleRejectConnection = () => {
    if (notification.relatedId) {
      updateConnectionStatus(notification.relatedId, 'rejected');
      markNotificationAsRead(notification.id);
    }
  };

  const handleOpenChat = () => {
    if (notification.relatedId) {
      navigate(`/connections/${notification.relatedId}`);
      markNotificationAsRead(notification.id);
    }
  };

  const getTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <Card className={`mb-4 ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{notification.title}</CardTitle>
          <div className="flex space-x-1">
            {!notification.read && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAsRead} 
                className="h-8 w-8 p-0"
                title="Mark as read"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDelete} 
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="Delete notification"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {getTimeAgo(notification.createdAt)}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{notification.message}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {notification.type === 'connection' && notification.message.includes('wants to connect') && (
            <>
              <Button variant="default" size="sm" onClick={handleAcceptConnection}>
                <Check className="mr-1 h-4 w-4" /> Accept
              </Button>
              <Button variant="outline" size="sm" onClick={handleRejectConnection}>
                <X className="mr-1 h-4 w-4" /> Decline
              </Button>
            </>
          )}
          
          {notification.type === 'message' && (
            <Button variant="outline" size="sm" onClick={handleOpenChat}>
              <MessageSquare className="mr-1 h-4 w-4" /> Open Chat
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
