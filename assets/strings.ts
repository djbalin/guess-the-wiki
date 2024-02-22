import { Difficulties, Languages } from "@/resources/TypesEnums";

export const GAME_DESCRIPTION: {
  [key in Languages]: { header: string; body: string };
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
  [key in Languages]: { [key in Difficulties]: string };
} = {
  en: {
    0: "Easy",
    1: "Medium",
    2: "Hard",
    3: "Extreme",
  },
  da: {
    0: "Let",
    1: "Mellem",
    2: "Svært",
    3: "Ekstremt",
  },
  fr: {
    0: "Facile",
    1: "Moyen",
    2: "Difficile",
    3: "Extrême",
  },
  de: {
    0: "Leicht",
    1: "Mittel",
    2: "Schwer",
    3: "Extrem",
  },
  es: {
    0: "Fácil",
    1: "Medio",
    2: "Difícil",
    3: "Extremo",
  },
};

export const GAME_SETTINGS: {
  [key in Languages]: {
    tweak: string;
    snippetCount: string;
    snippetLength: string;
    difficulty: string;
    play: string;
  };
} = {
  en: {
    tweak: "Tweak difficulty",
    snippetCount: "Number of snippets",
    snippetLength: "Words per snippet",
    difficulty: "Difficulty",
    play: "PLAY GAME!",
  },
  da: {
    tweak: "Justér sværhedsgrad",
    snippetCount: "Antal brødtekster",
    snippetLength: "Ord i brødtekster",
    difficulty: "Sværhedsgrad",
    play: "SPIL!",
  },
  fr: {
    tweak: "Ajuster la difficulté",
    snippetCount: "Nombre de snippets",
    snippetLength: "Longueur de snippet",
    difficulty: "Difficulté",
    play: "Á JOUER !",
  },
  de: {
    tweak: "Schwierigkeit anpassen",
    snippetCount: "Anzahl der Snippets",
    snippetLength: "Wörter pro Snippet",
    difficulty: "Schwierigkeit",
    play: "SPIELEN!",
  },
  es: {
    tweak: "Ajustar dificultad",
    snippetCount: "Número de fragmentos",
    snippetLength: "Palabras por fragmento",
    difficulty: "Dificultad",
    play: "JUGAR!",
  },
};
