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
import { useMutationCreateRoute } from "@/src/modules/masterdata/route/hooks/useMutationCreateRoute";
import { toast } from "react-toastify";

const formSchema = z.object({
  pathName: z.string().min(1, "กรุณากรอกชื่อเส้นทาง"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const router = useRouter();
  const { mutate, isPending } = useMutationCreateRoute();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pathName: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data.pathName, {
      onSuccess: () => {
        console.log("create route path done.");
        toast.success("สร้างเส้นทางเดินรถสำเร็จ", {
          autoClose: 1000,
          theme: "dark",
        });
        router.push("/masterdata/route");
      },
      onError: () => {
        toast.error("ไม่สามารถสร้างเส้นทางได้");
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">เพิ่มเส้นทางเดินรถ</p>
        <Button variant="outline" onClick={() => router.back()}>
          ย้อนกลับ
        </Button>
      </div>

      <Card className="p-6 shadow-none rounded">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="pathName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อเส้นทาง</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกชื่อเส้นทาง" {...field} />
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
