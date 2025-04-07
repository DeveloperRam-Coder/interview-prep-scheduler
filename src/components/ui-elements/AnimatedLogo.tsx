import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo = ({ className }: AnimatedLogoProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 1200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="relative">
        <div
          className={cn(
            "w-16 h-16 rounded-full bg-primary flex items-center justify-center transition-all duration-700",
            isAnimating ? "scale-110" : "scale-100"
          )}
        >
          <span className="text-primary-foreground text-2xl font-bold">
            {" "}
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </span>
        </div>

        {/* Animated rings */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 border-primary/20 transition-all duration-1000",
            isAnimating ? "scale-150 opacity-0" : "scale-100 opacity-100"
          )}
        />

        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 border-primary/10 transition-all duration-1500 delay-100",
            isAnimating ? "scale-175 opacity-0" : "scale-125 opacity-100"
          )}
        />
      </div>
    </div>
  );
};

export default AnimatedLogo;
