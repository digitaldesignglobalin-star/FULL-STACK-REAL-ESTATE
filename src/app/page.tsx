import { auth } from "@/auth";
import EditRoleMobile from "@/components/common/EditRoleMobile";
import WelcomePage from "@/components/common/WelcomePage";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

async function Home() {
  return (<div>
    <WelcomePage />
  </div>)
}

export default Home;
