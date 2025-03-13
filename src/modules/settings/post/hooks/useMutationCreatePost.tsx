import { useMutation } from "@tanstack/react-query";
import { createPost } from "../services/post";
import { CreatePostDto } from "../types";

export const useMutationCreatePost = () => {
  return useMutation({
    mutationFn: async (post: CreatePostDto) => {
      const response = await createPost(post);
      return response.data;
    },
  });
};
