"use client";

import { Button } from "@/components/ui/button";
import { AlertDialogComponent } from "@/src/common/components/AlertDialog";
import { DataTable } from "@/src/common/components/table";
import { TableSkeleton } from "@/src/common/components/TableSkeleton";
import { useAlertDialog } from "@/src/common/hooks/useAlertDialog";
import { createColumns } from "@/src/modules/settings/client/columns";
import { useMutationRemoveClient } from "@/src/modules/settings/client/hooks/useMutationRemoveClient";
import { useQueryGetClients } from "@/src/modules/settings/client/hooks/useQueryGetClients";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { toast } from "react-toastify";

export default function Page() {
  const {
    data: clients,
    isLoading,
    isPending,
    refetch,
  } = useQueryGetClients(["clients"], {
    staleTime: 0,
  });

  const router = useRouter();

  const { dialog, openDialog, closeDialog } = useAlertDialog();
  const { mutate: removeClient } = useMutationRemoveClient();

  const onDelete = (id: number) => {
    openDialog(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ที่จะลบเครื่องลูกข่ายนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
      () => {
        removeClient(id, {
          onSuccess: async () => {
            toast.success("ลบเส้นทางสำเร็จ", {
              autoClose: 1000,
              theme: "dark",
            });
            await refetch();
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

  const onEdit = (id: number) => {
    router.push(`/settings/client/${id}/edit`);
  };

  const columns = createColumns({ onDelete, onEdit });

  return (
    <div className="space-y-4">
      <p className="text-[24px] font-bold">เครื่องลูกข่าย</p>
      <div className="w-full">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <DataTable
            columns={columns}
            data={clients || []}
            placeholderSearch="ค้นหาเครื่องลูกข่าย"
            headerContent={
              <Link href="./client/create">
                <Button disabled={isPending}>เพิ่มเครื่องลูกข่าย</Button>
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
