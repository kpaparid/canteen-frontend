import styledComponents from "styled-components";

const StyledSVG = styledComponents.svg`

@keyframes pot {
  0%, 100% {
        transform: none;
  }
  50%{
    transform: translateY(-3px);
  }
}
#pot #top-2{
  animation: pot 2s linear infinite normal forwards;
}

// height: 150px;
max-width: 100%;
width: 100%;
stroke-width: 3;
stroke-miterlimit: 10;
stroke: var(--bs-primary);
fill: white;
#pot{
  stroke: var(--bs-body-color);
  fill: var(--bs-light-primary);
}

#mac1,#mac2,#mac3,#mac4,#mac5,#mac6,#mac7{
  stroke: var(--bs-body-color);
  // stroke: var(--bs-body-color);
  fill: yellow;
  stroke-width: 0.3;
}
#man{
  stroke-width: 2;
  stroke: var(--bs-primary);
  #hat{
    stroke-width: 1;
    stroke: var(--bs-body-color);
  }
  #hair {
    stroke-width: 3;
    fill: var(--bs-body-color);
    stroke: var(--bs-body-color);
  }
  #shirt{
    fill: var(--bs-primary);
    stroke: var(--bs-body-color);
    stroke-width: 1;
  }
  #front{
    fill: var(--bs-body-color);
    stroke: var(--bs-body-color);
  }

}
#inside_rect{
    stroke-width: 1;  
    fill: var(--bs-body-color);
    stroke: var(--bs-body-color);
}
#right, #inner_right{
  cx: 173;
}
#inner_right, #inner_left {
  r: 7;
  fill: var(--bs-light-primary);
  stroke: var(--bs-light-primary);
}
#right, #left{
  fill: var(--bs-body-color);
  stroke: var(--bs-body-color);
}
#canteen_primary {
  fill: var(--bs-light-primary);
  stroke: var(--bs-body-color);
}
#canteen_secondary {
  fill: transparent;
  stroke: transparent;
}
#time{
  fill: var(--bs-body-color);
}
// text{
//   stroke: var(--bs-body-color);
// }
text{
  stroke-width: 1;
}
#window, #time{
  stroke: var(--bs-body-color);
  // fill: var(--bs-body-color);
}
#top, #bar {
  fill: var(--bs-light-primary);
  stroke: var(--bs-body-color);
  stroke-width: 2;
}
#pan{
    fill: yellow;
  stroke: var(--bs-body-color);
  stroke-width: 0.2;
}

#arm, #hand, #right_hand, #head{
  fill: var(--bs-light-primary);
  stroke: var(--bs-body-color);
  stroke-width: 0.5;
}
text{
  stroke: white;
}
`;

