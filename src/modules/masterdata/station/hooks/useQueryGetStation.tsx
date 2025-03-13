import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { Station } from "../types";
import { getStation } from "../services/station";

export const useQueryGetStation = (
  key: QueryKey,
  options?: Omit<
    QueryObserverOptions<Station, Station>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const id = key[1] as number;
      const response = await getStation(id);
      return response.data;
    },
    ...options,
  });
};
