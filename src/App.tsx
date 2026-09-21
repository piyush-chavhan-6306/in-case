import React, { useState, useEffect } from 'react';
import { AppView } from './components/common/Navbar';
import { FloatingNavbar } from './components/landing/FloatingNavbar';
import { CinematicScene } from './components/landing/CinematicScene';
import { ProblemAndPillars } from './components/landing/ProblemAndPillars';
import { CsvUploader } from './components/discover/CsvUploader';
import { DiscoveryCelebration } from './components/discover/DiscoveryCelebration';
import { RiskRadar } from './components/discover/RiskRadar';
import { InventoryList } from './components/discover/InventoryList';
import { EncryptVaultView } from './components/protect/EncryptVaultView';
import { EmergencyCardPrint } from './components/protect/EmergencyCardPrint';
import { UnlockKitModal } from './components/rehearse/UnlockKitModal';
import { FireDrillModal } from './components/rehearse/FireDrillModal';
import { ReadinessScoreView } from './components/rehearse/ReadinessScoreView';
import { EmergencyModeView } from './components/act/EmergencyModeView';
import { AuthPage } from './components/auth/AuthPage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { FinancialDocumentsView } from './components/documents/FinancialDocumentsView';
import { CrisisFinancialManagerView } from './components/manager/CrisisFinancialManagerView';
import { useAuth } from './contexts/AuthContext';
import { OnboardingTourModal } from './components/common/OnboardingTourModal';
import { UserProfileModal } from './components/profile/UserProfileModal';

import { InventoryItem, VaultData, TrustedShare, DrillRecord, FinancialDocument } from './types';
import {
  getStoredItems,
  saveItems,
  getStoredVault,
  saveVault,
  getStoredShares,
  saveShares,
  getStoredDrills,
  recordDrillResult,
  clearVault,
  getStoredDocuments,
  saveDocuments,
  DEFAULT_SAMPLE_DOCS,
  isTourCompleted,
} from './utils/storage';
import { DEFAULT_DISCOVERED_ITEMS, SAMPLE_DRILL_HISTORY } from './utils/sampleData';

