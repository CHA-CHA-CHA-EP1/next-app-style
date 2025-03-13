import { ROUND_TRIP } from "../modules/train-schedules/types";

export interface TableActions {
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  roundTrip?: ROUND_TRIP;
}
