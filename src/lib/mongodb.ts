import mongoose from "mongoose";
import dns from "dns";

if (typeof window === 'undefined') {
  dns.setDefaultResultOrder('ipv4first');
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    console.warn("Could not set custom DNS servers:", e);
  }
}

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  let MONGODB_URI = process.env.MONGODB_URI!;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  // Rewrite Atlas SRV connection string to direct replica set hosts to bypass local DNS SRV resolution issues
  if (MONGODB_URI.includes('cluster0.thtf55d.mongodb.net')) {
    MONGODB_URI = "mongodb://veerharsh919_db_user:harsh2005@ac-lbveoyf-shard-00-00.thtf55d.mongodb.net:27017,ac-lbveoyf-shard-00-01.thtf55d.mongodb.net:27017,ac-lbveoyf-shard-00-02.thtf55d.mongodb.net:27017/?ssl=true&replicaSet=atlas-au5kxr-shard-0&authSource=admin";
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((m) => {
        return m.connection;
      })
      .catch((err) => {
        cached.promise = null; // Clear cached promise on connection error
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // Clear cached promise if awaiting it fails
    throw err;
  }
  return cached.conn;
}

export default dbConnect;
