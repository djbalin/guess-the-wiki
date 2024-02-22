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
    body: "Wikipedia-artiklerne forneden har fået blandet deres overskrifter rundt. Din opgave er at trække hver overskrift foroven ned på den brødtekst forneden, som den hører til (ord i brødteksten, som udgør del af overskriften, er censureret med ###)",
  },
  fr: {
    header: "Devinez l'article Wikipédia !",
    body: "Les titres des articles Wikipédia et leur contenu ont été mélangés ! Votre tâche est de faire glisser chaque titre vers le contenu qu'il représente (### dans le contenu indique qu'un mot qui fait part du titre a été censuré).",
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
};

export const TWEAK_DIFFICULTY: {
  [key in Languages]: {
    tweak: string;
    snippetCount: string;
    snippetLength: string;
    difficulty: string;
  };
} = {
  en: {
    tweak: "Tweak difficulty",
    snippetCount: "Number of snippets",
    snippetLength: "Words per snippet",
    difficulty: "Difficulty",
  },
  da: {
    tweak: "Justér sværhedsgrad",
    snippetCount: "Antal brødtekster",
    snippetLength: "Ord i brødtekster",
    difficulty: "Sværhedsgrad",
  },
  fr: {
    tweak: "Ajuster la difficulté",
    snippetCount: "Nombre de snippets",
    snippetLength: "Longueur de snippet",
    difficulty: "Difficulté",
  },
};

export const PLAY_GAME_BUTTON: {
  [key in Languages]: string;
} = {
  en: "PLAY GAME !",
  da: "SPIL !",
  fr: "Á JOUER !",
};
