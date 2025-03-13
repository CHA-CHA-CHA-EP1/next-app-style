import React, { useEffect, useState } from "react";
import { calculateActualTime } from "./platform";
import Slider from "./text_slider";

const Window = ({ data }: { data: any }) => {
  const [showEnglish, setShowEnglish] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowEnglish((prevShowEnglish) => !prevShowEnglish);
    }, 5000);
    return () => clearInterval(interval);
  });
  return (
    <div
      className="w-full h-full flex  flex-col mx-auto text-center"
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
        <div className="flex-1">
          <p
            style={{
              fontSize: `${data.form.topicFontsize}px`,
              fontFamily: data.form.topicFont,
            }}
          >
            {showEnglish ? "Window No." : "ช่องจำหน่ายตั๋ว"}
          </p>
          <p
            style={{
              fontSize: `${data.form.windowNumberFontsize}px`,
              color: data.form.windowNumberColor,
              fontFamily: data.form.windowNumberFont,
            }}
          >
            {data.form.windowNumber}
          </p>
        </div>
        <div className="flex-1 text-center justify-center z-10">
          <p
            style={{
              fontSize: `${data.form.topicFontsize}px`,
              fontFamily: data.form.topicFont,
            }}
          >
            {/* {showEnglish ? 'Destination Station' : 'สถานีปลายทาง'} */}
            {data.train_schedules.roundTrip === "ARRIVE"
              ? showEnglish
                ? "Origin"
                : "จากสถานีต้นทาง"
              : showEnglish
                ? "Destination Station"
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
                ? data.train_schedules.departureStation.stationNameEng
                : data.train_schedules.departureStation.stationName
              : showEnglish
                ? data.train_schedules.arrivalStation.stationNameEng
                : data.train_schedules.arrivalStation.stationName}
          </p>
        </div>
      </div>
      <div className="flex-1 h-full">
        <div className="flex flex-row h-full">
          <div className="flex-1 text-center items-center justify-center z-10">
            <p
              style={{
                fontSize: `${data.form.topicFontsize}px`,
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
          <div className="flex-1 text-center items-center justify-center z-10">
            <p
              style={{
                fontSize: `${data.form.topicFontsize}px`,
                fontFamily: data.form.topicFont,
              }}
            >
              {showEnglish ? "Train" : "ขบวนรถ"}
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
          <div className="flex-1 z-10">
            <p
              style={{
                fontSize: `${data.form.topicFontsize}px`,
                fontFamily: data.form.topicFont,
              }}
            >
              {/* {showEnglish ? 'Departure time' : 'เวลาออก'} */}
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
                  color:
                    data.train_schedules.lateTime !== 0
                      ? "red"
                      : data.train_schedules.roundTrip === "ARRIVE"
                        ? data.form.trainTimeColor
                        : "white",
                }}
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
          <div className="flex-1 z-10">
            <p
              style={{
                fontSize: `${data.form.topicFontsize}px`,
                fontFamily: data.form.topicFont,
              }}
            >
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

export default Window;
