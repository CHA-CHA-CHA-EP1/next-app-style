import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { PostBox } from "../types";
import { getPostBoxes } from "../services/postbox";

export const useQueryGetPostBoxes = (
  key: QueryKey,
  options?: Omit<
    QueryObserverOptions<PostBox[], PostBox[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await getPostBoxes();
      return response.data;
    },
    ...options,
  });
};
