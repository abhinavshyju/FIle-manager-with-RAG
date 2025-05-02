import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { apiRequest } from "@/service/Request";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ListFiles from "@/components/ListFiles";
import { Bot } from "lucide-react";
import { RagChat } from "@/components/RagChat";
export default function DashboardPage() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = async (files: File[]) => {
    setFiles((prev) => [...prev, ...files]);
  };
  const [uploadKey, setUploadKey] = useState(0);
  const [refresh, setRefresh] = useState("");
  const onFileUpload = async () => {
    const file = files[uploadKey];
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiRequest("POST", "upload", null, formData);
    if (response.status == 201) {
      toast(`${file.name} upload successful!`);
      setUploadKey((prev) => prev + 1);
      setRefresh(`${uploadKey}`);
    }
  };
  return (
    <div className="w-full flex flex-col">
      <div className="grid xl:grid-cols-2 gap-4">
        <div className="w-full border border-dashed min-w-[300px] bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload onChange={handleFileUpload} key={uploadKey} />
          <div className="w-full flex justify-center pb-4 px-4">
            <Button
              className="w-full"
              disabled={files.length == 0}
              onClick={() => {
                onFileUpload();
              }}
            >
              Upload
            </Button>
          </div>
        </div>
        <div className="w-full h-full border rounded-lg  flex-col p-4 text-sm text-gray-600 hidden xl:flex">
          <h1 className="text-base text-black mb-2 w-full border-b border-dashed pb-2">
            Recent Files
          </h1>
          <div className="w-full flex flex-col gap-2">
            {files
              .slice(-2)
              .reverse()
              .map((file) => (
                <div className="w-full border  px-4 py-2 rounded-lg">
                  <div className="flex justify-between">
                    <span>{file.name}</span>
                    <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="bg-gray-100 px-2  rounded-lg">
                      {file.type}
                    </span>
                  </div>
                </div>
              ))}
            {files.length > 2 && (
              <div className="w-full text-center mt-3 text-xs">
                <span>More</span>
              </div>
            )}
          </div>
          <div className="mt-auto flex justify-between items-center border p-2 border-dashed rounded-xl">
            <p>
              Artificial intelligence is transforming the way we interact with
              technology.
            </p>

            <RagChat />
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-between items-center border p-2 border-dashed rounded-xl xl:hidden">
        <p>
          Artificial intelligence is transforming the way we interact with
          technology.
        </p>

        <RagChat />
      </div>
      <div className="">
        <ListFiles refresh={refresh} />
      </div>
    </div>
  );
}
