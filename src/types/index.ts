export type ResourceType = "Book" | "Repository" | "Paper" | "Newsletter" | "Course" | "Other";

export interface Resource {
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

  // New Knowledge Layer Fields
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimated_hours: number;
  prerequisites: string[];
  learning_outcomes: string[];
  related_resources: string[]; // IDs of related resources
  skip_if: string[];

  verification: {
    official: boolean;
    community_score: number;
    agent_confidence: number;
  };

  metadata: {
    edition?: string;
    language?: string;
    isbn?: string;
    last_verified: string;
  };

  knowledge_dna: Record<string, number>; // Maps topics to a score from 1 to 10
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
  resources: string[]; // array of resource IDs
  date_updated: string;
}
