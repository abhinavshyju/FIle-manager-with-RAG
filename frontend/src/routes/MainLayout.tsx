import MainNavBar from "@/components/MainNavBar";
import { MainSidebar } from "@/components/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <SidebarProvider>
        <MainSidebar />
        <main className="w-full">
          <MainNavBar />
          <div className="px-4">{<Outlet />}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
