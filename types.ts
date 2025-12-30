import React from 'react';

export interface CloudObject {
  id: string;
  key: string;
  size: string;
  type: string;
  lastModified: string;
  metadata: Record<string, string>;
  isNew?: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type TabId = 'concept' | 'structure' | 'metadata' | 'api' | 'durability' | 'quiz';

export interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ElementType;
}