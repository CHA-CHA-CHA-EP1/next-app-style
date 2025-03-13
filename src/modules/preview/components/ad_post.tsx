import "./index.css";
import Slider from "./text_slider";

const AdPost = ({ data }: { data: any }) => {
  console.log("data form data", data.form);
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
        fontFamily: data.form.backgroundTextFont,
      }}
    >
      {data.form.backgroundVideo !== "" &&
        data.form.backgroundType === "VIDEO" && (
          <video autoPlay loop className="absolute w-full h-full object-cover">
            <source src={data.form.backgroundVideo} type="video/mp4" />
          </video>
        )}

      <div
        className="flex flex-1 mx-auto text-center items-center z-10 flex-col justify-center"
        style={{
          fontSize: `${data.form.backgroundTextFontsize}px`,
          color: data.form.backgroundTextColor,
        }}
      >
        {data.form.backgroundTextEnable === true ? (
          <p>{data.form.backgroundText}</p>
        ) : (
          <></>
        )}
        {data.form.backgroundTextEngEnable === true ? (
          <p>{data.form.backgroundTextEng}</p>
        ) : (
          <></>
        )}
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

export default AdPost;
