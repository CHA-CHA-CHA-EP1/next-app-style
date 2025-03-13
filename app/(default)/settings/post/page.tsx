"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/src/common/components/table";
import { AlertDialogComponent } from "@/src/common/components/AlertDialog";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TableSkeleton } from "@/src/common/components/TableSkeleton";
import { useQueryGetPosts } from "@/src/modules/settings/post/hooks/useQueryGetPosts";
import { createColumns } from "@/src/modules/settings/post/columns";
import { useMutationDeletePost } from "@/src/modules/settings/post/hooks/useMutationDeletePost";
import { useAlertDialog } from "@/src/common/hooks/useAlertDialog";

export default function Page() {
  const router = useRouter();
  const { dialog, openDialog, closeDialog } = useAlertDialog();
  const {
    data: posts,
    isLoading,
    refetch,
  } = useQueryGetPosts(["posts"], {
    staleTime: 0,
  });

  const { mutate: deletePost } = useMutationDeletePost();

  const onDelete = (id: number): void => {
    openDialog(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ที่จะลบป้ายนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
      () => {
        deletePost(id, {
          onSuccess: () => {
            toast.success("ลบป้ายสำเร็จ", {
              autoClose: 1000,
              theme: "dark",
            });
            refetch();
          },
          onError: () => {
            toast.error("ไม่สามารถป้ายได้");
          },
          onSettled: () => {
            closeDialog();
          },
        });
      },
    );
  };

  const onEdit = (id: number): void => {
    router.push(`/settings/post/${id}/edit`);
  };

  const columns = createColumns({
    onDelete,
    onEdit,
  });

  return (
    <div className="space-y-4">
      <p className="text-[24px] font-bold">ข้อมูลป้าย</p>
      <div className="w-full">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <DataTable
            columns={columns}
            data={posts || []}
            placeholderSearch="ค้นหาป้าย"
            headerContent={
              <Link href="./post/create">
                <Button disabled={false}>เพิ่มป้าย</Button>
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
