import {
  QueryKey,
  QueryObserverOptions,
  useQuery,
} from "@tanstack/react-query";
import { Post } from "../types";
import { getPost } from "../services/post";

export const useQueryPost = (
  key: QueryKey,
  options?: Omit<QueryObserverOptions<Post, Post>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const id = key[1] as number;
      const response = await getPost(id);
      return response.data;
    },
    ...options,
  });
};
