import { FC } from "react";
import { Clock } from "lucide-react";

interface PostBoxItemSelectedProps {
  data: any[];
  onDeleteAtIndex: (id: number) => void;
}

const PostBoxItemSelected: FC<PostBoxItemSelectedProps> = ({
  data,
  onDeleteAtIndex,
}) => {
  if (data.length == 0) {
    return (
      <div className="text-gray-400 text-center text-sm">
        กล่องเก็บป้ายว่างเปล่า
      </div>
    );
  }

  return data.map((item, idx) => (
    <div
      className={`shadow p-2 rounded justify-between items-center cursor-pointer hover:opacity-30`}
      key={idx}
      onClick={() => {
        onDeleteAtIndex(idx);
      }}
    >
      <div>{item?.post?.name}</div>
      <div className="flex gap-4 text-sm text-sky-700">
        <div className="flex items-center gap-2 font-bold">
          <Clock size={16} />
          เวลาเริ่ม {item?.time_show} น.
        </div>
        <div className="flex items-center gap-2 font-bold">
          <Clock size={16} />
          เวลาสิ้นสุด {item?.time_start} น.
        </div>
      </div>
    </div>
  ));
};

export default PostBoxItemSelected;
