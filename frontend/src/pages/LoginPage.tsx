import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/service/Request";
import { toast } from "sonner";

export default function LoginPage() {
  const formSchema = z.object({
    email: z.string().email({
      message: "Enter a valid email.",
    }),
    password: z.string().min(8, {
      message: "Password must be greater then 8.",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await apiRequest("POST", "auth/login", values);
    if (response.status == 200) {
      sessionStorage.setItem("authToken", response.data.access_token);
      window.location.href = "/dashboard";
    }
    if (response.status == 400) {
      toast(response.data.message);
    }
  };
  return (
    <div className="h-screen md:grid-cols-5 grid">
      <div className="bg-black col-span-2  items-center justify-center hidden md:flex ">
        <div className="text-white px-6 md:px-12">
          <h1 className="text-xl md:text-3xl font-bold mb-4">DocSphere</h1>
          <p className="text-white/75">
            Welcome to your dynamic document space! Effortlessly store, manage,
            and collaborate on files with ease. Your productivity starts
            here—let’s get organized and make things seamless!
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center col-span-3">
        <div className="min-w-[300px] w-1/2 max-w-[400px]">
          <h1 className="text-center text-3xl font-bold mb-6">
            Login to your account
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
          <span className="flex justify-end mt-2 gap-1.5">
            Don't have an accout ?
            <a href="/register" className="text-blue-400">
              Sign up
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
