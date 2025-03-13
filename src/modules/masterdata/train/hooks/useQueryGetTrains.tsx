import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { Train } from "../types";
import { getTrains } from "../services/train";

export const useQueryGetTrains = (
  key: QueryKey,
  options?: Omit<
    QueryObserverOptions<Train[], Train[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await getTrains();
      return response.data;
    },
    ...options,
  });
};
