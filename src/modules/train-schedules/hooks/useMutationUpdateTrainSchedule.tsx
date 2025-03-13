import { useMutation } from "@tanstack/react-query";
import { updateTrainSchedule } from "../services/train-schedules";
import { UpdateTrainSchedule } from "../types";

export const useMutationUpdateTrainSchedule = () => {
  return useMutation({
    mutationFn: async ({
      id,
      train,
    }: {
      id: number;
      train: UpdateTrainSchedule;
    }) => {
      const response = await updateTrainSchedule(id, train);
      return response.data;
    },
  });
};
