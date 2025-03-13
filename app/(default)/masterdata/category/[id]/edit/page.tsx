"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useQueryGetCategory } from "@/src/modules/masterdata/category/hooks/useQueryGetCategory";
import { useMutationUpdateCategory } from "@/src/modules/masterdata/category/hooks/useMutationUpdateCategory";
import { toast } from "react-toastify";
import { useEffect } from "react";

const formSchema = z.object({
  categoryName: z.string().min(1, "กรุณากรอกชื่อหมวดหมู่"),
  categoryNameEng: z.string().min(1, "กรุณากรอกชื่อหมวดหมู่ภาษาอังกฤษ"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();

  const { data: category, isLoading } = useQueryGetCategory(
    ["getCategory", params.id],
    {
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  );

  const { mutate, isPending } = useMutationUpdateCategory();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
      categoryNameEng: "",
    },
  });

  useEffect(() => {
    if (
      category &&
      (category.categoryName !== form.getValues("categoryName") ||
        category.categoryNameEng !== form.getValues("categoryNameEng"))
    ) {
      form.reset({
        categoryName: category.categoryName,
        categoryNameEng: category.categoryNameEng,
      });
    }
  }, [category?.categoryName, category?.categoryNameEng]);

  if (!category || isLoading) {
    return <div>Loading...</div>;
  }

  const onSubmit = (data: FormValues) => {
    mutate(
      {
        id: parseInt(params.id),
        name: data.categoryName,
        nameEng: data.categoryNameEng,
      },
      {
        onSuccess: () => {
          toast.success("แก้ไขหมวดหมู่สำเร็จ", {
            autoClose: 1000,
            theme: "dark",
          });
          router.push("/masterdata/category");
        },
        onError: () => {
          toast.error("ไม่สามารถแก้ไขหมวดหมู่ได้");
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">แก้ไขหมวดหมู่</p>
        <Button variant="outline" onClick={() => router.back()}>
          ย้อนกลับ
        </Button>
      </div>

      <Card className="p-6 rounded shadow-none">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อหมวดหมู่</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกชื่อหมวดหมู่" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryNameEng"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อหมวดหมู่ภาษาอังกฤษ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="กรอกชื่อหมวดหมู่ภาษาอังกฤษ"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isPending}>
                บันทึก
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
