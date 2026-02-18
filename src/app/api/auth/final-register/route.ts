// import connectDB from "@/lib/db";
// import User from "@/models/user.model";
// import Otp from "@/models/otp.model";
// import admin from "@/lib/firebase-admin";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const { firebaseToken, email } = await req.json();

//     if (!firebaseToken || !email) {
//       return NextResponse.json(
//         { message: "Missing data" },
//         { status: 400 }
//       );
//     }

//     const decoded = await admin.auth().verifyIdToken(firebaseToken);
//     const phoneNumber = decoded.phone_number;

//     if (!phoneNumber) {
//       return NextResponse.json(
//         { message: "Phone verification failed" },
//         { status: 400 }
//       );
//     }

//     const otpRecord = await Otp.findOne({ email });

//     if (!otpRecord) {
//       return NextResponse.json(
//         { message: "Email verification missing" },
//         { status: 400 }
//       );
//     }

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return NextResponse.json(
//         { message: "User already exists" },
//         { status: 400 }
//       );
//     }

//     await User.create({
//       name: otpRecord.name,
//       email: otpRecord.email,
//       password: otpRecord.password,
//       phone: phoneNumber,
//       emailVerified: true,
//       phoneVerified: true,
//     });

//     await Otp.deleteMany({ email });

//     return NextResponse.json(
//       { message: "User created successfully" },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Final registration failed" },
//       { status: 500 }
//     );
//   }
// }