export interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  group: string;
  joinDate: string;
  active: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  color: string;
}

export interface Message {
  id: string;
  content: string;
  recipients: string[];
  groups: string[];
  sentAt: string;
  status: 'sent' | 'pending' | 'failed';
  deliveredCount: number;
  totalRecipients: number;
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  createdAt: string;
}