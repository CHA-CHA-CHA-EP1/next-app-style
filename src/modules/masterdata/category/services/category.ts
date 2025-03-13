import api from "@/src/core/api/axiosInstance";

export const getCategories = async () => {
  return api.get("/categories");
};

export const createCategory = async (name: string, nameEng: string) => {
  return api.post("/categories", {
    categoryName: name,
    categoryNameEng: nameEng,
  });
};

export const updateCategory = async (
  id: number,
  name: string,
  nameEng: string,
) => {
  return api.put(`/categories/${id}`, {
    categoryName: name,
    categoryNameEng: nameEng,
  });
};

export const deleteCategory = async (id: number) => {
  return api.delete(`/categories/${id}`);
};

export const getCategory = async (id: number) => {
  return api.get(`/categories/${id}`);
};
