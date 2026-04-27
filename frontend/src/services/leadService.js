import api from "./api";

export const getLeads = (params = {}) => api.get("/leads", { params });
export const getLead = (id) => api.get(`/leads/${id}`);
export const createLead = (lead) => api.post("/leads", lead);
export const updateLead = (id, lead) => api.put(`/leads/${id}`, lead);
export const deleteLead = (id) => api.delete(`/leads/${id}`);
