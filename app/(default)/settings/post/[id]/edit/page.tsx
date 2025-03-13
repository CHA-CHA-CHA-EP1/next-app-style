"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { getTrainSchedules } from "@/src/modules/train-schedules/services/train-schedules";
import { TrainSchedule } from "@/src/modules/train-schedules/types";
import { getPost, updatePost } from "@/src/modules/settings/post/services/post";
import { CreatePostFormValues } from "@/src/modules/settings/post/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "@/src/modules/settings/post/schema";
import { ROUND_TRIP } from "@/src/modules/train-schedules/types";
import { toast } from "react-toastify";

// PostForm component
const PostForm = ({
  defaultValues,
  trainSchedules,
  id,
}: {
  defaultValues: CreatePostFormValues;
  trainSchedules: TrainSchedule[];
  id: string;
}) => {
  const [previewData, setPreviewData] = useState<null | CreatePostFormValues>(
    null,
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues,
  });

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

  const onSubmit = async () => {
    const data = form.getValues();

    try {
      await updatePost(+id, data);
      toast.success("แก้ไขข้อมูลป้ายสำเร็จ", {
        autoClose: 1000,
        theme: "dark",
      });
      router.push("/settings/post");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const roundTrip = form.watch("roundTrip");
    const currentTrainScheduleId = form.watch("trainSchedulesId");

    if (currentTrainScheduleId) {
      const currentSchedule = trainSchedules.find(
        (schedule) => schedule.id.toString() === currentTrainScheduleId,
      );

      if (currentSchedule && currentSchedule.roundTrip !== roundTrip) {
        form.setValue("trainSchedulesId", undefined);
      }
    }
  }, [form.watch("roundTrip")]);

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
                      <FormField
                        control={form.control}
                        name="trainSchedulesId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ขบวนรถ</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                if (value) {
                                  const selectedSchedule = trainSchedules?.find(
                                    (schedule) => schedule.id === Number(value),
                                  );
                                  if (selectedSchedule) {
                                    form.setValue(
                                      "roundTrip",
                                      selectedSchedule.roundTrip,
                                      {
                                        shouldValidate: true,
                                      },
                                    );
                                  }
                                }
                              }}
                              value={field.value ?? ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="เลือกขบวนรถ" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {trainSchedules
                                  ?.filter((schedule) =>
                                    form.watch("roundTrip")
                                      ? schedule.roundTrip ===
                                        form.watch("roundTrip")
                                      : true,
                                  )
                                  .map((trainSchedule) => (
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

                {form.watch("type") != "TRAIN_SCHEDULE_ARRIVAL" &&
                  form.watch("type") != "TRAIN_SCHEDULE_DEPARTURE" && (
                    <>
                      <FormField
                        control={form.control}
                        name="backgroundType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>รูปแบบพื้นหลัง {field.value}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
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
                    บันทึก
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
};

// Main Page component
export default function Page({ params }: { params: { id: string } }) {
  const [trainSchedules, setTrainSchedules] = useState<TrainSchedule[]>([]);
  const [isLoadingTrainSchedules, setIsLoadingTrainSchedules] = useState(true);
  const [errorTrainSchedules, setErrorTrainSchedules] = useState<string | null>(
    null,
  );
  const [postData, setPostData] = useState<any>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [errorPost, setErrorPost] = useState<string | null>(null);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoadingPost(true);
        const response = await getPost(Number(params.id));
        setPostData(response.data);
        setErrorPost(null);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setErrorPost("Failed to load post data");
      } finally {
        setIsLoadingPost(false);
      }
    };

    fetchPost();
  }, [params.id]);

  // Fetch train schedules
  useEffect(() => {
    const fetchTrainSchedules = async () => {
      try {
        setIsLoadingTrainSchedules(true);
        const response = await getTrainSchedules();
        setTrainSchedules(response.data);
        setErrorTrainSchedules(null);
      } catch (error) {
        console.error("Failed to fetch train schedules:", error);
        setErrorTrainSchedules("Failed to load train schedules");
      } finally {
        setIsLoadingTrainSchedules(false);
      }
    };

    fetchTrainSchedules();
  }, []);

  const isLoading = isLoadingPost || isLoadingTrainSchedules;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        กำลังโหลด...
      </div>
    );
  }

  if (errorPost) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {errorPost}
      </div>
    );
  }

  if (errorTrainSchedules) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {errorTrainSchedules}
      </div>
    );
  }

  // Prepare complete default values
  const selectedTrainSchedule = trainSchedules.find(
    (schedule) => schedule.id === postData.trainSchedulesId,
  );

  const defaultValues: CreatePostFormValues = {
    name: postData.name,
    type: postData.type,
    roundTrip: selectedTrainSchedule?.roundTrip || ROUND_TRIP.ARRIVE,
    windowNumber: postData.windowNumber ?? undefined,
    trainSchedulesId: selectedTrainSchedule?.id?.toString(),
    backgroundType: postData.backgroundType,
    backgroundColor: postData.backgroundColor ?? "#00257A",
    backgroundImage: postData.backgroundImage,
    backgroundVideo: postData.backgroundVideo,
    backgroundText: postData.backgroundText ?? "",
    backgroundTextEnable: postData.backgroundTextEnable ?? false,
    backgroundTextEng: postData.backgroundTextEng ?? "",
    backgroundTextEngEnable: postData.backgroundTextEngEnable ?? false,
    backgroundTextFont: postData.backgroundTextFont ?? "",
    backgroundTextFontsize: postData.backgroundTextFontsize ?? 100,
    backgroundTextColor: postData.backgroundTextColor ?? "#FFFFFF",
    textSliderThEnable: postData.textSliderThEnable ?? false,
    textSliderEngEnable: postData.textSliderEngEnable ?? false,
    textSliderBackgroundColor: postData.textSliderBackgroundColor ?? "#021045",
    textSliderColor: postData.textSliderColor ?? "#FFFFFF",
    textSliderFont: postData.textSliderFont ?? "",
    textSliderFontsize: postData.textSliderFontsize ?? 50,
    textSliderSpeed: postData.textSliderSpeed ?? 100,
    textSliderTh: postData.textSliderTh ?? "",
    textSliderEng: postData.textSliderEng ?? "",
    destinationFont: postData.destinationFont ?? "",
    destinationFontsize: postData.destinationFontsize ?? 100,
    destinationColor: postData.destinationColor ?? "#FFFFFF",
    windowNumberFont: postData.windowNumberFont ?? "",
    windowNumberFontsize: postData.windowNumberFontsize ?? 100,
    windowNumberColor: postData.windowNumberColor ?? "#FFFFFF",
    trainTypeFont: postData.trainTypeFont ?? "",
    trainTypeFontsize: postData.trainTypeFontsize ?? 100,
    trainTypeColor: postData.trainTypeColor ?? "#FFFFFF",
    platformFont: postData.platformFont ?? "",
    platformFontsize: postData.platformFontsize ?? 100,
    platformColor: postData.platformColor ?? "#FFFFFF",
    categoryFont: postData.categoryFont ?? "",
    categoryFontsize: postData.categoryFontsize ?? 100,
    categoryColor: postData.categoryColor ?? "#FFFFFF",
    lateTimeFont: postData.lateTimeFont ?? "",
    lateTimeFontsize: postData.lateTimeFontsize ?? 100,
    lateTimeColor: postData.lateTimeColor ?? "#FFFFFF",
    trainTimeFont: postData.trainTimeFont ?? "",
    trainTimeFontsize: postData.trainTimeFontsize ?? 100,
    trainTimeColor: postData.trainTimeColor ?? "#FFFFFF",
    topicFont: postData.topicFont ?? "",
    topicFontsize: postData.topicFontsize ?? 60,
    topicColor: postData.topicColor ?? "#FFFFFF",
  };

  // Only render form when we have all the data
  return (
    <PostForm
      defaultValues={defaultValues}
      trainSchedules={trainSchedules}
      id={params.id}
    />
  );
}
