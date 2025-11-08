export const getUserInitials = (name?: string) => {
  if (!name) return "CN";

  const parts = name.trim().split(" ").filter(Boolean);
  const firstName = parts[0] || "";
  const lastName = parts[1];

  if (lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  // If only one name, use the first two letters instead of repeating
  return firstName.slice(0, 2).toUpperCase();
};
