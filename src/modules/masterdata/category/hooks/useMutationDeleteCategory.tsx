import { useMutation } from "@tanstack/react-query";
import { deleteCategory } from "../services/category";

export const useMutationDeleteCategory = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteCategory(id);
      return response.data;
    },
  });
};
