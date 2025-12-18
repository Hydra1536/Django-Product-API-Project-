import api from "./api";

export const UserService = {
  list: (params = {}) =>
    api.get("/api/accounts/users/", {
      params: {
        limit: params.limit ?? 10,
        offset: params.offset ?? 0,
      },
    }),
  search: (q) => api.get(`/api/accounts/users/search/?q=${q}`),
  get: (id) => api.get(`/api/accounts/users/${id}/`),
  create: (data) => api.post("/api/accounts/users/", data),
  update: (id, data) => api.put(`/api/accounts/users/${id}/`, data),
  remove: (id) => api.delete(`/api/accounts/users/${id}/`),
  bulkDelete: (ids) =>
    api.delete("/api/accounts/users/bulk_delete/", { data: { ids } }),
};
