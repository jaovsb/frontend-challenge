import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

import { useAuth } from "@/features/auth/auth-context";
import { useRegister } from "@/features/auth/mutations";

export function RegisterPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const registerMutation = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    registerMutation.mutate(
      {
        name,
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
      <h1>Criar conta</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">
            Nome
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />
        </div>

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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending
            ? "Criando conta..."
            : "Criar conta"}
        </button>

        {registerMutation.isError && (
          <p>
            Não foi possível criar a conta.
          </p>
        )}
      </form>

      <Link to="/login">
        Já tenho uma conta
      </Link>
    </main>
  );
}