import React, { useEffect, useState } from "react";
import "./index.css";
import Slider from "./text_slider";
import { TrainSchedule } from "../../train-schedules/types";
import { getClientDashboard } from "../../settings/client/services/client";
import { calculateActualTime } from "./platform";

const TrainSchedulePage = ({ data }: { data: any }) => {
  const [trainSchedule, setTrainSchedule] = useState<TrainSchedule[]>([]);
  const [showEnglish, setShowEnglish] = useState(false);

  const {
    topicFont,
    topicColor,
    topicFontsize,
    trainTypeFont,
    trainTypeColor,
    trainTypeFontsize,
    type,
  } = data?.form;

  const trip: "ARRIVE" | "DEPARTURE" =
    type === "TRAIN_SCHEDULE_ARRIVAL" ? "ARRIVE" : "DEPARTURE";

  console.log(trip);

  useEffect(() => {
    // Toggle language every 3 seconds
    const languageInterval = setInterval(() => {
      setShowEnglish((prev) => !prev);
    }, 3000);

    const fetchData = async () => {
      const trainScheduleResponse = await getClientDashboard(trip);
      const trainScheduleData = trainScheduleResponse.data;
      setTrainSchedule(trainScheduleData);
    };

    const fetchDataInterval = setInterval(() => {
      fetchData();
    }, 5000);

    fetchData();

    return (): void => {
      clearInterval(fetchDataInterval);
      clearInterval(languageInterval);
    };
  }, [data]);

  const isSliderEnabled =
    data.form.textSliderEngEnable || data.form.textSliderThEnable;

  // Font size settings
  const tableSetting = {
    headerFontSize: topicFontsize,
    headerColor: topicColor,
    contentFontSize: trainTypeFontsize,
    contentColor: trainTypeColor,
  };

  // Style objects
  const headerStyle = {
    fontSize: `${tableSetting.headerFontSize}px`,
    color: `${tableSetting.headerColor}`,
    fontFamily: topicFont,
  };

  const contentStyle = {
    fontSize: `${tableSetting.contentFontSize}px`,
    color: `${tableSetting.contentColor}`,
    fontFamily: trainTypeFont,
  };

  const isBlinkTime = (time: string): boolean => {
    const currentTime = new Date();
    const timeToCheck = new Date(currentTime);
    const [hours, minutes] = time.split(":").map(Number);
    timeToCheck.setHours(hours);
    timeToCheck.setMinutes(minutes);
    timeToCheck.setSeconds(0);
    timeToCheck.setMilliseconds(0);
    const fiveMinutesBefore = new Date(timeToCheck);
    fiveMinutesBefore.setMinutes(timeToCheck.getMinutes() - 5);
    return currentTime >= fiveMinutesBefore && currentTime <= timeToCheck;
  };

  // Create fixed size array with actual and dummy data
  const TOTAL_ROWS = 10;
  const emptyRows = Math.max(0, TOTAL_ROWS - trainSchedule.length);

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="flex-1 min-h-0 overflow-hidden">
        <table className="w-full h-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white" style={headerStyle}>
              <th className="border border-gray-600 text-center">
                {showEnglish ? "Train No." : "ขบวนรถ"}
              </th>
              <th className="border border-gray-600 text-center">
                {trip === "ARRIVE"
                  ? showEnglish
                    ? "Origin"
                    : "ต้นทาง"
                  : showEnglish
                    ? "Destination"
                    : "ปลายทาง"}
              </th>
              <th className="border border-gray-600 text-center">
                {showEnglish ? "Platform" : "ชานชาลา"}
              </th>
              <th className="border border-gray-600 text-center truncate whitespace-nowrap">
                {trip === "ARRIVE"
                  ? showEnglish
                    ? "Sch. Arr."
                    : "กำหนดเข้า"
                  : showEnglish
                    ? "Sch. Dep."
                    : "กำหนดออก"}
              </th>
              <th className="border border-gray-600 text-center">
                {trip === "ARRIVE"
                  ? showEnglish
                    ? "Arrival"
                    : "เข้าจริง"
                  : showEnglish
                    ? "Depart"
                    : "ออกจริง"}
              </th>
              <th className="border border-gray-600 text-center">
                {showEnglish ? "Delay" : "ล่าช้า"}
              </th>
              <th className="border border-gray-600 text-center">
                {showEnglish ? "Remark" : "หมายเหตุ"}
              </th>
            </tr>
          </thead>

          <tbody className="text-white" style={contentStyle}>
            {trainSchedule.map((schedule, index) => (
              <tr
                key={index}
                className={`h-1/10 ${isBlinkTime(trip === "ARRIVE" ? schedule.departureTime : schedule.arrivalTime) ? "blink" : ""}`}
                style={{
                  color: schedule.lateTime !== 0 ? "#FF0000" : undefined,
                }}
              >
                <td className="border border-gray-300 text-center">
                  {showEnglish
                    ? `${schedule.train.category.categoryNameEng} ${schedule.train.trainName}`
                    : `${schedule.train.category.categoryName} ${schedule.train.trainName}`}
                </td>
                <td className="border border-gray-300 text-center">
                  {trip === "ARRIVE"
                    ? showEnglish
                      ? schedule.arrivalStation.stationNameEng
                      : schedule.arrivalStation.stationName
                    : showEnglish
                      ? schedule.departureStation.stationNameEng
                      : schedule.departureStation.stationName}
                </td>
                <td className="border border-gray-300 text-center">
                  {schedule.temporaryPlatformNumber || schedule.platformNumber}
                </td>
                <td className="border border-gray-300 text-center">
                  {trip === "ARRIVE"
                    ? schedule.departureTime
                    : schedule.arrivalTime}
                </td>
                <td className="border border-gray-300 text-center">
                  {trip === "ARRIVE"
                    ? calculateActualTime(
                        schedule.departureTime,
                        schedule.lateTime,
                      )
                    : calculateActualTime(
                        schedule.arrivalTime,
                        schedule.lateTime,
                      )}
                </td>
                <td className="border border-gray-300 text-center">
                  {schedule.lateTime !== 0 ? schedule.lateTime : ""}
                </td>
                <td className="border border-gray-300 text-center">
                  {schedule.lateTime !== 0
                    ? showEnglish
                      ? "Delayed"
                      : "ล่าช้า"
                    : ""}
                </td>
              </tr>
            ))}
            {Array.from({ length: emptyRows }).map((_, index) => (
              <tr key={`empty-${index}`} className="h-1/10">
                <td className="border border-gray-300 text-center text-black">
                  TRNAAAAAAAAAAAAAAAAAAA000
                </td>
                <td className="border border-gray-300 text-center text-black">
                  Bangkok
                </td>
                <td className="border border-gray-300 text-center text-black">
                  P0
                </td>
                <td className="border border-gray-300 text-center text-black">
                  10:00
                </td>
                <td className="border border-gray-300 text-center text-black">
                  10:00
                </td>
                <td className="border border-gray-300 text-center text-black">
                  On Time
                </td>
                <td className="border border-gray-300 text-center">
                  <button
                    className="bg-blue-500 text-black px-4 py-1 rounded invisible"
                    style={contentStyle}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isSliderEnabled && (
        <div
          className="w-full"
          style={{
            backgroundColor: data.form.textSliderBackgroundColor,
            fontSize: `${data.form.textSliderFontsize}px`,
            color: data.form.textSliderColor,
          }}
        >
          <Slider data={data} />
        </div>
      )}
    </div>
  );
};

export default TrainSchedulePage;
