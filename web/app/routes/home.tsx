import {
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";

import type { Route } from "./+types/home";

import {
  ArrowRight,
  Search,
} from "lucide-react";

import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Encontre um capítulo da Bíblia",
    },
    {
      name: "description",
      content: "Encontre rapidamente um capítulo da Bíblia.",
    },
  ];
}

export default function Home() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [book, numberChapter] = term.trim().split(/\s+/);

    navigate(`/versiculos/${book}/${numberChapter}`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl flex flex-col items-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center leading-tight mb-6 text-foreground">
          Encontre um capítulo da Bíblia
        </h1>

        <div className="w-full h-14 flex items-center bg-surface-raised border border-border rounded-full p-1.5 shadow-sm transition-all">
          <div className="flex-1 flex items-center pl-4">
            <span
              className="text-muted mr-3 text-xl"
              aria-hidden="true"
            >
              <Search />
            </span>

            <input
              type="text"
              placeholder="Ex: João 3 ou Salmos 23"
              value={term}
              onChange={handleChange}
              className="w-full bg-transparent text-lg text-foreground placeholder:text-foreground-subtle focus:outline-none"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="h-11 px-6 rounded-full bg-primary-600 text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:bg-primary-700 active:bg-primary-800 transition-colors cursor-pointer"
          >
            Buscar

            <ArrowRight
              className="w-4 h-4"
              aria-hidden="true"
            />
          </button>
        </div>
      </form>
    </div>
  );
}