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
import { useQueryGetTrainSchedule } from "@/src/modules/train-schedules/hooks/useQueryGetTrainSchedule";
import { useMutationUpdateTrainSchedule } from "@/src/modules/train-schedules/hooks/useMutationUpdateTrainSchedule";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { ROUND_TRIP } from "@/src/modules/train-schedules/types";
import { useQueryGetStations } from "@/src/modules/masterdata/station/hooks/useQueryGetStations";

const formSchema = z.object({
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

// export default function Page({ params }: { params: { id: string } }) {
export default function Page() {
  const router = useRouter();
  const params = { id: 7 };
  const { data: schedule, isLoading: isLoadingSchedule } =
    useQueryGetTrainSchedule(["getTrainSchedule", params.id], {
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    });
  const { data: stations, isLoading: isLoadingStations } = useQueryGetStations(
    ["stations"],
    {
      staleTime: 0,
    },
  );

  console.log(schedule);

  const { mutate, isPending } = useMutationUpdateTrainSchedule();

  // เปลี่ยนการกำหนด defaultValues
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platformNumber: schedule?.platformNumber ?? 0,
      roundTrip: schedule?.roundTrip ?? ROUND_TRIP.DEPARTURE,
      arrivalStationId: schedule?.arrivalStationId ?? 0,
      arrivalTime: schedule?.arrivalTime ?? "",
      departureStationId: schedule?.departureStationId ?? 0,
      departureTime: schedule?.departureTime ?? "",
      monday: schedule?.monday ?? false,
      tuesday: schedule?.tuesday ?? false,
      wednesday: schedule?.wednesday ?? false,
      thursday: schedule?.thursday ?? false,
      friday: schedule?.friday ?? false,
      satday: schedule?.satday ?? false,
      sunday: schedule?.sunday ?? false,
      holiday: schedule?.holiday ?? false,
    },
  });
  // ปรับ useEffect
  useEffect(() => {
    if (schedule) {
      Object.entries({
        platformNumber: schedule.platformNumber,
        roundTrip: schedule.roundTrip,
        departureStationId: schedule.departureStationId,
        arrivalStationId: schedule.arrivalStationId,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        monday: schedule.monday,
        tuesday: schedule.tuesday,
        wednesday: schedule.wednesday,
        thursday: schedule.thursday,
        friday: schedule.friday,
        satday: schedule.satday,
        sunday: schedule.sunday,
        holiday: schedule.holiday,
      }).forEach(([key, value]) => {
        form.setValue(key as keyof FormValues, value, {
          shouldValidate: true,
        });
      });
    }
  }, [schedule]);

  // แยกการ loading state
  if (isLoadingSchedule || isLoadingStations) {
    return <div>Loading...</div>;
  }

  // แยกการตรวจสอบข้อมูล
  if (!schedule || !stations) {
    return <div>ไม่พบข้อมูล</div>;
  }

  const onSubmit = (data: FormValues) => {
    mutate(
      { id: parseInt(params.id.toString()), train: data },
      {
        onSuccess: () => {
          toast.success("แก้ไขตารางเดินรถสำเร็จ", {
            autoClose: 1000,
            theme: "dark",
          });
          router.push("/train-schedules");
        },
        onError: () => {
          toast.error("ไม่สามารถแก้ไขตารางเดินรถได้");
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">แก้ไขตารางเดินรถ</p>
        <Button variant="outline" onClick={() => router.back()}>
          ย้อนกลับ
        </Button>
      </div>

      <Card className="p-6 shadow-none rounded">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
