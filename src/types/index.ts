export type ResourceType = "Book" | "Repository" | "Paper" | "Newsletter" | "Course" | "Other";

export interface Book {
  id: string;
  title: string;
  type: ResourceType;
  authorId: string;
  publisher?: string;
  domains: string[];
  tags: string[];
  score: number;
  trend_score: number;
  official_url: string;
  description: string;
  date_added: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  website?: string;
  twitter?: string;
  github?: string;
  resource_count: number;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  resource_count: number;
  trending: boolean;
}

export interface Collection {
  id: string;
  title: string;
  curator: string;
  description: string;
  resources: string[]; // array of book IDs
  date_updated: string;
}
