import { useMutation } from "@tanstack/react-query";
import { copyHolidayByYear } from "../services/holiday";

export const useMutationCopyHoliday = () => {
  return useMutation({
    mutationFn: async ({
      yearFrom,
      yearTo,
    }: {
      yearFrom: number;
      yearTo: number;
    }) => {
      const response = await copyHolidayByYear(yearFrom, yearTo);
      return response.data;
    },
  });
};