export function App() {
  const { user, signOut } = useAuth();
  const userId = user?.id;

  const [currentView, setCurrentView] = useState<AppView>(() => (userId ? 'dashboard' : 'landing'));
  const [items, setItems] = useState<InventoryItem[]>(() => getStoredItems(userId));
  const [vault, setVault] = useState<VaultData | null>(() => getStoredVault(userId));
  const [shares, setShares] = useState<TrustedShare[]>(() => getStoredShares(userId));
  const [drillHistory, setDrillHistory] = useState<DrillRecord[]>(() => getStoredDrills(userId));
  const [documents, setDocuments] = useState<FinancialDocument[]>(() => getStoredDocuments(userId));

  const [isUnlocked, setIsUnlocked] = useState(true);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isFireDrillModalOpen, setIsFireDrillModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeRiskFilter, setActiveRiskFilter] = useState<'nominee' | 'doc' | 'confidence' | null>(null);
  const [discoveredFilename, setDiscoveredFilename] = useState('demo_statement_hdfc_sbi.csv');
  const [isLoadingDiscovery, setIsLoadingDiscovery] = useState(false);

  // Synchronize state when user changes (e.g., login, OAuth redirect, or switch account)
  useEffect(() => {
    setItems(getStoredItems(userId));
    setVault(getStoredVault(userId));
    setShares(getStoredShares(userId));
    setDrillHistory(getStoredDrills(userId));
    setDocuments(getStoredDocuments(userId));

    if (userId) {
      // If user logged in (including via OAuth redirect), switch to dashboard
      if (currentView === 'landing') {
        setCurrentView('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // New user tour check
      if (!isTourCompleted(userId)) {
        setIsTourOpen(true);
      }
    } else {
      // If user logs out, redirect to landing
      if (currentView === 'dashboard' || currentView === 'documents' || currentView === 'manager') {
        setCurrentView('landing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [userId]);

  // Sync items to storage
  const handleUpdateItem = (updated: InventoryItem) => {
    const next = items.map((i) => (i.id === updated.id ? updated : i));
    setItems(next);
    saveItems(next, userId);
  };

  const handleDeleteItem = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    saveItems(next, userId);
  };

  const handleAddItem = (newItem: InventoryItem) => {
    const next = [newItem, ...items];
    setItems(next);
    saveItems(next, userId);
  };

  const handleDiscovered = (discoveredItems: InventoryItem[], filename: string) => {
    setItems(discoveredItems);
    saveItems(discoveredItems, userId);
    setDiscoveredFilename(filename);
    setCurrentView('discover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVaultCreated = (newVault: VaultData, newShares: TrustedShare[]) => {
    setVault(newVault);
    setShares(newShares);
    saveVault(newVault, userId);
    saveShares(newShares, userId);
  };

  const handleUnlocked = (decryptedItems: InventoryItem[]) => {
    setItems(decryptedItems);
    saveItems(decryptedItems, userId);
    setIsUnlocked(true);
    // Demo Journey Step 8 -> Step 9: Launch Fire Drill immediately upon unlock!
    setIsFireDrillModalOpen(true);
  };

  const handleDrillComplete = (record: DrillRecord) => {
    const updated = [record, ...drillHistory];
    setDrillHistory(updated);
    recordDrillResult(record, userId);
  };

  const handleResetData = () => {
    clearVault(userId);
    setVault(null);
    setShares([]);
    setItems(DEFAULT_DISCOVERED_ITEMS);
    saveItems(DEFAULT_DISCOVERED_ITEMS, userId);
    setDrillHistory(SAMPLE_DRILL_HISTORY);
    setIsUnlocked(true);
    setCurrentView('discover');
  };

  return (
    <div
      className={`min-h-screen flex flex-col selection:bg-amber-500/30 ${
        currentView === 'landing' ? 'bg-navy-950 text-slate-100' : 'bg-[#fbf8f2] text-stone-800'
      }`}
    >
      {/* Floating Story-Progress Navbar for non-landing views (Landing uses internal scene-synchronized navbar) */}
      {currentView !== 'landing' && currentView !== 'print' && (
        <FloatingNavbar
          currentView={currentView}
          onNavigate={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          activePillar={
            currentView === 'discover' ? 2 :
            currentView === 'protect' ? 3 :
            currentView === 'rehearse' ? 4 : 1
          }
          onOpenUnlock={() => setIsUnlockModalOpen(true)}
          onResetData={handleResetData}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <UserDashboard
            user={user}
            items={items}
            vault={vault}
            shares={shares}
            drillHistory={drillHistory}
            documents={documents}
            onNavigate={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartDrill={() => setIsFireDrillModalOpen(true)}
            onOpenUnlock={() => setIsUnlockModalOpen(true)}
            onOpenTour={() => setIsTourOpen(true)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {currentView === 'documents' && (
          <div className="w-full bg-gradient-to-b from-[#fbf8f2] via-[#f7f2ea] to-[#f4eee4] text-stone-800 min-h-screen">
            <FinancialDocumentsView
              documents={documents}
              onDocumentsChange={(docs) => {
                setDocuments(docs);
                saveDocuments(docs, userId);
              }}
              userId={userId}
              onNavigateToManager={() => {
                setCurrentView('manager');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {currentView === 'manager' && (
          <div className="w-full bg-gradient-to-b from-[#fbf8f2] via-[#f7f2ea] to-[#f4eee4] text-stone-800 min-h-screen">
            <CrisisFinancialManagerView
              items={items}
              documents={documents}
              onNavigateToDocs={() => {
                setCurrentView('documents');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToProtect={() => {
                setCurrentView('protect');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLaunchFireDrill={() => setIsFireDrillModalOpen(true)}
            />
          </div>
        )}

        {currentView === 'landing' && (
          <div>
            {/* 1,960-Frame Cinematic 3D Scene */}
            <CinematicScene
              onNavigate={(v) => {
                setCurrentView(v);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenUnlock={() => setIsUnlockModalOpen(true)}
              onResetData={handleResetData}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />

            {/* The Problem & 4 Pillars Section directly below */}
            <ProblemAndPillars
              onStartKit={() => {
                setCurrentView('discover');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenUnlock={() => setIsUnlockModalOpen(true)}
            />
          </div>
        )}

        {currentView === 'discover' && (
          <div className="w-full bg-gradient-to-b from-[#fbf8f2] via-[#f7f2ea] to-[#f4eee4] text-stone-800 min-h-screen">
            {/* 1. Full-Width Hero Section matching user design: /discover_hero_bg.jpg with CsvUploader on the desk */}
            <div className="relative w-full min-h-[640px] sm:min-h-[700px] flex items-center justify-center pt-24 sm:pt-28 pb-14 px-4 sm:px-8 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img
                  src="/discover_hero_bg.jpg"
                  alt="Boy with puppy and laptop in sunlit room"
                  className="w-full h-full object-cover object-center transform scale-[1.01]"
                />
                {/* Subtle bottom gradient to blend cleanly into the warm page */}
                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#fbf8f2] via-[#fbf8f2]/60 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 via-black/20 to-transparent" />
              </div>

              {/* Upload Card resting physically on the sunny wooden desk in front of the laptop */}
              <div className="relative z-10 w-full max-w-5xl mx-auto flex justify-center">
                <CsvUploader
                  onDiscovered={handleDiscovered}
                  isLoading={isLoadingDiscovery}
                  setIsLoading={setIsLoadingDiscovery}
                />
              </div>
            </div>

            {/* 2. Lower Discover Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-20">
              {/* Celebratory Breakdown Banner */}
              <DiscoveryCelebration items={items} filename={discoveredFilename} />

              {/* Risk Radar */}
              <RiskRadar
                items={items}
                onFilterRisk={(filter) => setActiveRiskFilter(filter)}
                activeFilter={activeRiskFilter}
              />

              {/* Categorized Inventory Cards List */}
              <InventoryList
                items={items}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onAddItem={handleAddItem}
                onProceedToProtect={() => {
                  setCurrentView('protect');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                activeRiskFilter={activeRiskFilter}
                onClearFilter={() => setActiveRiskFilter(null)}
              />
            </div>
          </div>
        )}

        {currentView === 'protect' && (
          <div className="w-full bg-gradient-to-b from-[#fbf8f2] via-[#f7f2ea] to-[#f4eee4] text-stone-800 min-h-screen">
            {/* Cinematic hero — reality desk / vault scene */}
            <div className="relative w-full min-h-[420px] sm:min-h-[520px] flex items-center justify-center pt-24 sm:pt-28 pb-14 px-4 sm:px-8 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img
                  src="/reality_desk_bg.png"
                  alt="Warm home office desk with safe — protect your documents"
                  className="w-full h-full object-cover object-center scale-[1.02]"
                />
                {/* Dark overlay at top for navbar legibility */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />
                {/* Warm fade into page below */}
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#fbf8f2] via-[#fbf8f2]/70 to-transparent" />
              </div>

              {/* Hero Text over image */}
              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 text-xs font-black uppercase tracking-wider mb-3 shadow-lg">
                  <span>🔒 Module 02 — Vault Protection</span>
                </div>
                <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight drop-shadow-lg mb-2">
                  Protect Your Family's Future
                </h1>
                <p className="text-sm sm:text-base text-white/85 font-semibold drop-shadow leading-relaxed">
                  Encrypt, split, and secure your family's most critical financial documents — accessible only when it truly matters.
                </p>
              </div>
            </div>

            {/* Content below hero */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16 -mt-8 relative z-10">
              <EncryptVaultView
                items={items}
                vault={vault}
                shares={shares}
                userId={userId}
                onVaultCreated={handleVaultCreated}
                onOpenPrintCards={() => setCurrentView('print')}
                onProceedToRehearse={() => {
                  setCurrentView('rehearse');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        )}


        {currentView === 'rehearse' && (
          <div className="w-full bg-gradient-to-b from-[#fbf8f2] via-[#f7f2ea] to-[#f4eee4] text-stone-800 min-h-screen">
            <ReadinessScoreView
              items={items}
              drillHistory={drillHistory}
              onStartDrill={() => setIsFireDrillModalOpen(true)}
              onProceedToPlaybook={() => {
                setCurrentView('emergency');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {currentView === 'emergency' && (
          <div className="w-full bg-gradient-to-b from-[#fbf8f2] via-[#f7f2ea] to-[#f4eee4] text-stone-800 min-h-screen">
            {/* Cinematic hero — urgent family scene */}
            <div className="relative w-full min-h-[420px] sm:min-h-[520px] flex items-center justify-center pt-24 sm:pt-28 pb-14 px-4 sm:px-8 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img
                  src="/unlock_family_bg.jpg"
                  alt="Family emergency readiness scene"
                  className="w-full h-full object-cover object-center scale-[1.02]"
                />
                {/* Urgent warm-red tint overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-orange-900/20 to-transparent" />
                {/* Dark top overlay for navbar */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
                {/* Warm fade into page below */}
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#fbf8f2] via-[#fbf8f2]/70 to-transparent" />
              </div>

              {/* Hero Text */}
              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-500/20 backdrop-blur-sm text-white border border-red-400/40 text-xs font-black uppercase tracking-wider mb-3 shadow-lg">
                  <span>🚨 Module 04 — Emergency Action Playbook</span>
                </div>
                <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight drop-shadow-lg mb-2">
                  Your Family's Safety Net
                </h1>
                <p className="text-sm sm:text-base text-white/85 font-semibold drop-shadow leading-relaxed">
                  Step-by-step playbooks for the first 24 hours, 7 days, and 30 days — guided by grounded AI assistance.
                </p>
              </div>
            </div>

            {/* Content below hero */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16 -mt-8 relative z-10">
              <EmergencyModeView
                items={items}
                onOpenPrintCards={() => setCurrentView('print')}
                onExitEmergencyMode={() => {
                  setCurrentView('discover');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        )}


        {currentView === 'print' && (
          <EmergencyCardPrint
            shares={shares}
            onBack={() => setCurrentView('protect')}
          />
        )}
      </main>

      {/* Global Modals */}
      <UnlockKitModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        vault={vault}
        shares={shares}
        onUnlocked={handleUnlocked}
        userId={userId}
        onNavigateToProtect={() => {
          setCurrentView('protect');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <FireDrillModal
        isOpen={isFireDrillModalOpen}
        onClose={() => setIsFireDrillModalOpen(false)}
        items={items}
        userId={userId}
        onDrillComplete={handleDrillComplete}
      />

      {/* Pixar-Style Supabase Auth Modal */}
      {isAuthModalOpen && (
        <AuthPage
          onSuccess={() => {
            setIsAuthModalOpen(false);
            setCurrentView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {/* User Family Profile & Nominee Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        vault={vault}
        shares={shares}
        onOpenTour={() => {
          setIsProfileModalOpen(false);
          setIsTourOpen(true);
        }}
        onSignOut={async () => {
          setIsProfileModalOpen(false);
          await signOut();
          setCurrentView('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive New User Onboarding Tour Modal */}
      <OnboardingTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        userId={userId}
        onNavigate={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      {currentView !== 'print' && (
        <footer
          className={`w-full py-8 px-6 sm:px-12 text-center text-xs no-print ${
            currentView === 'landing'
              ? 'bg-navy-950 border-t border-slate-900 text-slate-500'
              : 'bg-[#f3ede3] border-t border-[#e5dcd1] text-[#786b5f]'
          }`}
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight">IN CASE</span>
              <span>•</span>
              <span className="font-medium">Local-First Family Contingency System</span>
            </div>
            <div className="flex items-center space-x-4 text-[11px] font-medium">
              <span>Zero Knowledge</span>
              <span>•</span>
              <span>Client-Side WebCrypto AES-256</span>
              <span>•</span>
              <span>Shamir 2-of-3 Secret Sharing</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
