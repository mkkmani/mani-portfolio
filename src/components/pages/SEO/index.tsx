'use client';

import { useState, useEffect } from 'react';
import SingleCheck from './SingleCheck';
import BulkResults from './BulkResults';
import ContentSelector from './ContentSelector';
import ConfirmationModal from '@/components/Common/ConfirmationModal';
import type { SeoCheckResult, ContentItem, BulkCheckResult } from './types';

type ModalState = {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'warning' | 'danger' | 'info';
  onConfirm: () => void;
  step?: 'first' | 'second';
};

export default function SEODashboard() {
  const [loading, setLoading] = useState(false);
  const [singleResult, setSingleResult] = useState<SeoCheckResult | null>(null);
  const [bulkResults, setBulkResults] = useState<BulkCheckResult | null>(null);
  const [blogs, setBlogs] = useState<ContentItem[]>([]);
  const [preparations, setPreparations] = useState<ContentItem[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'single' | 'bulk'>('content');
  const [indexingLoading, setIndexingLoading] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => { }
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [blogsRes, prepsRes] = await Promise.all([
        fetch('/api/blogs?all=true'),
        fetch('/api/interview-prep')
      ]);

      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        setBlogs(blogsData);
      }

      if (prepsRes.ok) {
        const prepsData = await prepsRes.json();
        setPreparations(prepsData);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleSingleCheck = async (url: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/seo-check?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (response.ok) {
        setSingleResult(data);
      } else {
        alert(data.error || 'Failed to check URL');
      }
    } catch (error) {
      alert('Error checking URL');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCheck = async () => {
    if (selectedUrls.length === 0) return;

    setLoading(true);
    setActiveTab('bulk');

    try {
      const response = await fetch('/api/seo-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: selectedUrls })
      });

      const data = await response.json();

      if (response.ok) {
        setBulkResults(data);
      } else {
        alert(data.error || 'Failed to check URLs');
        setActiveTab('content');
      }
    } catch (error) {
      alert('Error checking URLs');
      setActiveTab('content');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUrl = (slug: string, type: 'blog' | 'prep') => {
    const url = type === 'blog' ? `/notelogs/${slug}` : `/interview-prep/${slug}`;
    setSelectedUrls(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const handleSelectAll = () => {
    const publishedBlogUrls = blogs.filter(b => b.published).map(b => `/notelogs/${b.slug}`);
    const publishedPrepUrls = preparations.filter(p => p.published).map(p => `/interview-prep/${p.slug}`);
    setSelectedUrls([...publishedBlogUrls, ...publishedPrepUrls]);
  };

  // First confirmation for sitemap revalidation
  const handleTriggerRevalidation = () => {
    setModalState({
      isOpen: true,
      title: 'Revalidate Sitemap',
      message: 'Are you sure you want to manually revalidate the sitemap?\n\nThis will regenerate the sitemap.xml file with all current published content.',
      type: 'warning',
      step: 'first',
      onConfirm: handleRevalidationSecondConfirmation
    });
  };

  // Second confirmation for sitemap revalidation
  const handleRevalidationSecondConfirmation = () => {
    closeModal();
    setModalState({
      isOpen: true,
      title: 'Final Confirmation',
      message: 'This action will immediately regenerate your sitemap.\n\nPlease confirm to proceed.',
      type: 'danger',
      step: 'second',
      onConfirm: executeSitemapRevalidation
    });
  };

  // Execute sitemap revalidation
  const executeSitemapRevalidation = async () => {
    closeModal();
    setLoading(true);
    try {
      const response = await fetch('/api/revalidate-sitemap', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        setModalState({
          isOpen: true,
          title: 'Success',
          message: '✓ Sitemap revalidated successfully!\n\nYour sitemap.xml has been regenerated with all published content.',
          type: 'info',
          onConfirm: closeModal
        });
      } else {
        setModalState({
          isOpen: true,
          title: 'Error',
          message: data.message || 'Failed to revalidate sitemap',
          type: 'danger',
          onConfirm: closeModal
        });
      }
    } catch (error) {
      setModalState({
        isOpen: true,
        title: 'Error',
        message: 'Error revalidating sitemap. Please try again.',
        type: 'danger',
        onConfirm: closeModal
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyGoogleIndexing = () => {
    setModalState({
      isOpen: true,
      title: 'Notify Google Indexing',
      message: 'Notify Google about all published content?\n\nThis will use the Google Indexing API and may take a few moments.',
      type: 'info',
      onConfirm: executeGoogleIndexing
    });
  };

  const executeGoogleIndexing = async () => {
    closeModal();
    setIndexingLoading(true);
    try {
      const response = await fetch('/api/google-indexing', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        if (data.totalUrls === 0) {
          setModalState({
            isOpen: true,
            title: 'No Content',
            message: 'ℹ️ No published content to notify Google about.',
            type: 'info',
            onConfirm: closeModal
          });
        } else {
          setModalState({
            isOpen: true,
            title: 'Indexing Complete',
            message: `✓ Google Indexing Notification Complete\n\nTotal URLs: ${data.totalUrls}\nSuccessful: ${data.successful}\nFailed: ${data.failed}\n\n${data.message}`,
            type: 'info',
            onConfirm: closeModal
          });
        }
      } else {
        setModalState({
          isOpen: true,
          title: 'Error',
          message: data.message || 'Failed to notify Google',
          type: 'danger',
          onConfirm: closeModal
        });
      }
    } catch (error) {
      setModalState({
        isOpen: true,
        title: 'Error',
        message: 'Error notifying Google. Make sure GOOGLE_INDEXING_CREDENTIALS is configured.',
        type: 'danger',
        onConfirm: closeModal
      });
    } finally {
      setIndexingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">SEO Verification</h1>
          <p className="text-foreground/60 text-lg">
            Check and verify SEO configuration for your content
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-foreground/10 mb-8">
          <div className="flex gap-6 overflow-x-auto">
            {[
              { id: 'content' as const, label: 'Content Verification' },
              { id: 'single' as const, label: 'Single URL' },
              { id: 'bulk' as const, label: 'Bulk Results' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 font-bold uppercase tracking-wider text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-foreground/40 hover:text-foreground/70'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-foreground/[0.02] border border-foreground/10 p-6 md:p-8">
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Content Verification Actions */}
              <div className="flex gap-3 flex-wrap pb-6 border-b border-foreground/10">
                <button
                  onClick={handleBulkCheck}
                  disabled={selectedUrls.length === 0 || loading}
                  className="px-6 py-3 bg-accent text-background font-bold uppercase tracking-wider hover:bg-accent/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : `Verify ${selectedUrls.length} Selected`}
                </button>
                <button
                  onClick={() => setActiveTab('single')}
                  className="px-6 py-3 border border-foreground/10 text-foreground/70 font-bold uppercase tracking-wider hover:bg-foreground/5 transition-colors"
                >
                  Single Check
                </button>
              </div>

              <ContentSelector
                blogs={blogs}
                preparations={preparations}
                selectedUrls={selectedUrls}
                onToggle={handleToggleUrl}
                onSelectAll={handleSelectAll}
                onClearSelection={() => setSelectedUrls([])}
              />

              {/* SEO Tools Section - Separated */}
              <div className="mt-8 pt-8 border-t-2 border-accent/20">
                <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 text-accent">
                  SEO Tools
                </h2>
                <p className="text-foreground/60 mb-6">
                  Manage sitemap and notify search engines about content updates
                </p>

                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={handleNotifyGoogleIndexing}
                    disabled={indexingLoading}
                    className="px-6 py-3 border border-accent/20 text-accent font-bold uppercase tracking-wider hover:bg-accent/5 transition-colors disabled:opacity-30"
                    title="Notify Google Indexing API about all published content"
                  >
                    {indexingLoading ? 'Notifying...' : 'Notify Google Indexing'}
                  </button>
                  <button
                    onClick={handleTriggerRevalidation}
                    disabled={loading}
                    className="px-6 py-3 border border-accent/20 text-accent font-bold uppercase tracking-wider hover:bg-accent/5 transition-colors disabled:opacity-30"
                  >
                    Revalidate Sitemap
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'single' && (
            <SingleCheck
              onCheck={handleSingleCheck}
              result={singleResult}
              loading={loading}
            />
          )}

          {activeTab === 'bulk' && <BulkResults results={bulkResults} />}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.step === 'second' ? 'Yes, Proceed' : 'Confirm'}
        cancelText="Cancel"
      />
    </div>
  );
}
