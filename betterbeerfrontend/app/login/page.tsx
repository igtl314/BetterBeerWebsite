'use client';

import { signIn } from "next-auth/react";
import { Button, Card, CardBody } from "@heroui/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Card className="w-full max-w-sm shadow-xl">
        <CardBody className="flex flex-col gap-4 p-8">
          <h1 className="text-2xl font-bold text-center text-default-900 mb-2">
            Sign in to Better Beer
          </h1>
          <Button
            color="primary"
            variant="shadow"
            size="lg"
            className="w-full font-semibold"
            onPress={() => signIn("google", { callbackUrl: "/" })}
          >
            Sign in with Google
          </Button>
          <Button
            color="default"
            variant="bordered"
            size="lg"
            className="w-full font-semibold"
            onPress={() => signIn("github", { callbackUrl: "/" })}
          >
            Sign in with GitHub
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
