import React, { useState } from "react";
import Marquee from "react-fast-marquee";

const Slider = ({ data }: { data: any }) => {
  const { form } = data;
  const {
    textSliderSpeed,
    textSliderTh,
    textSliderEng,
    textSliderThEnable,
    textSliderEngEnable,
  } = form;
  const [isThaiText, setIsThaiText] = useState(true);

  const shouldShowThai = textSliderThEnable;
  const shouldShowEng = textSliderEngEnable;

  const handleCycle = () => {
    if (shouldShowThai && shouldShowEng) {
      setIsThaiText((prev) => !prev);
    }
  };

  const getDisplayText = () => {
    if (shouldShowThai && shouldShowEng) {
      return isThaiText ? textSliderTh : textSliderEng;
    }
    if (shouldShowThai) {
      return textSliderTh;
    }
    if (shouldShowEng) {
      return textSliderEng;
    }
    return "";
  };

  return (
    <Marquee
      speed={Number(textSliderSpeed) || 50}
      onCycleComplete={handleCycle}
      className="overflow-hidden"
    >
      {getDisplayText()}
    </Marquee>
  );
};

export default Slider;
