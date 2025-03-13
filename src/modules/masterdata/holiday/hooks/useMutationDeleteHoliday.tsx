import { useMutation } from "@tanstack/react-query";
import { deleteHoliday } from "../services/holiday";

export const useMutationDeleteHoliday = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteHoliday(id);
      return response.data;
    },
  });
};
