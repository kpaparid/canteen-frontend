import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { isEqual } from "lodash";
import { memo, useCallback, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import styledComponents from "styled-components";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { addHours, addMinutes, eachMinuteOfInterval, format } from "date-fns";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import { useSelector } from "react-redux";
const StyledButton = styledComponents(Button)`
  &:focus, &:hover{
      border-color: white !important;
  }
  border-radius: 1rem 0 0 1rem;
`;
const StyledFormButton = styledComponents(Button)`
display: flex;
flex-wrap: nowrap;
width: 100%;
border: 0;
box-shadow: none;
align-items: center;
border-radius: 0;
.label{
  padding-right: 0.5rem;
}
.label{
  text-align: start;
}
.label-wrapper{
  min-height: 38px;
  flex-wrap: wrap;
  flex: 1 1 auto;
  display: flex;
  justify-content: start;
  align-items: center;
}
.radio{
    min-width: 25px;
    min-height: 25px;
    max-width: 25px;
    max-height: 25px;
    border-radius: 1rem;
    margin-right: 1rem;
    background-color: white;
    border: 3px solid var(--bs-primary);
}
  .checked{
    border: 8px solid var(--bs-primary);
  }
  &:disabled{
    opacity: 1;
  }
  &:focus{
      background-color: initial !important;
  }
  &:hover{
      background-color: var(--bs-light-primary) !important;
  }
  label, input {
    opacity: 1 !important;
    cursor: pointer;
  }
  input{
    height: 1.5rem;
    width: 1.5rem;
    border: 1px solid var(--bs-primary);
  }
`;

const theme = createTheme({
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          display: "none",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          display: "none",
        },
      },
    },
    MuiClockPicker: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        // "Mui-disabled": {
        //   color: "red",
        // },
      },
    },
  },
});

const PickupTimeModal = memo(({ children, onChange }) => {
  const [show, setShow] = useState();
  const time = useSelector((state) => state.shop.cart.time);
  const [option, setOption] = useState(time ? 1 : 0);

  const handleRadioClick = useCallback((v) => {
    onChange(null);
    setOption(v);
  }, []);
  const handleChange = useCallback(
    (option) => {
      onChange(option?.value);
    },
    [onChange]
  );

  return (
    <>
      <StyledButton
        onClick={() => setShow(true)}
        className="shadow-none p-0 border-0 border-end border-white border-2"
      >
        {time ? <div className="px-2 header-text">{time}</div> : children}
      </StyledButton>
      <Modal
        centered
        show={show}
        onHide={() => setShow(false)}
        backdropClassName="pickup-time-modal-backdrop"
        dialogClassName="d-flex justify-content-center"
        contentClassName="pickup-time-modal-content shadow-none bg-transparent d-flex justify-content-center align-items-center border-0"
      >
        <div
          style={{
            maxWidth: "400px",
            minWidth: "280px",
            boxShadow: "2px 2px 4px 3px rgb(0 0 0 / 13%)",
          }}
          className="rounded-top overflow-hidden"
        >
          <div className="bg-primary p-3 d-flex justify-content-center align-items-center header-text text-white">
            Bestelldetails
          </div>
          <div className="py-4 px-2 bg-white">
            <RadioCheck
              value={0}
              onClick={handleRadioClick}
              option={option}
              label="So schnell wie möglich"
            ></RadioCheck>
            <RadioCheck
              value={1}
              label="Vorbestellen"
              onClick={setOption}
              option={option}
            >
              <FormSelect onChange={handleChange} />
            </RadioCheck>
          </div>
          {/* <TimePicker time={time} onOpen={() => setMinutes()} /> */}
        </div>
      </Modal>
    </>
  );
}, isEqual);

const customStyles = {
  menuPortal: (provided) => ({ ...provided, zIndex: 1055 }),
  placeholder: (provided) => ({ ...provided, fontWeight: 500 }),
  container: (provided) => ({
    ...provided,
    // padding: "0.25rem 2.5rem",
    minWidth: 100,
  }),
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "1px solid #ff8b67" : "1px solid #cccccc",
    boxShadow: state.isFocused ? "none" : "none",
    "&:hover": {
      borderColor: "red",
      boxShadow: "0px 0px 6px #ff8b67",
    },
  }),
};
const FormSelect = memo(({ onChange }) => {
  var coeff = 1000 * 60 * 5;
  var date = new Date();
  var rounded = new Date(Math.round(date.getTime() / coeff) * coeff);
  const result = eachMinuteOfInterval(
    {
      start: addHours(rounded, 1),
      end:
        new Date().getHours() >= 19
          ? addHours(rounded, 3)
          : new Date().setHours(19),
    },
    { step: 5 }
  ).map((v) => {
    const value = format(v, "HH:mm");
    return { value, label: value };
  });

  useEffect(() => onChange(result[0]), []);
  return (
    <div className="px-0">
      <Select
        options={result}
        placeholder={false}
        styles={customStyles}
        isSearchable={false}
        defaultValue={result[0]}
        menuPortalTarget={document.querySelector("body")}
        onChange={onChange}
      />
    </div>
  );
}, isEqual);
const RadioCheck = memo(({ value, label, option, onClick, children }) => {
  const handleClick = useCallback(() => onClick(value), [onClick, value]);
  return (
    <StyledFormButton variant="white" onClick={handleClick}>
      <div className={`radio ${option === value ? "checked" : ""}`}></div>
      <div className="label-wrapper">
        <div className="label">{label}</div>
        <div className="checked-label">{option === value && children}</div>
      </div>
    </StyledFormButton>
  );
}, isEqual);

export default PickupTimeModal;
