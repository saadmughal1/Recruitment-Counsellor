import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Notifications = () => {
  const { user } = useAuth();

  // Dummy data for testing
  const dummyNotifications = [
    {
      id: "1",
      userId: user?.id,
      title: "Application Received",
      message: "Your job application for Frontend Developer was received.",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      userId: user?.id,
      title: "Interview Scheduled",
      message: "Your interview for Backend Developer is scheduled on Monday.",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      userId: user?.id,
      title: "Application Update",
      message: "Your application status for UI/UX Designer has been updated.",
      read: true,
      createdAt: new Date().toISOString(),
    },
  ];

  // Filter for this user
  const userNotifications = dummyNotifications.filter(
    (n) => n.userId === user?.id
  );
  const unreadNotifications = userNotifications.filter((n) => !n.read);
  const readNotifications = userNotifications.filter((n) => n.read);

  const handleMarkAllAsRead = () => {
    // Just for preview: in real app, call markNotificationAsRead for each unread notification
    console.log("Mark all as read clicked");
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
        <TabsContent value="unread">
          {unreadNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No unread notifications
              </h3>
              <p className="text-muted-foreground">
                You're all caught up! Check the "All" tab to see your
                notification history.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {unreadNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all">
          <div className="space-y-4">
            {userNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Notifications;
