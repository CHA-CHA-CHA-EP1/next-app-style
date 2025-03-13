import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { getRoute } from "../services/route";
import { Route } from "../types";

export const useQueryGetRoute = (
  key: QueryKey,
  options?: Omit<QueryObserverOptions<Route, Route>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const id = key[1] as number;
      const response = await getRoute(id);
      return response.data;
    },
    ...options,
  });
};
