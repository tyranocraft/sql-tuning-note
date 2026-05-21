export type Locale = "ko" | "en";

export type Database = "mysql" | "postgresql";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface ContentMeta {
  title: string;
  slug: string;
  database: Database;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  prerequisites: string[];
  nextSteps: string[];
  part?: number;
  totalParts?: number;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentItem extends ContentMeta {
  content: string;
}

export interface Dictionary {
  site: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    notes: string;
  };
  landing: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
    };
    difficulty: {
      beginner: string;
      intermediate: string;
      advanced: string;
    };
  };
  content: {
    prerequisites: string;
    nextSteps: string;
    showHint: string;
    hideHint: string;
    showAnswer: string;
    hideAnswer: string;
    checkAnswer: string;
    correct: string;
    incorrect: string;
  };
  search: {
    placeholder: string;
    noResults: string;
  };
  filter: {
    all: string;
    beginner: string;
    intermediate: string;
    advanced: string;
  };
}
