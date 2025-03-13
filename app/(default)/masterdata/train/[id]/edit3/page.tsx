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
import { useMutationUpdateTrain } from "@/src/modules/masterdata/train/hooks/useMutationUpdateTrain";
import { toast } from "react-toastify";
import { useQueries } from "@tanstack/react-query";
import { getTrain } from "@/src/modules/masterdata/train/services/train";
import { getCategories } from "@/src/modules/masterdata/category/services/category";
import { getRoutes } from "@/src/modules/masterdata/route/services/route";
import { useEffect } from "react";
import { Route } from "@/src/modules/masterdata/route/types";
import { Category } from "@/src/modules/masterdata/category/types";

const formSchema = z.object({
  trainName: z.string().min(1, "กรุณากรอกชื่อขบวนรถไฟ"),
  categoryId: z.string().min(1, "กรุณาเลือกประเภทรถไฟ"),
  routePathId: z.string().min(1, "กรุณาเลือกเส้นทาง"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const params = { id: 2 };
  const router = useRouter();

  const results = useQueries({
    queries: [
      {
        queryKey: ["categories"],
        queryFn: async () => {
          const response = await getCategories();
          return response.data;
        },
        staleTime: 0,
      },
      {
        queryKey: ["routes"],
        queryFn: async () => {
          const response = await getRoutes();
          return response.data;
        },
        staleTime: 0,
      },
      {
        queryKey: ["getTrain", params.id],
        queryFn: async () => {
          const id = params.id as number;
          const response = await getTrain(id);
          return response.data;
        },
        staleTime: 0,
      },
    ],
  });

  const { mutate, isPending } = useMutationUpdateTrain();

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
        id: parseInt(params.id.toString()),
        trainName: data.trainName,
        categoryId: parseInt(data.categoryId),
        routePathId: parseInt(data.routePathId),
      },
      {
        onSuccess: () => {
          toast.success("แก้ไขขบวนรถไฟสำเร็จ", {
            autoClose: 1000,
            theme: "dark",
          });
          router.push("/masterdata/train");
        },
        onError: () => {
          toast.error("ไม่สามารถแก้ไขขบวนรถไฟได้");
        },
      },
    );
  };

  const [categoriesQuery, routesQuery, trainQuery] = results;
  const isLoading = results.some((query) => query.isLoading);
  const isSuccess = results.every((query) => query.isSuccess);

  console.log("sucess status: ", isSuccess);

  const train = trainQuery?.data;
  const categories = categoriesQuery?.data;
  const routes = routesQuery?.data;

  useEffect(() => {
    if (isSuccess && train && categories && routes) {
      form.reset({
        trainName: train.trainName,
        categoryId: train.category?.id.toString(),
        routePathId: train.routePath?.id.toString(),
      });
    }
  }, [isSuccess, train]);

  if (isLoading && isSuccess) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">แก้ไขขบวนรถไฟ</p>
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
                      {categories?.map((category: Category) => (
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
                      {routes?.map((route: Route) => (
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
