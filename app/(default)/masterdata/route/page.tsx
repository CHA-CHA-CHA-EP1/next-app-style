"use client";
import { Button } from "@/components/ui/button";
import { useQueryGetRoutes } from "@/src/modules/masterdata/route/hooks/useQueryGetRoutes";
import { DataTable } from "@/src/common/components/table";
import { createColumns } from "@/src/modules/masterdata/route/columns";
import { useAlertDialog } from "@/src/common/hooks/useAlertDialog";
import { AlertDialogComponent } from "@/src/common/components/AlertDialog";
import { useMutationDeleteRoute } from "@/src/modules/masterdata/route/hooks/useMutationDeleteRoute";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TableSkeleton } from "@/src/common/components/TableSkeleton";

export default function Page() {
  const {
    data: routes,
    isLoading,
    refetch,
  } = useQueryGetRoutes(["routes"], {
    staleTime: 0,
  });
  const router = useRouter();
  const { dialog, openDialog, closeDialog } = useAlertDialog();
  const { mutate: deleteRoute, isPending } = useMutationDeleteRoute();

  const onDelete = (id: number): void => {
    openDialog(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ที่จะลบเส้นทางนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
      () => {
        deleteRoute(id, {
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
        });
      },
    );
  };

  const onEdit = (id: number): void => {
    router.push(`/masterdata/route/${id}/edit`);
  };

  const columns = createColumns({ onDelete, onEdit });

  return (
    <div className="space-y-4">
      <p className="text-[24px] font-bold">เส้นทางเดินรถ</p>
      <div className="w-full">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <DataTable
            columns={columns}
            data={routes || []}
            placeholderSearch="ค้นหาเส้นทางเดินรถ"
            headerContent={
              <Link href="./route/create">
                <Button disabled={isPending}>เพิ่มเส้นทางเดินรถ</Button>
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
