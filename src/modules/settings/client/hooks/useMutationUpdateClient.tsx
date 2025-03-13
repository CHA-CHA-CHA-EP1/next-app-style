import { useMutation } from "@tanstack/react-query";
import { updateClient } from "../services/client";
import { CreateClient } from "../types";

export const useMutationUpdateClient = () => {
  return useMutation({
    mutationFn: async ({
      id,
      client,
    }: {
      id: number;
      client: CreateClient;
    }) => {
      const response = await updateClient(id, client);
      return response.data;
    },
  });
};
