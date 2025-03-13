import { useMutation } from "@tanstack/react-query";
import { createStation } from "../services/station";

export const useMutationCreateStation = () => {
  return useMutation({
    mutationFn: async ({
      name,
      nameEng,
      routePathId,
    }: {
      name: string;
      nameEng: string;
      routePathId: number;
    }) => {
      const response = await createStation(name, nameEng, routePathId);
      return response.data;
    },
  });
};
