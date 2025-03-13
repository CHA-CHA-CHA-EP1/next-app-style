import { ColumnDef } from "@tanstack/react-table";
import { ROUND_TRIP, TrainSchedule } from "./types";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { FilterVariant } from "@/src/common/constants";
import { TableActions } from "@/src/common/types";
import { addMinutesToTimeString } from "@/src/common/helper/time";
import { resetTemporaryALL } from "./services/train-schedules";

export interface DayOption {
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

export const createColumns = ({
  onDelete,
  onEdit,
}: TableActions): ColumnDef<TrainSchedule>[] => [
  {
    accessorKey: "train.trainName",
    header: "ขบวน",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: FilterVariant.MULTI_SELECT,
    },
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues.length) return true;
      const value = row.getValue(id);
      return filterValues.includes(value as string);
    },
  },
  {
    accessorKey: "train.category.categoryName",
    header: "ประเภทรถ",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: FilterVariant.MULTI_SELECT,
    },
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues.length) return true;
      const value = row.getValue(id);
      return filterValues.includes(value as string);
    },
  },
  {
    accessorKey: "platformNumber",
    header: "ชานชาลา",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: FilterVariant.MULTI_SELECT,
    },
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues.length) return true;
      const value = row.getValue(id);
      return filterValues.includes(value as string);
    },
  },
  {
    accessorKey: "roundTrip",
    header: "เที่ยว",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: FilterVariant.MULTI_SELECT,
    },
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues.length) return true;
      const value = row.getValue(id);
      return filterValues.includes(value as string);
    },
    cell: ({ row }) => {
      return row.original.roundTrip == ROUND_TRIP.ARRIVE
        ? "เที่ยวกลับ"
        : "เที่ยวไป";
    },
  },
  {
    accessorKey: "arrivalStation.stationName",
    header: "สถานีต้นทาง",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: FilterVariant.MULTI_SELECT,
    },
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues.length) return true;
      const value = row.getValue(id);
      return filterValues.includes(value as string);
    },
  },
  {
    accessorKey: "arrivalTime",
    header: "เวลาออก",
  },
  {
    accessorKey: "departureStation.stationName",
    header: "สถานีปลายทาง",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: FilterVariant.MULTI_SELECT,
    },
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues.length) return true;
      const value = row.getValue(id);
      return filterValues.includes(value as string);
    },
  },
  {
    accessorKey: "departureTime",
    header: "เวลาถึง",
  },
  {
    accessorKey: "updatedAt",
    header: "แก้ไขล่าสุด",
    cell: ({ row }) => {
      return row.original.updatedAt
        ? row.original.updatedAt
        : row.original.createdAt;
    },
  },
  {
    accessorKey: "Mon",
    header: "วันให้บริการ",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: FilterVariant.DAYS_SELECT,
    },
    filterFn: (row, _, selectedDays: string[]) => {
      if (!selectedDays?.length) return true;

      return selectedDays.every(
        (day) => row.original[day as keyof TrainSchedule] === true,
      );
    },
    cell: ({ row }) => (
      <div className="flex gap-1 items-center">
        {DAYS_OPTIONS.map((day) => (
          <div key={day.value} className="flex flex-col items-center w-8">
            <span className="text-xs font-medium mb-1">{day.label}</span>
            {row.original[day.value] ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4 text-gray-300" />
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    header: () => <div className="text-center">จัดการ</div>,
    cell: ({ row }) => (
      <div className="flex justify-center gap-2">
        <Pencil
          size={16}
          className="cursor-pointer hover:text-blue-600"
          onClick={() => onEdit(row.original.id)}
        />
        <Trash2
          size={16}
          className="cursor-pointer hover:text-red-600"
          onClick={() => onDelete(row.original.id)}
        />
      </div>
    ),
  },
];

export type EditType = "time" | "platform";

export const temporaryColumns = ({
  onEdit,
  restartTemporary,
  resetAllTemporary,
  roundTrip,
}: {
  onEdit: (type: EditType, train: TrainSchedule) => void;
  restartTemporary: (id: number) => void;
  resetAllTemporary: () => void;
  roundTrip: ROUND_TRIP;
}): ColumnDef<TrainSchedule>[] => [
  {
    accessorKey: "train.trainName",
    header: "ขบวน",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: FilterVariant.MULTI_SELECT,
    },
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues.length) return true;
      const value = row.getValue(id);
      return filterValues.includes(value as string);
    },
  },
  {
    accessorKey:
      roundTrip == ROUND_TRIP.ARRIVE.toLowerCase()
        ? "arrivalStation.stationName"
        : "departureStation.stationName",
    header:
      roundTrip == ROUND_TRIP.ARRIVE.toLowerCase()
        ? "จากสถานีต้นทาง"
        : "สถานีปลายทาง",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: FilterVariant.MULTI_SELECT,
    },
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues.length) return true;
      const value = row.getValue(id);
      return filterValues.includes(value as string);
    },
  },
  {
    // เปลี่ยนจาก accessorKey เป็น accessorFn
    accessorFn: (row) => {
      const value = row.temporaryPlatformNumber ?? row.platformNumber;
      return row.temporaryPlatformNumber ? `${value} (ชั่วคราว)` : value;
    },
    id: "platformNumber", // ต้องกำหนด id เมื่อใช้ accessorFn
    header: "ชานชาลา",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: FilterVariant.MULTI_SELECT,
    },
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues.length) return true;
      const value = row.getValue(id);
      return filterValues.includes(value as string);
    },
  },
  {
    accessorKey:
      roundTrip == ROUND_TRIP.ARRIVE.toLowerCase()
        ? "departureTime"
        : "arrivalTime",
    header:
      roundTrip == ROUND_TRIP.ARRIVE.toLowerCase() ? "เวลาเข้า" : "กำหนดออก",
  },
  {
    accessorKey: "lateTime",
    header:
      roundTrip == ROUND_TRIP.ARRIVE.toLowerCase() ? "เข้าจริง" : "ออกจริง",
    cell: ({ row }) => {
      const lateTime = row.getValue("lateTime") as number;
      const baseTime =
        roundTrip === ROUND_TRIP.ARRIVE.toLowerCase()
          ? (row.getValue("departureTime") as string)
          : (row.getValue("arrivalTime") as string);

      return addMinutesToTimeString(baseTime, lateTime);
    },
  },
  {
    accessorKey: "lateTime",
    header: "ลาช้า (นาที)",
  },
  {
    id: "actions",
    header: () => (
      <div className="flex justify-between items-center">
        <span>จัดการ</span>
        <button
          onClick={() => resetAllTemporary()}
          className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          RESET ALL
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          onClick={() => onEdit("time", row.original)}
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          แก้ไขเวลา
        </button>
        <button
          onClick={() => onEdit("platform", row.original)}
          className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
        >
          แก้ไขชานชาลา
        </button>
        <button
          onClick={() => restartTemporary(row.original.id)}
          className="px-2 py-1 text-sm bg-orange-500 text-white rounded hover:bg-blue-600"
        >
          RESET
        </button>
      </div>
    ),
  },
];
