
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Notifications = () => {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead } = useData();
  
  // Filter notifications for current user
  const userNotifications = notifications.filter(notif => notif.userId === user?.id);
  
  // Separate unread and read notifications
  const unreadNotifications = userNotifications.filter(notif => !notif.read);
  const readNotifications = userNotifications.filter(notif => notif.read);
  
  const handleMarkAllAsRead = () => {
    unreadNotifications.forEach(notif => {
      markNotificationAsRead(notif.id);
    });
  };
  
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        
        {unreadNotifications.length > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="unread" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="unread">
            Unread {unreadNotifications.length > 0 && `(${unreadNotifications.length})`}
          </TabsTrigger>
          <TabsTrigger value="all">
            All {userNotifications.length > 0 && `(${userNotifications.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="unread">
          {unreadNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No unread notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! Check the "All" tab to see your notification history.
              </p>
            </div>
          ) : (
            <div>
              {unreadNotifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all">
          {userNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
              <p className="text-muted-foreground">
                Notifications about connections, messages, and job matches will appear here.
              </p>
            </div>
          ) : (
            <div>
              {userNotifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Notifications;
