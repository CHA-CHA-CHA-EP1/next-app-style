"use client";
import { Button } from "@/components/ui/button";
import { useQueryGetStations } from "@/src/modules/masterdata/station/hooks/useQueryGetStations";
import { DataTable } from "@/src/common/components/table";
import { createColumns } from "@/src/modules/masterdata/station/columns";
import { useAlertDialog } from "@/src/common/hooks/useAlertDialog";
import { AlertDialogComponent } from "@/src/common/components/AlertDialog";
import { useMutationDeleteStation } from "@/src/modules/masterdata/station/hooks/useMutationDeleteStation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TableSkeleton } from "@/src/common/components/TableSkeleton";

export default function Page() {
  const {
    data: routes,
    isLoading,
    refetch,
  } = useQueryGetStations(["stations"], {
    staleTime: 0,
  });
  const router = useRouter();
  const { dialog, openDialog, closeDialog } = useAlertDialog();
  const { mutate: deleteStation, isPending } = useMutationDeleteStation();

  const onDelete = (id: number): void => {
    openDialog(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ที่จะสถานีนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
      () => {
        deleteStation(id, {
          onSuccess: () => {
            toast.success("ลบสถานีทางสำเร็จ", {
              autoClose: 1000,
              theme: "dark",
            });
            refetch();
          },
          onError: () => {
            toast.error("ไม่สามารถสถานีได้");
          },
          onSettled: () => {
            closeDialog();
          },
        });
      },
    );
  };

  const onEdit = (id: number): void => {
    router.push(`/masterdata/station/${id}/edit`);
  };

  const columns = createColumns({ onDelete, onEdit });

  return (
    <div className="space-y-4">
      <p className="text-[24px] font-bold">รายชื่อสถานี</p>
      <div className="w-full">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <DataTable
            columns={columns}
            data={routes || []}
            placeholderSearch="ค้นหา"
            headerContent={
              <Link href="./station/create">
                <Button disabled={isPending}>เพิ่มสถานี</Button>
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
