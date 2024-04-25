import { useEffect } from "react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  Outlet,
  Link as RouterLink,
  useMatches,
  useNavigate,
} from "@remix-run/react";
import { Box, Link } from "@chakra-ui/react";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  if (url.pathname.replaceAll("/", "") === "settings") {
    return redirect("/settings/general");
  }

  return null;
}

const links = [
  { id: "general", label: "General" },
  { id: "account", label: "Account" },
  { id: "privacy", label: "Privacy", disabled: true },
];

export default function Settings() {
  const matches = useMatches();
  const pathname = matches.at(-1)?.pathname ?? "/settings/";
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname.replaceAll("/", "") === "settings") {
      navigate("/settings/general", { replace: true });
    }
  }, [pathname]);

  return (
    <Box>
      <Box
        width={"100%"}
        borderBottom={"thin solid"}
        borderBottomColor={"gray.400"}
        marginBottom={4}
        display={"flex"}
      >
        {links.map((link) => {
          const active = pathname?.replaceAll("/settings/", "") === link.id;
          return (
            <Link
              key={link.id}
              as={RouterLink}
              to={`/settings/${link.id}`}
              paddingX={6}
              paddingY={2}
              display={"block"}
              fontSize={"medium"}
              fontWeight={active ? "bold" : "semibold"}
              color={active ? "blue.600" : link.disabled ? "gray.400" : ""}
              backgroundColor={active ? "blue.50" : ""}
              borderTopRadius={active ? "md" : ""}
              transition={"all"}
              transitionDuration={"500ms"}
              pointerEvents={link.disabled ? "none" : "all"}
            >
              {link.label}
            </Link>
          );
        })}
      </Box>

      <Outlet />
    </Box>
  );
}
