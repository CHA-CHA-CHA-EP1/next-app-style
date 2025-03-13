import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Static mapping object
const static_mapping = {
  Home: "หน้าแรก",
  masterdata: "ตั้งค่าข้อมูลหลัก",
  settings: "ตั้งค่าระบบ",
  "train-schedules": "ตารางเดินรถ",
  "temporary-train-schedules": "แก้ไขล่าช้าและย้ายชานชาลา (ชั่วคราว)",
  route: "เส้นทางเดินรถ",
  category: "ประเภทรถ",
  station: "ตั้งค่าสถานี",
  train: "ตั้งค่าขบวนรถ",
  holiday: "ตั้งค่าวันหยุดประจำปี",
  post: "ตั้งค่าป้าย",
  "post-box": "ตั้งค่ากล่องเก็บป้าย",
  client: "ตั้งค่าเครื่องลูกข่าย",
  arrive: "ตารางเดินรถ (ขาเข้า)",
  departure: "ตารางเดินรถ (ขาออก)",
};

export default function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Remove leading slash and split path
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <Breadcrumb>
      <BreadcrumbList key={""}>
        {/* Home item */}
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbPage>{static_mapping.Home}</BreadcrumbPage>
        </BreadcrumbItem>

        {pathSegments.map((segment) => {
          // Get mapped title or format the segment if no mapping exists
          const mappedTitle =
            static_mapping[segment] ||
            segment
              .replace(/-/g, " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

          return (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{mappedTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
