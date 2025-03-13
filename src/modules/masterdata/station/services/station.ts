import api from "@/src/core/api/axiosInstance";

export const getStations = async () => {
  return api.get("/stations");
};

export const createStation = async (
  name: string,
  nameEng: string,
  routePathId: number,
) => {
  return api.post("/stations", {
    stationName: name,
    stationNameEng: nameEng,
    routePathId,
  });
};

export const updateStation = async (
  id: number,
  name: string,
  nameEng: string,
  routePathId: number,
) => {
  return api.put(`/stations/${id}`, {
    stationName: name,
    stationNameEng: nameEng,
    routePathId,
  });
};

export const deleteStation = async (id: number) => {
  return api.delete(`/stations/${id}`);
};

export const getStation = async (id: number) => {
  return api.get(`/stations/${id}`);
};

export const getStationByPathId = async (pathId: number) => {
  return api.get(`/stations?routePathId=${pathId}`);
};
