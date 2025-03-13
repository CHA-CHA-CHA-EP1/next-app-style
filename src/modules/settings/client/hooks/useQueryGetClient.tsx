import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { getClient } from "../services/client";
import { Client } from "../types";

export const useQueryGetClient = (
  key: QueryKey,
  options?: Omit<QueryObserverOptions<Client, Client>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const id = key[1] as number;
      const response = await getClient(id);
      return response.data;
    },
    ...options,
  });
};
