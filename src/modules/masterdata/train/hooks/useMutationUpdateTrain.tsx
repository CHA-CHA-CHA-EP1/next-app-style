import { useMutation } from "@tanstack/react-query";
import { updateTrain } from "../services/train";

export const useMutationUpdateTrain = () => {
  return useMutation({
    mutationFn: async ({
      id,
      trainName,
      categoryId,
      routePathId,
    }: {
      id: number;
      trainName: string;
      categoryId: number;
      routePathId: number;
    }) => {
      const response = await updateTrain(
        id,
        trainName,
        categoryId,
        routePathId,
      );
      return response.data;
    },
  });
};
