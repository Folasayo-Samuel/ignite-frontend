export const getUserInitials = (name?: string) => {
  if (!name) return "CN";

  const parts = name.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts[1] || "";

  // If only one name was provided, just use its first letter twice
  const initials = `${firstName[0] || ""}${lastName[0] || firstName[0] || ""}`;
  return initials.toUpperCase();
};
