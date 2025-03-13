"use client";
import AdPost from "@/src/modules/preview/components/ad_post";
import Platform from "@/src/modules/preview/components/platform";
import Window from "@/src/modules/preview/components/window";
import TrainSchedulePage from "@/src/modules/preview/components/train_schedules_full";
import { TrainSchedule } from "@/src/modules/train-schedules/types";
import { useEffect, useState } from "react";

const renderByType = (data: any) => {
  if (data === null) {
    return <>Not found.</>;
  }

  console.log(data.form.type);
  if (data.form.type === "ADS") {
    return <AdPost data={data} />;
  } else if (data.form.type === "PLATFORM") {
    return <Platform data={data} />;
  } else if (data.form.type === "WINDOW") {
    return <Window data={data} />;
  } else if (
    data.form.type === "TRAIN_SCHEDULE_ARRIVAL" ||
    data.form.type === "TRAIN_SCHEDULE_DEPARTURE"
  ) {
    return <TrainSchedulePage data={data} />;
  }

  return <div>ABCDE 11</div>;
};

export default function Page() {
  const [preview, setPreivew] = useState<any>(null);

  useEffect(() => {
    // ฟังก์ชันสำหรับโหลดและอัพเดทข้อมูล
    const loadPreviewData = () => {
      const previewData = localStorage.getItem("preview");
      if (!previewData) {
        return;
      }

      const data = JSON.parse(previewData);

      // ไม่ต้องเช็ค preview === null แล้ว เพราะเราต้องการอัพเดททุกครั้ง
      data.train_schedules = data?.train_schedules.filter(
        (train: TrainSchedule) => {
          console.log(train.id);
          if (Number(train.id) === Number(data.form.trainSchedulesId)) {
            console.log("found train");
            return train;
          }
        },
      )[0];

      setPreivew(data);
    };

    // โหลดข้อมูลครั้งแรก
    loadPreviewData();

    // ตั้ง interval ให้โหลดข้อมูลทุก 5 วินาที
    const intervalId = setInterval(loadPreviewData, 5000);

    // Cleanup เมื่อ component unmount
    return () => clearInterval(intervalId);
  }, []); // ลบ preview จาก dependencies

  return (
    <div className="w-full h-full absolute left-0 top-0">
      {renderByType(preview)}
    </div>
  );
}
