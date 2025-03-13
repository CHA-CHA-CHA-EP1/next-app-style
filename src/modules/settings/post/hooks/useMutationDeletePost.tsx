import { useMutation } from "@tanstack/react-query";
import { deletePost } from "../services/post";

export const useMutationDeletePost = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deletePost(id);
      return response.data;
    },
  });
};
