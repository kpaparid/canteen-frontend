import { Player, Controls } from "@lottiefiles/react-lottie-player";
import styledComponents from "styled-components";
import lottie from "./data.json";
import { memo } from "react";
import { isEqual } from "lodash";
import { useDurationHook } from "../../utilities/utils.mjs";

const StyledSVG = styledComponents.div`
// svg{
  transform: scale(1.2) !important;
// }
.lf-player-container{
  height: 100%;
  width: 100%;
}
height: 100%;
width: 100%;
stroke: var(--bs-primary);
fill: white;
stroke-width: 5;
#knife{
  stroke-width: 5;
  stroke: var(--bs-body-color);

  g:first-child path{
      fill: var(--bs-primary);
      stroke: var(--bs-primary);
  }
  g:nth-child(3), g:nth-child(4){
    path{
    fill: var(--bs-body-color);
      fill-opacity: 1;
    }
  }
  g:nth-child(2) path{
    fill: var(--bs-body-color);
  stroke: var(--bs-gray-600);
  fill: var(--bs-gray-600);
  }
}
#whole, #start1, #start2, #middle1, #middle2{
  path{
    fill-opacity: 1;
    stroke-width: 0;
    fill: var(--bs-primary);
    stroke: var(--bs-body-color);
    // stroke: transparent;
  }

}
#whole, #start2, #middle2{
  g:nth-child(2){
    path{
      stroke-width: 2;
      fill: green;
      stroke: green;
    }
  }
}
#lfood1, #lfood2, #lfood3{
  path {stroke: var(--bs-primary);
  stroke-width: 5;}
}
#pot{
      g path{
        &:first-child{
          fill: var(--bs-primary);
          stroke: var(--bs-primary);
          stroke-width: 1;
        }
        &:nth-child(2){
          fill: transparent;
          stroke: transparent;
          stroke-width: 0;
          display:none;
        }
        
      }
}
#bottle{
  g:nth-child(2) {
      path{
        fill: var(--bs-body-color);
        stroke: var(--bs-body-color);
        stroke-width: 1;
      }
  }
  g:nth-child(1) {
      path{
        fill: var(--bs-primary);
        stroke: var(--bs-body-color);
        stroke-width: 0;
      }
  }
}

#left_handle, #right_handle, #paper{
  fill: var(--bs-body-color);
  // stroke: var(--bs-body-color);
}
#bottom path{
    // fill: var(--bs-light-primary);
    fill: var(--bs-body-color);
    stroke: var(--bs-body-color);
}
#mixer{
  stroke: var(--bs-body-color);
  stroke-width: 7;
  g:nth-child(4) path{
    stroke: var(--bs-body-color);
    stroke: transparent;
    fill: var(--bs-primary) !important;
  }
}
#salt1 path{
  stroke: var(--bs-body-color);
  fill: var(--bs-body-color);
  stroke: var(--bs-gray-700);
  fill: var(--bs-gray-700);

}
#salt2 path{
  stroke: var(--bs-gray-600);
  fill: var(--bs-gray-600);
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
#bubble1,#bubble2,#bubble3,#bubble4,#bubble5,#bubble6,#bubble7,#bubble8,#bubble9,#bubble10,#bubble11,#bubble12,#bubble13{
  path{
    stroke: var(--bs-body-color);
    stroke-width: 2;
  }
}
#ball1, #ball2, #ball3, #ball4, #ball5, #ball6, #ball7, #ball8, #ball9{
  path {
    fill: var(--bs-light-primary);
  stroke: var(--bs-body-color);
  stroke-width: 4;
  }
}
#ball10, #ball11, #ball12,#ball13, #ball14, #ball15, #ball16, #ball17, #ball18, #ball19{
  path {
    fill: white;
  stroke: var(--bs-body-color);
  stroke-width: 4;
  }
}
`;

const Lottie = memo(() => {
  return (
    <StyledSVG>
      <Player
        autoplay
        loop
        style={{ height: "215px" }}
        src={lottie}
        // src="https://assets3.lottiefiles.com/packages/lf20_XZ3pkn.json"
      >
        {/* <Controls
          visible={true}
          buttons={["play", "repeat", "frame", "debug"]}
        /> */}
      </Player>
    </StyledSVG>
  );
}, isEqual);

const Wrapper = styledComponents.div`
position: relative;
height: 100%;
width: 100%;
`;

const ProcessingSvg2 = ({ time }) => {
  const duration = useDurationHook(time);
  return (
    <Wrapper>
      <StyledTime2>{duration ? duration + " min" : "now"}</StyledTime2>
      <Lottie></Lottie>
    </Wrapper>
  );
};
const StyledTime2 = styledComponents.div`
position: absolute;
bottom: 0px;
left: 50%;
transform: translateX(-50%);
font-weight: 700;
font-size: 20px;
`;
export default ProcessingSvg2;
