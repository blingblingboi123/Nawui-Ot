import React from "react";
import Hero from "@/components/ui/Hero";
import Features from "@/components/ui/Features";

const Home = () => {
  return (
    <div className="min-h-screen p-10 bg-green-300">
      <Hero />
      <Features />
    </div>
  );
};

export default Home;