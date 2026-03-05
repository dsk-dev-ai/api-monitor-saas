import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sdhxhguajxmbkhvuqtsv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkaHhoZ3VhanhtYmtodnVxdHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MzQ5ODcsImV4cCI6MjA4ODMxMDk4N30.rTxorWCLINi9BQEuSXlpgJ1DgRWlYpl7BqyFG7h2okI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);