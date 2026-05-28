import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ueqmclcbegoatpanrjpa.supabase.co";
const supabaseAnonKey = "sb_publishable_8FRBK4Ha_c21PeGI5qu0SQ_O33pBTTx";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);