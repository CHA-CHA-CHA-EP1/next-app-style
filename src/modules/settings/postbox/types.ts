export type PostBox = {
  id: number;
  name: string;
  createdAt: string;
  postPivot: {
    postId: number;
    post_type: string;
    time_show: string;
    time_start: string;
  }[];
};

export enum PostItemEnum {
  ALL = "ALL",
  PLATFORM = "PLATFORM",
  WINDOW = "WINDOW",
  ADS = "ADS",
  TRAIN_SCHEDULE_ARRIVAL = "TRAIN_SCHEDULE_ARRIVAL",
  TRAIN_SCHEDULE_DEPARTURE = "TRAIN_SCHEDULE_DEPARTURE",
}

export type NewPostBox = {
  name: string;
  postPivot: {
    postId: number;
    post_type: string;
    time_show: string;
    time_start: string;
  }[];
};
