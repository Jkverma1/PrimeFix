// lib/supabase.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bwsbtugpmuuxuboyyrxz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3c2J0dWdwbXV1eHVib3l5cnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MjI3MzgsImV4cCI6MjA4ODE5ODczOH0.m6sgMkZnM6UfASqIsWGSGon7qrVoecdFQWAv-9qcWdw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
