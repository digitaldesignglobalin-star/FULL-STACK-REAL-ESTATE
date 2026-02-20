import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AfterLogin() {

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = session?.user?.role;

  if (role === "admin") redirect("/admin");
  else if (role === "employee") redirect("/employee");
  else redirect("/dashboard");

}