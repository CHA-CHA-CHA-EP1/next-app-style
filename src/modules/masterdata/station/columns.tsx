import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Pencil } from "lucide-react";
import { TableActions } from "@/src/common/types";
import { FilterVariant } from "@/src/common/constants";
import { Station } from "./types";

export const createColumns = ({
  onDelete,
  onEdit,
}: TableActions): ColumnDef<Station>[] => [
  {
    accessorKey: "index",
    header: "ลำดับ",
    cell: ({ row }) => row.index + 1,
    enableSorting: true,
  },
  {
    accessorKey: "stationName",
    header: "สถานี",
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
    accessorKey: "stationNameEng",
    header: "station",
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
    accessorKey: "routePath.pathName",
    header: "เส้นทางเดินรถ",
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
