import React from 'react';

export type UserRole = 'guest' | 'user' | 'admin';

export interface User {
  id: string; // uid
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  type: string;
  salary: string;
  description: string;
  location?: string;
  postedDate: string; // ISO string
  status: 'Open' | 'Closed';
  pdfUrl?: string;
  applicantsCount?: number; // Optional, might need cloud function to maintain
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string; // Denormalized for easy display
  department: string; // Denormalized
  status: 'Pending' | 'Processing' | 'Interview' | 'Rejected' | 'Offer';
  appliedAt: string; // ISO string
  stage?: number; // Helper for UI progress bar
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}