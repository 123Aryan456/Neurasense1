import React, { useEffect, useRef } from "react";
import { Brain, Shield, Gauge, Code2, LineChart, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced neural networks analyze your Python code for patterns, complexity, and potential improvements.",
  },
  {
    icon: Shield,
    title: "Security Scanning",
    description:
      "Detect vulnerabilities, security risks, and potential exploits in your code with our advanced security scanner.",
  },
  {
    icon: LineChart,
    title: "Code Metrics",
    description:
      "Get detailed insights into code complexity, maintainability, and quality metrics with visual analytics.",
  },
  {
    icon: Code2,
    title: "Style Analysis",
    description:
      "Ensure code consistency and adherence to Python best practices with automated style checking.",
  },
  {
    icon: Gauge,
    title: "Performance Analysis",
    description:
      "Identify performance bottlenecks and get optimization suggestions to improve your code's efficiency.",
  },
  {
    icon: Sparkles,
    title: "Smart Suggestions",
    description:
      "Receive AI-powered suggestions for code improvements, optimizations, and best practices.",
  },
];

const Features = () => {
  const featuresRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animations
      gsap.from(".features-heading", {
        scrollTrigger: {
          trigger: ".features-heading",
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Feature cards animations
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, featuresRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={featuresRef} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="features-heading text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Enterprise-Grade Code Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced analysis tools powered by AI to improve your Python code
            quality
          </p>
        </div>

        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card p-6 rounded-xl border bg-card hover:bg-accent/50 transition-colors space-y-4"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
