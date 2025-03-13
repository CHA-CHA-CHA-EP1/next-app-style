import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { getClients } from "../services/client";
import { Client } from "../types";

export const useQueryGetClients = (
  key: QueryKey,
  options?: Omit<
    QueryObserverOptions<Client[], Client[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await getClients();
      return response.data;
    },
    ...options,
  });
};
