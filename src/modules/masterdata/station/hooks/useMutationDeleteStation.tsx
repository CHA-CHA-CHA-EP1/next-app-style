import { useMutation } from "@tanstack/react-query";
import { deleteStation } from "../services/station";

export const useMutationDeleteStation = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteStation(id);
      return response.data;
    },
  });
};
