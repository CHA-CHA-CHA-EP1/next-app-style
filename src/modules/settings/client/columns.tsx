import { ColumnDef } from "@tanstack/react-table";
import { TableActions } from "@/src/common/types";
import { Client } from "./types";
import { FilterVariant } from "@/src/common/constants";
import { Pencil, Trash2 } from "lucide-react";

const checkOnlineStatus = (lastActiveDate: string | null): string => {
  // เช็คถ้าเป็น null
  if (!lastActiveDate) {
    return "offline";
  }

  // แปลง string date เป็น Date object
  const lastActive = new Date(lastActiveDate);
  const now = new Date();

  // คำนวณความต่างของเวลาเป็นนาที
  const diffInMinutes = Math.floor(
    (now.getTime() - lastActive.getTime()) / (1000 * 60),
  );

  // เช็คตามเงื่อนไขเวลา
  if (diffInMinutes < 5) {
    return "online";
  } else if (diffInMinutes < 10) {
    return `${diffInMinutes} นาทีที่แล้ว`;
  } else {
    return "offline";
  }
};

export const createColumns = ({
  onDelete,
  onEdit,
}: TableActions): ColumnDef<Client>[] => [
  {
    accessorKey: "login_code",
    header: "Login Code",
  },
  {
    accessorKey: "name",
    header: "client",
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
    accessorKey: "ipAddress",
    header: "IP Address",
  },
  {
    accessorKey: "type",
    header: "ประเภท",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: FilterVariant.MULTI_SELECT,
    },
    cell: ({ row }) => {
      const type = row.getValue("type") as string;

      const typeMap: Record<string, string> = {
        platform: "ชานชาลา",
        window: "ช่องจำหน่ายตั๋ว",
        taxi: "TAXI",
        led: "LED",
      };

      return <span>{typeMap[type] || type}</span>;
    },
  },
  {
    accessorKey: "postBox.name",
    header: "กล่องเก็บป้ายที่ผูก",
    cell: ({ row }) => (
      <div>
        {row.original.postBox?.name ? (
          row.original.postBox?.name
        ) : (
          <span className="italic text-gray-500">รอผูกกล่องเก็บป้าย</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "lastUpdate",
    header: "สถานะล่าสุด",
    cell: ({ row }) => <p>{checkOnlineStatus(row.original?.lastUpdate)}</p>,
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
