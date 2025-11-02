import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const StudentLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div>{children}</div>
      <Footer />
    </div>
  );
};

export default StudentLayout;
