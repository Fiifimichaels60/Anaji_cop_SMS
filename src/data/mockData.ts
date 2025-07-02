import { Member, Group, Message, SMSTemplate } from '../types';

export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1234567890',
    email: 'john.smith@email.com',
    group: 'Adult Ministry',
    joinDate: '2023-01-15',
    active: true
  },
  {
    id: '2',
    name: 'Mary Johnson',
    phone: '+1234567891',
    email: 'mary.johnson@email.com',
    group: 'Youth Ministry',
    joinDate: '2023-02-20',
    active: true
  },
  {
    id: '3',
    name: 'David Wilson',
    phone: '+1234567892',
    email: 'david.wilson@email.com',
    group: 'Choir',
    joinDate: '2023-03-10',
    active: true
  },
  {
    id: '4',
    name: 'Sarah Brown',
    phone: '+1234567893',
    email: 'sarah.brown@email.com',
    group: 'Adult Ministry',
    joinDate: '2023-01-25',
    active: true
  },
  {
    id: '5',
    name: 'Michael Davis',
    phone: '+1234567894',
    email: 'michael.davis@email.com',
    group: 'Youth Ministry',
    joinDate: '2023-04-05',
    active: false
  }
];

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Adult Ministry',
    description: 'Adult congregation members',
    memberCount: 45,
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Youth Ministry',
    description: 'Young adults and teenagers',
    memberCount: 28,
    color: 'bg-green-500'
  },
  {
    id: '3',
    name: 'Choir',
    description: 'Church choir members',
    memberCount: 15,
    color: 'bg-purple-500'
  },
  {
    id: '4',
    name: 'Volunteers',
    description: 'Church volunteers and staff',
    memberCount: 20,
    color: 'bg-orange-500'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Join us for Sunday service at 10 AM. God bless!',
    recipients: ['John Smith', 'Mary Johnson'],
    groups: ['Adult Ministry'],
    sentAt: '2024-01-15T10:30:00Z',
    status: 'sent',
    deliveredCount: 42,
    totalRecipients: 45
  },
  {
    id: '2',
    content: 'Youth group meeting postponed to next Friday at 7 PM.',
    recipients: ['Mary Johnson', 'Michael Davis'],
    groups: ['Youth Ministry'],
    sentAt: '2024-01-14T15:20:00Z',
    status: 'sent',
    deliveredCount: 26,
    totalRecipients: 28
  }
];

export const mockTemplates: SMSTemplate[] = [
  {
    id: '1',
    name: 'Sunday Service Reminder',
    content: 'Don\'t forget about our Sunday service at 10 AM. We look forward to seeing you there! God bless.',
    category: 'Reminder',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Event Invitation',
    content: 'You\'re invited to our special church event on [DATE] at [TIME]. Join us for fellowship and worship!',
    category: 'Invitation',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Prayer Request',
    content: 'Please keep [NAME] in your prayers. God\'s healing power is with us always.',
    category: 'Prayer',
    createdAt: '2024-01-03T00:00:00Z'
  }
];