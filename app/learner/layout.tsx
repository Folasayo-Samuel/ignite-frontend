import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import React, { ReactNode } from "react";
import { RoleGuard } from "@/components/shared/RoleGuard";

type Props = {
  children: ReactNode;
};

const StudentLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen">
      <RoleGuard allowedRoles={["student"]}>
        <Navigation />
        <div>{children}</div>
        <Footer />
      </RoleGuard>
    </div>
  );
};

export default StudentLayout;
