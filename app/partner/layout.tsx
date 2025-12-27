import React, { ReactNode } from "react";
import { RoleGuard } from "@/components/shared/RoleGuard";

type Props = {
    children: ReactNode;
};

const PartnerLayout = ({ children }: Props) => {
    return (
        <RoleGuard allowedRoles={["partner"]}>
            {children}
        </RoleGuard>
    );
};

export default PartnerLayout;
