export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    INTERVIEWER_ASSIGNED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    CANDIDATE_CONFIRMED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    INTERVIEWER_CONFIRMED: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    CONFIRMED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    COMPLETED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    RESCHEDULED: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  };
  return map[status] ?? "bg-gray-100 text-gray-800";
}

export function getRoleBadgeClass(role: string): string {
  return role === "ADMIN" ? "badge-admin" : "badge-user";
}
