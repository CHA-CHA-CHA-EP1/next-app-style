import { ColumnDef } from "@tanstack/react-table";
import { Post } from "./types";
import { Pencil, Trash2 } from "lucide-react";
import { FilterVariant } from "@/src/common/constants";
import { TableActions } from "@/src/common/types";

export const createColumns = ({
  onDelete,
  onEdit,
}: TableActions): ColumnDef<Post>[] => [
  {
    accessorKey: "index",
    header: "ลำดับ",
    cell: ({ row }) => row.index + 1,
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "ชื่อป้าย",
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
          onClick={() => onDelete(row.original?.id)}
        />
      </div>
    ),
  },
];
