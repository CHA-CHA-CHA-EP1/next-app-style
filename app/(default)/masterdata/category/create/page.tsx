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
import { useMutationCreateCategory } from "@/src/modules/masterdata/category/hooks/useMutationCreateCategory";
import { toast } from "react-toastify";

const formSchema = z.object({
  categoryName: z.string().min(1, "กรุณากรอกชื่อหมวดหมู่"),
  categoryNameEng: z.string().min(1, "กรุณากรอกชื่อหมวดหมู่ภาษาอังกฤษ"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const router = useRouter();
  const { mutate, isPending } = useMutationCreateCategory();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
      categoryNameEng: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(
      {
        name: data.categoryName,
        nameEng: data.categoryNameEng,
      },
      {
        onSuccess: () => {
          toast.success("สร้างหมวดหมู่สำเร็จ", {
            autoClose: 1000,
            theme: "dark",
          });
          router.push("/masterdata/category");
        },
        onError: () => {
          toast.error("ไม่สามารถสร้างหมวดหมู่ได้");
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">เพิ่มหมวดหมู่</p>
        <Button variant="outline" onClick={() => router.back()}>
          ย้อนกลับ
        </Button>
      </div>

      <Card className="p-6 shadow-none rounded">
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
