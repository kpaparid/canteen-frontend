import { Player } from "@lottiefiles/react-lottie-player";
import styledComponents from "styled-components";
import lottie from "./ready.json";
import { memo } from "react";
import { isEqual } from "lodash";
const StyledSVG = styledComponents.div`
path{
  stroke-width: 0;
}
#bag{
  g:nth-child(3) path{
    fill: var(--bs-primary);
    stroke: var(--bs-body-color);
  }
  g:nth-child(1) path{
    fill: var(--bs-primary);
    stroke: var(--bs-body-color);
    // stroke-width: 2;
  }
  g:nth-child(2) path{
    fill: white;
    stroke: var(--bs-body-color);
  }
  g:nth-child(4) path{
    fill: var(--bs-light-primary);
    stroke: var(--bs-light-primary);
  }
  g:nth-child(5) path{
    fill: var(--bs-light-primary);
    stroke: var(--bs-light-primary);
    stroke: var(--bs-body-color);
  }
  g:nth-child(6), g:nth-child(7){
    path{
      fill: var(--bs-body-color);
      stroke: var(--bs-body-color);
      stroke-width: 1;
    }
  }
}
#kal, #kal2{
  path{
    stroke-width: 2;
    stroke: var(--bs-body-color);
    fill: var(--bs-body-color);
  }
}
#potatoes{
  g:first-child path{
        fill: var(--bs-light-primary);
        stroke: var(--bs-light-primary);
  }
  g:nth-child(31) path{
    stroke: var(--bs-body-color);
  }
  g:last-child path{
        fill: rgb(235, 35, 47);
        stroke: rgb(235, 35, 47);
  }
}
#cap{
      path{
        fill: var(--bs-light-primary);
      }
  g:first-child path{
    stroke-width: 20;
  }
  g:first-child, g:nth-child(2) {
    path{
      fill: rgb(235, 35, 47);
    }
  }
  g:nth-child(3) path{
    stroke-width: 10;
    stroke: var(--bs-light-primary);
  }

}
`;

const Lottie = memo(() => {
  return (
    <StyledSVG>
      <Player autoplay loop style={{ height: "240px" }} src={lottie}></Player>
    </StyledSVG>
  );
}, isEqual);

const ReadySvg = () => {
  return <Lottie />;
};
export default ReadySvg;
