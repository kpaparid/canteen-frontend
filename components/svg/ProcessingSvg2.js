import styledComponents from "styled-components";

const StyledSVG = styledComponents.svg`fill: none;
// var(--bs-body-color)
stroke: var(--bs-primary);
fill: white;
stroke-width: 5;
#pot, #bottle{
  fill: var(--bs-light-primary);
  stroke: var(--bs-body-color);
}
#left_handle, #right_handle, #bottom, #paper{
  fill: var(--bs-body-color);
  stroke: var(--bs-body-color);
}
#mixer{
  stroke: var(--bs-body-color);
  stroke-width: 7;
  #handle{
    stroke: var(--bs-body-color);
    fill: var(--bs-body-color);
  }
  #left{
    stroke-width: 10;
  }

}
#salt2{
  stroke: var(--bs-body-color);
  fill: var(--bs-light-primary);

}
#salt1{
  stroke: var(--bs-body-color);
  fill: var(--bs-light-primary);
}
#clock {
  stroke: var(--bs-body-color);
  stroke-width: 5;
  #main{
    fill: var(--bs-light-primary);
    stroke-width: 7;
  }
  text{
    stroke-width: 3;
    text-anchor: middle;
    font-size: 40px;
  }
}

`;
const ProcessingSvg2 = () => {
  return (
    <StyledSVG id="Layer_1" data-name="Layer 1" viewBox="0 0 688 417">
      <g id="mixer">
        <path
          id="round"
          className="cls-1"
          d="M457.6,295.3,543,264c19.7,1.3,34.6,18.7,33.5,37.3-1,16.9-15,31.1-32.8,32l-86.4-31.1"
          transform="translate(-149.6 -259.7)"
        />
        <line
          id="middle"
          className="cls-1"
          x1="426.1"
          y1="40.3"
          x2="120.1"
          y2="36"
        />
        <line
          id="left"
          className="cls-2"
          x1="125.9"
          y1="38.1"
          x2="323.4"
          y2="38.1"
        />
        <rect
          id="handle"
          className="cls-3"
          x="70.4"
          y="25.4"
          width="141"
          height="27"
          rx="12"
          ry="12"
        />
      </g>
      <g id="pot">
        <rect
          id="right_handle"
          data-name="right handle"
          className="cls-3"
          x="510.7"
          y="216.1"
          width="90.9"
          height="18.4"
          rx="1.2"
          ry="1.2"
        />
        <rect
          id="left_handle"
          data-name="left handle"
          className="cls-3"
          x="149.2"
          y="216.1"
          width="90.9"
          height="18.4"
          rx="1.2"
          ry="1.2"
        />
        <path
          id="pot-2"
          data-name="pot"
          className="cls-4"
          d="M678.5,460.5H363.8V581.6c1.2,5.2,6.7,26.3,29.7,41.5,24.8,16.4,51.8,14,57.3,13.4l141.4-1.3c6.7.3,35.7.9,60.4-17.8a73.7,73.7,0,0,0,26-35.8Z"
          transform="translate(-149.6 -259.7)"
        />
      </g>
      <g id="bottle">
        <path
          id="glass"
          className="cls-3"
          d="M215.3,635.4h36.5c9.3,0,16.8-8.3,16.8-18.4V496.7a75.1,75.1,0,0,0-2.7-23.5c-4.8-16.8-13-21.9-16.9-33.6-2.9-8.8-3.7-22.6,6.5-43.9l-44.9,1c10.8,21.2,10.2,35,7.5,43.9-3.7,12.2-12.2,17.1-17,35.6-1.5,5.8-2.5,10.6-2.6,21.5,0,2.9,0,9.6,0,17.8,0,11.3,0,25.7-.2,37.4-.3,16.1.2,43.5.2,64.1a20.2,20.2,0,0,0,4.9,13C207.3,634.3,212.5,635.2,215.3,635.4Z"
          transform="translate(-149.6 -259.7)"
        />
        <polygon
          id="paper"
          className="cls-3"
          points="83.7 255.8 83.7 289 48.6 289 48.8 255.8 83.7 255.8"
        />
      </g>
      <g id="salt1">
        <path
          id="body"
          className="cls-3"
          d="M345.3,637h16.1c-1.6-25.9-3.2-34.3-4.6-35.8a22.8,22.8,0,0,1-2.5-3.4,5.9,5.9,0,0,1-1.1-2.7,4.9,4.9,0,0,1,.2-1.9h8c.1-1.2,1.4-11.7-3.5-14.3-1.5-.8-3.9-1-7.9-1.3h-4.9l-6.6.3c-4.1.3-6.2.5-7.2,1.1-4.3,2.7-2.6,12.5-2.2,14.2h8a4.9,4.9,0,0,1,.2,1.9,5.9,5.9,0,0,1-1.1,2.7,22.8,22.8,0,0,1-2.5,3.4c-1.4,1.5-3,9.9-4.6,35.8Z"
          transform="translate(-149.6 -259.7)"
        />
        <path
          id="top"
          className="cls-3"
          d="M361.2,594.9H329.3a2.4,2.4,0,0,1-2.1-2.6,19.4,19.4,0,0,1-.4-3.7c0-.1,0-.3,0-.4a18.2,18.2,0,0,1,1-5.8c.4-1,2.2-5.3,6.1-6.3l1.3-.2,19.5-.2h0l2.5.4c.9.2,3.9,2.4,5.5,6.3a16.2,16.2,0,0,1,.6,10A2.4,2.4,0,0,1,361.2,594.9Z"
          transform="translate(-149.6 -259.7)"
        />
      </g>
      <g id="salt2">
        <path
          id="body-2"
          data-name="body"
          className="cls-3"
          d="M302,637h16.1c-1.6-25.9-3.2-34.3-4.6-35.8a22.8,22.8,0,0,1-2.5-3.4,5.9,5.9,0,0,1-1.1-2.7,4.9,4.9,0,0,1,.2-1.9h8c.1-1.2,1.4-11.7-3.5-14.3-1.5-.8-3.9-1-7.9-1.3h-4.9l-6.6.3c-4.1.3-6.2.5-7.2,1.1-4.3,2.7-2.6,12.5-2.2,14.2h8a4.9,4.9,0,0,1,.2,1.9,5.9,5.9,0,0,1-1.1,2.7,22.8,22.8,0,0,1-2.5,3.4c-1.4,1.5-3,9.9-4.6,35.8Z"
          transform="translate(-149.6 -259.7)"
        />
        <path
          id="top-2"
          data-name="top"
          className="cls-3"
          d="M317.9,594.9H286a2.4,2.4,0,0,1-2.1-2.6,19.4,19.4,0,0,1-.4-3.7c0-.1,0-.3,0-.4a18.2,18.2,0,0,1,1-5.8c.4-1,2.2-5.3,6.1-6.3l1.3-.2,19.5-.2h0l2.5.4c.9.2,3.9,2.4,5.5,6.3a16.2,16.2,0,0,1,.6,10A2.4,2.4,0,0,1,317.9,594.9Z"
          transform="translate(-149.6 -259.7)"
        />
      </g>
      <g id="bottom">
        <path
          id="wood"
          className="cls-3"
          d="M827.3,637.6H150.1v24.8c2.6,1.1,14.5,5.4,63.8,8.5,53.2,3.4,111.4,2.9,123.3,2.7l304.1-.3c14.5.1,76.7.2,130-3.6,37.4-2.7,51.2-5.9,56-7.3Z"
          transform="translate(-149.6 -259.7)"
        />
      </g>
      <g id="clock">
        <path
          id="main"
          className="cls-3"
          d="M762.6,617c0,10.7-7.3,19.3-16.4,19.3H564.6c-9,0-16.4-8.7-16.4-19.3V552.3c0-10.7,7.3-19.3,16.4-19.3H746.2c9,0,16.4,8.7,16.4,19.3Z"
          transform="translate(-149.6 -259.7)"
        />
        <path
          id="secondary"
          className="cls-3"
          d="M737.3,603.7c0,6.3-5.6,11.4-12.5,11.4H586c-6.9,0-12.5-5.1-12.5-11.4v-38c0-6.3,5.6-11.4,12.5-11.4H724.8c6.9,0,12.5,5.1,12.5,11.4Z"
          transform="translate(-149.6 -259.7)"
        />
        <text
          className="cls-5"
          transform="translate(437.4 333.8) scale(1.08 1)"
        >
          <tspan x="63" y="5">
            15min
          </tspan>
        </text>
      </g>
    </StyledSVG>
  );
};
export default ProcessingSvg2;
