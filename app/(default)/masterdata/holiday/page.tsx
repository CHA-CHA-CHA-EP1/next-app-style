"use client";
import { Button } from "@/components/ui/button";
import { useQueryGetHolidays } from "@/src/modules/masterdata/holiday/hooks/useQueryGetHolidays";
import { DataTable } from "@/src/common/components/table";
import { createColumns } from "@/src/modules/masterdata/holiday/columns";
import { useAlertDialog } from "@/src/common/hooks/useAlertDialog";
import { AlertDialogComponent } from "@/src/common/components/AlertDialog";
import { useMutationDeleteHoliday } from "@/src/modules/masterdata/holiday/hooks/useMutationDeleteHoliday";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TableSkeleton } from "@/src/common/components/TableSkeleton";

export default function Page() {
  const {
    data: holidays,
    isLoading,
    refetch,
  } = useQueryGetHolidays(["holidays"], {
    staleTime: 0,
  });
  const router = useRouter();
  const { dialog, openDialog, closeDialog } = useAlertDialog();
  const { mutate: deleteHoliday, isPending } = useMutationDeleteHoliday();

  const onDelete = (id: number): void => {
    openDialog(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ที่จะวันหยุดนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
      () => {
        deleteHoliday(id, {
          onSuccess: () => {
            toast.success("ลบวันหยุดสำเร็จ", {
              autoClose: 1000,
              theme: "dark",
            });
            refetch();
          },
          onError: () => {
            toast.error("ไม่สามารถลบวันหยุดได้");
          },
          onSettled: () => {
            closeDialog();
          },
        });
      },
    );
  };

  const onEdit = (id: number): void => {
    router.push(`/masterdata/holiday/${id}/edit`);
  };

  const columns = createColumns({ onDelete, onEdit });

  return (
    <div className="space-y-4">
      <p className="text-[24px] font-bold">รายชื่อวันหยุด</p>
      <div className="w-full">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <DataTable
            columns={columns}
            data={holidays || []}
            placeholderSearch="ค้นหา"
            headerContent={
              <Link href="./holiday/create">
                <Button disabled={isPending}>เพิ่มวันหยุด</Button>
              </Link>
            }
          />
        )}
      </div>
      <AlertDialogComponent
        isOpen={dialog.isOpen}
        title={dialog.title}
        description={dialog.description}
        onConfirm={dialog.onConfirm}
        onCancel={closeDialog}
      />
    </div>
  );
}
