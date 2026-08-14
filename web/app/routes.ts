import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/versiculos/:book/:chapter", "routes/versiculos.tsx"),
  route("/login", "routes/login.tsx"),
  route("/painel", "routes/painel/layout.tsx", [
    index("routes/painel/dashboard.tsx"),
    route("comentarios", "routes/painel/comentarios.tsx"),
    route("referencias", "routes/painel/referencias.tsx"),
    route("contexto-historico", "routes/painel/contexto-historico.tsx"),
    route("usuarios", "routes/painel/usuarios.tsx"),
    route("meu-perfil", "routes/painel/meu-perfil.tsx"),
  ]),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;