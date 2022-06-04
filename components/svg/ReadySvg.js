import styledComponents from "styled-components";

const StyledSVG = styledComponents.svg`
max-height: 100px;
max-width: 100%;
width: 100%;
stroke-width: 6;
stroke-miterlimit: 10;
stroke: var(--bs-primary);
.bag{
    animation: up-down 1200ms linear infinite normal forwards;
}
.can{
    animation: big-small 1200ms linear infinite normal forwards;
}
@keyframes big-small{
    0% {
    transform: translate(161.891556px,163.099999px);
    }
    50% {
        transform: translate(161.891556px,150px);
    }
    100% {
        transform: translate(161.891556px,163.1px);
    }
}
@keyframes up-down{
    0% {
    transform: translate(82.5px,146px);
    }
    25% {
        transform: translate(82.5px,123px);
    }
    50% {
        transform: translate(82.5px,146px);
    }
    75% {
        transform: translate(82.5px,169px);
    }
    100% {
        transform: translate(82.5px,146px);
    }
}
`;

const ReadySvg = () => {
  return (
    <StyledSVG
      id="eV1c6Q7xarj1"
      viewBox="0 0 300 300"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >
      <g transform="translate(53.6745 4.000007)">
        <g id="eV1c6Q7xarj3_to" transform="translate(82.5,145)" className="bag">
          <g transform="translate(-82.5,-111.300003)">
            <path
              d="M55.2,222.5l30,37l134-18.5c-.5-41.7-2.5-70.2-4.3-89.2-1.3-13.1-4.6-53.3-16.7-72.3-2.439024-3.812639-4.54674-7.827335-6.3-12-4.5-10.7-8.2-22.8-8.7-29.5-37.9,0-73.6,2.5-111.5,2.5v18.6L61.2,115Z"
              transform="translate(-54.700001-37.5)"
              fill="none"
            />
            <path
              d="M71.8,55.1c5.424688,21.467749,9.56536,43.239665,12.4,65.2c5.787771,44.894687,6.123543,90.324667,1,135.3l-30-37l6-107.5Z"
              transform="translate(-54.700001-37.5)"
              fill="none"
            />
            <polyline
              points="66.5,2 66.5,10.5 69.9,27.9 91,26.4 86.5,9.5 86.5,1.3"
              fill="none"
            />
            <circle
              r="31"
              transform="matrix(.993961-.109734 0.109734 0.993961 97.478527 125.613471)"
              fill="none"
            />
            <line
              x1="90"
              y1="142.9"
              x2="86.8"
              y2="113.6"
              fill="none"
              strokeWidth="3"
            />
            <line
              x1="107.2"
              y1="120.7"
              x2="109.4"
              y2="140.8"
              fill="none"
              strokeWidth="3"
            />
            <path
              d="M135.5,151.7c.026628,2.180352.843923,4.276891,2.3,5.9c1.234776,1.312349,2.838819,2.218983,4.6,2.6c3.648178-1.758484,5.375715-5.990948,4-9.8"
              transform="translate(-54.700001-37.5)"
              fill="none"
              strokeMiterlimit="10"
              strokeWidth="3"
            />
            <ellipse
              rx="4.4"
              ry="4.6"
              transform="matrix(.993961-.109734 0.109734 0.993961 106.68049 116.161286)"
              fill="none"
              strokeWidth="3"
            />
          </g>
        </g>
        <g
          id="eV1c6Q7xarj13_to"
          transform="translate(161.891556,163.099999)"
          className="can"
        >
          <g id="eV1c6Q7xarj13_ts" transform="scale(1,1)">
            <g transform="translate(-161.891556,-163.099998)">
              <polygon
                points="136.9,212.1 184.3,213.2 188.5,145.1 134.8,143.7 136.9,212.1"
                fill="#fff"
              />
              <rect
                width="60.4"
                height="7.58"
                rx="1"
                ry="1"
                transform="matrix(.999701 0.024432-.024432 0.999701 131.793188 135.599772)"
                fill="#fff"
                strokeWidth="4"
              />
              <polyline
                points="133.9,135.8 135.6,128.9 188.1,130.2 190.2,137.2"
                fill="#fff"
              />
              <circle
                r="8.3"
                transform="matrix(.024432-.999701 0.999701 0.024432 160.700664 178.441693)"
                fill="#fff"
              />
              <polyline points="162,129.6 164.8,115.7 184.3,113" fill="none" />
            </g>
          </g>
        </g>
      </g>
    </StyledSVG>
  );
};
export default ReadySvg;
