import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResourceTable } from '../Table';
import type { Resource } from '../../../types';

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

describe('ResourceTable', () => {
  it('renders table headers correctly', () => {
    render(<ResourceTable data={mockData} isLoading={false} />);
    expect(screen.getByText(/Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Domains/i)).toBeInTheDocument();
    expect(screen.getByText(/Score/i)).toBeInTheDocument();
  });

  it('renders data rows correctly', () => {
    render(<ResourceTable data={mockData} isLoading={false} />);
    expect(screen.getByText('Test Repo Alpha')).toBeInTheDocument();
    expect(screen.getByText('Test Repo Beta')).toBeInTheDocument();
  });

  it('sorts data when clicking on headers', () => {
    render(<ResourceTable data={mockData} isLoading={false} />);
    
    // Sort ascending
    const scoreHeader = screen.getByText(/Score/i);
    fireEvent.click(scoreHeader);
    
    // Wait for sort
    let rowsAsc = screen.getAllByRole('row');
    expect(rowsAsc[1]).toHaveTextContent(/Test Repo/i);
    
    // Sort descending
    fireEvent.click(scoreHeader);
    let rowsDesc = screen.getAllByRole('row');
    expect(rowsDesc[1]).toHaveTextContent(/Test Repo/i);
  });

  it('paginates correctly', () => {
    // Duplicate data to force pagination
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      ...mockData[0],
      id: `KA-REPO-${i}`,
      title: `Test Repo ${i}`
    }));
    
    render(<ResourceTable data={largeData} isLoading={false} />);
    
    // Should show first 10
    expect(screen.getByText('Test Repo 0')).toBeInTheDocument();
    expect(screen.queryByText('Test Repo 11')).not.toBeInTheDocument();
    
    // Click next page
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);
    
    // Should show next 10
    expect(screen.queryByText('Test Repo 0')).not.toBeInTheDocument();
    expect(screen.getByText('Test Repo 11')).toBeInTheDocument();
  });
});
