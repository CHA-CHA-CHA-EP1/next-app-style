"use client";
import { Button } from "@/components/ui/button";
import { useQueryGetTrains } from "@/src/modules/masterdata/train/hooks/useQueryGetTrains";
import { DataTable } from "@/src/common/components/table";
import { createColumns } from "@/src/modules/masterdata/train/columns";
import { useAlertDialog } from "@/src/common/hooks/useAlertDialog";
import { AlertDialogComponent } from "@/src/common/components/AlertDialog";
import { useMutationDeleteTrain } from "@/src/modules/masterdata/train/hooks/useMutationDeleteTrain";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TableSkeleton } from "@/src/common/components/TableSkeleton";

export default function Page() {
  const {
    data: trains,
    isLoading,
    refetch,
  } = useQueryGetTrains(["trains"], {
    staleTime: 0,
  });
  const router = useRouter();
  const { dialog, openDialog, closeDialog } = useAlertDialog();
  const { mutate: deleteTrain, isPending } = useMutationDeleteTrain();

  const onDelete = (id: number): void => {
    openDialog(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ที่จะลบขบวนรถ? การกระทำนี้ไม่สามารถย้อนกลับได้",
      () => {
        deleteTrain(id, {
          onSuccess: () => {
            toast.success("ลบขบวนรถสำเร็จ", {
              autoClose: 1000,
              theme: "dark",
            });
            refetch();
          },
          onError: () => {
            toast.error("ไม่สามารถลบขบวนรถได้");
          },
          onSettled: () => {
            closeDialog();
          },
        });
      },
    );
  };

  const onEdit = (id: number): void => {
    router.push(`/masterdata/train/${id}/edit`);
  };

  const columns = createColumns({ onDelete, onEdit });

  return (
    <div className="space-y-4">
      <p className="text-[24px] font-bold">รายชื่อขบวนรถ</p>
      <div className="w-full">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <DataTable
            columns={columns}
            data={trains || []}
            placeholderSearch="ค้นหา"
            headerContent={
              <Link href="./train/create">
                <Button disabled={isPending}>เพิ่มขบวนรถ</Button>
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
