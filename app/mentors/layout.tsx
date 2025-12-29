import React, { ReactNode } from "react";
import { RoleGuard } from "@/components/shared/RoleGuard";

type Props = {
    children: ReactNode;
};

const MentorsLayout = ({ children }: Props) => {
    return (
        <RoleGuard allowedRoles={["mentor", "student", "admin"]}>
            {children}
        </RoleGuard>
    );
};

export default MentorsLayout;
