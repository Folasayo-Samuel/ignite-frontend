export const mapFilterTabToQuery = (filterTab: string): Record<string, string | boolean> => {
    switch (filterTab) {
      case "pending":
        return { isApproved: false };
      case "kyc_yes":
        return { isProfileComplete: true };
      case "kyc_no":
        return { isProfileComplete: false };
      case "suspended":
        return { isSuspended: true };
      case "active":
        return { isActive: true };
      case "inactive":
        return { isActive: false };
      case "deactivated":
        return { isDeactivated: true };
      default:
        return {};
    }
  };
  