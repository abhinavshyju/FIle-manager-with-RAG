import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Bot, Download, File, Menu } from "lucide-react";
import { apiRequest } from "@/service/Request";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RagChat } from "./RagChat";

export interface FilesType {
  createed_at: string;
  id: number;
  filename: string;
  url: string;
  user_id: number;
  active: boolean;
  size: number;
}

export default function ListFiles({ refresh }: { refresh: string }) {
  const [files, setFiles] = useState<FilesType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const pageSize = 10;
  const searchMode = debouncedTerm.length > 0;

  const fetchFiles = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest("GET", url);
      if (response.data && response.data.data) {
        setFiles(response.data.data.reverse());
        setHasMore(response.data.pagination?.more_files || false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const skip = (page - 1) * pageSize;
    if (searchMode) {
      fetchFiles(
        `file/search?query=${debouncedTerm}&skip=${skip}&limit=${pageSize}`
      );
    } else {
      fetchFiles(`file/all?skip=${skip}&limit=${pageSize}`);
    }
  }, [page, debouncedTerm, refresh]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);

    const options = {
      month: "short" as "short",
      day: "2-digit" as "2-digit",
      year: "numeric" as "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };
  return (
    <div className="flex flex-col gap-2 pb-12">
      <div className="border mt-5 py-4 px-2 rounded-lg ">
        <div className="grid grid-cols-[40px_1fr_100px_1fr_50px_100px]  items-center gap-2 text-sm text-muted-foreground">
          <div className="col-span-6 px-6  border-b pb-2  justify-between items-center grid grid-cols-[1fr_300px]">
            <h1 className="w-[300px]">Your Files</h1>
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div></div>
          <div>File Name</div>
          <div>File Size</div>
          <div>Last Update</div>
          <div>Active</div>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-5 px-2 rounded-lg">
        {files.length > 0 ? (
          files.map((file, index) => (
            <div
              key={index}
              className="grid grid-cols-[40px_1fr_100px_1fr_50px_100px] items-center gap-2 border-b pb-2"
            >
              <FileSVG size={30} />
              <h1>{file.filename}</h1>
              <h1 className="text-muted-foreground text-sm">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </h1>
              <h1 className="text-muted-foreground text-sm">
                {formatDate(file.createed_at)}
              </h1>
              {file.active ? (
                <div className="size-2 bg-green-500 rounded-full shadow-green-500/50 shadow-md animate-pulse"></div>
              ) : (
                <div className="size-2 bg-red-500 rounded-full shadow-red-500/50 shadow-md animate-pulse"></div>
              )}
              <FileDialog filename={file.filename} id={file.id} />
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No files found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || loading}
        >
          Previous
        </Button>
        <span>Page {page}</span>
        <Button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!hasMore || loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

const FileSVG = ({ size }: { size: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0,0,256,256"
      style={{ fill: "#228BE6" }}
    >
      <g transform="scale(8.53333,8.53333)">
        <path d="M24.707,8.793l-6.5,-6.5c-0.188,-0.188 -0.442,-0.293 -0.707,-0.293h-10.5c-1.105,0 -2,0.895 -2,2v22c0,1.105 0.895,2 2,2h16c1.105,0 2,-0.895 2,-2v-16.5c0,-0.265 -0.105,-0.519 -0.293,-0.707zM18,10c-0.552,0 -1,-0.448 -1,-1v-5.096l6.096,6.096z"></path>
      </g>
    </svg>
  );
};

const FileDialog = ({ filename, id }: { filename: string; id: number }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUrl = async (name: string) => {
    if (url) return;

    setLoading(true);
    try {
      const response = await apiRequest("GET", `file/get-url?filename=${name}`);
      if (response.status === 200) {
        setUrl(response.data.url);
        console.log(url);
      }
    } catch (error) {
      console.error("Error fetching file URL:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="">
        <Button
          disabled={loading}
          onClick={() => fetchUrl(filename)}
          className="my-2"
        >
          <File /> Open
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-4">
          <h1 className="">{filename}</h1>
          <div className="border rounded-xl border-dashed ">
            <div className="flex justify-center opacity-50">
              <FileSVG size={300} />
            </div>
          </div>

          <div className="mt-2 flex justify-between items-center border p-2 border-dashed rounded-xl ">
            <RagChat document_id={id} filename={filename} />
            <Button
              variant={"secondary"}
              disabled={!url}
              onClick={() => {
                window.open(url, "_blank");
              }}
            >
              <Download /> Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
