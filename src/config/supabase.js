import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing database credentials. Check your .env file.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const supabaseWithAuth = (accessToken) =>
  createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
