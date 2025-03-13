import { useMutation } from "@tanstack/react-query";
import { updateCategory } from "../services/category";

export const useMutationUpdateCategory = () => {
  return useMutation({
    mutationFn: async ({
      id,
      name,
      nameEng,
    }: {
      id: number;
      name: string;
      nameEng: string;
    }) => {
      const response = await updateCategory(id, name, nameEng);
      return response.data;
    },
  });
};
