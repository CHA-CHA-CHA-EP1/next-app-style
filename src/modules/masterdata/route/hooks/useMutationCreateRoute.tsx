import { useMutation } from "@tanstack/react-query";
import { createRoute } from "../services/route";

export const useMutationCreateRoute = () => {
  return useMutation({
    mutationFn: async (name: string) => {
      const response = await createRoute(name);
      return response.data;
    },
  });
};
