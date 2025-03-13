"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryGetPostBoxes } from "@/src/modules/settings/postbox/hooks/useQueryGetPostBoxes";
import PostBoxItem from "@/src/common/components/PostBoxItem";
import { useEffect, useState } from "react";
import { PostItemEnum } from "@/src/modules/settings/postbox/types";
import PostItems from "@/src/common/components/PostItems";
import { useQueryGetPosts } from "@/src/modules/settings/post/hooks/useQueryGetPosts";
import PostBoxItemSelected from "@/src/common/components/PostItemSelected";
import { Post } from "@/src/modules/settings/post/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  removePostBox,
  updatePostBox,
} from "@/src/modules/settings/postbox/services/postbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AlertDialogComponent } from "@/src/common/components/AlertDialog";
import { useAlertDialog } from "@/src/common/hooks/useAlertDialog";

export default function Page() {
  const { dialog, openDialog, closeDialog } = useAlertDialog();
  const [searchPostBoxes, setSearchPostBoxes] = useState<string>("");
  const [postBoxSeleted, setPostBoxSeleted] = useState<number | null>(null);
  const [newPostBoxSeletecd, setNewPostBoxSelected] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<string>("--:--");
  const [timeShow, setTimeShow] = useState<string>("--:--");
  const [showSetTime, setShowSetTime] = useState<boolean>(false);
  const [tempPost, setTempPost] = useState<Post | null>(null);
  const [roundTrip, setRoundTrip] = useState<"ARRIVE" | "DEPARTURE">("ARRIVE");

  const router = useRouter();

  const {
    data: postBoxes,
    isLoading: isLoadingPostBoxes,
    isSuccess: isSuccessPostBoxes,
    refetch: refetchPostBoxes,
  } = useQueryGetPostBoxes(["postboxes"], {
    staleTime: 0,
  });

  const {
    data: posts,
    isLoading: isLoadingPosts,
    isSuccess: isSuccessPosts,
  } = useQueryGetPosts(["posts"], {
    staleTime: 0,
  });

  useEffect(() => {
    if (!postBoxes) {
      return;
    }
    const postbox = postBoxes.find((item) => item.id == postBoxSeleted);
    if (postbox?.postPivot.length == 0) {
      setNewPostBoxSelected([]);
      return;
    }
    setNewPostBoxSelected(postbox?.postPivot);
  }, [postBoxSeleted]);

  const isAllDone = isSuccessPostBoxes && isSuccessPosts;
  const isLoading = isLoadingPostBoxes || isLoadingPosts;

  if (isLoading || !isAllDone) {
    return <div>loading ...</div>;
  }

  const postBoxesFiltered = postBoxes.filter((item) => {
    if (!searchPostBoxes) return true;

    return item.name.toLowerCase().includes(searchPostBoxes.toLowerCase());
  });

  const onPostBoxSelected = (id: number) => {
    setPostBoxSeleted(id);
  };

  const onPostBoxDelete = async (id: number) => {
    openDialog(
      "ลบกล่องเก็บป้าย",
      "คุณแน่ใจหรือไม่ที่จะลบกล่องเก็บป้ายนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
      async () => {
        try {
          await removePostBox(id);
          await refetchPostBoxes();
          toast.success("ลบกล่องเก็บป้ายสำเร็จ");
          closeDialog();
        } catch (err) {
          console.log(err);
          toast.error("ไม่สามารถทำรายการได้");
        }
      },
    );
  };

  const labelPostBoxSelected = () => {
    if (!postBoxSeleted) {
      return null;
    }

    const postbox = postBoxes.find((item) => item.id == postBoxSeleted);

    return postbox ? postbox.name : "";
  };
  // {
  //   "name": "POST BOX 1",
  //   "postPivot": [
  //       {
  //           "time_start": "10:00",
  //           "time_show": "--:--",
  //           "postId": 97,
  //           "post_type": "ADS"
  //       }
  //   ]
  // }
  //
  const onNewPostSelected = (data: Post) => {
    setTempPost(data);

    // Set initial time values based on post type
    if (data.type === "ADS") {
      setTimeShow("--:--");
      setStartTime("--:--");
    } else if (data.trainSchedules) {
      if (data.trainSchedules.roundTrip === "ARRIVE") {
        setTimeShow(data.trainSchedules.arrivalTime);
        setStartTime(data.trainSchedules.departureTime);
      } else if (data.trainSchedules.roundTrip === "DEPARTURE") {
        setTimeShow(data.trainSchedules.departureTime);
        setStartTime(data.trainSchedules.arrivalTime);
      }
    }

    setShowSetTime(true);
  };

  const handleConfirmTime = async () => {
    if ((startTime == "--:--" && timeShow == "--:--") || !tempPost) {
      return;
    }

    setNewPostBoxSelected((prev) => [
      ...prev,
      {
        postId: tempPost.id,
        post: tempPost,
        time_show: timeShow,
        time_start: startTime,
        post_type:
          tempPost.type === "ADS"
            ? "ADS"
            : tempPost?.trainSchedules?.roundTrip === "ARRIVE"
              ? "IN"
              : tempPost?.trainSchedules?.roundTrip === "DEPARTURE"
                ? "OUT"
                : "",
      },
    ]);

    setShowSetTime(false);
    setTempPost(null);
    setStartTime("--:--");
    setTimeShow("--:--");
  };

  const onDeleteAtIndex = (index: number) => {
    setNewPostBoxSelected((prev) => {
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleSave = async () => {
    if (!postBoxSeleted) {
      return;
    }

    const postbox = postBoxes.find((item) => item.id == postBoxSeleted);

    if (!postbox) {
      return;
    }

    const data = {
      name: postbox?.name,
      postPivot: newPostBoxSeletecd,
    };

    try {
      const response = await updatePostBox(postbox?.id, data);
      await refetchPostBoxes();
      toast.success("บันทึกกล่องเก็บป้ายสำเร็จ", {
        autoClose: 1000,
        theme: "dark",
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-4">
      <AlertDialogComponent
        isOpen={dialog.isOpen}
        title={dialog.title}
        description={dialog.description}
        onConfirm={dialog.onConfirm}
        onCancel={closeDialog}
      />
      <AlertDialog open={showSetTime}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ตั้งค่าเวลาป้าย</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <div>
                  <Label>เวลาเริ่ม</Label>
                  <Input
                    type="time"
                    onChange={(e) => {
                      setTimeShow(e.target.value);
                    }}
                    disabled={
                      tempPost?.type == "ADS" ||
                      tempPost?.trainSchedules?.roundTrip == "ARRIVE"
                    }
                    value={timeShow}
                  />
                </div>
                <div>
                  <Label>เวลาสิ้นสุด (เปลี่ยนป้าย)</Label>
                  <Input
                    type="time"
                    onChange={(e) => setStartTime(e.target.value)}
                    value={startTime}
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowSetTime(false);
                setTempPost(null);
                setStartTime("--:--");
                setTimeShow("--:--");
              }}
            >
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTime}>
              ตกลง
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">ตั้งค่ากล่องเก็บป้าย</p>
        <Button
          onClick={() => {
            router.push("post-box/create");
          }}
        >
          เพิ่มกล่องเก็บป้าย
        </Button>
      </div>

      <div className="flex flex-row w-full gap-2">
        <Card className="p-2 shadow-none rounded grow-[0.3]">
          <div>
            <Input
              placeholder="ค้นหากล่องเก็บป้าย"
              onChange={(e) => setSearchPostBoxes(e.target.value)}
            />
          </div>
          <div className="mt-2 space-y-2">
            <PostBoxItem
              postbox={postBoxesFiltered}
              selected={postBoxSeleted}
              onPostBoxSelected={onPostBoxSelected}
              onPostBoxDelete={onPostBoxDelete}
            />
          </div>
        </Card>
        <Card className="grow-[2] p-2 shadow-none rounded">
          {!postBoxSeleted && (
            <div className="text-gray-400 text-sm">โปรดเลือกกล่องเก็บป้าย</div>
          )}
          {postBoxSeleted && (
            <Tabs defaultValue={PostItemEnum.ALL}>
              <div className="flex items-center gap-2">
                <TabsList className="flex-1 text-left justify-between items-center">
                  <TabsTrigger value={PostItemEnum.ALL}>ทั้งหมด</TabsTrigger>
                  <TabsTrigger value={PostItemEnum.PLATFORM}>
                    ป้ายชานชาลา
                  </TabsTrigger>
                  <TabsTrigger value={PostItemEnum.WINDOW}>
                    ช่องจำหน่ายตั๋ว
                  </TabsTrigger>
                  <TabsTrigger value={PostItemEnum.ADS}>โฆษณา</TabsTrigger>
                  <TabsTrigger value={PostItemEnum.TRAIN_SCHEDULE_ARRIVAL}>
                    ตารางเดินรถ
                  </TabsTrigger>
                  <div className="text-sm flex flex-col justify-center items-center">
                    <Switch
                      onCheckedChange={(value) => {
                        if (value) {
                          setRoundTrip("DEPARTURE");
                        } else {
                          setRoundTrip("ARRIVE");
                        }
                      }}
                    />
                  </div>
                </TabsList>
                <div className="flex-1">
                  <Button size={"sm"} className="mr-2" onClick={handleSave}>
                    บันทึก
                  </Button>
                  กล่องเก็บป้าย: {labelPostBoxSelected()}
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex-1">
                  <TabsContent value={PostItemEnum.ALL}>
                    <PostItems
                      postItem={posts}
                      variant={PostItemEnum.ALL}
                      onNewPostSelected={onNewPostSelected}
                      roundTrip={roundTrip}
                    />
                  </TabsContent>
                  <TabsContent value={PostItemEnum.PLATFORM}>
                    <PostItems
                      postItem={posts}
                      variant={PostItemEnum.PLATFORM}
                      onNewPostSelected={onNewPostSelected}
                      roundTrip={roundTrip}
                    />
                  </TabsContent>
                  <TabsContent value={PostItemEnum.WINDOW}>
                    <PostItems
                      postItem={posts}
                      variant={PostItemEnum.WINDOW}
                      onNewPostSelected={onNewPostSelected}
                      roundTrip={roundTrip}
                    />
                  </TabsContent>
                  <TabsContent value={PostItemEnum.ADS}>
                    <PostItems
                      postItem={posts}
                      variant={PostItemEnum.ADS}
                      roundTrip={roundTrip}
                      onNewPostSelected={onNewPostSelected}
                    />
                  </TabsContent>
                  <TabsContent value={PostItemEnum.TRAIN_SCHEDULE_ARRIVAL}>
                    <PostItems
                      postItem={posts}
                      variant={PostItemEnum.TRAIN_SCHEDULE_ARRIVAL}
                      roundTrip={roundTrip}
                      onNewPostSelected={onNewPostSelected}
                    />
                  </TabsContent>
                </div>
                <div className="flex-1 mt-2 space-y-2">
                  <PostBoxItemSelected
                    data={newPostBoxSeletecd ?? []}
                    onDeleteAtIndex={onDeleteAtIndex}
                  />
                </div>
              </div>
            </Tabs>
          )}
        </Card>
      </div>
    </div>
  );
}
