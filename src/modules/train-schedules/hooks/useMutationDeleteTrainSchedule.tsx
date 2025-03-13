import { useMutation } from "@tanstack/react-query";
import { deleteTrainSchedule } from "../services/train-schedules";

export const useMutationDeleteTrainSchedule = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const response = await deleteTrainSchedule(id);
      return response.data;
    },
  });
};
