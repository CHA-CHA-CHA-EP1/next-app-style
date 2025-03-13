import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { Category } from "../types";
import { getCategory } from "../services/category";

export const useQueryGetCategory = (
  key: QueryKey,
  options?: Omit<
    QueryObserverOptions<Category, Category>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const id = key[1] as number;
      const response = await getCategory(id);
      return response.data;
    },
    ...options,
  });
};