const ProcessingSvg = () => {
  return (
    <StyledSVG id="Layer_1" data-name="Layer 1" viewBox="0 0 210 200">
      <rect
        id="canteen_primary"
        data-name="canteen primary"
        className="cls-1"
        x="0.5"
        y="25.2"
        width="200.3"
        height="103.41"
        rx="12"
        ry="12"
      />
      <rect
        id="window"
        className="cls-2"
        x="136.6"
        y="122.4"
        width="102.7"
        height="60.4"
        rx="12"
        ry="12"
        transform="translate(-62.6 -78.4) rotate(-0.5)"
      />
      <rect
        id="inside_rect"
        data-name="inside rect"
        className="cls-3"
        x="125.2"
        y="85.4"
        width="51.7"
        height="12.5"
      />
      <path
        id="top"
        className="cls-4"
        d="M81.6,80.7l162.4,6.7-15.4,28.4H91.5Z"
        transform="translate(-61.2 -80.1)"
      />
      <circle id="left" className="cls-4" cx="33.6" cy="128.6" r="16.7" />
      <circle id="right" className="cls-4" cx="164.6" cy="128.6" r="16.7" />
      <g id="man">
        <path
          id="right_hand"
          data-name="right hand"
          className="cls-5"
          d="M164.7,158h.4a23.5,23.5,0,0,1-.6,16h-2.6a45,45,0,0,0-.1-15.6A15.5,15.5,0,0,1,164.7,158Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="shirt"
          className="cls-6"
          d="M157.7,145h-.3l2.2.9,1,.8,1.3,1.4,1.3,2.4.5,1.5.4,2,1.3,3-5.4,1.1v17.4H144.6l-.7-17.4-5.4-1.2,1.7-8.3,1-1.5,2.6-.8,2.8-.9,1.8-.8,1.2-1.2,1,.7,1.3.4h1.4l1.2-.6h.9l1.9,1.1.4.2"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="front"
          className="cls-7"
          d="M160,175.3H144.6l-.6-13.1a18.4,18.4,0,0,0,1-2,19.7,19.7,0,0,0,1.5-6.5c.2-2.5.4-5.7-.8-7.8,0,0-.2-.4-.1-.5s3.2,4.6,7,4.5a5.2,5.2,0,0,0,3.4-1.2c1.6-1.4,1.6-3.8,1.8-3.8s-.7,4.6-.1,9.4a19.7,19.7,0,0,0,2.4,7.2c.2,1.8.3,3.6.3,5.6A79.4,79.4,0,0,1,160,175.3Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="head"
          className="cls-8"
          d="M156.3,140.9a3.9,3.9,0,0,1-7.8,0l-.7-4.3,2.2-1.7,3.5-1,2,.6.8.7.8,1Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="hat"
          className="cls-2"
          d="M147.4,136.1l-.5-3.2a3.2,3.2,0,0,1-2.5-1.5,2.8,2.8,0,0,1-.1-2.8c.7-1.1,2.9-1.3,4.8.2a2.8,2.8,0,1,1,5.4.1c2.1-1.4,4.3-1.1,4.8-.1s-.2,2.8-2.1,4.1l-.2,3.4h-9.7Z"
          transform="translate(-61.2 -80.1)"
        />
        <g id="pan">
          <path
            className="cls-9"
            d="M164.6,160.2l14-3.2a3,3,0,0,1,.5,1.6,1.9,1.9,0,0,1-1.1,1.8L166.5,163a2.4,2.4,0,0,1-1.6-1.2A2.6,2.6,0,0,1,164.6,160.2Z"
            transform="translate(-61.2 -80.1)"
          />
          <path
            className="cls-9"
            d="M164.5,161.8"
            transform="translate(-61.2 -80.1)"
          />
          <rect
            className="cls-10"
            x="153.9"
            y="162.9"
            width="11.2"
            height="0.91"
            transform="translate(-102.1 -26.1) rotate(-17.1)"
          />
        </g>
        <path
          id="arm"
          className="cls-11"
          d="M139.4,157.9c.5,1.7,1.2,3.8,2.1,6a7.2,7.2,0,0,0,2,3.1l1.1.8.8-.4c2.4-1.3,4.4-1.8,4.3-2s-3.1.8-4.8-.7l-.5-.6a16.8,16.8,0,0,1-2.3-5.6Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="hand"
          className="cls-11"
          d="M156.9,163.1c-.8-.5-1.7.1-3.9.8l-2.7.8c-1.4.5-3.6,1.1-7.1,2l.8,1,1.4.3a6.5,6.5,0,0,0,2.3-.3,48.6,48.6,0,0,1,6.9-1.7,3.9,3.9,0,0,0,2.2-.8,1.4,1.4,0,0,0,.6-1A1.4,1.4,0,0,0,156.9,163.1Z"
          transform="translate(-61.2 -80.1)"
        />
      </g>
      <path
        id="bar"
        className="cls-2"
        d="M133,174.7l110-.2,2,8.7H131Z"
        transform="translate(-61.2 -80.1)"
      />
      <circle
        id="inner_right"
        data-name="inner right"
        className="cls-4"
        cx="164.6"
        cy="128.6"
        r="11.1"
      />
      <circle
        id="inner_left"
        data-name="inner left"
        className="cls-4"
        cx="33.6"
        cy="128.6"
        r="11.1"
      />
      <line className="cls-12" x1="69.9" y1="14.9" x2="169.9" y2="14.9" />
      <line className="cls-12" x1="97.8" y1="21.5" x2="161.8" y2="21.5" />
      <line className="cls-12" x1="89.9" y1="28.7" x2="149.9" y2="28.7" />
      <circle id="time" className="cls-4" cx="39.2" cy="73.8" r="27.4"></circle>

      <path
        className="cls-4"
        d="M162.2,165.5"
        transform="translate(-61.2 -80.1)"
      />
      <g id="pot">
        <path
          id="mac8"
          className="cls-13"
          d="M218.4,163.5h0c-.4,0-.8-.2-.8-.4l-.8-13c0-.2.3-.4.8-.4h0c.4,0,.8.2.8.4l.8,13C219.2,163.3,218.8,163.5,218.4,163.5Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="mac7"
          className="cls-13"
          d="M215.8,161.8h0c-.4.2-.8.1-.9-.1l-6.3-14.3c-.1-.2.1-.6.5-.7h0c.4-.2.8-.1.9.1l6.3,14.3C216.4,161.3,216.2,161.7,215.8,161.8Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="mac6"
          className="cls-13"
          d="M216.2,160.5h0c-.4,0-.8-.2-.8-.4l-.8-13c0-.2.3-.4.8-.4h0c.4,0,.8.2.8.4l.8,13C217,160.3,216.6,160.5,216.2,160.5Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="mac5"
          className="cls-13"
          d="M219.2,164.3h0a.8.8,0,0,1-1-.3L210,145a.7.7,0,0,1,.5-.9h0a.8.8,0,0,1,1,.3l8.2,19A.7.7,0,0,1,219.2,164.3Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="mac4"
          className="cls-13"
          d="M206.9,155.2h0a.8.8,0,0,1-.9-.4l-5.2-20.1a.7.7,0,0,1,.6-.8h0a.8.8,0,0,1,.9.4l5.2,20.1A.7.7,0,0,1,206.9,155.2Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="mac3"
          className="cls-13"
          d="M209.5,156.4h0a.8.8,0,0,1-1-.2l-10-18.1a.7.7,0,0,1,.4-.9h0a.8.8,0,0,1,1,.2l10,18.1A.7.7,0,0,1,209.5,156.4Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="mac2"
          className="cls-13"
          d="M205.8,155.9h0a.8.8,0,0,1-1-.3l-8.1-19.1a.7.7,0,0,1,.5-.9h0a.8.8,0,0,1,1,.3l8.1,19.1A.7.7,0,0,1,205.8,155.9Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="mac1"
          className="cls-13"
          d="M206.2,158.1h0a.8.8,0,0,1-1-.2l-10-18.1a.7.7,0,0,1,.4-.9h0a.8.8,0,0,1,1,.2l10,18.1A.7.7,0,0,1,206.2,158.1Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="main"
          className="cls-14"
          d="M200.7,151.9c-.2,3.1-.3,5.4-.4,6.7s-.3,4.3,1,5.6a6.2,6.2,0,0,0,2.8,1.3H225a6,6,0,0,0,2.4-1.2c1.4-1.2,1.5-2.9,1.6-5.8,0-.7,0-1.2,0-2.3s-.2-3.2-.3-4.2Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="right-2"
          data-name="right"
          className="cls-15"
          d="M235.8,155.5l-3.3.5-3.3.8,3.3-.5Z"
          transform="translate(-61.2 -80.1)"
        />
        <path
          id="left-2"
          data-name="left"
          className="cls-15"
          d="M200,156.7l-3.3-.7-3.4-.4,3.3.7Z"
          transform="translate(-61.2 -80.1)"
        />
        <rect
          id="cover"
          className="cls-16"
          x="138.6"
          y="71.6"
          width="30.1"
          height="0.78"
          rx="0.2"
          ry="0.2"
        />
        <g id="top-2" data-name="top">
          <path
            id="top_body"
            data-name="top body"
            className="cls-2"
            d="M227.8,142.8c.9-1,.2-2.5-1.6-3.4s-3.9-.8-4.7.2-.2,2.5,1.6,3.4S227,143.8,227.8,142.8Z"
            transform="translate(-61.2 -80.1)"
          />
          <path
            id="top_handle"
            data-name="top handle"
            className="cls-2"
            d="M208.3,140.7a7.7,7.7,0,0,1,3.7-2.4c3.6-1,7.2.8,11.6,2.9s8.9,4.4,9.4,8a5.8,5.8,0,0,1-.9,3.7Z"
            transform="translate(-61.2 -80.1)"
          />
        </g>
      </g>
      <text x="39.2" y="74.8" textAnchor="middle">
        15min
      </text>
    </StyledSVG>
  );
};
export default ProcessingSvg;
