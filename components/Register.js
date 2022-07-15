import { nanoid } from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import styledComponents from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { validateEmail } from "../utilities/utils.mjs";
import DismissibleAlert from "./Alert";

const StyledForm = styledComponents(Form)`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
}
`;
const UserForm = memo(() => {
  const [alert, setAlert] = useState();
  const codeRef = useRef();
  const phoneRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const { createUser, resetPassword, addClaims } = useAuth();
  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      const name = nameRef.current.value;
      const email = emailRef.current.value;
      const phoneNumber = phoneRef.current.value;
      const code = codeRef.current.value;
      const validated =
        validateEmail(email) &&
        ((code.trim() !== "" && phoneNumber.length === 11) ||
          phoneNumber.length === 0);
      validated &&
        createUser({
          email,
          displayName: name,
          password: nanoid(),
        })
          .then(({ user }) => {
            code.trim() !== "" &&
              phoneNumber.length === 11 &&
              addClaims(user.uid, { phoneNumber: "+" + code + phoneNumber });
            return resetPassword(email).then(() => {
              nameRef.current.value = "";
              emailRef.current.value = "";
              codeRef.current.value = "49";
              phoneRef.current.value = "";
              setAlert(() => ({
                title: "Account created",
                message: null,
                variant: "success",
                show: true,
              }));
            });
          })
          .catch(({ message }) => {
            console.log(message);
            setAlert(() => ({ message, variant: "danger", show: true }));
          });
    },
    [createUser, resetPassword, addClaims]
  );

  return (
    <>
      <DismissibleAlert
        className="mx-3"
        {...alert}
        onClose={() => setAlert((old) => ({ ...old, show: false }))}
      />
      <StyledForm onSubmit={handleSave}>
        <Modal.Body className="bg-gray-white px-5">
          <div className="flex-column">
            <Form.Label>Email</Form.Label>
            <Form.Control required type="email" ref={emailRef}></Form.Control>
            <Form.Label className="pt-4">Name</Form.Label>
            <Form.Control required ref={nameRef}></Form.Control>
            <Form.Label className="pt-4">Phone</Form.Label>
            <div className="d-flex flex-nowrap">
              <div
                className="form-control d-flex flex-nowrap align-items-center justify-content-center me-2"
                style={{ width: "fit-content" }}
              >
                +
                <Form.Control
                  className="text-start p-0 ps-1 border-0 shadow-none"
                  style={{ width: "37px" }}
                  defaultValue={49}
                  type={"number"}
                  ref={codeRef}
                ></Form.Control>
              </div>

              <Form.Control ref={phoneRef} type={"number"}></Form.Control>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-darker-nonary border-0">
          <Button
            type="submit"
            variant="gray-white"
            className="w-100 shadow-none"
          >
            Register
          </Button>
        </Modal.Footer>
      </StyledForm>
    </>
  );
}, isEqual);
const RegisterUser = memo(
  ({ btnText = "Register", modalTitle = "Register User" }) => {
    const [show, setShow] = useState();
    const handleShow = useCallback(() => setShow(true), []);
    const handleClose = useCallback(() => setShow(false), []);
    return (
      <>
        <div className="px-">
          <Button
            variant="darker-nonary"
            className="w-100 text-gray-white shadow-none"
            onClick={handleShow}
          >
            {btnText}
          </Button>
        </div>
        <Modal
          show={show}
          onHide={handleClose}
          variant="darker-nonary"
          centered
          className="p-0"
          contentClassName="w-100 h-100 bg-darker-nonary rounded"
          dialogClassName="register-user-dialog"
          backdropClassName="register-user-backdrop"
        >
          <Modal.Header className="bg-darker-nonary border-0">
            <h5 className="text-white">{modalTitle}</h5>
          </Modal.Header>
          <UserForm onClose={handleClose} />
        </Modal>
      </>
    );
  },
  isEqual
);
export default RegisterUser;
