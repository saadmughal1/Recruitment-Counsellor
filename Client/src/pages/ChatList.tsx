import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

const ChatList = () => {
  const [getChatList, setChatList] = useState([]);

  useEffect(() => {
    loadChat();
  }, []);

  const loadChat = async () => {
    const tok = localStorage.getItem("user");
    const token = JSON.parse(tok)?.token;

    try {
      const res = await axios.get(
        "http://localhost:4000/api/message/all-chats-list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data?.data)
      setChatList(res.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Chat List</h1>

      {/* If there are no chats */}
      {getChatList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">No chats available</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              You don't have any chats yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Map through chats */}
          {getChatList.map((chat, index) => {
            return (
              <Card key={index + 1}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      {chat.profilePhoto ? (
                        <AvatarImage
                          src={`http://localhost:4000/uploads/${chat.profilePhoto}`}
                          alt={chat.fullname}
                        />
                      ) : (
                        <AvatarFallback></AvatarFallback>
                      )}
                    </Avatar>
                    <h3 className="font-medium text-lg">{chat.fullname}</h3>
                  </div>

                  <div>
                    <Button variant="default" className="mt-2" asChild>
                      <Link to={`/start-chat/${chat.oppositeUserId}`}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Open Chat
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
};

export default ChatList;
