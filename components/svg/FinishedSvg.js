import { faCheck, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import { memo } from "react";
import styledComponents from "styled-components";

const Wrapper = styledComponents.div`

    animation: extend 2s infinite;
    width: 80px;
    height: 80px;
    border-radius: 5rem;
    padding: 1rem;
    background-color: var(--bs-primary);
    color: white;
    transition: all 2s;
    @keyframes extend{
        0%, 100%{
            transform: scale(1);
            box-shadow: 0px 0px 0px 0px var(--bs-light-primary);
        }
        50%{
            transform: scale(1.4);
            box-shadow: 0px 0px 2px 20px var(--bs-light-primary);
        }
    }
`;

const FinishedSvg = memo(() => {
  return (
    <div className="h-100 w-100 p-4 d-flex justify-content-center align-items-center">
      <Wrapper>
        <FontAwesomeIcon icon={faCheck} className="h-100 w-100" />
      </Wrapper>
    </div>
  );
}, isEqual);
export default FinishedSvg;
