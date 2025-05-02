import { SidebarTrigger } from "./ui/sidebar";

export default function MainNavBar() {
  return (
    <div className=" w-full px-4 py-6">
      <div className="flex justify-between w-full border-b py-1">
        <div className="flex gap-2 items-center font-semibold"></div>
        <div className="">
          <SidebarTrigger />
        </div>
      </div>
    </div>
  );
}
