import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

/**
 * Mentors layout — public directory accessible without authentication.
 * Individual mentor profiles are also public.
 */
const MentorsLayout = ({ children }: Props) => {
    return <>{children}</>;
};

export default MentorsLayout;
