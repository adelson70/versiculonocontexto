import { NavLink } from "react-router";

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r bg-white p-4">
      <h1 className="mb-6 text-xl font-bold">
        Painel
      </h1>

      <nav className="space-y-1">
        <NavLink
          to="/painel"
          end
          className="block rounded-md px-3 py-2 hover:bg-gray-100"
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/painel/comentarios"
          className="block rounded-md px-3 py-2 hover:bg-gray-100"
        >
          Comentários
        </NavLink>

        <NavLink
          to="/painel/referencias"
          className="block rounded-md px-3 py-2 hover:bg-gray-100"
        >
          Referências
        </NavLink>

        <NavLink
          to="/painel/contexto-historico"
          className="block rounded-md px-3 py-2 hover:bg-gray-100"
        >
          Contexto histórico
        </NavLink>

        <NavLink
          to="/painel/usuarios"
          className="block rounded-md px-3 py-2 hover:bg-gray-100"
        >
          Usuários
        </NavLink>
      </nav>
    </aside>
  );
}