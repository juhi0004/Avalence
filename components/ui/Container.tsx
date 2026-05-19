import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Container({ children, className = "", id }: ContainerProps) {
  return (
    <div
      id={id}
      className={`mx-auto w-full max-w-[1440px] px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 relative ${className}`}
    >
      {children}
    </div>
  );
}
