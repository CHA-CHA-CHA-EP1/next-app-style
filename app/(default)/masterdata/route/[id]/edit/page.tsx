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
import { useQueryGetRoute } from "@/src/modules/masterdata/route/hooks/useQueryGetRoute";
import { useMutationUpdateRoute } from "@/src/modules/masterdata/route/hooks/useMutationUpdateRoute";
import { toast } from "react-toastify";
import { useEffect } from "react";

const formSchema = z.object({
  pathName: z.string().min(1, "กรุณากรอกชื่อเส้นทาง"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: route, isLoading } = useQueryGetRoute(["getRoute", params.id], {
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  const { mutate, isPending } = useMutationUpdateRoute();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pathName: "",
    },
  });

  useEffect(() => {
    // Only reset if route exists and name changed
    if (route && route.pathName !== form.getValues("pathName")) {
      form.reset({ pathName: route.pathName });
    }
  }, [route?.pathName]); // Only depend on pathName changes

  if (!route || isLoading) {
    return <div>Loading...</div>;
  }

  const onSubmit = (data: FormValues) => {
    mutate(
      { id: parseInt(params.id), name: data.pathName },
      {
        onSuccess: () => {
          toast.success("แก้ไขเส้นทางเดินรถสำเร็จ", {
            autoClose: 1000,
            theme: "dark",
          });
          router.push("/masterdata/route");
        },
        onError: () => {
          toast.error("ไม่สามารถแก้ไขเส้นทางได้");
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">แก้ไขเส้นทางเดินรถ</p>
        <Button variant="outline" onClick={() => router.back()}>
          ย้อนกลับ
        </Button>
      </div>
      <Card className="p-6 rounded shadow-none">
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
