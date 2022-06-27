import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

const Post = () => {
  const router = useRouter();
  const { pid } = router.query;
  const { resetPassword } = useAuth();

  return (
    <div>
      <Button onClick={resetPassword}>Reset</Button>
    </div>
  );
};

export default Post;
