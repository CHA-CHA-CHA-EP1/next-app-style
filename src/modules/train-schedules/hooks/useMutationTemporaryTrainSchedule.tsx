import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { TrainSchedule } from "../types";
import { getTrainScheduleByRoundTrip } from "../services/train-schedules";

export const useQueryTemporaryTrainSchedules = (
  key: QueryKey,
  options?: Omit<
    QueryObserverOptions<TrainSchedule[], TrainSchedule[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const roundTrip = key[1] as string;
      const response = await getTrainScheduleByRoundTrip(roundTrip);
      return response?.data || [];
    },
    ...options,
  });
};
