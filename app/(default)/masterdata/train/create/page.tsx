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
import { useMutationCreateTrain } from "@/src/modules/masterdata/train/hooks/useMutationCreateTrain";
import { useQueryGetCategories } from "@/src/modules/masterdata/category/hooks/useQueryGetCategories";
import { useQueryGetRoutes } from "@/src/modules/masterdata/route/hooks/useQueryGetRoutes";
import { toast } from "react-toastify";

const formSchema = z.object({
  trainName: z.string().min(1, "กรุณากรอกชื่อขบวนรถไฟ"),
  categoryId: z.string().min(1, "กรุณาเลือกประเภทรถไฟ"),
  routePathId: z.string().min(1, "กรุณาเลือกเส้นทาง"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const router = useRouter();
  const { mutate, isPending } = useMutationCreateTrain();

  // ดึงข้อมูล categories และ routes
  const { data: categories, isLoading: isLoadingCategories } =
    useQueryGetCategories(["categories"], {
      staleTime: 0,
    });

  const { data: routes, isLoading: isLoadingRoutes } = useQueryGetRoutes(
    ["routes"],
    {
      staleTime: 0,
    },
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainName: "",
      categoryId: "",
      routePathId: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(
      {
        trainName: data.trainName,
        categoryId: parseInt(data.categoryId),
        routePathId: parseInt(data.routePathId),
      },
      {
        onSuccess: () => {
          toast.success("สร้างขบวนรถไฟสำเร็จ", {
            autoClose: 1000,
            theme: "dark",
          });
          router.push("/masterdata/train");
        },
        onError: () => {
          toast.error("ไม่สามารถสร้างขบวนรถไฟได้");
        },
      },
    );
  };

  if (isLoadingCategories || isLoadingRoutes) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">เพิ่มขบวนรถไฟ</p>
        <Button variant="outline" onClick={() => router.back()}>
          ย้อนกลับ
        </Button>
      </div>

      <Card className="p-6 shadow-none rounded">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="trainName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อขบวนรถไฟ</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกชื่อขบวนรถไฟ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ประเภทรถไฟ</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภทรถไฟ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
