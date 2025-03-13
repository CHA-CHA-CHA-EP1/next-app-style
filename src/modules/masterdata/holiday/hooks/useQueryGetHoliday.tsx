import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { Holiday } from "../types";
import { getHoliday } from "../services/holiday";

export const useQueryGetHoliday = (
  key: QueryKey,
  options?: Omit<
    QueryObserverOptions<Holiday, Holiday>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const id = key[1] as number;
      const response = await getHoliday(id);
      return {
        ...response.data,
        date: new Date(response.data.date).toISOString().split("T")[0],
      };
    },
    ...options,
  });
};
