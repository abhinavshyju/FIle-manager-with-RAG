import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { apiRequest } from "@/service/Request";
import { Bot } from "lucide-react";
import { useState } from "react";

export function RagChat({
  document_id,
  filename,
}: {
  document_id?: number;
  filename?: string;
}) {
  const [userMessage, setUserMassage] = useState<string>();
  const [chat, setChat] = useState<
    {
      sender: "user" | "bot";
      message: string;
    }[]
  >([
    {
      sender: "bot",
      message: "Hi there. What should we dive into today? ",
    },
  ]);
  const [disenabled, setDisenabled] = useState(false);
  const onChatClick = async () => {
    if (userMessage) {
      setDisenabled(true);
      setChat((prev) => [...prev, { sender: "user", message: userMessage }]);
      const response = await apiRequest(
        "POST",
        document_id ? "agent/doc" : "agent",
        document_id
          ? { msg: userMessage, document_id }
          : { msg: userMessage, document_id: 1 }
      );
      if (response.status == 200) {
        setDisenabled(false);
        setUserMassage("");
        setChat((prev) => [
          ...prev,
          { sender: "bot", message: response.data.answer },
        ]);
      }
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Bot /> <span>Use RAG feature</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>RAG Chat</SheetTitle>
          <SheetDescription>Chat with our documents</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col overflow-y-auto px-4 gap-2">
          {chat.map((chat) => (
            <div
              className={` px-2  py-1 rounded-lg text-left ${
                chat.sender == "bot" ? "mr-4" : "ml-4 bg-gray-100"
              }`}
            >
              {chat.message}
            </div>
          ))}
        </div>
        <SheetFooter>
          {filename && (
            <div className="flex">
              <span className="text-sm px-2 bg-gray-100 rounded ">
                {filename}
              </span>
            </div>
          )}
          <div className=" flex gap-2">
            <Input
              type="text"
              placeholder="Enter the message..."
              value={userMessage}
              onChange={(e) => setUserMassage(e.target.value)}
            />{" "}
            <Button
              disabled={!userMessage || disenabled}
              onClick={() => onChatClick()}
            >
              Send
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
