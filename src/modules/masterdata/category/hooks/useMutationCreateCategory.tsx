import { useMutation } from "@tanstack/react-query";
import { createCategory } from "../services/category";

export const useMutationCreateCategory = () => {
  return useMutation({
    mutationFn: async ({
      name,
      nameEng,
    }: {
      name: string;
      nameEng: string;
    }) => {
      const response = await createCategory(name, nameEng);
      return response.data;
    },
  });
};
