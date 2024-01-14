const ExpandingLoader = () => {
  return (
    <svg
      height="100px"
      preserveAspectRatio="xMidYMid"
      style={{
        margin: "auto",
        background: "transparent",
        display: "block",
        shapeRendering: "auto",
      }}
      viewBox="0 0 100 100"
      width="100px"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        r="0"
        stroke="#16a34a"
        strokeWidth="2"
      >
        <animate
          attributeName="r"
          begin="0s"
          calcMode="spline"
          dur="1s"
          keySplines="0 0.2 0.8 1"
          keyTimes="0;1"
          repeatCount="indefinite"
          values="0;40"
        ></animate>

        <animate
          attributeName="opacity"
          begin="0s"
          calcMode="spline"
          dur="1s"
          keySplines="0.2 0 0.8 1"
          keyTimes="0;1"
          repeatCount="indefinite"
          values="1;0"
        ></animate>
      </circle>
      <circle
        cx="50"
        cy="50"
        fill="none"
        r="0"
        stroke="#46dff0"
        strokeWidth="2"
      >
        <animate
          attributeName="r"
          begin="-0.5s"
          calcMode="spline"
          dur="1s"
          keySplines="0 0.2 0.8 1"
          keyTimes="0;1"
          repeatCount="indefinite"
          values="0;40"
        ></animate>

        <animate
          attributeName="opacity"
          begin="-0.5s"
          calcMode="spline"
          dur="1s"
          keySplines="0.2 0 0.8 1"
          keyTimes="0;1"
          repeatCount="indefinite"
          values="1;0"
        ></animate>
      </circle>{" "}
    </svg>
  );
};

export default ExpandingLoader;
