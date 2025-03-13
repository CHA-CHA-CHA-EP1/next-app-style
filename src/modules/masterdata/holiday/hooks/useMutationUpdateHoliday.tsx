import { useMutation } from "@tanstack/react-query";
import { updateHoliday } from "../services/holiday";

export const useMutationUpdateHoliday = () => {
  return useMutation({
    mutationFn: async ({
      id,
      name,
      date,
    }: {
      id: number;
      name: string;
      date: string;
    }) => {
      const response = await updateHoliday(id, name, date);
      return response.data;
    },
  });
};
