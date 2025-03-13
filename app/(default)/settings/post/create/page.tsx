"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQueryGetTrainSchedules } from "@/src/modules/train-schedules/hooks/useQueryGetTrainSchedules";
import { useForm } from "react-hook-form";
import {
  CreatePostFormValues,
  createPostSchema,
} from "@/src/modules/settings/post/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
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
import { ROUND_TRIP, TrainSchedule } from "@/src/modules/train-schedules/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createPost } from "@/src/modules/settings/post/services/post";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [previewData, setPreviewData] = useState<null | CreatePostFormValues>(
    null,
  );

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  }, [previewData]);

  const router = useRouter();

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      name: "",
      type: "PLATFORM",
      roundTrip: ROUND_TRIP.ARRIVE,
      windowNumber: undefined,
      trainSchedulesId: undefined,
      backgroundType: "COLOR",
      backgroundColor: "#00257A",
      backgroundText: "",
      backgroundTextEnable: false,
      backgroundTextEng: "",
      backgroundTextEngEnable: false,
      backgroundTextFont: "",
      backgroundTextFontsize: 100,
      backgroundTextColor: "#FFFFFF",
      textSliderThEnable: false,
      textSliderEngEnable: false,
      textSliderBackgroundColor: "#021045",
      textSliderColor: "#FFFFFF",
      textSliderFont: "",
      textSliderFontsize: 50,
      textSliderSpeed: 100,
      textSliderTh: "",
      textSliderEng: "",
      destinationFont: "",
      destinationFontsize: 100,
      destinationColor: "#FFFFFF",
      windowNumberFont: "",
      windowNumberFontsize: 100,
      windowNumberColor: "#FFFFFF",
      trainTypeFont: "", // FOR train_schedule table content TD
      trainTypeFontsize: 100,
      trainTypeColor: "#FFFFFF",
      platformFont: "",
      platformFontsize: 100,
      platformColor: "#FFFFFF",
      categoryFont: "",
      categoryFontsize: 100,
      categoryColor: "#FFFFFF",
      lateTimeFont: "",
      lateTimeFontsize: 100,
      lateTimeColor: "#FFFFFF",
      trainTimeFont: "",
      trainTimeFontsize: 100,
      trainTimeColor: "#FFFFFF",
      topicFont: "", // FOR train_schedule table Header
      topicFontsize: 60,
      topicColor: "#FFFFFF",
    },
  });

  const { data: trainSchedules, isLoading: isLoadingTrainSchedules } =
    useQueryGetTrainSchedules(["trainSchedules"], {
      staleTime: 0,
    });

  const onSubmit = async () => {
    const data = form.getValues();

    try {
      await createPost(data);
      toast.success("สร้างป้ายสำเร็จ", {
        autoClose: 1000,
        theme: "dark",
      });

      router.push("/settings/post");
    } catch (err) {
      console.log(err);
    }
  };

  const updatePreviewData = async () => {
    const data = form.getValues();
    if (
      !data?.trainSchedulesId &&
      !["ADS", "TRAIN_SCHEDULE_ARRIVAL", "TRAIN_SCHEDULE_DEPARTURE"].includes(
        data.type,
      )
    ) {
      alert("กรุณาเลือกขบวนรถ");
      return;
    }

    setPreviewData(data);
    localStorage.setItem(
      "preview",
      JSON.stringify({
        form: data,
        train_schedules: trainSchedules,
      }),
    );

    // handleRefresh();
  };

  const fullScreen = () => {
    const data = form.getValues();
    setPreviewData(data);
    localStorage.setItem(
      "preview",
      JSON.stringify({
        form: data,
        train_schedules: trainSchedules,
      }),
    );
    if (iframeRef) {
      iframeRef.current?.requestFullscreen();
    }
  };

  if (isLoadingTrainSchedules || !trainSchedules) {
    return <>loading...</>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">เพิ่มป้าย</p>
        <Button variant="outline" onClick={() => router.back()}>
          ย้อนกลับ
        </Button>
      </div>
      <Card
        className="p-0 shadow-none rounded w-full overflow-hidden"
        style={{
          display: previewData ? "block" : "none",
        }}
      >
        <div
          className="w-full overflow-auto"
          style={{
            height: "500px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              transform: `scale(${0.5})`,
              transformOrigin: "top left",
              width: `${100 / 0.5}%`,
              height: `${100 / 0.5}%`,
              overflow: "hidden",
            }}
          >
            {previewData && (
              <iframe
                ref={iframeRef}
                src="/preview"
                className="w-full h-full border-0 overflow-hidden"
                title="Preview Content"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </Card>
      <Form {...form}>
        <form className="space-y-4">
          <Card className="p-3 shadow-none rounded">
            <div className="flex">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อป้าย</FormLabel>
                      <FormControl>
                        <Input placeholder="กรอกชื่อป้าย" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ประเภทป้าย</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกประเภทป้าย" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectContent>
                            <SelectItem value="PLATFORM">ชานชาลา</SelectItem>
                            <SelectItem value="WINDOW">
                              ช่องจำหน่ายตั๋ว
                            </SelectItem>
                            <SelectItem value="ADS">ประกาศ / โฆษณา</SelectItem>
                            <SelectItem value="TRAIN_SCHEDULE_ARRIVAL">
                              ตารางเดินรถ (ขาเข้า)
                            </SelectItem>
                            <SelectItem value="TRAIN_SCHEDULE_DEPARTURE">
                              ตารางเดินรถ (ขาออก)
                            </SelectItem>
                          </SelectContent>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("type") != "ADS" &&
                  form.watch("type") != "TRAIN_SCHEDULE_ARRIVAL" &&
                  form.watch("type") != "TRAIN_SCHEDULE_DEPARTURE" && (
                    <>
                      {" "}
                      <FormField
                        control={form.control}
                        name="roundTrip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>เที่ยวการเดินรถ</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="เที่ยวไป - กลับ" />
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
                      {form.watch("type") != "TRAIN_SCHEDULE_ARRIVAL" &&
                        form.watch("type") != "TRAIN_SCHEDULE_DEPARTURE" && (
                          <>
                            <FormField
                              control={form.control}
                              name="trainSchedulesId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ขบวนรถ</FormLabel>
                                  <Select
                                    onValueChange={(value) =>
                                      field.onChange(Number(value))
                                    }
                                    defaultValue={field.value?.toString() ?? ""}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="เลือกขบวนรถ" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {trainSchedules
                                        .filter((schedule) =>
                                          form.watch("roundTrip")
                                            ? schedule.roundTrip ===
                                              form.watch("roundTrip")
                                            : true,
                                        )
                                        .map((trainSchedule: TrainSchedule) => (
                                          <SelectItem
                                            key={trainSchedule.id}
                                            value={trainSchedule.id.toString()}
                                          >
                                            {trainSchedule.train.trainName}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                      {form.watch("type") === "WINDOW" && (
                        <FormField
                          control={form.control}
                          name="windowNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                หมายเลขช่อง{" "}
                                <span className="text-red-700">
                                  *กรณีเลือกประเภทช่องจำหน่ายตั๋ว
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="กรอกหมายเลขช่อง"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  min={1}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <FormField
                        control={form.control}
                        name="backgroundType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>รูปแบบพื้นหลัง</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="COLOR">
                                  สีพื้นหลัง
                                </SelectItem>
                                <SelectItem value="IMAGE">
                                  รูปพื้นหลัง
                                </SelectItem>
                                <SelectItem value="VIDEO">
                                  วีดีโอพื้นหลัง
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {form.watch("backgroundType") === "COLOR" && (
                        <FormField
                          control={form.control}
                          name="backgroundColor"
                          render={({}) => (
                            <FormItem>
                              <FormLabel>สีพื้นหลัง</FormLabel>
                              <FormControl>
                                <FormField
                                  control={form.control}
                                  name="backgroundColor"
                                  render={({ field }) => (
                                    <Input type="color" {...field} />
                                  )}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {form.watch("backgroundType") === "IMAGE" && (
                        <FormField
                          control={form.control}
                          name="postMedia"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>เลือกรูปภาพพื้นหลัง</FormLabel>
                              <FormControl>
                                <Input
                                  accept="image/*"
                                  type="file"
                                  onChange={(e) => {
                                    field.onChange(e.target.files?.[0]);
                                    if (e.target.files?.[0] !== undefined) {
                                      const url = URL.createObjectURL(
                                        e.target.files?.[0],
                                      );
                                      form.setValue("backgroundImage", url);
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {form.watch("backgroundType") === "VIDEO" && (
                        <FormField
                          control={form.control}
                          name="postMedia"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>เลือกวีดีโอพื้นหลัง</FormLabel>
                              <FormControl>
                                <Input
                                  accept="video/*"
                                  type="file"
                                  onChange={(e) => {
                                    field.onChange(e.target.files?.[0]);
                                    if (e.target.files?.[0] !== undefined) {
                                      const url = URL.createObjectURL(
                                        e.target.files?.[0],
                                      );
                                      // setPreviewUrl(URL.createObjectURL(e.target.files?.[0]));
                                      form.setValue("backgroundVideo", url);
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </>
                  )}
                <div className="mt-4"></div>
                <FormField
                  control={form.control}
                  name="textSliderThEnable"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="ml-2 text-sm font-bold font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        เปิดใช้งานตัวอักษรวิ่งไทย
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="textSliderTh"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="ข้อความวิ่ง"
                          disabled={!form.watch("textSliderThEnable")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="textSliderEngEnable"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="ml-2 text-sm font-bold font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        เปิดใช้งานตัวอักษรอังกฤษ
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="textSliderEng"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="ข้อความวิ่ง"
                          disabled={!form.watch("textSliderEngEnable")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
                  <FormField
                    control={form.control}
                    name="textSliderBackgroundColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>สีพื้นหลัง</FormLabel>
                        <FormControl>
                          <Input type="color" {...field} className="w-[80px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="textSliderColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>สีตัวอักษร</FormLabel>
                        <FormControl>
                          <Input type="color" {...field} className="w-[80px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="textSliderSpeed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ความเร็ว {field.value}</FormLabel>
                        <FormControl>
                          <Input
                            type="range"
                            min={100}
                            max={300}
                            step={10}
                            {...field}
                            className="w-[100px]"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="textSliderFontsize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ขนาดตัวอักษร {field.value} px.</FormLabel>
                        <FormControl>
                          <Input
                            type="range"
                            min={20}
                            max={100}
                            step={1}
                            {...field}
                            className="w-[100px]"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-6 space-y-2">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={updatePreviewData}
                  >
                    อัพเดทตัวอย่าง
                  </Button>
                  <Button
                    type="button"
                    className="w-full mt-2"
                    onClick={async () => {
                      fullScreen();
                    }}
                  >
                    ตัวอย่าง (full-screen)
                  </Button>
                  <Button type="button" className="w-full" onClick={onSubmit}>
                    สร้าง
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                {form.watch("type") === "ADS" && (
                  <div className="flex-1 p-5">
                    <Label>รูปแบบแสดงตัวอักษร</Label>
                    <Separator className="mt-2 mb-2" />
                    <div className="flex flex-col">
                      <FormField
                        control={form.control}
                        name="backgroundTextEnable"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="ml-2 mt-2 text-sm font-bold font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              เปิดใช้งานข้อความไทย
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="backgroundText"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="text"
                                {...field}
                                placeholder="ใส่ข้อความ"
                                disabled={!form.watch("backgroundTextEnable")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="backgroundTextEngEnable"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="ml-2 text-sm font-bold font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              เปิดใช้งานข้อความอังกฤษ
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="backgroundTextEng"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="text"
                                {...field}
                                placeholder="ใส่ข้อความ"
                                disabled={
                                  !form.watch("backgroundTextEngEnable")
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between">
                        <FormField
                          control={form.control}
                          name="backgroundTextFont"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>รูปแบบตัวอักษร</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="none">
                                    ไม่มีรูปแบบ
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="backgroundTextColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>สีตัวอักษร</FormLabel>
                              <FormControl>
                                <Input
                                  type="color"
                                  {...field}
                                  className="w-[80px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="backgroundTextFontsize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                ขนาดตัวอักษร {field.value} px.
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="range"
                                  min={10}
                                  max={250}
                                  step={5}
                                  {...field}
                                  className="w-[200px]"
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {(form.watch("type") === "TRAIN_SCHEDULE_DEPARTURE" ||
                  form.watch("type") === "TRAIN_SCHEDULE_ARRIVAL") && (
                  <div className="flex-1 p-5">
                    <Label className="text-sm font-bold">รูปแบบหัวตาราง</Label>
                    <Separator className="mt-2 mb-2" />
                    <div className="flex justify-between">
                      <FormField
                        control={form.control}
                        name="topicFont"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>รูปแบบตัวอักษร</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* {renderFontsSelection(fonts)} */}
                                <SelectItem value="none">
                                  ไม่มีรูปแบบ
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="topicColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>สีตัวอักษร</FormLabel>
                            <FormControl>
                              <Input
                                type="color"
                                {...field}
                                className="w-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="topicFontsize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              ขนาดตัวอักษร {field.value} px.
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="range"
                                min={10}
                                max={250}
                                step={5}
                                {...field}
                                className="w-[200px]"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4"></div>

                    <Label className="text-sm font-bold">
                      รูปแบบตัวอักษรในตาราง
                    </Label>
                    <Separator className="mt-2 mb-2" />
                    <div className="flex justify-between">
                      <FormField
                        control={form.control}
                        name="trainTypeFont"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>รูปแบบตัวอักษร</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* {renderFontsSelection(fonts)} */}
                                <SelectItem value="none">
                                  ไม่มีรูปแบบ
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="trainTypeColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>สีตัวอักษร</FormLabel>
                            <FormControl>
                              <Input
                                type="color"
                                {...field}
                                className="w-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="trainTypeFontsize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              ขนาดตัวอักษร {field.value} px.
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="range"
                                min={10}
                                max={250}
                                step={5}
                                {...field}
                                className="w-[200px]"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                {(form.watch("type") === "WINDOW" ||
                  form.watch("type") === "PLATFORM") && (
                  <div className="flex-1 p-5">
                    <Label className="text-sm font-bold">รูปแบบหัวข้อ</Label>
                    <Separator className="mt-2 mb-2" />

                    <div className="flex justify-between">
                      <FormField
                        control={form.control}
                        name="topicFont"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>รูปแบบตัวอักษร</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* {renderFontsSelection(fonts)} */}
                                <SelectItem value="none">
                                  ไม่มีรูปแบบ
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="topicColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>สีตัวอักษร</FormLabel>
                            <FormControl>
                              <Input
                                type="color"
                                {...field}
                                className="w-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="topicFontsize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              ขนาดตัวอักษร {field.value} px.
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="range"
                                min={10}
                                max={250}
                                step={5}
                                {...field}
                                className="w-[200px]"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-4"></div>

                    <Label className="text-sm font-bold">รูปแบบปลายทาง</Label>
                    <Separator className="mt-2 mb-2" />

                    <div className="flex justify-between">
                      <FormField
                        control={form.control}
                        name="destinationFont"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>รูปแบบตัวอักษร</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* {renderFontsSelection(fonts)} */}
                                <SelectItem value="none">
                                  ไม่มีรูปแบบ
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="destinationColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>สีตัวอักษร</FormLabel>
                            <FormControl>
                              <Input
                                type="color"
                                {...field}
                                className="w-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="destinationFontsize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              ขนาดตัวอักษร {field.value} px.
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="range"
                                min={10}
                                max={250}
                                step={5}
                                {...field}
                                className="w-[200px]"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {form.watch("type") === "WINDOW" && (
                      <div>
                        <div className="mt-5"></div>
                        <Label className="text-sm font-bold">
                          รูปแบบช่องจำหน่ายตั๋ว
                        </Label>
                        <Separator className="mt-2 mb-2" />
                        <div className="flex justify-between">
                          <FormField
                            control={form.control}
                            name="windowNumberFont"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>รูปแบบตัวอักษร</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {/* {renderFontsSelection(fonts)} */}
                                    <SelectItem value="none">
                                      ไม่มีรูปแบบ
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="windowNumberColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>สีตัวอักษร</FormLabel>
                                <FormControl>
                                  <Input
                                    type="color"
                                    {...field}
                                    className="w-[80px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="windowNumberFontsize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  ขนาดตัวอักษร {field.value} px.
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="range"
                                    min={10}
                                    max={250}
                                    step={5}
                                    {...field}
                                    className="w-[200px]"
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-5"></div>
                    <Label className="text-sm font-bold">รูปแบบชานชาลา</Label>
                    <Separator className="mt-2 mb-2" />

                    <div className="flex justify-between">
                      <FormField
                        control={form.control}
                        name="platformFont"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>รูปแบบตัวอักษร</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* {renderFontsSelection(fonts)} */}
                                <SelectItem value="none">
                                  ไม่มีรูปแบบ
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="platformColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>สีตัวอักษร</FormLabel>
                            <FormControl>
                              <Input
                                type="color"
                                {...field}
                                className="w-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="platformFontsize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              ขนาดตัวอักษร {field.value} px.
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="range"
                                min={10}
                                max={250}
                                step={5}
                                {...field}
                                className="w-[200px]"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-5"></div>
                    <Label className="text-sm font-bold">รูปแบบขบวนรถ</Label>
                    <Separator className="mt-2 mb-2" />
                    <div className="flex justify-between">
                      <FormField
                        control={form.control}
                        name="trainTypeFont"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>รูปแบบตัวอักษร</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* {renderFontsSelection(fonts)} */}
                                <SelectItem value="none">
                                  ไม่มีรูปแบบ
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="trainTypeColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>สีตัวอักษร</FormLabel>
                            <FormControl>
                              <Input
                                type="color"
                                {...field}
                                className="w-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="trainTypeFontsize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              ขนาดตัวอักษร {field.value} px.
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="range"
                                min={10}
                                max={250}
                                step={5}
                                {...field}
                                className="w-[200px]"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-5"></div>
                    <Label className="text-sm font-bold">รูปแบบประเภทรถ</Label>
                    <Separator className="mt-2 mb-2" />
                    <div className="flex justify-between">
                      <FormField
                        control={form.control}
                        name="categoryFont"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>รูปแบบตัวอักษร</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* {renderFontsSelection(fonts)} */}
                                <SelectItem value="none">
                                  ไม่มีรูปแบบ
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="categoryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>สีตัวอักษร</FormLabel>
                            <FormControl>
                              <Input
                                type="color"
                                {...field}
                                className="w-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="categoryFontsize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              ขนาดตัวอักษร {field.value} px.
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="range"
                                min={10}
                                max={250}
                                step={5}
                                {...field}
                                className="w-[200px]"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {form.watch("type") === "PLATFORM" && (
                      <div>
                        <div className="mt-5"></div>
                        <Label className="text-sm font-bold">
                          รูปแบบรถออกล่าช้า
                        </Label>
                        <Separator className="mt-2 mb-2" />
                        <div className="flex justify-between">
                          <FormField
                            control={form.control}
                            name="lateTimeFont"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>รูปแบบตัวอักษร</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {/* {renderFontsSelection(fonts)} */}
                                    <SelectItem value="none">
                                      ไม่มีรูปแบบ
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="lateTimeColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>สีตัวอักษร</FormLabel>
                                <FormControl>
                                  <Input
                                    type="color"
                                    {...field}
                                    className="w-[80px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="lateTimeFontsize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  ขนาดตัวอักษร {field.value} px.
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="range"
                                    min={10}
                                    max={250}
                                    step={5}
                                    {...field}
                                    className="w-[200px]"
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-5"></div>
                    <Label className="text-sm font-bold">รูปแบบเวลารถออก</Label>
                    <Separator className="mt-2 mb-2" />
                    <div className="flex justify-between">
                      <FormField
                        control={form.control}
                        name="trainTimeFont"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>รูปแบบตัวอักษร</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* {renderFontsSelection(fonts)} */}
                                <SelectItem value="none">
                                  ไม่มีรูปแบบ
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="trainTimeColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>สีตัวอักษร</FormLabel>
                            <FormControl>
                              <Input
                                type="color"
                                {...field}
                                className="w-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="trainTimeFontsize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              ขนาดตัวอักษร {field.value} px.
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="range"
                                min={10}
                                max={250}
                                step={5}
                                {...field}
                                className="w-[200px]"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>{" "}
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
}
