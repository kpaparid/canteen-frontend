import {
  faEnvelope,
  faUnlockAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { current } from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import { forwardRef, memo, useRef } from "react";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import styledComponents from "styled-components";
import { useAuth } from "../contexts/AuthContext";

export const UserDropdown = memo(() => {
  const { currentUser } = useAuth();
  return (
    <Dropdown drop="start" className="d-flex">
      <Dropdown.Toggle
        as={StyledToggle}
        id="dropdown-basic"
        className="toggle-btn w-100"
      >
        <div className="d-flex flex-nowrap justify-content-center px-2 align-items-center">
          {currentUser ? "Mein Konto" : "Anmelden"}
          <FontAwesomeIcon className="px-3" icon={faUser} />
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu as={CustomMenu}></Dropdown.Menu>
    </Dropdown>
  );
}, isEqual);

const CustomMenu = forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const { currentUser, login, logout, authenticatedFetch } = useAuth();
    const emailRef = useRef();
    const passwordRef = useRef();
    async function handleSubmit(e) {
      e.preventDefault();
      try {
        await login(emailRef.current.value, passwordRef.current.value);
      } catch (error) {
        setError("Failed to log in");
      }

      // setLoading(false);
    }
    return (
      <StyledMenu
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        {currentUser ? (
          <>
            <div className="header">Konto</div>
            <div className="p-3">
              <div className="pb-3 fw-bolder d-flex flex-column align-items-center">
                {currentUser.email}
                {currentUser.displayName}
              </div>
              <Button
                variant="primary"
                className="w-100"
                onClick={() => logout()}
              >
                Ausloggen
              </Button>
            </div>
          </>
        ) : (
          <Form onSubmit={handleSubmit} className="p-0">
            <Form.Label className="header">Anmelden</Form.Label>
            <div className="p-3">
              <Form.Group id="email" className="mb-4">
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </InputGroup.Text>
                  <Form.Control
                    className="form-login bg-white"
                    ref={emailRef}
                    required
                    type="email"
                    placeholder="Email"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Group id="password" className="mb-4">
                  <InputGroup>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faUnlockAlt} />
                    </InputGroup.Text>
                    <Form.Control
                      className="form-login bg-white"
                      ref={passwordRef}
                      required
                      type="password"
                      placeholder="Passwort"
                    />
                  </InputGroup>
                </Form.Group>
              </Form.Group>
              <Button type="submit" className="w-100">
                Einloggen
              </Button>
            </div>
          </Form>
        )}
      </StyledMenu>
    );
  }
);
const StyledMenu = styledComponents.div`
    border: 0;
    padding: 0;
    min-width: 100%;
    box-shadow: 2px 2px 9px 9px rgb(0 0 0 / 30%);
    transform: translate(calc(50% - 95px), -50px) !important;
    border-radius: 0.4375rem;
    overflow: hidden;
    min-width: 350px;
    .header{
        background-color: var(--bs-primary);
        border: 0;
        margin: 0;
        width: 100%;
        border-radius: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem 1.5rem;
        font-weight: 700;
        color: white;
        box-shadow: none;
        text-shadow: 1px 1px 3px rgb(34 34 34 / 70%);
    }
`;
const StyledToggle = styledComponents(Button)`
    box-shadow: 2px 2px 4px 3px rgb(0 0 0 / 13%);
    border-radius: 1rem;
    text-shadow: 1px 1px 3px rgb(34 34 34 / 70%);
    font-weight: 700;
    margin: auto;
    min-width: 190px;
    max-width: 190px;
    &:before{
        display: none !important;
    }

`;
