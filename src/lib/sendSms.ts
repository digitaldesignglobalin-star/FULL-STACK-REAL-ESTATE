import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID!,
  process.env.TWILIO_AUTH!
);

export async function sendSMS(phone: string, otp: string) {
  try {

    const res = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE!,
      to: `+91${phone}`,
    });

    return { success: true, sid: res.sid };

  } catch (err) {

    console.error("Twilio error:", err);

    return { success: false };
  }
}
