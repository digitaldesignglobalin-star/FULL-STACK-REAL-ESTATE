import { auth } from "@/auth";
import EditRoleMobile from "@/components/common/EditRoleMobile";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

async function Home() {
  await connectDB();

  const session = await auth()

  console.log(session)
  const user = await User.findById(session?.user?.id)
  if(!user) {
    redirect('/login')
  }

  const inComplete = !user.mobile || !user.role || (!user.mobile && user.role =="user")

  if(!inComplete) {
    return <EditRoleMobile/>
  }
  
  return <div>

  </div>;
}

export default Home;
