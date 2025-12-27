import React, { ReactNode } from "react";
import { RoleGuard } from "@/components/shared/RoleGuard";

type Props = {
    children: ReactNode;
};

const MentorsLayout = ({ children }: Props) => {
    return (
        <RoleGuard allowedRoles={["mentor"]}>
            {children}
        </RoleGuard>
    );
};

export default MentorsLayout;
