export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    PENDING: "badge-pending",
    CONFIRMED: "badge-confirmed",
    REJECTED: "badge-rejected",
    COMPLETED: "badge-completed",
    CANCELLED: "badge-cancelled",
    RESCHEDULED: "badge-pending",
  };
  return map[status] ?? "badge-cancelled";
}

export function getRoleBadgeClass(role: string): string {
  return role === "ADMIN" ? "badge-admin" : "badge-user";
}
