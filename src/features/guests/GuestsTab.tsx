import { useState, useMemo, useRef } from 'react';
import {
  UserPlus,
  Download,
  Upload,
  Sparkles,
  Trash2,
  Edit2,
  X,
  Search,
  Filter
} from 'lucide-react';
import { Guest } from '../../lib/schema';

interface GuestsTabProps {
  guests: Guest[];
  eventName: string;
  eventType: string;
  onAddGuest: (guest: Omit<Guest, 'id'>) => void;
  onUpdateGuest: (id: string, updated: Partial<Guest>) => void;
  onRemoveGuest: (id: string) => void;
  onImportCsv: (importedGuests: Guest[]) => void;
  guestAiNotes?: string;
  onSaveAiNotes: (notes: string) => void;
}

export default function GuestsTab({
  guests,
  eventName,
  eventType,
  onAddGuest,
  onUpdateGuest,
  onRemoveGuest,
  onImportCsv,
  guestAiNotes,
  onSaveAiNotes
}: GuestsTabProps) {
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('All');
  const [rsvpFilter, setRsvpFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string>(guestAiNotes || '');
  const [showAiModal, setShowAiModal] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formGroup, setFormGroup] = useState('Friends');
  const [formRsvp, setFormRsvp] = useState<'Invited' | 'Yes' | 'No' | 'Maybe'>('Invited');
  const [formDietary, setFormDietary] = useState('None');
  const [formPlusOnes, setFormPlusOnes] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Summary Metrics
  const { totalGuests, confirmedCount, cateringHeadcount } = useMemo(() => {
    const total = guests.length;
    const confirmed = guests.filter(g => g.rsvp === 'Yes');
    const headcount = confirmed.reduce((acc, g) => acc + 1 + (g.plusOnes || 0), 0);
    return {
      totalGuests: total,
      confirmedCount: confirmed.length,
      cateringHeadcount: headcount
    };
  }, [guests]);

  // Filtered List
  const filteredGuests = useMemo(() => {
    return guests.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.dietary.toLowerCase().includes(search.toLowerCase()) ||
        g.group.toLowerCase().includes(search.toLowerCase());
      const matchesGroup = groupFilter === 'All' || g.group === groupFilter;
      const matchesRsvp = rsvpFilter === 'All' || g.rsvp === rsvpFilter;
      return matchesSearch && matchesGroup && matchesRsvp;
    });
  }, [guests, search, groupFilter, rsvpFilter]);

  const uniqueGroups = useMemo(() => {
    const set = new Set(guests.map(g => g.group));
    return ['All', ...Array.from(set)];
  }, [guests]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormName('');
    setFormGroup('Friends');
    setFormRsvp('Invited');
    setFormDietary('None');
    setFormPlusOnes(0);
    setEditingGuest(null);
    setIsAddOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (g: Guest) => {
    setEditingGuest(g);
    setFormName(g.name);
    setFormGroup(g.group);
    setFormRsvp(g.rsvp);
    setFormDietary(g.dietary);
    setFormPlusOnes(g.plusOnes);
    setIsAddOpen(true);
  };

  // Save Add/Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingGuest) {
      onUpdateGuest(editingGuest.id, {
        name: formName.trim(),
        group: formGroup.trim() || 'General',
        rsvp: formRsvp,
        dietary: formDietary.trim() || 'None',
        plusOnes: Number(formPlusOnes) || 0
      });
    } else {
      onAddGuest({
        name: formName.trim(),
        group: formGroup.trim() || 'General',
        rsvp: formRsvp,
        dietary: formDietary.trim() || 'None',
        plusOnes: Number(formPlusOnes) || 0
      });
    }
    setIsAddOpen(false);
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['Name', 'Group', 'RSVP', 'Dietary', 'PlusOnes'];
    const rows = guests.map(g => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.group.replace(/"/g, '""')}"`,
      `"${g.rsvp}"`,
      `"${g.dietary.replace(/"/g, '""')}"`,
      g.plusOnes
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${eventName.replace(/\s+/g, '_')}_guests.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r\n|\n/).filter(line => line.trim());
      if (lines.length < 2) return;

      const imported: Guest[] = [];
      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        const [name, group, rsvp, dietary, plusOnes] = parts;
        if (name) {
          imported.push({
            id: `g-import-${Date.now()}-${i}`,
            name,
            group: group || 'General',
            rsvp: (['Invited', 'Yes', 'No', 'Maybe'].includes(rsvp || '') ? rsvp : 'Invited') as Guest['rsvp'],
            dietary: dietary || 'None',
            plusOnes: parseInt(plusOnes || '0', 10) || 0
          });
        }
      }

      if (imported.length > 0) {
        onImportCsv(imported);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // AI Seating & Dietary Split Suggestion
  const handleFetchAiSuggestions = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/guests-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests, eventName, eventType })
      });
      const data = await res.json();
      if (data.ok && data.recommendation) {
        setAiResult(data.recommendation);
        onSaveAiNotes(data.recommendation);
        setShowAiModal(true);
      }
    } catch {
      // Local fallback
      const fallback = `📊 AI Menu Breakdown:\n• Total guests: ${guests.length}\n• Vegetarian/Vegan: ${guests.filter(g => g.dietary.toLowerCase().includes('veg')).length}\n• Allergies noted: ${guests.filter(g => g.dietary !== 'None').length}\n\n🪑 Suggested Seating:\nGroup guests into tables of 8 by affinity (${Array.from(new Set(guests.map(g => g.group))).join(', ')}).`;
      setAiResult(fallback);
      setShowAiModal(true);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Summary Ribbon */}
      <div className="p-4 sm:p-5 rounded-[20px] bg-surface-soft/60 border border-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-0.5">
            RSVP &amp; Headcount Intelligence
          </span>
          <h3 className="font-serif text-lg font-bold text-text">
            Confirmed {confirmedCount} of {totalGuests}, estimated catering headcount {cateringHeadcount}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Includes confirmed RSVPs plus registered plus-ones for accurate kitchen orders.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleFetchAiSuggestions}
            disabled={isAiLoading || guests.length === 0}
            className="px-3.5 py-2 rounded-xl bg-blush text-primary-dark hover:bg-primary hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isAiLoading ? 'Analyzing...' : 'AI Seating & Menu Split'}</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
            aria-label="Upload CSV Guest File"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-white border border-border text-xs font-medium text-text hover:bg-surface-soft transition flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            title="Import guest list from CSV"
          >
            <Upload className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
            <span>Import CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={guests.length === 0}
            className="px-3 py-2 rounded-xl bg-white border border-border text-xs font-medium text-text hover:bg-surface-soft transition flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            title="Export guest list to CSV"
          >
            <Download className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition flex items-center gap-1.5 cursor-pointer shadow-2xs min-h-[44px]"
          >
            <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>+ Add Guest</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-3.5" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guests, group, or dietary..."
            aria-label="Search guests"
            className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white border border-border text-xs text-text placeholder:text-text-muted/60 focus:border-primary outline-none"
          />
        </div>

        {/* Group & RSVP Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-border px-2.5 py-1.5 rounded-xl">
            <Filter className="w-3 h-3 text-text-muted" aria-hidden="true" />
            <label htmlFor="group-select" className="text-[11px] font-semibold text-text-muted">Group:</label>
            <select
              id="group-select"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="bg-transparent text-xs text-text font-medium outline-none cursor-pointer"
            >
              {uniqueGroups.map(grp => (
                <option key={grp} value={grp}>{grp}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white border border-border px-2.5 py-1.5 rounded-xl">
            <label htmlFor="rsvp-select" className="text-[11px] font-semibold text-text-muted">RSVP:</label>
            <select
              id="rsvp-select"
              value={rsvpFilter}
              onChange={(e) => setRsvpFilter(e.target.value)}
              className="bg-transparent text-xs text-text font-medium outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Yes">Yes</option>
              <option value="Invited">Invited</option>
              <option value="Maybe">Maybe</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Guests Table */}
      <div className="overflow-x-auto rounded-[20px] border border-border bg-white shadow-2xs">
        <table className="w-full text-left text-xs sm:text-sm border-collapse" aria-label="Guest list and attendance roster">
          <thead>
            <tr className="bg-surface-soft text-text-muted text-[11px] font-bold uppercase tracking-wider border-b border-border">
              <th className="py-3 px-4">Guest Name</th>
              <th className="py-3 px-3">Affiliation / Group</th>
              <th className="py-3 px-3">RSVP Status</th>
              <th className="py-3 px-3">Dietary Notes</th>
              <th className="py-3 px-3 text-center">Plus-Ones</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-text-muted text-xs">
                  No matching guests found. Click "+ Add Guest" or "Import CSV" to populate.
                </td>
              </tr>
            ) : (
              filteredGuests.map(g => (
                <tr key={g.id} className="hover:bg-bg transition-colors">
                  <td className="py-3 px-4 font-semibold text-text">
                    {g.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-soft border border-border text-plum">
                      {g.group}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={g.rsvp}
                      onChange={(e) => onUpdateGuest(g.id, { rsvp: e.target.value as Guest['rsvp'] })}
                      aria-label={`RSVP status for ${g.name}`}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                        g.rsvp === 'Yes'
                          ? 'bg-sage border-sage text-text'
                          : g.rsvp === 'Maybe'
                          ? 'bg-[#FFF3CD] border-[#FFEEBA] text-[#856404]'
                          : g.rsvp === 'No'
                          ? 'bg-[#FADBD8] border-[#F5B7B1] text-[#922B21]'
                          : 'bg-surface-soft border-border text-text-muted'
                      }`}
                    >
                      <option value="Invited">Invited</option>
                      <option value="Yes">Yes (Attending)</option>
                      <option value="Maybe">Maybe</option>
                      <option value="No">No (Declined)</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-xs text-text-muted">
                    {g.dietary || 'None'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-text">
                    +{g.plusOnes}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(g)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-soft transition cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Edit guest"
                      >
                        <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveGuest(g.id)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-primary-dark hover:bg-blush transition cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Remove guest"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Add/Edit Guest Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-text/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-border shadow-[0_16px_40px_rgba(91,58,87,0.15)] max-w-md w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="font-serif text-lg font-bold text-text">
                {editingGuest ? 'Edit Guest' : 'Add New Guest'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-soft transition cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label htmlFor="form-guest-name" className="font-bold text-text block mb-1">
                  Full Name / Household *
                </label>
                <input
                  id="form-guest-name"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Maya & Arjun Kapoor"
                  className="w-full p-2.5 rounded-xl border border-border bg-surface-soft/40 text-text outline-none focus:border-primary text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="form-guest-group" className="font-bold text-text block mb-1">
                    Group / Side
                  </label>
                  <input
                    id="form-guest-group"
                    type="text"
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value)}
                    placeholder="Family, Friends, VIP..."
                    className="w-full p-2.5 rounded-xl border border-border bg-surface-soft/40 text-text outline-none focus:border-primary text-xs"
                  />
                </div>

                <div>
                  <label htmlFor="form-guest-rsvp" className="font-bold text-text block mb-1">
                    RSVP Status
                  </label>
                  <select
                    id="form-guest-rsvp"
                    value={formRsvp}
                    onChange={(e) => setFormRsvp(e.target.value as Guest['rsvp'])}
                    className="w-full p-2.5 rounded-xl border border-border bg-surface-soft/40 text-text outline-none focus:border-primary text-xs cursor-pointer"
                  >
                    <option value="Invited">Invited</option>
                    <option value="Yes">Yes (Confirmed)</option>
                    <option value="Maybe">Maybe</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="form-guest-dietary" className="font-bold text-text block mb-1">
                    Dietary Requirements
                  </label>
                  <input
                    id="form-guest-dietary"
                    type="text"
                    value={formDietary}
                    onChange={(e) => setFormDietary(e.target.value)}
                    placeholder="Vegetarian, Jain, Nut Allergy..."
                    className="w-full p-2.5 rounded-xl border border-border bg-surface-soft/40 text-text outline-none focus:border-primary text-xs"
                  />
                </div>

                <div>
                  <label htmlFor="form-guest-plusones" className="font-bold text-text block mb-1">
                    Plus-Ones Count
                  </label>
                  <input
                    id="form-guest-plusones"
                    type="number"
                    min="0"
                    max="10"
                    value={formPlusOnes}
                    onChange={(e) => setFormPlusOnes(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2.5 rounded-xl border border-border bg-surface-soft/40 text-text outline-none focus:border-primary text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-soft text-text font-medium hover:bg-border transition cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition cursor-pointer shadow-2xs min-h-[44px]"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. AI Dietary & Seating Recommendations Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-text/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-border shadow-[0_16px_40px_rgba(91,58,87,0.15)] max-w-lg w-full p-6 animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
                <h3 className="font-serif text-lg font-bold text-text">
                  AI Seating &amp; Menu Split Breakdown
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-soft transition cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-surface-soft/60 border border-border text-xs text-text leading-relaxed whitespace-pre-wrap font-sans max-h-[60vh] overflow-y-auto">
              {aiResult}
            </pre>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition cursor-pointer min-h-[44px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
