import { nanoid } from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { validateEmail } from "../utilities/utils.mjs";
import DismissibleAlert from "./Alert";

const UserForm = memo(({ onClose }) => {
  const [alert, setAlert] = useState();
  const nameRef = useRef();
  const emailRef = useRef();
  const { createUser, resetPassword } = useAuth();
  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      const name = nameRef.current.value;
      const email = emailRef.current.value;
      const validated =
        name?.trim() !== "" && email?.trim() !== "" && validateEmail(email);
      validated &&
        createUser({ email, displayName: name, password: nanoid() })
          .then((r) =>
            resetPassword(email).then(() => {
              nameRef.current.value = "";
              emailRef.current.value = "";
              setAlert(() => ({
                title: "Account created",
                message: null,
                variant: "success",
                show: true,
              }));
            })
          )
          .catch(({ message }) => {
            setAlert(() => ({ message, variant: "danger", show: true }));
            setShow(true);
          });
    },
    [createUser, resetPassword]
  );

  return (
    <>
      <DismissibleAlert
        className="mx-3"
        {...alert}
        onClose={() => setAlert((old) => ({ ...old, show: false }))}
      />
      <Form onSubmit={handleSave}>
        <Modal.Body className="bg-gray-white px-5">
          <div className="flex-column">
            <Form.Label>Email</Form.Label>
            <Form.Control required type="email" ref={emailRef}></Form.Control>
            <Form.Label className="pt-4">Name</Form.Label>
            <Form.Control ref={nameRef}></Form.Control>
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
      </Form>
    </>
  );
}, isEqual);
const RegisterUser = memo(() => {
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
          Register
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
          <h5 className="text-white">Register User</h5>
        </Modal.Header>
        <UserForm onClose={handleClose} />
      </Modal>
    </>
  );
}, isEqual);
export default RegisterUser;
