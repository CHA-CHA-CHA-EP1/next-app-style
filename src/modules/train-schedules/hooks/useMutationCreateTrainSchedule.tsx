import { useMutation } from "@tanstack/react-query";
import { createTrainSchedule } from "../services/train-schedules";
import { CreateTrainSchedulePayload } from "../types";

export const useMutationCreateTrainSchedule = () => {
  return useMutation({
    mutationFn: async (train: CreateTrainSchedulePayload) => {
      const response = await createTrainSchedule(train);
      return response.data;
    },
  });
};
