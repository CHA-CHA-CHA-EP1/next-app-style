import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { Train } from "../types";
import { getTrain } from "../services/train";

export const useQueryGetTrain = (
  key: QueryKey,
  options?: Omit<QueryObserverOptions<Train, Train>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const id = key[1] as number;
      const response = await getTrain(id);
      return response.data;
    },
    ...options,
  });
};
