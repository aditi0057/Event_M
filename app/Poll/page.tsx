'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContent';
import { deletePoll, fetchPolls, updatePoll } from '@/services/api';
import PollCard from '@/components/shared/PollCard';
import Link from 'next/link';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState, ErrorState } from '@/components/ui/empty-state';
import { PollCardSkeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/ui/modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';

interface PollResult {
  option: string;
  count: number;
}

interface Poll {
  _id: string;
  question: string;
  options: string[];
  end_time: string;
  tab: 'Venue' | 'Schedule' | 'Others';
  userHasVoted: boolean;
  results: PollResult[];
  totalVotes: number;
  allowMultipleVotes?: boolean;
  isActive?: boolean;
}

const tabs = ['Venue', 'Schedule', 'Food', 'Others'] as const;

const PollsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Venue');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusTab, setStatusTab] = useState<'Active' | 'Closed'>('Active');
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Poll | null>(null);
  const [editForm, setEditForm] = useState({ question: '', tab: 'Venue', options: ['', ''], end_time: '', allowMultipleVotes: false });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadPolls = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const pollsData = await fetchPolls();
        setPolls(pollsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load polls.');
      } finally {
        setIsLoading(false);
      }
    };
    loadPolls();
  }, []);

  const isActivePoll = (poll: Poll) => poll.isActive !== false && (!poll.end_time || new Date(poll.end_time) > new Date());
  const filteredPolls = (polls || []).filter((poll) => poll.tab === activeTab && (statusTab === 'Active' ? isActivePoll(poll) : !isActivePoll(poll)));

  const startEdit = (poll: Poll) => {
    setEditingPoll(poll);
    setEditForm({
      question: poll.question,
      tab: poll.tab,
      options: poll.options.length ? poll.options : ['', ''],
      end_time: poll.end_time ? new Date(poll.end_time).toISOString().slice(0, 16) : '',
      allowMultipleVotes: Boolean(poll.allowMultipleVotes),
    });
  };

  const savePoll = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingPoll) return;
    const cleanOptions = editForm.options.map((option) => option.trim()).filter(Boolean);
    if (!editForm.question.trim() || cleanOptions.length < 2) {
      toast('Question and at least two options are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...editForm, options: cleanOptions, end_time: editForm.end_time ? new Date(editForm.end_time).toISOString() : null };
      const updated = await updatePoll(editingPoll._id, payload);
      setPolls((current) => current.map((poll) => poll._id === editingPoll._id ? { ...poll, ...updated, ...payload } : poll));
      setEditingPoll(null);
      toast('Poll updated.', 'success');
    } catch (err: any) {
      toast(err.message || 'Could not update poll.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget._id;
    setPolls((current) => current.filter((poll) => poll._id !== targetId));
    setDeleteTarget(null);
    try {
      await deletePoll(targetId);
      toast('Poll deleted.', 'success');
    } catch (err: any) {
      toast(err.message || 'Could not delete poll.', 'error');
      setPolls((current) => [deleteTarget, ...current]);
    }
  };

  return (
    <section className="page-shell">
      <div className="wrapper space-y-8">
        <div className="section-header">
          <div className="section-copy">
            <p className="eyebrow">Team decisions</p>
            <h1 className="mt-2 text-3xl font-semibold">Team Polls</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
              Vote on event details with clear categories and live result visibility.
            </p>
          </div>
          {user?.role === 'admin' && (
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link href="/Poll/Create">
                <Plus className="mr-2 h-4 w-4" />
                New Poll
              </Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Tabs items={[...tabs]} activeTab={activeTab} onChange={(value) => setActiveTab(value as any)} />
          <Tabs items={['Active', 'Closed']} activeTab={statusTab} onChange={(value) => setStatusTab(value as any)} />
        </div>

        {isLoading && <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <PollCardSkeleton key={i} />)}</div>}
        {error && <ErrorState message={error} />}

        {!isLoading && !error && filteredPolls.length > 0 && (
          <div className="space-y-4">
            {filteredPolls.map((poll) => <PollCard key={poll._id} poll={poll} isAdmin={user?.role === 'admin'} onEdit={startEdit} onDelete={setDeleteTarget} />)}
          </div>
        )}

        {!isLoading && !error && filteredPolls.length === 0 && (
          <EmptyState title={statusTab === "Active" ? "No active polls right now." : "No closed polls"} action={user?.role === 'admin' && statusTab === "Active" ? { label: "+ New Poll", href: "/Poll/Create" } : undefined} />
        )}
      </div>
      <Modal title="Edit Poll" open={Boolean(editingPoll)} onClose={() => setEditingPoll(null)}>
        <form onSubmit={savePoll} className="grid gap-5">
          <Input label="Question" value={editForm.question} onChange={(e) => setEditForm((current) => ({ ...current, question: e.target.value }))} required />
          <Select label="Category" value={editForm.tab} onChange={(value) => setEditForm((current) => ({ ...current, tab: value }))} options={tabs.map((value) => ({ label: value, value }))} />
          <div className="grid gap-3">
            <label className="text-sm font-semibold">Options</label>
            {editForm.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input value={option} onChange={(e) => setEditForm((current) => ({ ...current, options: current.options.map((item, i) => i === index ? e.target.value : item) }))} />
                {editForm.options.length > 2 && <Button type="button" variant="ghost" size="icon" onClick={() => setEditForm((current) => ({ ...current, options: current.options.filter((_, i) => i !== index) }))}><X className="h-4 w-4" /></Button>}
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => setEditForm((current) => ({ ...current, options: [...current.options, ''] }))}>Add option</Button>
          </div>
          <Input label="Voting deadline" type="datetime-local" value={editForm.end_time} onChange={(e) => setEditForm((current) => ({ ...current, end_time: e.target.value }))} />
          <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={editForm.allowMultipleVotes} onChange={(e) => setEditForm((current) => ({ ...current, allowMultipleVotes: e.target.checked }))} /> Allow multiple votes</label>
          <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
            <Button type="button" variant="secondary" onClick={() => setEditingPoll(null)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete poll" description="Are you sure you want to delete this poll? This will remove all votes." dangerous onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
    </section>
  );
};

export default PollsPage;
