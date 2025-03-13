import { useMutation } from "@tanstack/react-query";
import { updateStation } from "../services/station";

export const useMutationUpdateStation = () => {
  return useMutation({
    mutationFn: async ({
      id,
      name,
      nameEng,
      routePathId,
    }: {
      id: number;
      name: string;
      nameEng: string;
      routePathId: number;
    }) => {
      const response = await updateStation(id, name, nameEng, routePathId);
      return response.data;
    },
  });
};
