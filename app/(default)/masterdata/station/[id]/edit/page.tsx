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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useQueryGetStation } from "@/src/modules/masterdata/station/hooks/useQueryGetStation";
import { useMutationUpdateStation } from "@/src/modules/masterdata/station/hooks/useMutationUpdateStation";
import { useQueryGetRoutes } from "@/src/modules/masterdata/route/hooks/useQueryGetRoutes";
import { toast } from "react-toastify";
import { useEffect } from "react";

const formSchema = z.object({
  stationName: z.string().min(1, "กรุณากรอกชื่อสถานี"),
  stationNameEng: z.string().min(1, "กรุณากรอกชื่อสถานีภาษาอังกฤษ"),
  routePathId: z.string().min(1, "กรุณาเลือกเส้นทาง"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();

  // ดึงข้อมูลสถานีและเส้นทางทั้งหมด
  const { data: station, isLoading: isLoadingStation } = useQueryGetStation(
    ["getStation", params.id],
    {
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  );

  const { data: routes, isLoading: isLoadingRoutes } = useQueryGetRoutes(
    ["routes"],
    {
      staleTime: 0,
    },
  );

  const { mutate, isPending } = useMutationUpdateStation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stationName: "",
      stationNameEng: "",
      routePathId: "",
    },
  });

  // อัพเดทฟอร์มเมื่อได้ข้อมูลสถานี
  useEffect(() => {
    if (
      station &&
      (station.stationName !== form.getValues("stationName") ||
        station.stationNameEng !== form.getValues("stationNameEng") ||
        station.routePath.id.toString() !== form.getValues("routePathId"))
    ) {
      form.reset({
        stationName: station.stationName,
        stationNameEng: station.stationNameEng,
        routePathId: station.routePath.id.toString(),
      });
    }
  }, [station]);

  const onSubmit = (data: FormValues) => {
    mutate(
      {
        id: parseInt(params.id),
        name: data.stationName,
        nameEng: data.stationNameEng,
        routePathId: parseInt(data.routePathId),
      },
      {
        onSuccess: () => {
          toast.success("แก้ไขสถานีสำเร็จ", {
            autoClose: 1000,
            theme: "dark",
          });
          router.push("/masterdata/station");
        },
        onError: () => {
          toast.error("ไม่สามารถแก้ไขสถานีได้");
        },
      },
    );
  };

  if (isLoadingStation || isLoadingRoutes) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">แก้ไขสถานี</p>
        <Button variant="outline" onClick={() => router.back()}>
          ย้อนกลับ
        </Button>
      </div>
      <Card className="p-6 shadow-none rounded">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="stationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อสถานี</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกชื่อสถานี" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stationNameEng"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อสถานีภาษาอังกฤษ</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกชื่อสถานีภาษาอังกฤษ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="routePathId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เส้นทาง</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกเส้นทาง" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {routes?.map((route) => (
                        <SelectItem key={route.id} value={route.id.toString()}>
                          {route.pathName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {isPending ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
