import api from "@/src/core/api/axiosInstance";

export const getPostBoxes = async () => {
  return api.get("/postbox");
};

export const createPostBox = async (postbox: any) => {
  return api.post("/postbox", postbox);
};

export const updatePostBox = async (id: number, postBox: any) => {
  const modifiedPostBox = { ...postBox };

  // ถ้ามี postPivot และเป็น array
  if (modifiedPostBox.postPivot && Array.isArray(modifiedPostBox.postPivot)) {
    // map ผ่านแต่ละ item และลบ field post
    modifiedPostBox.postPivot = modifiedPostBox.postPivot.map((item) => {
      const newItem = { ...item };
      delete newItem.post;
      return newItem;
    });
  }
  return api.put(`/postbox/${id}`, modifiedPostBox);
};

export const removePostBox = async (id: number) => {
  return api.delete(`/postbox/${id}`);
};
