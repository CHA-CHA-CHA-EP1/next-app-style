import { PostBox } from "@/src/modules/settings/postbox/types";
import { FC } from "react";

import { Trash2 } from "lucide-react";

interface PostBoxItemProps {
  postbox: PostBox[];
  selected: number | null;
  onPostBoxSelected: (id: number) => void;
  onPostBoxDelete: (id: number) => void;
}

const PostBoxItem: FC<PostBoxItemProps> = ({
  postbox,
  onPostBoxSelected,
  selected,
  onPostBoxDelete,
}) => {
  if (postbox.length == 0) {
    return <div className="text-gray-400 text-center text-sm">ไม่พบข้อมูล</div>;
  }

  return postbox.map((item, idx) => (
    <div
      className={`shadow p-2 rounded flex justify-between items-center cursor-pointer
        ${selected === item.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"}`}
      key={idx}
      onClick={() => {
        onPostBoxSelected(item.id);
      }}
    >
      <p className="text-[14px]">{item.name}</p>
      <Trash2
        size={14}
        className="cursor-pointer hover:text-red-600"
        onClick={() => onPostBoxDelete(item.id)}
      />
    </div>
  ));
};

export default PostBoxItem;
