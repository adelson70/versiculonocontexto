
import api from "./api";

export type VersesData = {
      book: {
          name: string;
          slug: string;
      };

      background: {
          id: string;
          context: string;
      } | "";

      number_chapter: number;

      verses: {
          id: string;
          number: number;
          text: string;
          chapter_id: string;
      }[];
};

export const getVerses = async (book: string, number_chapter: number) => {
  try {
    const response = await api.get(`/verses?book=${book}&number_chapter=${number_chapter}`);
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erro ao buscar versículos");
  }
}; 

export const getVerseDetails = async (verse_id: string) => {
  try {
    const response = await api.get(`/verses/details/${verse_id}`);
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erro ao buscar versículos");
  }
}