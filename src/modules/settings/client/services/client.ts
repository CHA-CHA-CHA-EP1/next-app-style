import api from "@/src/core/api/axiosInstance";
import { CreateClient } from "../types";

export const getClients = () => {
  return api.get("/client");
};

export const getClient = (id: number) => {
  return api.get(`/client/${id}`);
};

export const removeClient = (id: number) => {
  return api.delete(`/client/${id}`);
};

export const createClient = (data: CreateClient) => {
  return api.post("/client", data);
};

export const updateClient = (id: number, data: CreateClient) => {
  return api.put(`/client/${id}`, data);
};

export const getClientDashboard = (trip: "ARRIVE" | "DEPARTURE") => {
  return api.get(`/train-schedules/client-dashboard/${trip}`);
};

// export async function getClientDashboard(trip: any): Promise<any[]> {
//   const res = await api.get(`/train-schedules/client-dashboard/ARRIVE`);
//   console.log(res.data);
//   return res.data;
// }
