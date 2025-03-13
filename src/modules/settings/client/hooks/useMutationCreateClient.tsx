import { useMutation } from "@tanstack/react-query";
import { createClient } from "../services/client";
import { CreateClient } from "../types";

export const useMutationCreateClient = () => {
  return useMutation({
    mutationFn: async (client: CreateClient) => {
      const response = await createClient(client);
      return response.data;
    },
  });
};
