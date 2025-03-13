"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPostBox } from "@/src/modules/settings/postbox/services/postbox";
import { toast } from "react-toastify";

export default function Page() {
  const router = useRouter();
  const [postBoxName, setPostBoxName] = useState<string>("");

  const onCreate = async () => {
    if (postBoxName == "") {
      toast.error("กรุณากรอกชื่อกล่องเก็บป้าย");
      return;
    }
    try {
      const data = {
        name: postBoxName,
        postPivot: [],
      };

      await createPostBox(data);
      toast.success("สร้างกล่องเก็บป้ายสำเร็จ", {
        autoClose: 1000,
        theme: "dark",
      });
      router.back();
    } catch (err) {
      toast.error("ไม่สามารถสร้างเส้นทางได้");
      console.log(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">เพิ่มกล่องเก็บป้าย</p>
        <Button variant="outline" onClick={() => router.back()}>
          ย้อนกลับ
        </Button>
      </div>
      <Card className="p-6 shadow-none rounded space-y-4">
        <Label>ชื่อกล่องเก็บป้าย</Label>
        <Input
          type="text"
          placeholder="ชื่อกล่องเก็บป้่าย"
          onChange={(e) => setPostBoxName(e.target.value)}
          value={postBoxName}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            ยกเลิก
          </Button>
          <Button type="button" onClick={onCreate}>
            บันทึก
          </Button>
        </div>
      </Card>
    </div>
  );
}
