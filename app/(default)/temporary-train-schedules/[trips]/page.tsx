"use client";

import { TableSkeleton } from "@/src/common/components/TableSkeleton";
import { TemporaryDataTable } from "@/src/common/components/temporary-table";
import {
  EditType,
  temporaryColumns,
} from "@/src/modules/train-schedules/columns";
import {
  getTrainScheduleByRoundTrip,
  resetTemporaryALL,
  restartTemporaryById,
  updateTemporaryPlatformNumberById,
  updateTrainScheduleDelayTime,
} from "@/src/modules/train-schedules/services/train-schedules";
import { ROUND_TRIP, TrainSchedule } from "@/src/modules/train-schedules/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  addMinutesToTimeString,
  calculateTimeDifferenceInMinutes,
} from "@/src/common/helper/time";
import { Label } from "@radix-ui/react-dropdown-menu";

export default function Page({
  params,
}: {
  params: {
    trips: ROUND_TRIP;
  };
}) {
  const [trainSchedule, setTrainSchedules] = useState<TrainSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editType, setEditType] = useState<EditType | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<TrainSchedule | null>(
    null,
  );

  const [timeValue, setTimeValue] = useState<string>("");
  const [delayMinutes, setDelayMinutes] = useState<number>(0);

  const [temporaryPlatformValue, setTemporaryPlatformValue] = useState<
    number | null
  >(null);

  const fetchData = async () => {
    const trainScheduleResponse = await getTrainScheduleByRoundTrip(
      params.trips.toUpperCase(),
    );
    setTrainSchedules(trainScheduleResponse);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleOnEdit = (type: EditType, train: TrainSchedule) => {
    setEditType(type);
    setSelectedTrain(train);

    if (type == "time") {
      if (train.roundTrip === ROUND_TRIP.ARRIVE) {
        setTimeValue(train.departureTime);
      } else {
        setTimeValue(train.arrivalTime);
      }
      setDelayMinutes(train.lateTime);
    } else {
      setTemporaryPlatformValue(train.temporaryPlatformNumber);
    }
  };

  const handleOnSubmit = async () => {
    if (!selectedTrain) {
      return;
    }

    try {
      if (editType == "time") {
        await updateTrainScheduleDelayTime(selectedTrain?.id, delayMinutes);
      } else {
        if (!temporaryPlatformValue) {
          return;
        }

        await updateTemporaryPlatformNumberById(
          selectedTrain?.id,
          temporaryPlatformValue,
        );
        console.log("update Temporary Platform Number: ");
      }
      toast.success("แก้ไขข้อมูล ตารางเดินรถชั่วคราวสำเร็จ", {
        autoClose: 1000,
        theme: "dark",
      });

      setEditType(null);
      setTimeValue("");
      setTemporaryPlatformValue(null);
      setSelectedTrain(null);

      await fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const restartTemporary = async (id: number) => {
    try {
      await restartTemporaryById(id);
      toast.success("คืนค่า ตารางเดินรถชั่วคราวสำเร็จ", {
        autoClose: 1000,
        theme: "dark",
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const resetTemporaryAll = async () => {
    console.log("all");
    try {
      await resetTemporaryALL();
      toast.success("คืนค่า ตารางเดินรถชั่วคราวสำเร็จ", {
        autoClose: 1000,
        theme: "dark",
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = temporaryColumns({
    onEdit: handleOnEdit,
    roundTrip: params.trips,
    restartTemporary,
    resetAllTemporary: resetTemporaryAll,
  });

  let title = "ตารางเดินรถชั่วคราว";
  title +=
    params.trips === ROUND_TRIP.ARRIVE.toLowerCase() ? " (ขาเข้า)" : " (ขาออก)";

  return (
    <div className="space-y-4">
      <Dialog
        open={!!editType}
        onOpenChange={(open) => {
          if (!open) {
            setEditType(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTrain !== null ? selectedTrain.train.trainName : ""}{" "}
              {editType === "time"
                ? "แก้ไขเวลาล่าช้า (นาที)"
                : "ย้ายชานชาลาชั่วคราว"}
            </DialogTitle>
            <DialogDescription>
              {editType == "platform" && (
                <div className="flex flex-col gap-2">
                  <Label>หมายเลขชานชาลา</Label>
                  <Input
                    type="number"
                    value={selectedTrain?.platformNumber}
                    disabled
                  />
                  <Label>ย้ายไปยังหมายเลข (ชั่วคราว)</Label>
                  <Input
                    type="number"
                    value={temporaryPlatformValue ?? 0}
                    onChange={(e) => {
                      const platformNumber = parseInt(e.target.value);
                      setTemporaryPlatformValue(platformNumber);
                    }}
                    required
                  />
                  <Button
                    onClick={() => {
                      handleOnSubmit();
                    }}
                  >
                    ยืนยัน
                  </Button>
                </div>
              )}
              {editType == "time" && (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2">
                    <Input
                      type="time"
                      disabled
                      value={
                        selectedTrain?.roundTrip == ROUND_TRIP.ARRIVE
                          ? selectedTrain?.departureTime
                          : selectedTrain?.arrivalTime
                      }
                    />
                    <Input
                      type="time"
                      onChange={(e) => {
                        const { value } = e.target;
                        if (!selectedTrain) {
                          return;
                        }

                        const diffInMinutes = calculateTimeDifferenceInMinutes(
                          selectedTrain?.roundTrip == ROUND_TRIP.ARRIVE
                            ? selectedTrain?.departureTime
                            : selectedTrain?.arrivalTime,
                          value,
                        );

                        setDelayMinutes(diffInMinutes);
                        setTimeValue(value);
                      }}
                      value={timeValue}
                    />
                    <Input
                      type="number"
                      value={delayMinutes}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        const time = addMinutesToTimeString(timeValue, value);
                        setDelayMinutes(value);
                        setTimeValue(time);
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      handleOnSubmit();
                    }}
                  >
                    ยืนยัน
                  </Button>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <p className="text-[24px] font-bold">{title}</p>
      <div className="w-full">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <TemporaryDataTable
            columns={columns}
            data={trainSchedule || []}
            placeholderSearch="ค้นหาเส้นทางเดินรถ"
          />
        )}
      </div>
    </div>
  );
}
