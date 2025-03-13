import { useMutation } from "@tanstack/react-query";
import { removeClient } from "../services/client";

export const useMutationRemoveClient = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await removeClient(id);
      return response.data;
    },
  });
};
