"use client";
import { Button } from "@/components/ui/button";
import { useQueryGetTrainSchedules } from "@/src/modules/train-schedules/hooks/useQueryGetTrainSchedules";
import { DataTable } from "@/src/common/components/table";
import { createColumns } from "@/src/modules/train-schedules/columns";
import { useAlertDialog } from "@/src/common/hooks/useAlertDialog";
import { AlertDialogComponent } from "@/src/common/components/AlertDialog";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TableSkeleton } from "@/src/common/components/TableSkeleton";
import { useMutationDeleteTrainSchedule } from "@/src/modules/train-schedules/hooks/useMutationDeleteTrainSchedule";

export default function Page() {
  const {
    data: routes,
    isLoading,
    refetch,
  } = useQueryGetTrainSchedules(["train-schedules"], {
    staleTime: 0,
  });
  const router = useRouter();
  const { dialog, openDialog, closeDialog } = useAlertDialog();
  const { mutate: deleteTrainSchedule, isPending } =
    useMutationDeleteTrainSchedule();

  const onDelete = (id: number): void => {
    openDialog(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ที่จะลบเส้นทางนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
      () => {
        deleteTrainSchedule(
          { id },
          {
            onSuccess: () => {
              toast.success("ลบเส้นทางสำเร็จ", {
                autoClose: 1000,
                theme: "dark",
              });
              refetch();
            },
            onError: () => {
              toast.error("ไม่สามารถลบเส้นทางได้");
            },
            onSettled: () => {
              closeDialog();
            },
          },
        );
      },
    );
  };

  const onEdit = (id: number): void => {
    router.push(`/train-schedules/${id}/edit`);
  };

  const columns = createColumns({ onDelete, onEdit });

  return (
    <div className="space-y-4">
      <p className="text-[24px] font-bold">ตารางเดินรถ</p>
      <div className="w-full">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <DataTable
            columns={columns}
            data={routes || []}
            placeholderSearch="ค้นหา"
            headerContent={
              <Link href="./train-schedules/create">
                <Button disabled={isPending}>เพิ่มตารางเดินรถ</Button>
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
