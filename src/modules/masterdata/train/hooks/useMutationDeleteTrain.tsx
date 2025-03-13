import { useMutation } from "@tanstack/react-query";
import { deleteTrain } from "../services/train";

export const useMutationDeleteTrain = () => {
  return useMutation({
    mutationFn: async (trainId: number) => {
      const response = await deleteTrain(trainId);
      return response.data;
    },
  });
};
