import type { Route } from "./+types/versiculos";
import { getVerses, type VersesData } from "~/services/verses.service";

export async function loader({
    params,
}: Route.LoaderArgs) {
    const response = await getVerses(
        params.book!,
        Number(params.chapter)
    );

    return response.data;
}

export function meta({}: Route.MetaArgs) {
    return [
        {
            title: "Versículo no Contexto",
        },
        {
            name: "description",
            content: "Encontre rapidamente um capítulo da Bíblia.",
        },
    ];
}

export default function Versiculos({
    loaderData,
}: Route.ComponentProps) {
    const data = loaderData as VersesData

    const context =
    typeof data.background === "object"
        ? data.background.context
        : null;

    return (
        <div className="min-h-screen bg-background px-4 py-12">
            <header className="mb-12">
                <h1 className="font-display text-4xl font-bold text-foreground text-center">
                    {data.book.name} {data.number_chapter}
                </h1>

                {context && (
                    <div className="mx-auto mt-6 max-w-3xl text-center">
                        <h2 className="font-label text-sm font-semibold uppercase tracking-wide text-primary-600">
                            Contexto Histórico
                        </h2>

                        <p className="mt-2 text-lg text-foreground-muted">
                            {context}
                        </p>
                    </div>
                )}
            </header>

            <div className="flex flex-wrap justify-center gap-6 font-body text-xl leading-relaxed text-foreground">
                {data.verses.map((verse) => (
                    <div
                        key={verse.id}
                        className="w-[320px] shrink-0 rounded-2xl border border-border-subtle bg-surface-raised p-5"
                    >
                        <span className="mr-3 font-label text-sm font-semibold text-primary-600">
                            {verse.number}
                        </span>

                        <span>
                            {verse.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}