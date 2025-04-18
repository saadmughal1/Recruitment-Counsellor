import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ArrowLeft, Send } from "lucide-react";

import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const Chat = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const { id: recipientId } = useParams<{ id: string }>();
  const [messageText, setMessageText] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const senderId = JSON.parse(localStorage.getItem("user")).id;

  // join the room for first time
  useEffect(() => {
    if (!socket || !recipientId) return;

    const room = `${getMinId(senderId, recipientId)}-${getMaxId(
      senderId,
      recipientId
    )}`;

    socket.emit("join_room", room);
  }, [socket, recipientId]);

  const fetchMessages = async () => {
    const tok = localStorage.getItem("user");
    const token = JSON.parse(tok || "{}")?.token;

    try {
      const res = await axios.get(
        `http://localhost:4000/api/message/load-chat/${recipientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log(res.data?.data)
      setMessageList(res.data?.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [recipientId]);

  function getMaxId(...ids) {
    return ids.reduce((max, curr) => (curr > max ? curr : max));
  }

  function getMinId(...ids) {
    return ids.reduce((min, curr) => (curr < min ? curr : min));
  }

  const sendMessage = async () => {
    const tok = localStorage.getItem("user");
    const token = JSON.parse(tok || "{}")?.token;

    try {
      const res = await axios.post(
        `http://localhost:4000/api/message/send-message`,
        {
          recipientId,
          content: messageText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      console.log(res)
      // setMessageList((prev) => [
      //   ...prev,
      //   { content: messageText, sender: recipientId },
      // ]);
      setMessageText("");

      const data = {
        content: messageText,
        room: `${getMinId(senderId, recipientId)}-${getMaxId(
          senderId,
          recipientId
        )}`,
        senderId: senderId,
        recipientId: recipientId,
        createdAt: new Date().toISOString(),
      };

      await socket.emit("send_message", data);

      setMessageList((prev) => [...prev, data]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (data.recipientId === senderId) {
        // console.log("Received message:", data);
        setMessageList((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage); // clean up
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "MMM d, h:mm a");
  };

  return (
    <MainLayout>
      <Button variant="outline" className="mb-4" asChild>
        <a onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </a>
      </Button>

      <Card className="h-[75vh] flex flex-col">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle>Chat</CardTitle>
        </CardHeader>

        <CardContent className="flex-grow overflow-y-auto p-6">
          {messageList.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          ) : (
            <div className="space-y-4">
              {messageList.map((msg, index) => {
                return (
                  <div
                    key={index + 1}
                    className={`flex ${
                      msg.senderId == senderId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        msg.senderId == senderId
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <div className="break-words">{msg.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          msg.senderId == senderId
                            ? "text-primary-foreground/80"
                            : "text-secondary-foreground/80"
                        }`}
                      >
                        {formatMessageTime(msg.createdAt)}
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
            <Button onClick={sendMessage} disabled={!messageText.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </CardFooter>
      </Card>
    </MainLayout>
  );
};

export default Chat;
