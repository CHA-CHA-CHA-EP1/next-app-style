// components/table/table-filter.tsx
import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterVariant } from "@/src/common/constants";
import { Column } from "@tanstack/react-table";
import { ROUND_TRIP, TrainSchedule } from "@/src/modules/train-schedules/types";

interface TableFilterProps<TData> {
  column: Column<TData>;
  filterVariant: FilterVariant;
}

interface DayOption {
  value: keyof TrainSchedule; // monday, tuesday, etc.
  label: string; // Mon, Tue, etc.
}

const DAYS_OPTIONS: DayOption[] = [
  { value: "monday", label: "MON" },
  { value: "tuesday", label: "TUE" },
  { value: "wednesday", label: "WED" },
  { value: "thursday", label: "THU" },
  { value: "friday", label: "FRI" },
  { value: "satday", label: "SAT" },
  { value: "sunday", label: "SUN" },
  { value: "holiday", label: "HOL" },
];

export function TableFilter<TData>({
  column,
  filterVariant,
}: TableFilterProps<TData>) {
  const [open, setOpen] = React.useState(false);

  const getUniqueValues = () => {
    const uniqueValues = new Set<string>();
    (column.getFacetedUniqueValues() as Map<string, number>).forEach(
      (_, value) => {
        uniqueValues.add(value);
      },
    );

    if (column.id == "roundTrip") {
      return Array.from(uniqueValues).map((value) => ({
        value,
        label: value == ROUND_TRIP.ARRIVE ? "เที่ยวกลับ" : "เที่ยวไป",
      }));
    }

    if (column.id === "type") {
      const typeMap: Record<string, string> = {
        window: "ช่องจำหน่ายตั๋ว",
        platform: "ชานชาลา",
        taxi: "TAXI",
        led: "LED",
      };

      return Array.from(uniqueValues).map((value) => ({
        value,
        label: typeMap[value] || value,
      }));
    }
    return Array.from(uniqueValues).map((value) => ({
      value,
      label: value,
    }));
  };

  const options = getUniqueValues();
  const selectedValues = (column.getFilterValue() as string[]) || [];

  if (filterVariant === FilterVariant.MULTI_SELECT) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedValues.length === 0
              ? `${column.columnDef.header as string}`
              : `${selectedValues.length} รายการที่เลือก`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2">
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`select-all-${column.id}`}
                  checked={selectedValues.length === options.length}
                  onCheckedChange={(checked) => {
                    column.setFilterValue(
                      checked ? options.map((opt) => opt.value) : [],
                    );
                  }}
                />
                <label
                  htmlFor={`select-all-${column.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  เลือกทั้งหมด
                </label>
              </div>
              <div className="h-px bg-muted" />
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${column.id}-${option.value}`}
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const newSelected = checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter(
                            (value) => value !== option.value,
                          );
                      column.setFilterValue(
                        newSelected.length ? newSelected : undefined,
                      );
                    }}
                  />
                  <label
                    htmlFor={`${column.id}-${option.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    );
  }

  if (filterVariant === FilterVariant.BOOLEAN_SELECT) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[120px] justify-between"
          >
            {column.getFilterValue() === undefined
              ? (column.columnDef.header as string)
              : column.getFilterValue()
                ? "เปิด"
                : "ปิด"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[120px] p-2">
          <div className="space-y-2">
            <div
              className="cursor-pointer p-1 hover:bg-accent rounded"
              onClick={() => column.setFilterValue(undefined)}
            >
              ทั้งหมด
            </div>
            <div
              className="cursor-pointer p-1 hover:bg-accent rounded"
              onClick={() => column.setFilterValue(true)}
            >
              เปิด
            </div>
            <div
              className="cursor-pointer p-1 hover:bg-accent rounded"
              onClick={() => column.setFilterValue(false)}
            >
              ปิด
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  if (filterVariant === FilterVariant.DAYS_SELECT) {
    console.log("days-select");
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedValues.length === 0
              ? "วันให้บริการ"
              : `${selectedValues.length} วัน`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2">
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`select-all-days`}
                  checked={selectedValues.length === DAYS_OPTIONS.length}
                  onCheckedChange={(checked) => {
                    column.setFilterValue(
                      checked ? DAYS_OPTIONS.map((opt) => opt.value) : [],
                    );
                  }}
                />
                <label
                  htmlFor={`select-all-days`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  เลือกทั้งหมด
                </label>
              </div>
              <div className="h-px bg-muted" />
              {DAYS_OPTIONS.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={selectedValues.includes(day.value)}
                    onCheckedChange={(checked) => {
                      const newSelected = checked
                        ? [...selectedValues, day.value]
                        : selectedValues.filter((val) => val !== day.value);
                      column.setFilterValue(
                        newSelected.length ? newSelected : undefined,
                      );
                    }}
                  />
                  <label
                    htmlFor={`day-${day.value}`}
                    className="text-sm font-medium leading-none"
                  >
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    );
  }

  return null;
}
