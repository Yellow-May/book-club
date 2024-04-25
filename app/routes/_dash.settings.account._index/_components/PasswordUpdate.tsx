import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function PasswordUpdate() {
  const fetcher = useFetcher();
  const loading = fetcher.state !== "idle";
  const fetcherData = fetcher.data as any;
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => !loading && setIsOpen(false);
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (fetcherData?.error) {
      toast({
        title: "Error",
        description: fetcherData.error as string,
        status: "error",
      });
    }
    if (fetcherData?.message) {
      toast({
        title: "Password updated",
        description: fetcherData.message,
        status: "success",
      });
      setConfirmPassword("");
      setPassword("");
      setNewPassword("");
      setIsOpen(false);
    }

    return () => {
      setConfirmPassword("");
      setPassword("");
      setNewPassword("");
      setIsOpen(false);
    };
  }, [fetcherData]);

  return (
    <Box maxW={480}>
      <Box marginBottom={4}>
        <Heading as="h2" size="sm" textTransform={"uppercase"} fontWeight={700}>
          Password Update
        </Heading>
        <Text as={"p"} color="gray.500" fontSize={"small"}>
          Change your password here
        </Text>
      </Box>

      <Box>
        <FormControl id="new_password" marginBottom={4}>
          <FormLabel fontSize={"small"}>New Password</FormLabel>
          <Input
            type="password"
            name="new_password"
            bgColor={"white"}
            value={new_password}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            minLength={8}
            maxLength={24}
            _placeholder={{ color: "gray.500" }}
            _focus={{ borderColor: "blue.500" }}
            _hover={{ borderColor: "blue.500" }}
            _disabled={{ opacity: 0.6 }}
          />
        </FormControl>

        <FormControl
          id="confirm_password"
          marginBottom={4}
          isInvalid={new_password !== confirm_password}
        >
          <FormLabel fontSize={"small"}>Confirm Password</FormLabel>
          <Input
            type="password"
            name="confirm_password"
            bgColor={"white"}
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            minLength={8}
            maxLength={24}
            _placeholder={{ color: "gray.500" }}
            _focus={{ borderColor: "blue.500" }}
            _hover={{ borderColor: "blue.500" }}
            _disabled={{ opacity: 0.6 }}
            isInvalid={new_password !== confirm_password}
            _invalid={{ borderColor: "red.500" }}
          />
          <FormErrorMessage>Password must match</FormErrorMessage>
        </FormControl>

        <Flex justifyContent={"flex-end"}>
          <Button
            type="button"
            colorScheme="blue"
            isDisabled={
              loading || new_password !== confirm_password || !new_password
            }
            _disabled={{ opacity: 0.6 }}
            loadingText="Updating..."
            isLoading={loading}
            onClick={() => setIsOpen(true)}
          >
            Update
          </Button>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Password</ModalHeader>
          <ModalBody>
            <FormControl id="password" marginBottom={4}>
              <FormLabel fontSize={"small"}>Password</FormLabel>
              <Input
                type="password"
                name="password"
                bgColor={"gray.100"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                minLength={8}
                maxLength={24}
                _placeholder={{ color: "gray.500" }}
                _focus={{ borderColor: "blue.500" }}
                _hover={{ borderColor: "blue.500" }}
                _disabled={{ opacity: 0.6 }}
                disabled={loading}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={4}>
            <Button
              colorScheme="red"
              variant={"outline"}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <fetcher.Form method="post">
              <input type="hidden" value={password} name="password" />
              <input type="hidden" value={new_password} name="new_password" />
              <Button
                type="submit"
                colorScheme="blue"
                name="_action"
                value="update_password"
                disabled={loading}
                loadingText={"Updating..."}
                isLoading={loading}
              >
                Update
              </Button>
            </fetcher.Form>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
