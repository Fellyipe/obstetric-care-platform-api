import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.DB_URL;
const DB_KEY = process.env.DB_KEY;
const DB_SERVICE_KEY = process.env.DB_SERVICE_KEY;

if (!DB_URL || !DB_KEY) {
  throw new Error("Missing database credentials. Check your .env file.");
}

export const db = createClient(DB_URL, DB_KEY);

export const dbAdmin = createClient(DB_URL, DB_SERVICE_KEY);

export const dbWithAuth = (accessToken) =>
  createClient(DB_URL, DB_KEY, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
