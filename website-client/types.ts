export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  author: {
    name: string;
    avatarUrl: string;
    type: 'Team' | 'Pro';
  };
  stats: {
    likes: number;
    views: number;
  };
}

export interface FilterCategory {
  label: string;
  value: string;
}

export interface User {
  _id?: string;
  name: string;
  company?: string;
  email: string;
  mobile: string;
  avatarUrl: string;
  billingDetails?: any;
}