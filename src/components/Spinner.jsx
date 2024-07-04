import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThreeCircles } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <ThreeCircles
        height="100"
        width="100"
        color="#fddc08"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="three-circles-rotating"
        outerCircleColor="#177e00"
        innerCircleColor="#fddc08"
        middleCircleColor="#177e00"
      />
    </div>
  );
};

export default Spinner;
