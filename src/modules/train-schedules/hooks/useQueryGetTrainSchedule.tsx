import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { TrainSchedule } from "../types";
import { getTrainSchedule } from "../services/train-schedules";

export const useQueryGetTrainSchedule = (
  key: QueryKey,
  options?: Omit<
    QueryObserverOptions<TrainSchedule, TrainSchedule>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const id = key[1] as number;
      const response = await getTrainSchedule(id);
      return response.data;
    },
    ...options,
  });
};
