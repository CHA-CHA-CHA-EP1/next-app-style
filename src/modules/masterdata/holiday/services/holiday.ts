import api from "@/src/core/api/axiosInstance";

export const getHolidays = async () => {
  return api.get("/holiday");
};

export const createHoliday = async (name: string, date: string) => {
  return api.post("/holiday", {
    name,
    date,
  });
};

export const updateHoliday = async (id: number, name: string, date: string) => {
  return api.put(`/holiday/${id}`, {
    name,
    date,
  });
};

export const deleteHoliday = async (id: number) => {
  return api.delete(`/holiday/${id}`);
};

export const getHoliday = async (id: number) => {
  return api.get(`/holiday/${id}`);
};

export const copyHolidayByYear = async (yearFrom: number, yearTo: number) => {
  return api.post(`/holiday/copy/${yearFrom}/${yearTo}`);
};
