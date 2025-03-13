import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { TrainSchedule } from "../types";
import { getTrainSchedules } from "../services/train-schedules";

export const useQueryGetTrainSchedules = (
  key: QueryKey,
  options?: Omit<
    QueryObserverOptions<TrainSchedule[], TrainSchedule[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await getTrainSchedules();
      return response.data;
    },
    ...options,
  });
};
