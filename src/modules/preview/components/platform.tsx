import React, { useEffect } from "react";
import Slider from "./text_slider";
import "./platform.css";
import "./train_schedule.css";
import "./index.css";

export function calculateActualTime(time: string, lateMin: number) {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + lateMin;
  const actualHours = Math.floor(totalMinutes / 60);
  const actualMinutes = totalMinutes % 60;
  const formattedHours = String(actualHours).padStart(2, "0");
  const formattedMinutes = String(actualMinutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}`;
}

const isBlinkTime = (time: string): boolean => {
  // implement receive time like 00:00 HH:mm and check if if when 5 minutes before the time return true
  const currentTime = new Date();
  const timeToCheck = new Date(currentTime);
  timeToCheck.setHours(parseInt(time.split(":")[0]));
  timeToCheck.setMinutes(parseInt(time.split(":")[1]));
  timeToCheck.setSeconds(0);
  timeToCheck.setMilliseconds(0);
  const fiveMinutesBefore = new Date(timeToCheck);
  fiveMinutesBefore.setMinutes(timeToCheck.getMinutes() - 5);
  return currentTime >= fiveMinutesBefore && currentTime <= timeToCheck;
};

const Platform = ({ data }: { data: any }) => {
  const [showEnglish, setShowEnglish] = React.useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowEnglish((prevShowEnglish) => !prevShowEnglish);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="w-full h-full flex  flex-col mx-auto text-center justify-between"
      style={{
        backgroundColor: data.form.backgroundColor,
        backgroundImage:
          data.form.backgroundType === "IMAGE" &&
          data.form.backgroundImage !== ""
            ? `url(${data.form.backgroundImage})`
            : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {data.form.backgroundVideo !== "" &&
        data.form.backgroundType === "VIDEO" && (
          <video autoPlay loop className="absolute w-full h-full object-cover">
            <source src={data.form.backgroundVideo} type="video/mp4" />
          </video>
        )}
      <div className="flex flex-1 text-center items-center z-10">
        <div className="flex-1 text-center justify-center">
          <p
            style={{
              fontSize: `${data.form.topicFontsize}px`,
              color: data.form.topicColor,
              fontFamily: data.form.topicFont,
            }}
          >
            {/* {showEnglish ? 'Station Destination' : 'สถานีปลายทาง'} */}
            {data.train_schedules.roundTrip === "ARRIVE"
              ? showEnglish
                ? "From Origin"
                : "จากสถานีต้นทาง"
              : showEnglish
                ? "Departure Station"
                : "สถานีปลายทาง"}
          </p>
          <p
            style={{
              fontSize: `${data.form.destinationFontsize}px`,
              color: data.form.destinationColor,
              fontFamily: data.form.destinationFont,
            }}
          >
            {data.train_schedules.roundTrip === "ARRIVE"
              ? showEnglish
                ? data.train_schedules.arrivalStation.stationNameEng
                : data.train_schedules.arrivalStation.stationName
              : showEnglish
                ? data.train_schedules.departureStation.stationNameEng
                : data.train_schedules.departureStation.stationName}
          </p>
        </div>

        <div className="flex-1">
          <p
            style={{
              fontSize: `${data.form.topicFontsize}px`,
              color: data.form.topicColor,
              fontFamily: data.form.topicFont,
            }}
          >
            {/* {showEnglish ? 'Platform' : 'เข้าชานชาลา'} */}
            {data.train_schedules.roundTrip === "ARRIVE"
              ? showEnglish
                ? "IN Platform"
                : "เข้าชานชาลา"
              : showEnglish
                ? "Out Platform"
                : "ออกชานชาลา"}
          </p>
          <p
            style={{
              fontSize: `${data.form.platformFontsize}px`,
              color: data.form.platformColor,
              fontFamily: data.form.platformFont,
            }}
          >
            {data.train_schedules.temporaryPlatformNumber
              ? data.train_schedules.temporaryPlatformNumber
              : data.train_schedules.platformNumber}
          </p>
        </div>
      </div>
      <div className="flex-1 h-full z-10">
        <div className="flex flex-row h-full">
          <div className="flex-1 text-center items-center justify-center">
            <p
              style={{
                fontSize: `${data.form.topicFontsize}px`,
                color: data.form.topicColor,
                fontFamily: data.form.topicFont,
              }}
            >
              {showEnglish ? "Train No." : "ขบวนรถ"}
            </p>
            <p
              style={{
                fontSize: `${data.form.trainTypeFontsize}px`,
                color: data.form.trainTypeColor,
                fontFamily: data.form.trainTypeFont,
              }}
            >
              {data.train_schedules.train.trainName}
            </p>
          </div>
          <div className="flex-1 text-center items-center justify-center">
            <p
              style={{
                fontSize: `${data.form.topicFontsize}px`,
                color: data.form.topicColor,
                fontFamily: data.form.topicFont,
              }}
            >
              {showEnglish ? "Type" : "ประเภทรถ"}
            </p>
            <p
              style={{
                fontSize: `${data.form.categoryFontsize}px`,
                color: data.form.categoryColor,
                fontFamily: data.form.categoryFont,
              }}
            >
              {showEnglish
                ? data.train_schedules.train.category.categoryNameEng
                : data.train_schedules.train.category.categoryName}
            </p>
          </div>
          <div className="flex-1">
            <p
              style={{
                fontSize: `${data.form.topicFontsize}px`,
                color: data.form.topicColor,
                fontFamily: data.form.topicFont,
              }}
            >
              {data.train_schedules.roundTrip === "ARRIVE"
                ? showEnglish
                  ? "Delay (Min)"
                  : "รถเข้าล่าช้า (นาที)"
                : showEnglish
                  ? "Delay (Min)"
                  : "รถออกล่าช้า (นาที)"}
            </p>
            <p
              style={{
                fontSize: `${data.form.lateTimeFontsize}px`,
                color: data.form.lateTimeColor,
                fontFamily: data.form.lateTimeFont,
              }}
            >
              <span
                style={{
                  color:
                    data.train_schedules.lateTime !== 0 ||
                    isBlinkTime(
                      calculateActualTime(
                        data.train_schedules.departureTime,
                        data.train_schedules.lateTime,
                      ),
                    ) ||
                    isBlinkTime(
                      calculateActualTime(
                        data.train_schedules.arrivalTime,
                        data.train_schedules.lateTime,
                      ),
                    )
                      ? "red"
                      : data.train_schedules.roundTrip === "ARRIVE"
                        ? data.form.trainTimeColor
                        : "white",
                }}
                className={
                  isBlinkTime(
                    calculateActualTime(
                      data.train_schedules.departureTime,
                      data.train_schedules.lateTime,
                    ),
                  ) ||
                  isBlinkTime(
                    calculateActualTime(
                      data.train_schedules.arrivalTime,
                      data.train_schedules.lateTime,
                    ),
                  )
                    ? "blink"
                    : ""
                }
              >
                {data.train_schedules.lateTime}
              </span>
            </p>
          </div>
          <div className="flex-1">
            <p
              style={{
                fontSize: `${data.form.topicFontsize}px`,
                fontFamily: data.form.topicFont,
                color: data.form.topicColor,
              }}
            >
              {data.train_schedules.roundTrip === "ARRIVE"
                ? showEnglish
                  ? "Arrive"
                  : "เวลาเข้า"
                : showEnglish
                  ? "Departure"
                  : "เวลาออก"}
            </p>
            <p
              style={{
                fontSize: `${data.form.trainTimeFontsize}px`,
                color: data.form.trainTimeColor,
                fontFamily: data.form.trainTimeFont,
              }}
            >
              <span
                style={{
                  // color: (data.train_schedules.lateTime !== 0) ? 'red' : (data.train_schedules.roundTrip === "ARRIVE") ? data.form.trainTimeColor : 'white'
                  color:
                    data.train_schedules.lateTime !== 0 ||
                    isBlinkTime(
                      calculateActualTime(
                        data.train_schedules.departureTime,
                        data.train_schedules.lateTime,
                      ),
                    ) ||
                    isBlinkTime(
                      calculateActualTime(
                        data.train_schedules.arrivalTime,
                        data.train_schedules.lateTime,
                      ),
                    )
                      ? "red"
                      : data.train_schedules.roundTrip === "ARRIVE"
                        ? data.form.trainTimeColor
                        : "white",
                }}
                className={
                  isBlinkTime(
                    calculateActualTime(
                      data.train_schedules.departureTime,
                      data.train_schedules.lateTime,
                    ),
                  ) ||
                  isBlinkTime(
                    calculateActualTime(
                      data.train_schedules.arrivalTime,
                      data.train_schedules.lateTime,
                    ),
                  )
                    ? "blink"
                    : ""
                }
              >
                {data.train_schedules.roundTrip === "ARRIVE"
                  ? calculateActualTime(
                      data.train_schedules.departureTime,
                      data.train_schedules.lateTime,
                    )
                  : calculateActualTime(
                      data.train_schedules.arrivalTime,
                      data.train_schedules.lateTime,
                    )}
              </span>
            </p>
          </div>
        </div>
      </div>
      {data.form.textSliderEngEnable || data.form.textSliderThEnable ? (
        <div
          className="z-10 absolute bottom-0 w-full"
          style={{
            backgroundColor: data.form.textSliderBackgroundColor,
            fontSize: `${data.form.textSliderFontsize}px`,
            color: `${data.form.textSliderColor}`,
          }}
        >
          <Slider data={data} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Platform;
