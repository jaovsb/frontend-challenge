import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/auth-context";
import { useLogin } from "@/features/auth/mutations";

export function LoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    loginMutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: (response) => {
          setSession(
            response.user,
            response.token,
          );

          navigate({
            to: "/",
          });
        },
      },
    );
  }

  return (
    <main>
      <h1>Entrar</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">
            E-mail
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="password">
            Senha
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending
            ? "Entrando..."
            : "Entrar"}
        </button>

        {loginMutation.isError && (
          <p>
            E-mail ou senha inválidos.
          </p>
        )}
      </form>

      <Link to="/register">
        Criar conta
      </Link>
    </main>
  );
}