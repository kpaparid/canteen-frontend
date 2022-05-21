import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
// import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const { currentUser, login, logout, authenticatedFetch } = useAuth();
  console.log(currentUser);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  //   const [loading, setLoading] = useState(false);
  const router = useRouter();
  const redirectPathName = router.query.pathName || "/";

  const fetch = () => {
    const options = { url: "http://localhost:3005/firebase/roles" };
    authenticatedFetch(options).then((r) => {
      console.log(r);
      return r;
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      //   setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      console.log("logged in", currentUser);
      router.push(redirectPathName);
    } catch (error) {
      setError("Failed to log in");
      console.log(error);
    }

    // setLoading(false);
  }

  return (
    <main className="bg-primary h-100">
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center">
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Sign in to our platform</h3>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                <Form className="mt-4" onSubmit={handleSubmit}>
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Your Email</Form.Label>
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
                        defaultValue="kpaparid@gmail.com"
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Your Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control
                          className="form-login bg-white"
                          ref={passwordRef}
                          required
                          type="password"
                          placeholder="Password"
                          defaultValue="123456"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Form.Group>
                  <Button
                    // disabled={loading}
                    variant="primary"
                    type="submit"
                    className="w-50"
                  >
                    Sign in
                  </Button>
                  <Button
                    variant="primary"
                    className="w-50"
                    onClick={() => logout()}
                  >
                    Logout
                  </Button>
                  <Button
                    variant="primary"
                    className="w-50"
                    onClick={() => fetch()}
                  >
                    fetch
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
// export async function getServerSideProps(context) {
//   const { currentUser } = useAuth();
//   console.log("current user", currentUser);
//   return { props: {} };
// }
