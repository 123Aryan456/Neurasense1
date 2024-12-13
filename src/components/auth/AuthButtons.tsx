import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

const AuthButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        onClick={() => navigate("/signin")}
        className="flex items-center gap-2"
      >
        <LogIn className="h-4 w-4" />
        Sign In
      </Button>
      <Button
        onClick={() => navigate("/onboarding")}
        className="flex items-center gap-2"
      >
        <UserPlus className="h-4 w-4" />
        Sign Up
      </Button>
    </div>
  );
};

export default AuthButtons;
