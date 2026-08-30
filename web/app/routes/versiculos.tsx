import { useEffect, useState } from "react";
import type { Route } from "./+types/versiculos";
import { getVerseDetails, getVerses, type VersesData } from "~/services/verses.service";

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

async function getDetailsVerse(verse_id: string) {
    const response = await getVerseDetails(verse_id)
    return response.data
}

type ActiveTab = "referencias" | "comentarios" | null;

type VerseDetails = {
    references: Array<{
        id: string;
        book: string;
        number_chapter: number;
        number_verse: number;
        text: string;
    }>;
    commentaries: Array<{
        id: string;
        text: string;
    }>;
};

export default function Versiculos({
    loaderData,
}: Route.ComponentProps) {
    const data = loaderData as VersesData;

    const [selectedVerse, setSelectedVerse] = useState<
        VersesData["verses"][number] | null
    >(null);

    const [verseDetails, setVerseDetails] = useState<VerseDetails | null>(null);

    const [activeTab, setActiveTab] = useState<ActiveTab>(null);

    const context =
        typeof data.background === "object"
            ? data.background.context
            : null;

    async function handleSelectVerse(
        verse: VersesData["verses"][number]
    ) {
        setSelectedVerse(verse);
        setActiveTab(null);
        const data = await getDetailsVerse(verse.id)
        setVerseDetails({
            references: data.references,
            commentaries: data.commentaries,
        })

    }

    function handleCloseModal() {
        setSelectedVerse(null);
        setActiveTab(null);
    }

    function handleTabChange(tab: Exclude<ActiveTab, null>) {
        setActiveTab((current) =>
            current === tab ? null : tab
        );
    }

    useEffect(() => {
        if (!selectedVerse) {
            document.body.style.overflow = "";
            return;
        }
    
        document.body.style.overflow = "hidden";
    
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                handleCloseModal();
            }
        }
    
        document.addEventListener("keydown", handleKeyDown);
    
        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedVerse]);

    return (
        <div className="min-h-screen bg-background px-4 py-12">
            <header className="mb-12">
                <h1 className="text-center font-display text-4xl font-bold text-foreground">
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

            <div className="flex flex-wrap justify-center gap-6">
                {data.verses.map((verse) => (
                    <div
                        key={verse.id}
                        onClick={() => handleSelectVerse(verse)}
                        className="
                            w-[320px]
                            shrink-0
                            cursor-pointer
                            rounded-2xl
                            border border-border-subtle
                            bg-surface-raised
                            p-5
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:border-primary-200
                            hover:shadow-lg
                            hover:shadow-neutral-950/5
                        "
                    >
                        <span className="mr-3 font-label text-sm font-semibold text-primary-600">
                            {verse.number}
                        </span>

                        <span className="font-body text-xl leading-relaxed text-foreground">
                            {verse.text}
                        </span>
                    </div>
                ))}
            </div>

            {selectedVerse && (
                <div
                    className="
                        fixed inset-0 z-50
                        flex items-center justify-center
                        bg-neutral-950/30
                        p-3
                        backdrop-blur-[3px]
                        sm:p-6
                    "
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseModal();
                        }
                    }}
                >
                    <div
                        className="
                            flex
                            h-[min(720px,calc(100vh-2rem))]
                            w-full
                            max-w-6xl
                            overflow-hidden
                            rounded-2xl
                            border border-border-subtle
                            bg-surface-raised
                            shadow-2xl
                            shadow-neutral-950/20
                        "
                    >
                        <section
                            className="
                                relative
                                flex
                                w-[42%]
                                min-w-0
                                flex-col
                                bg-surface-raised
                                px-8
                                py-8
                                lg:px-10
                                lg:py-9
                            "
                        >
                            <div className="flex flex-1 flex-col justify-center">
                                <h2
                                    id="modal-title"
                                    className="
                                        font-display
                                        text-[34px]
                                        font-bold
                                        tracking-tight
                                        text-foreground
                                        lg:text-[38px]
                                    "
                                >
                                    {data.book.name}{" "}

                                    <span className="text-primary-600">
                                        {data.number_chapter}:
                                        {selectedVerse.number}
                                    </span>
                                </h2>

                                <div className="mt-7 max-w-md">
                                    <p
                                        className="
                                            font-body
                                            text-[18px]
                                            leading-[1.65]
                                            text-foreground
                                            lg:text-[19px]
                                        "
                                    >
                                        <span
                                            className="
                                                mr-2
                                                align-top
                                                font-label
                                                text-[11px]
                                                font-bold
                                                text-primary-600
                                            "
                                        >
                                            {selectedVerse.number}
                                        </span>

                                        {selectedVerse.text}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section
                            className="
                                relative
                                flex
                                min-w-0
                                flex-1
                                flex-col
                                bg-background
                                px-7
                                py-7
                                lg:px-8
                                lg:py-7
                            "
                        >
                            <div className="flex shrink-0 items-start justify-between">
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-7
                                    "
                                    role="tablist"
                                    aria-label="Informações do versículo"
                                >
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={
                                            activeTab ===
                                            "referencias"
                                        }
                                        onClick={() =>
                                            handleTabChange(
                                                "referencias"
                                            )
                                        }
                                        className={`
                                            relative
                                            pb-3
                                            font-display
                                            text-[18px]
                                            font-bold
                                            transition-colors
                                            duration-200
                                            focus:outline-none
                                            ${
                                                activeTab ===
                                                "referencias"
                                                    ? "text-primary-600"
                                                    : "text-foreground-muted hover:text-foreground"
                                            }
                                        `}
                                    >
                                        Referências

                                        <span
                                            className={`
                                                absolute
                                                inset-x-0
                                                bottom-0
                                                h-[2px]
                                                rounded-full
                                                transition-all
                                                duration-200
                                                ${
                                                    activeTab ===
                                                    "referencias"
                                                        ? "scale-x-100 bg-primary-600 opacity-100"
                                                        : "scale-x-0 bg-transparent opacity-0"
                                                }
                                            `}
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={
                                            activeTab ===
                                            "comentarios"
                                        }
                                        onClick={() =>
                                            handleTabChange(
                                                "comentarios"
                                            )
                                        }
                                        className={`
                                            relative
                                            pb-3
                                            font-display
                                            text-[18px]
                                            font-bold
                                            transition-colors
                                            duration-200
                                            focus:outline-none
                                            ${
                                                activeTab ===
                                                "comentarios"
                                                    ? "text-primary-600"
                                                    : "text-foreground-muted hover:text-foreground"
                                            }
                                        `}
                                    >
                                        Comentários

                                        <span
                                            className={`
                                                absolute
                                                inset-x-0
                                                bottom-0
                                                h-[2px]
                                                rounded-full
                                                transition-all
                                                duration-200
                                                ${
                                                    activeTab ===
                                                    "comentarios"
                                                        ? "scale-x-100 bg-primary-600 opacity-100"
                                                        : "scale-x-0 bg-transparent opacity-0"
                                                }
                                            `}
                                        />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    aria-label="Fechar"
                                    onClick={handleCloseModal}
                                    className="
                                        -mr-1
                                        -mt-1
                                        flex
                                        size-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        text-foreground-muted
                                        transition-colors
                                        hover:bg-surface-hover
                                        hover:text-foreground
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-primary-500/30
                                    "
                                >
                                    <svg
                                        className="size-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            d="M6 6l12 12M18 6L6 18"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div
                                className="
                                    min-h-0
                                    flex-1
                                    overflow-y-auto
                                    pt-8
                                "
                            >
                                {activeTab === null && (
                                    <div
                                        className="
                                            flex
                                            h-full
                                            min-h-[300px]
                                            items-center
                                            justify-center
                                            px-6
                                            text-center
                                        "
                                    >
                                        <div className="max-w-sm">
                                            <div
                                                className="
                                                    mx-auto
                                                    flex
                                                    size-12
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-surface-raised
                                                    text-foreground-muted
                                                "
                                            >
                                                <svg
                                                    className="size-6"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 6v6l4 2"
                                                    />

                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="9"
                                                    />
                                                </svg>
                                            </div>

                                            <p className="mt-4 font-display text-base font-semibold text-foreground">
                                                Explore este versículo
                                            </p>

                                            <p className="mt-1 font-body text-sm leading-relaxed text-foreground-muted">
                                                Selecione referências ou
                                                comentários para ver mais
                                                informações sobre o contexto
                                                deste versículo.
                                            </p>
                                        </div>
                                    </div>
                                )}


                                {activeTab === "referencias" && (
                                    <div
                                        role="tabpanel"
                                        aria-label="Referências"
                                        className="space-y-4"
                                    >

                                    {verseDetails?.references.length ? (
                                        verseDetails.references.map((reference) => (
                                            <div
                                                key={reference.id}
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-border-subtle
                                                    bg-surface-raised
                                                    p-5
                                                "
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-display text-base font-bold text-primary-600">
                                                        {reference.book}
                                                    </span>

                                                    <span className="font-label text-sm text-foreground-muted">
                                                        {reference.number_chapter}:
                                                        {reference.number_verse}
                                                    </span>
                                                </div>

                                                <p className="mt-3 font-body text-sm leading-relaxed text-foreground">
                                                    {reference.text}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center mt-50">
                                            <p className="font-body text-sm text-foreground-muted">
                                                Nenhuma referência encontrada.
                                            </p>
                                        </div>
                                    )}

                                    </div>
                                )}

                                {activeTab === "comentarios" && (
                                    <div
                                        role="tabpanel"
                                        aria-label="Comentários"
                                        className="space-y-4"
                                    >
                                        {verseDetails?.commentaries.length ? (
                                            verseDetails?.commentaries.map((commentary) => (
                                                <div
                                                    key={commentary.id}
                                                    className="
                                                        rounded-xl
                                                        border
                                                        border-border-subtle
                                                        bg-surface-raised
                                                        p-5
                                                    "
                                                >
                                                    <p className="font-body text-sm leading-relaxed text-foreground">
                                                        {commentary.text}
                                                    </p>
                                                </div>
                                            ))

                                        ) : (
                                            <div className="flex items-center justify-center mt-50">
                                            <p className="font-body text-sm text-foreground-muted">
                                                Nenhuma comentário encontrado.
                                            </p>
                                        </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}
