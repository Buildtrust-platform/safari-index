'use client';

/**
 * Ops Settings Page
 *
 * Manage response templates and automation rules:
 * - Response templates for different inquiry types
 * - Automation toggles (auto-acknowledge, follow-up reminders)
 * - Preferences
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  FileText,
  Sparkles,
  Bell,
  Clock,
  Mail,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Save,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useOpsKey } from '../components/hooks/useOpsKey';

interface ResponseTemplate {
  id: string;
  name: string;
  category: 'first_response' | 'follow_up' | 'quote';
  subject: string;
  body: string;
  isDefault?: boolean;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  timing?: string;
}

const DEFAULT_TEMPLATES: ResponseTemplate[] = [
  {
    id: 'first-family',
    name: 'Family First Response',
    category: 'first_response',
    subject: 'Your Family Safari Inquiry',
    body: `Hi,

Thank you for reaching out about planning a family safari adventure!

I've reviewed your inquiry and I'm excited to help create an unforgettable experience for your family. Based on what you've shared, I have some wonderful options in mind.

Would you like to schedule a quick call to discuss the details? I'm available this week and would love to learn more about what you're hoping for from this trip.

Best regards,
Vurara Safaris`,
    isDefault: true,
  },
  {
    id: 'first-honeymoon',
    name: 'Honeymoon',
    category: 'first_response',
    subject: 'Your Romantic Safari Getaway',
    body: `Hi,

Congratulations! Thank you for considering us for your honeymoon safari.

A safari honeymoon is truly one of the most romantic experiences - imagine sundowners overlooking the savanna, private dinners under the stars, and waking up to the sounds of the African bush.

I'd love to chat about creating something special for you both. When would be a good time for a quick call?

Best regards,
Vurara Safaris`,
  },
  {
    id: 'followup-48h',
    name: '48h Check-in',
    category: 'follow_up',
    subject: 'Following Up on Your Safari Inquiry',
    body: `Hi,

I wanted to follow up on my previous email about your safari inquiry. I know planning a trip like this involves a lot of decisions!

Do you have any questions I can help answer? I'm happy to hop on a quick call if that would be easier.

Looking forward to hearing from you.

Best regards,
Vurara Safaris`,
  },
];

const DEFAULT_RULES: AutomationRule[] = [
  {
    id: 'auto-acknowledge',
    name: 'Auto-acknowledge new inquiries',
    description: 'Send an immediate confirmation when a new inquiry is received',
    enabled: true,
    timing: 'Instant',
  },
  {
    id: 'follow-up-48h',
    name: 'Follow-up reminder',
    description: 'Reminder to follow up if no response after initial contact',
    enabled: true,
    timing: 'After 48 hours',
  },
  {
    id: 'quote-reminder',
    name: 'Quote follow-up',
    description: 'Remind to follow up after sending a quote',
    enabled: false,
    timing: 'After 3 days',
  },
  {
    id: 'lost-feedback',
    name: 'Lost inquiry feedback',
    description: 'Request feedback when an inquiry is marked as lost',
    enabled: false,
    timing: 'After 7 days',
  },
];

// ============================================================
// COMPONENTS
// ============================================================

function TemplateCard({
  template,
  onEdit,
  onDelete,
}: {
  template: ResponseTemplate;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-stone-200 dark:border-zinc-700 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-stone-900 dark:text-white truncate">
              {template.name}
            </h4>
            {template.isDefault && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded">
                Default
              </span>
            )}
          </div>
          <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1 line-clamp-2">
            {template.body.substring(0, 100)}...
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-2 text-stone-400 hover:text-stone-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-stone-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 hover:bg-stone-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AutomationToggle({
  rule,
  onToggle,
}: {
  rule: AutomationRule;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-lg border border-stone-200 dark:border-zinc-700">
      <div className="flex-1 min-w-0 mr-4">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-stone-900 dark:text-white">{rule.name}</h4>
          {rule.timing && (
            <span className="px-2 py-0.5 text-xs text-stone-500 dark:text-zinc-400 bg-stone-100 dark:bg-zinc-700 rounded">
              {rule.timing}
            </span>
          )}
        </div>
        <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1">{rule.description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`p-1 rounded-lg transition-colors ${
          rule.enabled
            ? 'text-green-500 hover:text-green-600'
            : 'text-stone-400 hover:text-stone-500 dark:text-zinc-500 dark:hover:text-zinc-400'
        }`}
      >
        {rule.enabled ? (
          <ToggleRight className="w-8 h-8" />
        ) : (
          <ToggleLeft className="w-8 h-8" />
        )}
      </button>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function OpsSettingsPage() {
  const { opsKey, isAuthenticated, isLoading: authLoading, getAuthHeaders } = useOpsKey();

  const [templates, setTemplates] = useState<ResponseTemplate[]>(DEFAULT_TEMPLATES);
  const [rules, setRules] = useState<AutomationRule[]>(DEFAULT_RULES);
  const [activeTab, setActiveTab] = useState<'templates' | 'automation'>('templates');
  const [editingTemplate, setEditingTemplate] = useState<ResponseTemplate | null>(null);
  const [saving, setSaving] = useState(false);

  // Template form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ResponseTemplate['category']>('first_response');
  const [formSubject, setFormSubject] = useState('');
  const [formBody, setFormBody] = useState('');

  // Load saved settings (would normally come from API/localStorage)
  useEffect(() => {
    const savedTemplates = localStorage.getItem('ops_templates');
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch {
        // Use defaults
      }
    }

    const savedRules = localStorage.getItem('ops_automation_rules');
    if (savedRules) {
      try {
        setRules(JSON.parse(savedRules));
      } catch {
        // Use defaults
      }
    }
  }, []);

  // Save templates
  const saveTemplates = useCallback((newTemplates: ResponseTemplate[]) => {
    setTemplates(newTemplates);
    localStorage.setItem('ops_templates', JSON.stringify(newTemplates));
  }, []);

  // Save rules
  const saveRules = useCallback((newRules: AutomationRule[]) => {
    setRules(newRules);
    localStorage.setItem('ops_automation_rules', JSON.stringify(newRules));
  }, []);

  // Open template editor
  const openTemplateEditor = (template?: ResponseTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormName(template.name);
      setFormCategory(template.category);
      setFormSubject(template.subject);
      setFormBody(template.body);
    } else {
      setEditingTemplate({ id: '', name: '', category: 'first_response', subject: '', body: '' });
      setFormName('');
      setFormCategory('first_response');
      setFormSubject('');
      setFormBody('');
    }
  };

  // Save template
  const handleSaveTemplate = () => {
    if (!formName || !formBody) return;

    setSaving(true);

    const newTemplate: ResponseTemplate = {
      id: editingTemplate?.id || `template-${Date.now()}`,
      name: formName,
      category: formCategory,
      subject: formSubject,
      body: formBody,
    };

    if (editingTemplate?.id) {
      // Update existing
      saveTemplates(templates.map((t) => (t.id === editingTemplate.id ? newTemplate : t)));
    } else {
      // Add new
      saveTemplates([...templates, newTemplate]);
    }

    setEditingTemplate(null);
    setSaving(false);
  };

  // Delete template
  const handleDeleteTemplate = (templateId: string) => {
    saveTemplates(templates.filter((t) => t.id !== templateId));
  };

  // Toggle automation rule
  const handleToggleRule = (ruleId: string) => {
    saveRules(rules.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r)));
  };

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  const firstResponseTemplates = templates.filter((t) => t.category === 'first_response');
  const followUpTemplates = templates.filter((t) => t.category === 'follow_up');

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-white flex items-center gap-3">
            <Settings className="w-6 h-6" />
            Settings
          </h1>
          <p className="text-stone-500 dark:text-zinc-400 mt-1">
            Manage templates and automation rules
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-stone-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'templates'
                ? 'border-amber-500 text-amber-600 dark:text-amber-500'
                : 'border-transparent text-stone-500 dark:text-zinc-400 hover:text-stone-700 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="w-4 h-4 inline-block mr-2" />
            Response Templates
          </button>
          <button
            onClick={() => setActiveTab('automation')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'automation'
                ? 'border-amber-500 text-amber-600 dark:text-amber-500'
                : 'border-transparent text-stone-500 dark:text-zinc-400 hover:text-stone-700 dark:hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4 inline-block mr-2" />
            Automation
          </button>
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && !editingTemplate && (
          <div className="space-y-6">
            {/* First Response Templates */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-stone-500 dark:text-zinc-400 uppercase tracking-wide">
                  First Response
                </h2>
                <button
                  onClick={() => openTemplateEditor()}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Template
                </button>
              </div>
              <div className="space-y-3">
                {firstResponseTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={() => openTemplateEditor(template)}
                    onDelete={() => handleDeleteTemplate(template.id)}
                  />
                ))}
                {firstResponseTemplates.length === 0 && (
                  <p className="text-sm text-stone-400 dark:text-zinc-500 text-center py-8">
                    No first response templates yet
                  </p>
                )}
              </div>
            </section>

            {/* Follow-up Templates */}
            <section>
              <h2 className="text-sm font-medium text-stone-500 dark:text-zinc-400 uppercase tracking-wide mb-4">
                Follow-ups
              </h2>
              <div className="space-y-3">
                {followUpTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={() => openTemplateEditor(template)}
                    onDelete={() => handleDeleteTemplate(template.id)}
                  />
                ))}
                {followUpTemplates.length === 0 && (
                  <p className="text-sm text-stone-400 dark:text-zinc-500 text-center py-8">
                    No follow-up templates yet
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Template Editor */}
        {activeTab === 'templates' && editingTemplate && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-white">
                {editingTemplate.id ? 'Edit Template' : 'New Template'}
              </h2>
              <button
                onClick={() => setEditingTemplate(null)}
                className="p-2 text-stone-400 hover:text-stone-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-zinc-300 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Family First Response"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-zinc-300 mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as ResponseTemplate['category'])}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="first_response">First Response</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="quote">Quote</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-zinc-300 mb-1">
                Email Subject
              </label>
              <input
                type="text"
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                placeholder="e.g., Your Safari Inquiry"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-zinc-300 mb-1">
                Email Body
              </label>
              <textarea
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                placeholder="Write your template here..."
                rows={12}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none font-mono text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-zinc-800">
              <button
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2 text-sm text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!formName || !formBody || saving}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Template'}
              </button>
            </div>
          </div>
        )}

        {/* Automation Tab */}
        {activeTab === 'automation' && (
          <div className="space-y-4">
            <p className="text-sm text-stone-500 dark:text-zinc-400">
              Configure automated actions to streamline your workflow.
            </p>

            <div className="space-y-3">
              {rules.map((rule) => (
                <AutomationToggle
                  key={rule.id}
                  rule={rule}
                  onToggle={() => handleToggleRule(rule.id)}
                />
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-300">Coming Soon</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Advanced automation features including automatic email sending, custom triggers,
                    and integration with external services are coming soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
