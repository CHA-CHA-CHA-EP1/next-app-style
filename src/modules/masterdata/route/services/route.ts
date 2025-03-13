import api from "@/src/core/api/axiosInstance";

export const getRoutes = async () => {
  return api.get("/route");
};

export const createRoute = async (name: string) => {
  console.log("name", name);
  return api.post("/route", {
    pathName: name,
  });
};

export const updateRoute = async (id: number, name: string) => {
  return api.put(`/route/${id}`, {
    pathName: name,
  });
};

export const deleteRoute = async (id: number) => {
  return api.delete(`/route/${id}`);
};

export const getRoute = async (id: number) => {
  return api.get(`/route/${id}`);
};
