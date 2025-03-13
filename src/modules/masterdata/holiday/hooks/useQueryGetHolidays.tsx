import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { Holiday } from "../types";
import { getHolidays } from "../services/holiday";

export const useQueryGetHolidays = (
  key: QueryKey,
  options?: Omit<
    QueryObserverOptions<Holiday[], Holiday[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await getHolidays();
      const { data } = response;

      return data.map((item: Holiday) => {
        return {
          id: item.id,
          name: item.name,
          date: new Date(item.date).toISOString().split("T")[0],
        };
      });
    },
    ...options,
  });
};
