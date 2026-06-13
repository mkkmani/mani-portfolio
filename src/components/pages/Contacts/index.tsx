'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Mail, Search, X } from 'lucide-react';
import Link from 'next/link';
import type { Contact } from './types';

type ContactFilter = 'all' | 'pending' | 'replied';

export default function ContactsManagement() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState<ContactFilter>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact/admin');
      if (res.ok) setContacts(await res.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (contactId: string) => {
    if (!replyText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/contact/${contactId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText })
      });
      if (res.ok) {
        setReplyText('');
        setSelectedContact(null);
        fetchContacts();
      }
    } catch (error) {
      console.error('Reply error:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = contacts.filter(c => !c.replied).length;
  const repliedCount = contacts.filter(c => c.replied).length;

  const query = search.trim().toLowerCase();
  const filteredContacts = contacts.filter(c => {
    const matchesFilter =
      filter === 'all' ? true : filter === 'pending' ? !c.replied : c.replied;
    if (!matchesFilter) return false;
    if (!query) return true;
    return (
      c.name.toLowerCase().includes(query) ||
      c.contactValue.toLowerCase().includes(query) ||
      c.message.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/get-access" className="inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors mb-4 text-sm font-bold uppercase tracking-wider">
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Contacts <span className="text-accent">Management</span>
            </h1>
            <p className="text-foreground/60 text-lg">
              View and respond to inquiries ({contacts.length})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {([
            { key: 'all', label: 'Total', value: contacts.length },
            { key: 'pending', label: 'Pending', value: pendingCount },
            { key: 'replied', label: 'Replied', value: repliedCount },
          ] as const).map(({ key, label, value }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`text-left border p-4 transition-all ${
                  active
                    ? 'border-accent bg-accent/5'
                    : 'border-foreground/10 bg-foreground/2 hover:border-foreground/30'
                }`}
              >
                <div className={`text-2xl font-bold ${active ? 'text-accent' : 'text-foreground'}`}>{value}</div>
                <div className="text-xs text-foreground/40 uppercase tracking-wider">{label}</div>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or message..."
            className="w-full bg-foreground/5 border border-foreground/20 pl-11 pr-11 py-3 text-sm focus:border-accent focus:bg-foreground/10 outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-accent transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {loading && !selectedContact ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredContacts.map((contact) => (
              <div key={contact._id} className="border border-foreground/10 bg-foreground/[0.02] p-6 hover:border-accent/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{contact.name}</h3>
                        <div className="flex items-center gap-2 text-accent text-sm font-medium">
                          <Mail size={14} />
                          {contact.contactValue}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-3 py-1.5 bg-foreground/5 border border-foreground/10 text-foreground/60">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                        {contact.replied && (
                          <span className="text-xs font-bold px-3 py-1.5 bg-accent/20 text-accent flex items-center gap-1.5 uppercase">
                            <Check size={10} /> Replied
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="bg-foreground/5 border-l-2 border-accent/30 p-4">
                      <p className="text-foreground/90 leading-relaxed">{contact.message}</p>
                    </div>

                    {/* Admin Reply */}
                    {contact.adminReply && (
                      <div className="bg-accent/5 border-l-2 border-accent p-4">
                        <p className="text-xs text-accent font-bold mb-2 uppercase tracking-widest">Your Reply</p>
                        <p className="text-foreground/80 leading-relaxed">{contact.adminReply}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex items-start">
                    <button
                      onClick={() => setSelectedContact(selectedContact?._id === contact._id ? null : contact)}
                      className="px-6 py-3 text-xs font-bold uppercase tracking-wider border border-foreground/20 hover:bg-accent hover:text-background hover:border-accent transition-all"
                    >
                      {selectedContact?._id === contact._id ? 'Close' : 'Reply'}
                    </button>
                  </div>
                </div>

                {/* Reply Form */}
                {selectedContact?._id === contact._id && (
                  <div className="mt-6 pt-6 border-t border-foreground/10">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      className="w-full bg-foreground/5 border border-foreground/20 p-4 text-sm mb-4 focus:border-accent focus:bg-foreground/10 outline-none transition-all"
                      rows={4}
                    />
                    <button
                      onClick={() => handleReply(contact._id)}
                      disabled={!replyText.trim() || loading}
                      className="px-8 py-3 bg-accent text-background text-xs font-bold uppercase tracking-wider hover:bg-accent/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                )}
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <div className="text-center py-12 text-foreground/40">
                {contacts.length === 0
                  ? 'No contacts found'
                  : 'No contacts match the current filter'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
