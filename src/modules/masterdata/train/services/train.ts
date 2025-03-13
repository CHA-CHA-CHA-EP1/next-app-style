import api from "@/src/core/api/axiosInstance";

export const getTrain = async (id: number) => {
  return api.get(`/trains/${id}`);
};

export const getTrains = async () => {
  return api.get("/trains");
};

export const createTrain = async (
  trainName: string,
  categoryId: number,
  routePathId: number,
) => {
  return api.post("/trains", {
    trainName,
    categoryId,
    routePathId,
  });
};

export const updateTrain = async (
  id: number,
  trainName: string,
  categoryId: number,
  routePathId: number,
) => {
  return api.put(`/trains/${id}`, {
    trainName,
    categoryId,
    routePathId,
  });
};

export const deleteTrain = async (id: number) => {
  return api.delete(`/trains/${id}`);
};
