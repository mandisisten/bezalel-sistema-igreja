"use client";

import Image from "next/image";
import { Church } from "lucide-react";
import { useConfiguracao } from "@/lib/firestore-hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  const { configuracao } = useConfiguracao();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, color-mix(in oklch, var(--primary) 16%, transparent), transparent 55%), radial-gradient(circle at 85% 85%, color-mix(in oklch, var(--primary) 12%, transparent), transparent 55%)",
        }}
      />

      <Card className="w-full max-w-sm border-border/60 shadow-lg">
        <CardHeader className="items-center text-center">
          {configuracao.logoUrl ? (
            <Image
              src={configuracao.logoUrl}
              alt={configuracao.nomeIgreja}
              width={56}
              height={56}
              className="mb-2 size-14 rounded-xl object-contain"
              unoptimized
            />
          ) : (
            <span className="mb-2 flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Church className="size-7" />
            </span>
          )}
          <CardTitle className="text-xl">{configuracao.nomeIgreja}</CardTitle>
          <CardDescription>Entre com seu e-mail e senha para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
