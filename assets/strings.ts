import { LanguageCode } from "@/types/language";
import { Difficulty } from "@/types/game";

export const GAME_DESCRIPTION: {
  [key in LanguageCode]: { header: string; body: string };
} = {
  en: {
    header: "Guess the Wikipedia article!",
    body: "The titles of Wikipedia articles and their content have been shuffled! Your task is to drag each title to the content that it represents (### in the content indicates that a word from the title has been censored).",
  },
  da: {
    header: "Find den rette Wikipedia-artikel!",
    body: "Der er gået ged i den hos Wikipedia! Artiklerne og deres overskrifter er blevet blandet rundt. Din opgave er at trække hver overskrift hen til det uddrag af artiklen, som den passer til (hvis et ord fra overskriften indgår i brødteksten, er det blevet censureret med ###)",
  },
  fr: {
    header: "Devinez l'article Wikipédia !",
    body: "Les titres des articles Wikipédia et leur contenu ont été mélangés ! Votre tâche est de faire glisser chaque titre vers le contenu qu'il représente (### dans le contenu indique qu'un mot qui fait part du titre a été censuré).",
  },
  de: {
    header: "Errate den Wikipedia-Artikel!",
    body: "Die Titel von Wikipedia-Artikeln und deren Inhalt wurden durcheinandergebracht! Deine Aufgabe ist es, jeden Titel zum Inhalt zuzuordnen, den er repräsentiert (### im Inhalt zeigt an, dass ein Wort aus dem Titel zensiert wurde).",
  },
  es: {
    header: "¡Adivina el artículo de Wikipedia!",
    body: "¡Los títulos de los artículos de Wikipedia y su contenido se han mezclado! Tu tarea es arrastrar cada título al contenido que representa (### en el contenido indica que una palabra del título ha sido censurada).",
  },
};

export const DIFFICULTY_DESCRIPTORS: {
  [key in LanguageCode]: { [key in Difficulty]: string };
} = {
  en: {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    extreme: "Extreme",
  },
  da: {
    easy: "Let",
    medium: "Mellem",
    hard: "Svært",
    extreme: "Ekstremt",
  },
  fr: {
    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile",
    extreme: "Extrême",
  },
  de: {
    easy: "Leicht",
    medium: "Mittel",
    hard: "Schwer",
    extreme: "Extrem",
  },
  es: {
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
    extreme: "Extremo",
  },
};

export const GAME_SETTINGS: {
  [key in LanguageCode]: {
    tweak: string;
    numPages: string;
    snippetLength: string;
    difficulty: string;
    play: string;
  };
} = {
  en: {
    tweak: "Tweak difficulty",
    numPages: "Number of snippets",
    snippetLength: "Words per snippet",
    difficulty: "Difficulty",
    play: "PLAY GAME!",
  },
  da: {
    tweak: "Justér sværhedsgrad",
    numPages: "Antal brødtekster",
    snippetLength: "Ord i brødtekster",
    difficulty: "Sværhedsgrad",
    play: "SPIL!",
  },
  fr: {
    tweak: "Ajuster la difficulté",
    numPages: "Nombre de snippets",
    snippetLength: "Longueur de snippet",
    difficulty: "Difficulté",
    play: "Á JOUER !",
  },
  de: {
    tweak: "Schwierigkeit anpassen",
    numPages: "Anzahl der Snippets",
    snippetLength: "Wörter pro Snippet",
    difficulty: "Schwierigkeit",
    play: "SPIELEN!",
  },
  es: {
    tweak: "Ajustar dificultad",
    numPages: "Número de fragmentos",
    snippetLength: "Palabras por fragmento",
    difficulty: "Dificultad",
    play: "JUGAR!",
  },
} as const;
