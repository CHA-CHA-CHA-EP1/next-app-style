import { useMutation } from "@tanstack/react-query";
import { createTrain } from "../services/train";

export const useMutationCreateTrain = () => {
  return useMutation({
    mutationFn: async ({
      trainName,
      categoryId,
      routePathId,
    }: {
      trainName: string;
      categoryId: number;
      routePathId: number;
    }) => {
      const response = await createTrain(trainName, categoryId, routePathId);
      return response.data;
    },
  });
};
