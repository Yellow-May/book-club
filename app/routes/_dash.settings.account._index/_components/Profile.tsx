import { useState } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { loader } from "../route";

function getBase64(
  file: File,
  cb: (name: "success" | "error", res: any) => void
) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb("success", reader.result);
  };
  reader.onerror = function (error) {
    cb("error", error);
  };
}

export default function ProfileSettings() {
  const fetcher = useFetcher();
  const loaderData = useLoaderData<typeof loader>();
  const [file, setFile] = useState<File | null>(null);
  const [img_url, setUrl] = useState(loaderData?.user.profile.avatar?.url);
  const [has_updated, setHasUpdated] = useState(false);
  const toast = useToast();
  const loading = fetcher.state !== "idle";

  return (
    <Box maxW={480} marginBottom={12}>
      <Box marginBottom={4}>
        <Heading as="h1" size="sm" textTransform={"uppercase"} fontWeight={700}>
          Profile
        </Heading>
        <Text as={"p"} color="gray.500" fontSize={"small"}>
          Change your profile details here
        </Text>
      </Box>

      <Box as={fetcher.Form} method="POST">
        <FormControl id="avatar" marginBottom={4}>
          <FormLabel fontSize={"small"}>Avatar</FormLabel>
          <Box position={"relative"} width={"max-content"}>
            <Input
              type="file"
              position={"absolute"}
              top={0}
              left={0}
              width={"100%"}
              height={"100%"}
              opacity={0}
              onChange={(e) => {
                getBase64(e.target.files![0], (name, res) => {
                  if (name === "success") {
                    setUrl(res);
                    setHasUpdated(true);
                    setFile(e.target.files![0]);
                  } else {
                    toast({
                      title: "Error",
                      description: "Error uploading image",
                      status: "error",
                    });
                  }
                });
              }}
              accept="image/*"
              isDisabled={loading}
            />
            <input
              type="hidden"
              name="avatar_name"
              value={file?.name ?? loaderData?.user.profile.avatar?.name}
              onChange={() => null}
            />
            <input
              type="hidden"
              name="avatar_size"
              value={file?.size ?? loaderData?.user.profile.avatar?.size}
              onChange={() => null}
            />
            <input
              type="hidden"
              name="avatar_url"
              value={img_url}
              onChange={() => null}
            />
            <Avatar pointerEvents={"none"} size={"xl"} src={img_url} />
          </Box>
        </FormControl>

        <FormControl id="full_name" marginBottom={4}>
          <FormLabel fontSize={"small"}>Full Name</FormLabel>
          <Input
            name="full_name"
            bgColor={"white"}
            defaultValue={loaderData?.user.profile.full_name}
            onChange={() => {
              setHasUpdated(true);
            }}
            maxLength={24}
            isDisabled={loading}
          />
        </FormControl>

        <Flex justifyContent={"flex-end"}>
          <Button
            type="submit"
            colorScheme="blue"
            isDisabled={!has_updated}
            _disabled={{ opacity: 0.6 }}
            loadingText="Updating..."
            isLoading={loading}
            transition={"color"}
            transitionDuration={"200ms"}
            name="_action"
            value="update_profile"
          >
            Update
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
