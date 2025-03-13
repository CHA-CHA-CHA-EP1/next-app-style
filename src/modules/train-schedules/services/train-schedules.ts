import api from "@/src/core/api/axiosInstance";
import { CreateTrainSchedulePayload, UpdateTrainSchedule } from "../types";

export const getTrainSchedules = async () => {
  return api.get("/train-schedules");
};

export const getTrainSchedule = async (id: number) => {
  return api.get(`/train-schedules/${id}`);
};

export const createTrainSchedule = async (
  train: CreateTrainSchedulePayload,
) => {
  return api.post("/train-schedules", {
    ...train,
  });
};

export const deleteTrainSchedule = async (id: number) => {
  return api.delete(`/train-schedules/${id}`);
};

export const updateTrainSchedule = async (
  id: number,
  train: UpdateTrainSchedule,
) => {
  return api.put(`/train-schedules/${id}`, {
    ...train,
  });
};

export const getTrainScheduleByRoundTrip = async (roundTrip: string) => {
  const res = await api.get(
    `/train-schedules/dashboard/${roundTrip.toUpperCase()}`,
  );
  return res.data;
};

export const updateTrainScheduleDelayTime = async (
  id: number,
  delay: number,
) => {
  const res = await api.put(`/train-schedules/updateLateTime/${id}/${delay}`);
  return res.data;
};

export const updateTemporaryPlatformNumberById = async (
  id: number,
  platformNumber: number,
) => {
  const res = await api.put(
    `/train-schedules/updateTemporaryPlatformNumber/${id}/${platformNumber}`,
  );
  return res.data;
};

export const restartTemporaryById = async (id: number) => {
  const res = await api.put(`/train-schedules/reset-temporary/${id}`);
  return res.data;
};

export const resetTemporaryALL = async () => {
  const res = await api.post(`/train-schedules/reset-all`);
  return res.data;
};
