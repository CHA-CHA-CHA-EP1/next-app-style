"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/src/common/components/table";
import { createColumns } from "@/src/modules/masterdata/category/columns";
import { useAlertDialog } from "@/src/common/hooks/useAlertDialog";
import { AlertDialogComponent } from "@/src/common/components/AlertDialog";
import { useMutationDeleteCategory } from "@/src/modules/masterdata/category/hooks/useMutationDeleteCategory";
import { useQueryGetCategories } from "@/src/modules/masterdata/category/hooks/useQueryGetCategories";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TableSkeleton } from "@/src/common/components/TableSkeleton";

export default function Page() {
  const {
    data: categories,
    isLoading,
    refetch,
  } = useQueryGetCategories(["categories"], {
    staleTime: 0,
  });
  const router = useRouter();
  const { dialog, openDialog, closeDialog } = useAlertDialog();
  const { mutate: deleteCategory, isPending } = useMutationDeleteCategory();

  const onDelete = (id: number): void => {
    openDialog(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ที่จะลบรายชื่อประเภทรถ? การกระทำนี้ไม่สามารถย้อนกลับได้",
      () => {
        deleteCategory(id, {
          onSuccess: () => {
            toast.success("ลบประเภทรถทางสำเร็จ", {
              autoClose: 1000,
              theme: "dark",
            });
            refetch();
          },
          onError: () => {
            toast.error("ไม่สามารถประเภทรถเส้นทางได้");
          },
          onSettled: () => {
            closeDialog();
          },
        });
      },
    );
  };

  const onEdit = (id: number): void => {
    router.push(`/masterdata/category/${id}/edit`);
  };

  const columns = createColumns({ onDelete, onEdit });

  return (
    <div className="space-y-4">
      <p className="text-[24px] font-bold">รายชื่อประเภทรถ</p>
      <div className="w-full">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <DataTable
            columns={columns}
            data={categories || []}
            placeholderSearch="ค้นหาประเภทรถ"
            headerContent={
              <Link href="./category/create">
                <Button disabled={isPending}>เพิ่มประเภทรถ</Button>
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
