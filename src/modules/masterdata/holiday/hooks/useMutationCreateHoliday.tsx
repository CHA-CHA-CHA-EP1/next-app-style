import { useMutation } from "@tanstack/react-query";
import { createHoliday } from "../services/holiday";

export const useMutationCreateHoliday = () => {
  return useMutation({
    mutationFn: async ({ name, date }: { name: string; date: string }) => {
      const response = await createHoliday(name, date);
      return response.data;
    },
  });
};
