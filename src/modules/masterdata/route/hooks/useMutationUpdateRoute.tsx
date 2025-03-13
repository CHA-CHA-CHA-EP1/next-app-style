import { useMutation } from "@tanstack/react-query";
import { updateRoute } from "../services/route";

export const useMutationUpdateRoute = () => {
  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const response = await updateRoute(id, name);
      return response.data;
    },
  });
};
