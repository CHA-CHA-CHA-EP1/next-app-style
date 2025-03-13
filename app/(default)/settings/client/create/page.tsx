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
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryGetPostBoxes } from "@/src/modules/settings/postbox/hooks/useQueryGetPostBoxes";
import { CreateClient } from "@/src/modules/settings/client/types";
import { useMutationCreateClient } from "@/src/modules/settings/client/hooks/useMutationCreateClient";

const formSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ client"),
  postBoxId: z.string().min(1, "กรุณาเลือกกล่องเก็บป้าย"),
  ipAddress: z
    .string()
    .min(1, "กรุณากรอก IP Address")
    .regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, "รูปแบบ IP Address ไม่ถูกต้อง"),
  subnetMask: z
    .string()
    .min(1, "กรุณากรอก Subnet Mask")
    .regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, "รูปแบบ Subnet Mask ไม่ถูกต้อง"),
  geteway: z
    .string()
    .min(1, "กรุณากรอก Gateway")
    .regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, "รูปแบบ Gateway ไม่ถูกต้อง"),
  type: z.string().min(1, "กรุณาเลือกประเภท"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateClientPage() {
  const router = useRouter();
  const { mutate, isPending } = useMutationCreateClient();
  const { data: postBoxes } = useQueryGetPostBoxes(["postboxes"]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      postBoxId: "",
      ipAddress: "",
      subnetMask: "",
      geteway: "",
      type: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const clientData: CreateClient = {
      name: data.name,
      ipAddress: data.ipAddress,
      subnetMask: data.subnetMask,
      geteway: data.geteway,
      postBoxId: parseInt(data.postBoxId),
      type: data.type,
    };

    mutate(clientData, {
      onSuccess: () => {
        toast.success("สร้าง Client สำเร็จ", {
          autoClose: 1000,
          theme: "dark",
        });
        router.push("/settings/client");
      },
      onError: () => {
        toast.error("ไม่สามารถสร้าง Client ได้");
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">เพิ่ม Client</p>
        <Button variant="outline" onClick={() => router.back()}>
          ย้อนกลับ
        </Button>
      </div>

      <Card className="p-6 shadow-none rounded">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อ Client</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกชื่อ Client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postBoxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>กล่องเก็บป้าย</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกกล่องเก็บป้าย" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {postBoxes?.map((box) => (
                        <SelectItem key={box.id} value={box.id.toString()}>
                          {box.name}
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
              name="ipAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input placeholder="xxx.xxx.xxx.xxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subnetMask"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subnet Mask</FormLabel>
                  <FormControl>
                    <Input placeholder="xxx.xxx.xxx.xxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="geteway"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gateway</FormLabel>
                  <FormControl>
                    <Input placeholder="xxx.xxx.xxx.xxx" {...field} />
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
                  <FormLabel>ประเภท</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภท" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="platform">ชานชาลา</SelectItem>
                      <SelectItem value="window">ช่องจำหน่ายตั๋ว</SelectItem>
                      <SelectItem value="taxi">TAXI</SelectItem>
                      <SelectItem value="led">LED</SelectItem>
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
                บันทึก
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
