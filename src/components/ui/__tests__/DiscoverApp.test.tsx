import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DiscoverApp from '../DiscoverApp';
import type { Resource, Domain } from '../../../types';

const mockDomains: Domain[] = [
  { id: 'dom-1', name: 'AI', description: 'AI', count: 1 },
  { id: 'dom-2', name: 'ML', description: 'ML', count: 1 },
];

const mockData: Resource[] = [
  {
    id: "KA-REPO-001",
    type: "repository",
    title: "Test Repo Alpha",
    description: "A test repository",
    url: "https://github.com/test/alpha",
    official_url: "https://github.com/test/alpha",
    domains: ["AI"],
    tags: ["testing"],
    score: 9.5,
    trend_score: 1.2,
    authorId: "AUTH-001",
    published_date: "2023-01-01",
    last_updated: "2023-01-02",
    knowledge_dna: {
      core_concept: "Testing",
      target_audience: ["devs"],
      learning_curve: "beginner",
      prerequisites: []
    }
  },
  {
    id: "KA-REPO-002",
    type: "repository",
    title: "Test Repo Beta",
    description: "Another test repository",
    url: "https://github.com/test/beta",
    official_url: "https://github.com/test/beta",
    domains: ["ML"],
    tags: ["testing"],
    score: 8.0,
    trend_score: 2.0,
    authorId: "AUTH-002",
    published_date: "2023-02-01",
    last_updated: "2023-02-02",
    knowledge_dna: {
      core_concept: "Testing",
      target_audience: ["devs"],
      learning_curve: "beginner",
      prerequisites: []
    }
  }
];

describe('DiscoverApp', () => {
  it('renders correctly with default data', async () => {
    render(<DiscoverApp resources={mockData} domains={mockDomains} />);
    expect(screen.getByPlaceholderText('Search resources, tags, authors...')).toBeInTheDocument();
    expect(await screen.findByText('Test Repo Alpha')).toBeInTheDocument();
    expect(screen.getByText('Test Repo Beta')).toBeInTheDocument();
  });

  it('filters by search text', async () => {
    render(<DiscoverApp resources={mockData} domains={mockDomains} />);
    
    const searchInput = screen.getByPlaceholderText('Search resources, tags, authors...');
    fireEvent.change(searchInput, { target: { value: 'Alpha' } });
    
    expect(await screen.findByText('Test Repo Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Test Repo Beta')).not.toBeInTheDocument();
  });

  it('filters by domain', async () => {
    render(<DiscoverApp resources={mockData} domains={mockDomains} />);
    
    // Default is "All"
    const mlButton = screen.getByText('ML');
    fireEvent.click(mlButton);
    
    expect(screen.queryByText('Test Repo Alpha')).not.toBeInTheDocument();
    expect(await screen.findByText('Test Repo Beta')).toBeInTheDocument();
  });

  it('shows no results message when search matches nothing', async () => {
    render(<DiscoverApp resources={mockData} domains={mockDomains} />);
    
    const searchInput = screen.getByPlaceholderText('Search resources, tags, authors...');
    fireEvent.change(searchInput, { target: { value: 'xyz123' } });
    
    // Wait for the skeleton to disappear by finding any text that indicates loading finished, or just await a delay.
    // In our case we can wait for "0 results"
    expect(await screen.findByText(/0 results/)).toBeInTheDocument();
    expect(screen.queryByText('Test Repo Alpha')).not.toBeInTheDocument();
  });
});
