"use client";

import * as React from "react";
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [],
  navMain: [
    {
      title: "ภาพรวมระบบ",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "สถิติการใช้งาน",
          url: "#",
        },
        {
          title: "การแจ้งเตือน",
          url: "#",
        },
      ],
    },
    {
      title: "ตั้งค่าข้อมูลหลัก",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "เส้นทางเดินรถ",
          url: "/masterdata/route",
        },
        {
          title: "ประเภทรถ",
          url: "/masterdata/category",
        },
        {
          title: "ตั้งค่าสถานี",
          url: "/masterdata/station",
        },
        {
          title: "ตั้งค่าขบวนรถ",
          url: "/masterdata/train",
        },
        {
          title: "ตั้งค่าวันหยุดประจำปี",
          url: "/masterdata/holiday",
        },
        {
          title: "ตั้งค่ารูปแบบตัวอักษร",
          url: "#",
        },
      ],
    },
    {
      title: "ตั้งค่าตารางเดินรถ",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "ตารางเดินรถ",
          url: "/train-schedules",
        },
      ],
    },
    {
      title: "แก้ไขล่าช้าและย้ายชานชาลา (ชั่วคราว)",
      url: "#",
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "ตารางเดินรถ (ขาเข้า)",
          url: "/temporary-train-schedules/arrive",
        },
        {
          title: "ตารางเดินรถ (ขาออก)",
          url: "/temporary-train-schedules/departure",
        },
      ],
    },
    {
      title: "ตั้งค่าระบบ",
      url: "#",
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "ตั้งค่าป้าย",
          url: "/settings/post",
        },
        {
          title: "ตั้งค่ากล่องเก็บป้าย",
          url: "/settings/post-box",
        },
        {
          title: "ตั้งค่าเครื่องลูกข่าย",
          url: "/settings/client",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
