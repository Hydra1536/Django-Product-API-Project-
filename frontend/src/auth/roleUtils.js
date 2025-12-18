export const isAdmin = (user) => user?.role === "admin";

export const isStaff = (user) =>
  user?.role === "staff" || user?.role === "super_staff";

export const canManageProducts = (user) =>
  ["admin", "super_staff"].includes(user?.role);

export const canManageUsers = (user) => user?.role === "admin";
