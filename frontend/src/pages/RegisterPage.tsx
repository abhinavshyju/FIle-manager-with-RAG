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

export default function RegisterPage() {
  const formSchema = z.object({
    name: z.string().min(3, {
      message: "Name atlest 3 characters.",
    }),
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
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await apiRequest("POST", "auth/register", values);
    if (response.status == 200) {
      window.location.href = "/login";
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
            Signup to your account
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            Already have an account ?
            <a href="/login" className="text-blue-400">
              Sign in
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
