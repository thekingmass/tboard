/**
 * Calculates user initials from a full name.
 * @param name - The user's full name (e.g., "John Doe")
 * @returns Initials in uppercase (e.g., "JD"), or "?" if no name provided
 */
export function getUserInitials(name: string | null | undefined): string {
  const full = (name ?? "").trim();
  if (!full) return "?";
  
  const parts = full.split(/\s+/).filter(Boolean);
  
  // Single name: return first letter
  if (parts.length === 1) {
    return parts[0]![0]!.toUpperCase();
  }
  
  // Multiple names: return first letter of first and last name
  const first = parts[0]![0] ?? "";
  const last = parts[parts.length - 1]![0] ?? "";
  
  return (first + last).toUpperCase();
}
