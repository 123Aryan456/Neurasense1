import React from "react";
import { UserInfo } from "../OnboardingPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { z } from "zod";

interface UserInfoStepProps {
  userInfo: UserInfo;
  onUpdate: (info: UserInfo) => void;
}

const userInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const UserInfoStep = ({ userInfo, onUpdate }: UserInfoStepProps) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const { signIn } = useAuth();

  const validateField = (field: keyof UserInfo, value: string) => {
    try {
      userInfoSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.errors[0].message,
        }));
      }
    }
  };

  const handleChange =
    (field: keyof UserInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onUpdate({ ...userInfo, [field]: value });
      validateField(field, value);
    };

  const handleSignIn = async () => {
    try {
      await signIn(userInfo.email, userInfo.password);
    } catch (error) {
      console.error("Sign in error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Invalid email or password",
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Create Your Account
        </h2>
        <p className="text-muted-foreground">
          Enter your information to get started
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={userInfo.name}
            onChange={handleChange("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={userInfo.email}
            onChange={handleChange("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={userInfo.password}
            onChange={handleChange("password")}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {errors.submit && (
          <p className="text-sm text-red-500 mt-4">{errors.submit}</p>
        )}

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={handleSignIn}>
            Sign In Instead
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoStep;
