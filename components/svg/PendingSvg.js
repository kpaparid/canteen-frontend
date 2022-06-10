import { Controls, Player } from "@lottiefiles/react-lottie-player";
import lottie from "./pending.json";
import styledComponents from "styled-components";
import { memo } from "react";
import { isEqual } from "lodash";
const StyledSVG = styledComponents.div`
    // stroke: var(--bs-body-color);
#activePage, #topPage{
  path{
    fill: var(--bs-light-primary);
    fill: var(--bs-light-senary);
    stroke-width: 2;
  }
}
#emptyPage path{
    // fill: var(--bs-light-primary);
    // fill: var(--bs-light-senary);
    stroke-width: 0;
}
#page path{
  stroke-width: 0;
}
#activePage path{
  stroke: var(--bs-body-color);
}
#pencil{
  // path{
  //   stroke-width: 2;
  // fill: var(--bs-body-color);
  // }
  // g:first-child path{
  //   fill: var(--bs-primary);

  // }
}

#closedLetter, #bottomLetter, #middleLetter, #openLetter, #topLetter{
  path{
    fill: var(--bs-primary);
    stroke-width: 1;
    stroke: var(--bs-primary);
  }
}
#bottomLetter, #middleLetter{
    path{
    stroke: var(--bs-primary);
      stroke-width: 2;
    }
}
#topLetter{
    path{
    fill: var(--bs-light-primary);
    stroke: var(--bs-light-primary);
      stroke-width: 2;
    }
}
#openLetter path{
    fill: var(--bs-light-primary);
    stroke: var(--bs-light-primary);
}
#car{
 g:first-child path{
    fill: var(--bs-primary);
    stroke: var(--bs-body-color);
 }
}
#innerRight, #innerLeft{
  path {
    fill: var(--bs-primary);
    stroke: var(--bs-body-color);
    stroke-width: 20;
  }
}
#outerRight, #outerLeft{
  path {
    fill: var(--bs-body-color);
    stroke: var(--bs-body-color);
  }
}
  #potTop path{
      stroke: var(--bs-body-color);
      fill: var(--bs-body-color);
  }
#pot {
  path{
    fill: rgb(255, 214, 49);
    stroke: rgb(255, 214, 49);
  }
  g:nth-child(9) path{
    fill: var(--bs-primary);
  }
  g:nth-child(10),g:nth-child(11),g:nth-child(12){
    path{
      fill: var(--bs-body-color);
      stroke: var(--bs-body-color);
      stroke-width: 5;
    }
  }
}
#windowBack path{
  stroke-width: 0;
}
#wind path{
  stroke-width: 20;
      stroke: var(--bs-body-color);
      fill: var(--bs-body-color);
    stroke: var(--bs-light-primary);
    fill: var(--bs-light-primary);
}
#top path{
      stroke: var(--bs-body-color);
      fill: var(--bs-body-color);
}
#canteen #top path{
    stroke: var(--bs-light-primary);
    fill: var(--bs-light-primary);
}
#primary path{
    stroke: var(--bs-primary);
    fill: var(--bs-primary);
}
#lines{
  path{
    // stroke: var(--bs-primary);
    // fill: var(--bs-primary);
      stroke: var(--bs-body-color);
      fill: var(--bs-body-color);
    stroke-width: 35;
  }
}
#bar path{
    stroke: var(--bs-light-primary);
    fill: var(--bs-light-primary);

}
#table path{
      stroke: var(--bs-body-color);
      fill: var(--bs-body-color);
      fill-opacity: 1;
}
#pan{
  path{
    stroke: var(--bs-primary);
    fill: var(--bs-primary);
  }
  g:first-child{
    path{
      stroke: var(--bs-body-color);
      fill: var(--bs-body-color);
    }
  }
}
#man{
  g:nth-child(3) path{
    fill: var(--bs-light-primary);
      stroke: var(--bs-body-color);
      stroke-width: 0;
  }
  g:nth-child(2) path{
      fill: var(--bs-primary);
      stroke-width: 0;
  }
  g:nth-child(1) path{
      fill: var(--bs-body-color);
      stroke-width: 0;
  }
}
#arm path{
    fill: var(--bs-light-primary);
      stroke: var(--bs-body-color);
      stroke-width: 0;

}






`;

const Lottie = memo(() => {
  return (
    <StyledSVG>
      <Player autoplay loop style={{ height: "240px" }} src={lottie}>
        {/* <Controls
          visible={true}
          buttons={["play", "repeat", "frame", "debug"]}
        /> */}
      </Player>
    </StyledSVG>
  );
}, isEqual);

const PendingSvg = () => {
  return <Lottie />;
};
export default PendingSvg;
