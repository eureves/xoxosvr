import "./Progress.css";

const ProgressIcon = ({ played, size, image }) => {
  const progress = isNaN(played) ? 0 : played;
  const trackColor = "rgba(0, 0, 0, 0.5";
  const trackWidth = size / 15;
  const spinnerSpeed = 1;
  const spinnerMode = false;
  const indicatorColor = "rgba(0, 255, 255, 0.7";
  const indicatorCap = "round";
  const indicatorWidth = size / 15;

  const center = size / 2;
  const radius = center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth);
  const dashArray = 2 * Math.PI * radius;
  const dashOffset = dashArray * ((100 - progress) / 100);

  return (
    <>
      <div className="svg-pi-wrapper" style={{ width: size, height: size, maxWidth: size }}>
        <svg className="svg-pi" style={{ width: size, height: size }}>
          <circle
            className="svg-pi-track"
            cx={center}
            cy={center}
            fill="transparent"
            r={radius}
            stroke={trackColor}
            strokeWidth={trackWidth}
          />
          <circle
            className={`svg-pi-indicator ${spinnerMode ? "svg-pi-indicator--spinner" : ""}`}
            style={{ animationDuration: spinnerSpeed * 1000 }}
            cx={center}
            cy={center}
            fill="transparent"
            r={radius}
            stroke={indicatorColor}
            strokeWidth={indicatorWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap={indicatorCap}
          />
        </svg>
        <img className="svg-pi-image" width={size} height={size} alt="" src={image}></img>
      </div>
    </>
  );
};

export default ProgressIcon;
