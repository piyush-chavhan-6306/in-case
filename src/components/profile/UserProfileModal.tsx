import React, { useState, useEffect } from 'react';
import {
  User,
  X,
  ShieldCheck,
  Phone,
  Heart,
  AlertCircle,
  CheckCircle2,
  Download,
  LogOut,
  Sparkles,
  MapPin,
  Users,
  Activity,
  KeyRound,
  Shield,
  FileCheck,
  Save,
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserProfile, VaultData, TrustedShare } from '../../types';
import { getStoredProfile, saveProfile, exportFamilyBackupJSON } from '../../utils/storage';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  vault: VaultData | null;
  shares: TrustedShare[];
  onOpenTour?: () => void;
  onSignOut?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  vault,
  shares,
  onOpenTour,
  onSignOut,
}) => {
  if (!isOpen) return null;

  const userId = user?.id;
  const userEmail = user?.email || 'guardian@example.com';

  const [profile, setProfile] = useState<UserProfile>(() => getStoredProfile(userId, userEmail));
  const [activeTab, setActiveTab] = useState<'details' | 'nominee' | 'medical' | 'security'>('details');
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setProfile(getStoredProfile(userId, userEmail));
  }, [userId, userEmail]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    setProfile(updated);
    saveProfile(updated, userId);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleExportBackup = () => {
    exportFamilyBackupJSON(userId, userEmail);
  };

  // Initials for avatar
  const initials = (profile.fullName || userEmail)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'IN';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200 select-none">
      {/* Background Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/reality_desk_bg.png"
          alt="Warm ambient desk"
          className="w-full h-full object-cover object-center filter blur-[2px] brightness-[0.7] scale-[1.02]"
        />
        <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs" />
      </div>

      {/* Main Porcelain / Warm Ivory Modal */}
      <div
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(253, 248, 240, 0.96) 100%)',
          boxShadow: '0 30px 80px -15px rgba(0,0,0,0.5), 0 15px 40px rgba(245, 158, 11, 0.2), inset 0 2px 4px rgba(255,255,255,0.95)',
        }}
        className="relative z-10 w-full max-w-2xl backdrop-blur-2xl rounded-[36px] sm:rounded-[42px] border-2 border-white p-6 sm:p-8 text-stone-800 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-5 border-b border-[#ebdccb]/70 shrink-0">
          <div className="flex items-center space-x-4">
            {/* User Avatar Circle */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-md shadow-amber-500/30"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ea580c, #d97706)',
              }}
            >
              {initials}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-black text-xl sm:text-2xl text-[#2c2016] tracking-tight">
                  {profile.fullName || 'Family Guardian'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active
                </span>
              </div>
              <p className="text-xs text-[#786b5f] font-mono mt-0.5 truncate max-w-[280px] sm:max-w-md">
                {userEmail} {userId ? `• ID: ${userId.slice(0, 8)}...` : '• Offline Account'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f3ede4] hover:bg-[#ebdccb] text-[#6b5e52] hover:text-[#2c2016] flex items-center justify-center transition border border-[#dfd2c2]/60"
            aria-label="Close profile modal"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-2xl bg-[#f2eae0] p-1 my-4 border border-[#e2d5c5] shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex-1 min-w-[100px] py-2 text-xs font-black rounded-xl transition-all ${
              activeTab === 'details'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Personal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nominee')}
            className={`flex-1 min-w-[100px] py-2 text-xs font-black rounded-xl transition-all ${
              activeTab === 'nominee'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Nominee
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('medical')}
            className={`flex-1 min-w-[100px] py-2 text-xs font-black rounded-xl transition-all ${
              activeTab === 'medical'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Medical
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 min-w-[100px] py-2 text-xs font-black rounded-xl transition-all ${
              activeTab === 'security'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Security & Backup
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#2c2016] uppercase tracking-wider mb-1.5">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-3 rounded-2xl bg-[#f5f0e8] hover:bg-[#f1ebe1] focus:bg-white border border-[#dfd4c4] focus:border-amber-500 text-stone-800 text-sm font-medium focus:outline-none transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#2c2016] uppercase tracking-wider mb-1.5">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={userEmail}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-100 border border-stone-300 text-stone-500 text-sm font-medium cursor-not-allowed opacity-90"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  🔒 Synced with your Supabase secure authentication identity.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#2c2016] uppercase tracking-wider mb-1.5">
                    Primary Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-2xl bg-[#f5f0e8] hover:bg-[#f1ebe1] focus:bg-white border border-[#dfd4c4] focus:border-amber-500 text-stone-800 text-sm font-medium focus:outline-none transition shadow-inner"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Used for emergency dispatch and SMS alerts.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#2c2016] uppercase tracking-wider mb-1.5">
                    Alternate Emergency Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.alternatePhone || ''}
                    onChange={(e) => setProfile({ ...profile, alternatePhone: e.target.value })}
                    placeholder="+91 98111 22334"
                    className="w-full px-4 py-3 rounded-2xl bg-[#f5f0e8] hover:bg-[#f1ebe1] focus:bg-white border border-[#dfd4c4] focus:border-amber-500 text-stone-800 text-sm font-medium focus:outline-none transition shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#2c2016] uppercase tracking-wider mb-1.5">
                  Residential City / State
                </label>
                <input
                  type="text"
                  value={profile.city || ''}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full px-4 py-3 rounded-2xl bg-[#f5f0e8] hover:bg-[#f1ebe1] focus:bg-white border border-[#dfd4c4] focus:border-amber-500 text-stone-800 text-sm font-medium focus:outline-none transition shadow-inner"
                />
              </div>
            </div>
          )}

          {activeTab === 'nominee' && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex items-start space-x-2.5">
                <Users className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Designate your family's principal recipient. During sudden bereavement or incapacitation, this contact is recognized by financial institutions to initiate asset claims.
                </span>
              </div>

              <div>
                <label className="block text-xs font-black text-[#2c2016] uppercase tracking-wider mb-1.5">
                  Primary Nominee Name
                </label>
                <input
                  type="text"
                  value={profile.primaryNomineeName}
                  onChange={(e) => setProfile({ ...profile, primaryNomineeName: e.target.value })}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-4 py-3 rounded-2xl bg-[#f5f0e8] hover:bg-[#f1ebe1] focus:bg-white border border-[#dfd4c4] focus:border-amber-500 text-stone-800 text-sm font-medium focus:outline-none transition shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#2c2016] uppercase tracking-wider mb-1.5">
                    Relationship
                  </label>
                  <select
                    value={profile.primaryNomineeRelation}
                    onChange={(e) => setProfile({ ...profile, primaryNomineeRelation: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#f5f0e8] hover:bg-[#f1ebe1] focus:bg-white border border-[#dfd4c4] focus:border-amber-500 text-stone-800 text-sm font-medium focus:outline-none transition shadow-inner"
                  >
                    <option value="Spouse">Spouse / Partner</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Legal Trust">Family Legal Trust</option>
                    <option value="Other">Other Family Nominee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#2c2016] uppercase tracking-wider mb-1.5">
                    Nominee Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.primaryNomineePhone}
                    onChange={(e) => setProfile({ ...profile, primaryNomineePhone: e.target.value })}
                    placeholder="+91 99220 33445"
                    className="w-full px-4 py-3 rounded-2xl bg-[#f5f0e8] hover:bg-[#f1ebe1] focus:bg-white border border-[#dfd4c4] focus:border-amber-500 text-stone-800 text-sm font-medium focus:outline-none transition shadow-inner"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-rose-900 text-xs leading-relaxed flex items-start space-x-2.5">
                <Activity className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  Immediate medical triage parameters. In an emergency hospital admission, doctors need quick access to blood type and drug contraindications.
                </span>
              </div>

              <div>
                <label className="block text-xs font-black text-[#2c2016] uppercase tracking-wider mb-1.5">
                  Blood Group
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setProfile({ ...profile, bloodGroup: bg })}
                      className={`py-2.5 rounded-xl font-bold text-xs border transition ${
                        profile.bloodGroup === bg
                          ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                          : 'bg-[#f5f0e8] text-stone-700 border-[#dfd4c4] hover:bg-stone-200'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#2c2016] uppercase tracking-wider mb-1.5">
                  Critical Medical Notes & Known Allergies
                </label>
                <textarea
                  rows={3}
                  value={profile.allergiesAndMedicalNotes || ''}
                  onChange={(e) => setProfile({ ...profile, allergiesAndMedicalNotes: e.target.value })}
                  placeholder="e.g. Severe Penicillin allergy. Type-2 Diabetes on Metformin. Asthmatic inhaler required."
                  className="w-full px-4 py-3 rounded-2xl bg-[#f5f0e8] hover:bg-[#f1ebe1] focus:bg-white border border-[#dfd4c4] focus:border-amber-500 text-stone-800 text-sm font-medium focus:outline-none transition shadow-inner"
                />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              {/* Security Health Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <div className="flex items-center space-x-2 text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                    <span>Client-Side Vault</span>
                  </div>
                  <span className={`text-sm font-black ${vault ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {vault ? 'AES-256 Encrypted' : 'Unencrypted Draft'}
                  </span>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {vault ? `${vault.itemCount} protected assets` : 'Create vault in Protect tab'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <div className="flex items-center space-x-2 text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    <span>Shamir Guardians</span>
                  </div>
                  <span className={`text-sm font-black ${shares.length === 3 ? 'text-emerald-700' : 'text-stone-700'}`}>
                    {shares.length === 3 ? '3 Shares (2-of-3 Active)' : `${shares.length} Shares Generated`}
                  </span>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {shares.length === 3 ? 'Polynomial threshold active' : 'Split key in Protect tab'}
                  </p>
                </div>
              </div>

              {/* Action: Download Encrypted Backup */}
              <div className="p-4 rounded-2xl bg-[#faf4ec] border border-[#ebdccb] flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-xs text-stone-800">Complete Offline Backup</h5>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Download encrypted JSON backup including profile, commitments, and documents.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs border border-[#dfd2c2] shadow-2xs flex items-center space-x-1.5 transition active:scale-95 shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>Download JSON</span>
                </button>
              </div>

              {/* Action: Quick Tour */}
              {onOpenTour && (
                <div className="p-4 rounded-2xl bg-[#faf4ec] border border-[#ebdccb] flex items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-xs text-stone-800">Product Tour & Walkthrough</h5>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Replay the interactive guided tour of all 4 IN CASE modules.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenTour();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs border border-[#dfd2c2] shadow-2xs flex items-center space-x-1.5 transition active:scale-95 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Replay Tour</span>
                  </button>
                </div>
              )}

              {/* Action: Sign Out */}
              {onSignOut && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSignOut();
                    }}
                    className="w-full py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Account</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Save Action & Toast */}
        <div className="pt-4 border-t border-[#ebdccb]/70 flex items-center justify-between gap-3 shrink-0 mt-3">
          {savedToast ? (
            <div className="flex items-center space-x-1.5 text-emerald-700 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile details saved securely!</span>
            </div>
          ) : (
            <span className="text-[11px] text-stone-400">
              Last saved: {new Date(profile.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-stone-600 hover:bg-stone-100 transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ea580c] hover:brightness-105 active:scale-95 text-white text-xs font-black shadow-md shadow-amber-500/30 flex items-center space-x-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
