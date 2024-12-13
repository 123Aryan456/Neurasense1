import { supabase } from "./supabase";

export type SubscriptionTier = "free" | "premium" | "enterprise";

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

export const createSubscription = async (
  userId: string,
  tier: SubscriptionTier,
  expiresAt?: Date,
) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: userId,
      tier,
      status: "active",
      expires_at: expiresAt?.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
};

export const cancelSubscription = async (subscriptionId: string) => {
  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("id", subscriptionId);

  if (error) throw error;
};

export const isPremiumUser = async (userId: string) => {
  const subscription = await getCurrentSubscription(userId);
  return (
    subscription?.tier === "premium" || subscription?.tier === "enterprise"
  );
};
