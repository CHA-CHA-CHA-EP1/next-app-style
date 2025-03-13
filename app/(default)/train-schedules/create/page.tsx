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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useMutationCreateTrainSchedule } from "@/src/modules/train-schedules/hooks/useMutationCreateTrainSchedule";
import { useQueryGetTrains } from "@/src/modules/masterdata/train/hooks/useQueryGetTrains";
import { useQueryGetStations } from "@/src/modules/masterdata/station/hooks/useQueryGetStations";
import { toast } from "react-toastify";
import { ROUND_TRIP } from "@/src/modules/train-schedules/types";

const formSchema = z.object({
  trainId: z.number({
    required_error: "กรุณาเลือกรถไฟ",
  }),
  platformNumber: z.number({
    required_error: "กรุณาระบุหมายเลขชานชาลา",
  }),
  roundTrip: z.nativeEnum(ROUND_TRIP, {
    required_error: "กรุณาเลือกประเภทการเดินรถ",
  }),
  arrivalStationId: z.number({
    required_error: "กรุณาเลือกสถานีปลายทาง",
  }),
  arrivalTime: z.string({
    required_error: "กรุณาระบุเวลาถึง",
  }),
  departureStationId: z.number({
    required_error: "กรุณาเลือกสถานีต้นทาง",
  }),
  departureTime: z.string({
    required_error: "กรุณาระบุเวลาออกเดินทาง",
  }),
  monday: z.boolean().default(false),
  tuesday: z.boolean().default(false),
  wednesday: z.boolean().default(false),
  thursday: z.boolean().default(false),
  friday: z.boolean().default(false),
  satday: z.boolean().default(false),
  sunday: z.boolean().default(false),
  holiday: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const router = useRouter();
  const { mutate, isPending } = useMutationCreateTrainSchedule();
  const { data: trains, isLoading: isLoadingTrains } = useQueryGetTrains(
    ["trains"],
    {
      staleTime: 0,
    },
  );
  const { data: stations, isLoading: isLoadingStations } = useQueryGetStations(
    ["stations"],
    {
      staleTime: 0,
    },
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainId: undefined,
      platformNumber: undefined,
      roundTrip: undefined,
      arrivalStationId: undefined,
      arrivalTime: "",
      departureStationId: undefined,
      departureTime: "",
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      satday: false,
      sunday: false,
      holiday: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("สร้างตารางเดินรถสำเร็จ", {
          autoClose: 1000,
          theme: "dark",
        });
        router.push("/train-schedules");
      },
      onError: () => {
        toast.error("ไม่สามารถสร้างตารางเดินรถได้");
      },
    });
  };

  if (isLoadingTrains || isLoadingStations) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">เพิ่มตารางเดินรถ</p>
        <Button variant="outline" onClick={() => router.back()}>
          ย้อนกลับ
        </Button>
      </div>

      <Card className="p-6 shadow-none rounded">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="trainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รถไฟ</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      disabled={isLoadingTrains}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกรถไฟ" />
                      </SelectTrigger>
                      <SelectContent>
                        {trains?.map((train) => (
                          <SelectItem
                            key={train.id}
                            value={train.id.toString()}
                          >
                            {train.trainName} - {train.routePath.pathName} (
                            {train.category.categoryName})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platformNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>หมายเลขชานชาลา</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roundTrip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ประเภทการเดินรถ</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภทการเดินรถ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ROUND_TRIP.DEPARTURE}>
                          เที่ยวไป
                        </SelectItem>
                        <SelectItem value={ROUND_TRIP.ARRIVE}>
                          เที่ยวกลับ
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departureStationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>สถานีต้นทาง</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                        disabled={isLoadingStations}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกสถานีต้นทาง" />
                        </SelectTrigger>
                        <SelectContent>
                          {stations?.map((station) => (
                            <SelectItem
                              key={station.id}
                              value={station.id.toString()}
                            >
                              {station.stationName} - {station.stationNameEng}
                              <span className="text-gray-500 ml-1">
                                ({station.routePath.pathName})
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arrivalStationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>สถานีปลายทาง</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                        disabled={isLoadingStations}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกสถานีปลายทาง" />
                        </SelectTrigger>
                        <SelectContent>
                          {stations?.map((station) => (
                            <SelectItem
                              key={station.id}
                              value={station.id.toString()}
                            >
                              {station.stationName} - {station.stationNameEng}
                              <span className="text-gray-500 ml-1">
                                ({station.routePath.pathName})
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departureTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เวลาออกเดินทาง</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arrivalTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เวลาถึง</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormLabel>วันให้บริการ</FormLabel>
            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="monday"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>วันจันทร์</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tuesday"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>วันอังคาร</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wednesday"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>วันพุธ</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thursday"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>วันพฤหัสบดี</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="friday"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>วันศุกร์</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="satday"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>วันเสาร์</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sunday"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>วันอาทิตย์</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="holiday"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>วันหยุด</FormLabel>
                  </FormItem>
                )}
              />
            </div>

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
