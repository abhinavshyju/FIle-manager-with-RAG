import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout() {
  return (
    <div className="bg-background ">
      <div className="fixed top-0 left-0 z-50 w-full  flex justify-center ">
        <div className="flex max-w-7xl w-full justify-between px-4 md:px-2 py-4">
          <div className="text-xl font-bold">
            <h1>DocSphere</h1>
          </div>
        </div>
      </div>
      <Outlet />
      <Toaster />
    </div>
  );
}
