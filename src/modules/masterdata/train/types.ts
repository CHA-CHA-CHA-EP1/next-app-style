export type Train = {
  id: number;
  trainName: string;
  routePath: {
    id: number;
    pathName: string;
  };
  category: {
    id: number;
    categoryName: string;
    categoryNameEng: string;
  };
};
