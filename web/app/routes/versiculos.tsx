import { useParams } from "react-router";


export default function Versiculos() {
    const { book, chapter } = useParams();

    if (!book || !chapter) {
        return <div>Versiculo não encontrado</div>;
    }

    return <div>Versiculo {book} {chapter}</div>;
}
