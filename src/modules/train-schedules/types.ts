import { Train } from "../masterdata/train/types";

export enum ROUND_TRIP {
  ARRIVE = "ARRIVE",
  DEPARTURE = "DEPARTURE",
}

export type CreateTrainSchedule = {
  trainId: number;
  platformNumber: number;
  roundTrip: ROUND_TRIP;
  arrivalStationId: number;
  arrivalTime: string;
  departureStationId: number;
  departureTime: string;
};

export type CreateTrainSchedulePayload = {
  trainId: number;
  platformNumber: number;
  roundTrip: ROUND_TRIP;
  arrivalStationId: number;
  arrivalTime: string; // format "HH:mm"
  departureStationId: number;
  departureTime: string; // format "HH:mm"
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  satday: boolean;
  sunday: boolean;
  holiday: boolean;
};

export type UpdateTrainSchedule = {
  platformNumber: number;
  roundTrip: ROUND_TRIP;
  arrivalStationId: number;
  arrivalTime: string;
  departureStationId: number;
  departureTime: string;
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  satday?: boolean;
  sunday?: boolean;
  holiday?: boolean;
};

export type TrainSchedule = {
  id: number;
  trainId: number;
  platformNumber: number;
  temporaryPlatformNumber: number;
  roundTrip: ROUND_TRIP;
  arrivalStationId: number;
  arrivalTime: string;
  departureStationId: number;
  departureTime: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  satday: boolean;
  sunday: boolean;
  holiday: boolean;
  lateTime: number;
  createdAt: string;
  updatedAt: string | null;
  train: Train;
  arrivalStation: {
    id: number;
    stationName: string;
    stationNameEng: string;
    routePathId: number;
  };
  departureStation: {
    id: number;
    stationName: string;
    stationNameEng: string;
    routePathId: number;
  };
};
