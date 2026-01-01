import { Box } from "@mui/joy";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box
      component="footer"
      className="bg-neutral-100! py-6 text-white"
    >
      <nav>
        <ul className="container mx-auto flex justify-end space-x-8">
          <li>
            <Link
              to={"/legal/terms"}
              className="font-bold hover:underline text-neutral-800! focus:underline"
            >
              Terms of Service
            </Link>
          </li>
          <li>
            <Link
              to={"/legal/privacy"}
              className="font-bold hover:underline text-neutral-800! focus:underline"
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              to={"/contact"}
              className="font-bold hover:underline focus:underline text-neutral-800!"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </Box>
  );
}
