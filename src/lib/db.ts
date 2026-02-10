import mongoose from "mongoose";

// import dns from "node:dns/promises"; 
// dns.setServers(["1.1.1.1", "1.0.0.1"]);

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("DB ERROR");
}

if (process.env.NODE_ENV === "development") {
  const dns = await import("node:dns/promises");
  dns.setServers(["1.1.1.1", "1.0.0.1"]);
}


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL)
      .then((conn) => conn.connection);
  }

  try {
    const conn = await cached.promise;
    return conn;
  } catch (error) {
    console.log(error)
  }
};

export default connectDB
