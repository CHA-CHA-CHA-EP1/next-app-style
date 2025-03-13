import { useMutation } from "@tanstack/react-query";
import { deleteRoute } from "../services/route";

export const useMutationDeleteRoute = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteRoute(id);
      return response.data;
    },
  });
};
