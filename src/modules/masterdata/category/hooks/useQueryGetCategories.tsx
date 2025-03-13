import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { Category } from "../types";
import { getCategories } from "../services/category";

export const useQueryGetCategories = (
  key: QueryKey,
  options?: Omit<
    QueryObserverOptions<Category[], Category[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await getCategories();
      return response.data;
    },
    ...options,
  });
};
