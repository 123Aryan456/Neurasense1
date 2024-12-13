import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: [
      "Basic code analysis",
      "Style checking",
      "Documentation analysis",
      "Limited API calls",
    ],
  },
  {
    name: "Premium",
    price: "$9.99",
    features: [
      "Advanced code analysis",
      "AI-powered suggestions",
      "Security vulnerability scanning",
      "Performance optimization tips",
      "Real-time collaboration",
      "Priority support",
      "Unlimited API calls",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "All Premium features",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantees",
      "Team management",
      "Custom reporting",
    ],
  },
];

const PricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUpgrade = async (plan: string) => {
    if (!user) {
      navigate("/signin");
      return;
    }

    try {
      const { error } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        tier: plan.toLowerCase(),
        status: "active",
        expires_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Subscription Updated",
        description: `You are now subscribed to the ${plan} plan!`,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      toast({
        title: "Error",
        description: "Failed to upgrade subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-muted-foreground text-lg">
            Get access to powerful code analysis features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.highlighted ? "border-primary" : ""}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Crown className="h-4 w-4" />
                    Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">{plan.price}</div>
                {plan.name !== "Free" && (
                  <div className="text-sm text-muted-foreground">per month</div>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-6 ${plan.highlighted ? "bg-primary" : ""}`}
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {plan.name === "Enterprise"
                    ? "Contact Sales"
                    : plan.name === "Free"
                      ? "Get Started"
                      : "Upgrade Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
