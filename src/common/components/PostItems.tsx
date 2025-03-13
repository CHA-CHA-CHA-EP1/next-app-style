import { Post } from "@/src/modules/settings/post/types";
import { PostItemEnum } from "@/src/modules/settings/postbox/types";
import { FC } from "react";

interface PostItemProps {
  postItem: Post[];
  variant: PostItemEnum;
  onNewPostSelected: (
    data: Post,
    time_start: string,
    time_show: string,
  ) => void;
  roundTrip: "ARRIVE" | "DEPARTURE";
}

const PostItems: FC<PostItemProps> = ({
  variant,
  postItem,
  roundTrip,
  onNewPostSelected,
}) => {
  const filteredPosts = postItem.filter((post) => {
    let typeMatch = false;
    switch (variant) {
      case PostItemEnum.ALL:
        typeMatch = true;
        break;
      case PostItemEnum.PLATFORM:
        typeMatch = post.type === "PLATFORM";
        break;
      case PostItemEnum.WINDOW:
        typeMatch = post.type === "WINDOW";
        break;
      case PostItemEnum.ADS:
        typeMatch = post.type === "ADS";
        break;
      case PostItemEnum.TRAIN_SCHEDULE_ARRIVAL:
      case PostItemEnum.TRAIN_SCHEDULE_DEPARTURE:
        typeMatch =
          post.type === "TRAIN_SCHEDULE_DEPARTURE" ||
          post.type === "TRAIN_SCHEDULE_ARRIVAL";
        break;
    }

    // ถ้าเป็น ADS ไม่ต้องเช็ค roundTrip
    if (
      post.type === "ADS" ||
      post.type === "TRAIN_SCHEDULE_DEPARTURE" ||
      post.type === "TRAIN_SCHEDULE_ARRIVAL"
    ) {
      return typeMatch;
    }

    // กรองตาม roundTrip สำหรับ posts ที่ไม่ใช่ ADS
    const roundTripMatch = post.trainSchedules?.roundTrip == roundTrip;

    // ต้องตรงทั้ง type และ roundTrip
    return typeMatch && roundTripMatch;
  });

  console.log(filteredPosts);

  if (filteredPosts.length === 0) {
    return <div className="text-gray-400 text-center text-sm">ไม่พบข้อมูล</div>;
  }

  return filteredPosts.map((item, idx) => (
    <div
      className="shadow p-2 rounded flex justify-between items-center mb-2 cursor-pointer hover:bg-green-300"
      key={idx}
      onClick={() => {
        onNewPostSelected(item);
      }}
    >
      <p className="text-[14px]">{item.name}</p>
    </div>
  ));
};

export default PostItems;
