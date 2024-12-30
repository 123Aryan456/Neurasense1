import { supabase } from "./supabase";

export type SubscriptionTier = "free";

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: "active" | "cancelled" | "expired";
  started_at: string;
  expires_at: string | null;
}

export const getCurrentSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as Subscription | null;
};
