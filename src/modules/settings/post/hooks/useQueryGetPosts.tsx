import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { Post } from "../types";
import { getPosts } from "../services/post";

export const useQueryGetPosts = (
  key: QueryKey,
  options?: Omit<QueryObserverOptions<Post[], Post[]>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await getPosts();
      return response.data;
    },
    ...options,
  });
};
