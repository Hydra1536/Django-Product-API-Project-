import api from "./api";

export const ProductService = {
  list(params = {}) {
    return api.get("/api/products/", {
      params: {
        limit: params.limit ?? 10,
        offset: params.offset ?? 0,
        search: params.search,
        price__gte: params.price__gte,
        price__lte: params.price__lte,
        ordering: params.ordering,
      },
    });
  },

  search: (q) => api.get(`/api/products/search/?q=${q}`),
  get: (id) => api.get(`/api/products/${id}/`),
  create: (data) => api.post("/api/products/", data),
  update: (id, data) => api.put(`/api/products/${id}/`, data),
  remove: (id) => api.delete(`/api/products/${id}/`),
  bulkDelete: (ids) =>
    api.delete("/api/products/bulk_delete/", { data: { ids } }),
  minPrice: (q) => api.get(`/api/products/?price__gte=${q}/`),
  maxPrice: (q) => api.get(`/api/products/?price__lte=${q}/`),
};
