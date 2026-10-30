import { useState, type FormEvent } from "react";
import { Paper, TextInput, PasswordInput, Button, Stack, Title, Text, Center } from "@mantine/core";
import axios from "axios";

interface LoginProps {
    onLogin: (email: string, password: string) => Promise<void>;
    serverError: string | null;
}

function Login({ onLogin, serverError }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await onLogin(email, password);
        } catch (error) {
            console.log(error);

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setError("Invalid email or password");
            } else {
                setError("Unable to log in. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Center mih="75vh">
            <Paper withBorder shadow="xs" radius="md" p="xl" w="100%" maw={380}>
                <Title order={3}>Product Footprint Review</Title>
                <Text size="sm" c="dimmed" mt={6}>Sign in to continue</Text>

                <form onSubmit={handleSubmit}>
                    <Stack mt="lg">
                        <TextInput
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {(error || serverError) && <Text c="red" size="sm">{error || serverError}</Text>}
                        <Button type="submit" loading={loading}>Sign In</Button>
                    </Stack>
                </form>
            </Paper>
        </Center>
    );
}

export default Login;
