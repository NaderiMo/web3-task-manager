import React from "react";

const AnimatedBackground: React.FC = () => {
  return (
    <>
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl bg-blue-400/10 animate-float"></div>
      <div
        className="absolute right-20 bottom-20 w-96 h-96 rounded-full blur-3xl bg-purple-400/10 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 bg-pink-400/5 animate-float"
        style={{ animationDelay: "4s" }}
      ></div>
    </>
  );
};

export default AnimatedBackground;
