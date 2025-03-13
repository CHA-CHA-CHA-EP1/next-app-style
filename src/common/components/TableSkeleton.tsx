// components/skeletons/TableSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search และ Button Loading */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-[380px]" />
        <Skeleton className="h-10 w-[150px] " />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-[150px] " />
        <Skeleton className="h-10 w-[150px] " />
        <Skeleton className="h-10 w-[150px] " />
        <Skeleton className="h-10 w-[150px] " />
        <Skeleton className="h-10 w-[150px] " />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* สร้าง columns ตามจำนวนที่ต้องการ */}
              <TableHead>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[200px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* สร้าง rows ตามจำนวนที่ต้องการ */}
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
