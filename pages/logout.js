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

  return (
    <main className="bg-primary h-100">
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <div className="p-5 bg-white m-auto">
          <Button variant="primary" className="w-100" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      </section>
    </main>
  );
}
// export async function getServerSideProps(context) {
//   const { currentUser } = useAuth();
//   console.log("current user", currentUser);
//   return { props: {} };
// }
