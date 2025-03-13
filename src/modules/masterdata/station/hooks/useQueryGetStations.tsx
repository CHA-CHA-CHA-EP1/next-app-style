import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { Station } from "../types";
import { getStations } from "../services/station";

export const useQueryGetStations = (
  key: QueryKey,
  options?: Omit<
    QueryObserverOptions<Station[], Station[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await getStations();
      return response.data;
    },
    ...options,
  });
};
