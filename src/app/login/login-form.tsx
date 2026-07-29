"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, AuthErrorCodes } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";

function mensagemErro(code: string) {
  if (
    code === AuthErrorCodes.INVALID_PASSWORD ||
    code === AuthErrorCodes.USER_DELETED ||
    code === "auth/invalid-credential"
  ) {
    return "E-mail ou senha incorretos.";
  }
  return "Não foi possível entrar. Tente novamente.";
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      const email = String(formData.get("email"));
      const senha = String(formData.get("senha"));
      await signInWithEmailAndPassword(auth, email, senha);
      router.push("/dashboard");
    } catch (err) {
      const code = err instanceof Error && "code" in err ? String(err.code) : "";
      setError(mensagemErro(code));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="senha">Senha</FieldLabel>
          <Input
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>
        {error && <FieldError>{error}</FieldError>}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </FieldGroup>
    </form>
  );
}
