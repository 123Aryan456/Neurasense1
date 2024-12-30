import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if Cmd/Ctrl is pressed
      if (!(event.metaKey || event.ctrlKey)) return;

      switch (event.key) {
        case "d":
          event.preventDefault();
          navigate("/dashboard");
          break;
        case "a":
          event.preventDefault();
          navigate("/analyze");
          break;
        case "t":
          event.preventDefault();
          navigate("/code-tree");
          break;
        case "p":
          event.preventDefault();
          navigate("/performance");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);
}
