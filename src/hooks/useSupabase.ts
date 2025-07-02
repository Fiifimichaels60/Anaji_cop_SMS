import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Tables = Database['public']['Tables'];
type Member = Tables['members']['Row'] & {
  group?: Tables['groups']['Row'];
};
type Group = Tables['groups']['Row'] & {
  memberCount?: number;
};
type Message = Tables['messages']['Row'] & {
  groups?: string[];
  recipients?: string[];
};
type SMSTemplate = Tables['sms_templates']['Row'];

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Members
  const [members, setMembers] = useState<Member[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [templates, setTemplates] = useState<SMSTemplate[]>([]);

  const handleError = (error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    setError(error.message || `An error occurred in ${context}`);
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchMembers(),
        fetchGroups(),
        fetchMessages(),
        fetchTemplates()
      ]);
    } catch (error) {
      handleError(error, 'fetchData');
    } finally {
      setLoading(false);
    }
  };

  // Members CRUD
  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          group:groups(*)
        `)
        .order('name');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      handleError(error, 'fetchMembers');
    }
  };

  const addMember = async (member: Tables['members']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .insert([{ ...member, updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      await fetchMembers();
      return data;
    } catch (error) {
      handleError(error, 'addMember');
      throw error;
    }
  };

  const updateMember = async (id: string, updates: Tables['members']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchMembers();
      return data;
    } catch (error) {
      handleError(error, 'updateMember');
      throw error;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMembers();
    } catch (error) {
      handleError(error, 'deleteMember');
      throw error;
    }
  };

  // Groups CRUD
  const fetchGroups = async () => {
    try {
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .order('name');

      if (groupsError) throw groupsError;

      // Get member counts for each group
      const groupsWithCounts = await Promise.all(
        (groupsData || []).map(async (group) => {
          const { count } = await supabase
            .from('members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id)
            .eq('active', true);

          return { ...group, memberCount: count || 0 };
        })
      );

      setGroups(groupsWithCounts);
    } catch (error) {
      handleError(error, 'fetchGroups');
    }
  };

  const addGroup = async (group: Tables['groups']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert([{ ...group, updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      await fetchGroups();
      return data;
    } catch (error) {
      handleError(error, 'addGroup');
      throw error;
    }
  };

  // Messages CRUD
  const fetchMessages = async () => {
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Fetch related groups and recipients for each message
      const messagesWithDetails = await Promise.all(
        (messagesData || []).map(async (message) => {
          // Get groups
          const { data: messageGroups } = await supabase
            .from('message_groups')
            .select('group:groups(name)')
            .eq('message_id', message.id);

          // Get recipients
          const { data: messageRecipients } = await supabase
            .from('message_recipients')
            .select('member:members(name)')
            .eq('message_id', message.id);

          return {
            ...message,
            groups: messageGroups?.map(mg => mg.group?.name).filter(Boolean) || [],
            recipients: messageRecipients?.map(mr => mr.member?.name).filter(Boolean) || []
          };
        })
      );

      setMessages(messagesWithDetails);
    } catch (error) {
      handleError(error, 'fetchMessages');
    }
  };

  const sendMessage = async (
    content: string,
    selectedGroups: string[],
    selectedMembers: string[]
  ) => {
    try {
      // Get all recipients
      let allRecipients: Member[] = [];

      // Add group members
      if (selectedGroups.length > 0) {
        const { data: groupMembers } = await supabase
          .from('members')
          .select('*')
          .in('group_id', selectedGroups)
          .eq('active', true);

        if (groupMembers) {
          allRecipients = [...allRecipients, ...groupMembers];
        }
      }

      // Add individual members
      if (selectedMembers.length > 0) {
        const { data: individualMembers } = await supabase
          .from('members')
          .select('*')
          .in('id', selectedMembers)
          .eq('active', true);

        if (individualMembers) {
          allRecipients = [...allRecipients, ...individualMembers];
        }
      }

      // Remove duplicates
      const uniqueRecipients = allRecipients.filter(
        (member, index, self) => index === self.findIndex(m => m.id === member.id)
      );

      if (uniqueRecipients.length === 0) {
        throw new Error('No recipients selected');
      }

      // Create message record
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([{
          content,
          status: 'sent' as const,
          total_recipients: uniqueRecipients.length,
          delivered_count: uniqueRecipients.length, // Simulating successful delivery
          sent_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (messageError) throw messageError;

      // Create message-group relationships
      if (selectedGroups.length > 0) {
        const { error: groupsError } = await supabase
          .from('message_groups')
          .insert(
            selectedGroups.map(groupId => ({
              message_id: messageData.id,
              group_id: groupId
            }))
          );

        if (groupsError) throw groupsError;
      }

      // Create message-recipient relationships
      const { error: recipientsError } = await supabase
        .from('message_recipients')
        .insert(
          uniqueRecipients.map(member => ({
            message_id: messageData.id,
            member_id: member.id,
            status: 'delivered' as const,
            delivered_at: new Date().toISOString()
          }))
        );

      if (recipientsError) throw recipientsError;

      await fetchMessages();
      return messageData;
    } catch (error) {
      handleError(error, 'sendMessage');
      throw error;
    }
  };

  // Templates CRUD
  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('sms_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      handleError(error, 'fetchTemplates');
    }
  };

  const addTemplate = async (template: Tables['sms_templates']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('sms_templates')
        .insert([{ ...template, updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      await fetchTemplates();
      return data;
    } catch (error) {
      handleError(error, 'addTemplate');
      throw error;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchData();
  }, []);

  return {
    // State
    members,
    groups,
    messages,
    templates,
    loading,
    error,

    // Methods
    fetchData,
    
    // Members
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,

    // Groups
    fetchGroups,
    addGroup,

    // Messages
    fetchMessages,
    sendMessage,

    // Templates
    fetchTemplates,
    addTemplate,

    // Utility
    clearError: () => setError(null)
  };
};