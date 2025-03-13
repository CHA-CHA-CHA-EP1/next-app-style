import api from "@/src/core/api/axiosInstance";

export const getPosts = async () => {
  return api.get("/post");
};

export const deletePost = async (id: number) => {
  return api.delete(`/post/${id}`);
};

export const createPost = async (post: any) => {
  const res = await api.post("/post", post, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updatePost = async (id: number, post: any) => {
  const res = await api.put(`/post/${id}`, post, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getPost = async (id: number) => {
  return api.get(`/post/${id}`);
};
