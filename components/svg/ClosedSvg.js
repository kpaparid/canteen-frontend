import { isEqual } from "lodash";
import { memo } from "react";
import styledComponents from "styled-components";

const StyledSvg = styledComponents.svg`
#top, #bar{
    fill: var(--bs-light-primary);
    stroke: var(--bs-light-primary);
}
.line{
    stroke: var(--bs-primary);
    fill: var(--bs-primary);
}
#innerLeft, #innerRight{
    fill: var(--bs-primary);
    stroke: var(--bs-body-color);
    stroke-width: 20;
}
#primary{
    fill: var(--bs-primary);
    stroke: var(--bs-primary);
}
#secondary{
    fill: var(--bs-pending);
}
.closed{
    stroke: blue;
    fill: var(--bs-light-primary);
}
#sign{
    // fill: var(--bs-body-color);
    // stroke: var(--bs-body-color);

    
    stroke: var(--bs-primary);
    fill: var(--bs-primary);
}
#text{
  font-size: 56px;
  stroke: var(--bs-primary);
  fill: var(--bs-primary);
    stroke-width: 5;

}#sign{
    stroke: var(--bs-primary);
    stroke-width: 7;
    fill: var(--bs-pending);

}
#window{
      stroke: var(--bs-gray-900);
    fill: var(--bs-gray-900);
}
#outerRight, #outerLeft{
  fill: var(--bs-body-color);
  stroke: var(--bs-body-color);
}

`;

const ClosedSvg = memo(() => {
  return (
    <StyledSvg
      version="1.1"
      id="group"
      x="0px"
      y="0px"
      viewBox="0 0 1000 735.68"
    >
      <g id="primary">
        <path
          id="canteen_primary"
          d="M972.6,634.6H28.66c-6.6,0-12-5.4-12-12V146.97c0-6.6,5.4-12,12-12H972.6
		c6.6,0,12,5.4,12,12V622.6C984.6,629.2,979.2,634.6,972.6,634.6z"
        />
      </g>
      <g id="secondary">
        <path
          id="canteen_secondary"
          d="M927.69,636.42H75.7
		c-31.89,0-57.98-26.09-57.98-57.98c-0.35-93.61-0.71-187.21-1.06-280.82c49.11,71.81,133.69,170.24,257.73,194.46
		c222.92,43.54,376.66-190.98,541.11-112.33c115.27,55.13,159.59,227.67,153.49,238.99c-0.18,0.33-0.36,0.64-0.36,0.64
		C958.13,629.89,943.63,636.42,927.69,636.42z"
        />
      </g>
      <g id="windowBack">
        <path
          id="window"
          d="M859.42,510.33l-684.55,0c-8.58,0-15.6-7.02-15.6-15.6c0-8.76,0-182.48,0-260.59
		c0-1.05,0.12-6.56,4.58-11.02c2.83-2.83,6.73-4.58,11.02-4.58l684.55,0c8.58,0,15.6,7.02,15.6,15.6l0,260.59
		C875.02,503.31,868,510.33,859.42,510.33z"
        />
        <line
          className="closed"
          x1="159.26"
          y1="259.22"
          x2="875.02"
          y2="259.22"
        />

        <line
          className="closed"
          x1="159.26"
          y1="305.1"
          x2="875.02"
          y2="305.1"
        />

        <line
          className="closed"
          x1="159.26"
          y1="346.8"
          x2="875.02"
          y2="346.8"
        />

        <line
          className="closed"
          x1="875.02"
          y1="392.68"
          x2="159.26"
          y2="392.68"
        />

        <line
          className="closed"
          x1="159.26"
          y1="434.38"
          x2="875.02"
          y2="434.38"
        />

        <line
          className="closed"
          x1="159.26"
          y1="468.93"
          x2="875.02"
          y2="468.93"
        />
      </g>
      <g id="middle">
        <rect id="sign" x="216.82" y="295.61" width="600.59" height="102.37" />

        <text id="text" transform="matrix(1, 0, 0, 1, 331.577, 370.071)">
          GESCHLOSSEN
        </text>
      </g>
      <g id="top">
        <path
          id="top"
          d="M113.24,15.79c261.58,10.85,523.17,21.69,784.75,32.54c-24.79,45.69-49.57,91.38-74.36,137.07
		H160.84L113.24,15.79z"
        />
      </g>
      <g id="outerLeft">
        <circle id="left" cx="176.66" cy="634.6" r="80.52" />
      </g>
      <g id="outerRight">
        <circle id="right" cx="809.57" cy="634.6" r="80.52" />
      </g>
      <g id="bar">
        <path
          id="bar"
          d="M127.41,470.13
		c259.8-0.4,519.61-0.8,779.41-1.2l14.17,41.87H113.24L127.41,470.13z"
        />
      </g>
      <g id="innerRight">
        <circle id="inner_right" cx="809.57" cy="634.6" r="53.7" />
      </g>
      <g id="innerLeft">
        <circle id="inner_left" cx="176.66" cy="634.6" r="53.7" />
      </g>
      <g className="line">
        <line x1="351.8" y1="85.04" x2="834.94" y2="85.04" />
      </g>
      <g className="line">
        <line x1="486.97" y1="117.25" x2="796.18" y2="117.25" />
      </g>
      <g className="line">
        <line x1="448.43" y1="151.73" x2="738.31" y2="151.73" />
      </g>
    </StyledSvg>
  );
}, isEqual);
export default ClosedSvg;
