import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { getRoutes } from "../services/route";
import { Route } from "../types";

export const useQueryGetRoutes = (
  key: QueryKey,
  options?: Omit<
    QueryObserverOptions<Route[], Route[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await getRoutes();
      return response.data;
    },
    ...options,
  });
};
