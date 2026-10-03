import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GroupCompetitionView } from './components/GroupCompetitionView';
import { WeeklyScoreTable } from './components/WeeklyScoreTable';
import { MorningDutyView } from './components/MorningDutyView';
import { AfternoonSessionView } from './components/AfternoonSessionView';
import { ReportStatsView } from './components/ReportStatsView';
import { ClassSettingsModal } from './components/ClassSettingsModal';
import { AuthModal } from './components/AuthModal';
import { AccountManagerModal } from './components/AccountManagerModal';

import { loadAppState, saveAppState } from './utils/storage';

// ============================================================================
// CẤU HÌNH ĐỒNG BỘ ĐÁM MÂY FIREBASE (PROJECT: trang-9618d)
// ============================================================================
const CANDIDATE_URLS = [
  'https://trang-9618d-default-rtdb.asia-southeast1.firebasedatabase.app',
  'https://trang-9618d-default-rtdb.firebaseio.com',
];

let activeFirebaseUrl = CANDIDATE_URLS[0];
let isSyncingFromCloud = false;

async function resolveFirebaseUrl(): Promise<string> {
  for (const url of CANDIDATE_URLS) {
    try {
      const res = await fetch(`${url}/thcs_nenep_data.json`, { method: 'GET' });
      if (res.ok) {
        activeFirebaseUrl = url;
        return url;
      }
    } catch {
      // Thử link tiếp theo
    }
  }
  return activeFirebaseUrl;
}

async function syncToCloud(stateToSync: any) {
  if (isSyncingFromCloud) return;
  try {
    const now = Date.now();
    const { currentUserRole, currentAccountId, ...sharedData } = stateToSync || {};

    await fetch(`${activeFirebaseUrl}/thcs_nenep_data.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appData: sharedData,
        updatedAt: now,
      }),
    });
  } catch (err) {
    console.error('Lỗi lưu đám mây Firebase:', err);
  }
}

export default function App() {
  const [appState, setAppState] = useState<any>(() => {
    try {
      return loadAppState() || {};
    } catch {
      return {};
    }
  });

  const [currentView, setCurrentView] = useState<string>('competition');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountManagerOpen, setIsAccountManagerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    resolveFirebaseUrl().then((url) => {
      fetch(`${url}/thcs_nenep_data.json`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.appData) {
            isSyncingFromCloud = true;
            setAppState((prev: any) => ({
              ...prev,
              ...data.appData,
            }));
            isSyncingFromCloud = false;
          }
        })
        .catch((err) => console.error('Lỗi tải dữ liệu từ Firebase:', err));
    });
  }, []);

  useEffect(() => {
    try {
      saveAppState(appState);
      syncToCloud(appState);
    } catch (e) {
      console.error(e);
    }
  }, [appState]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        userRole={appState?.currentUserRole}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAccountManager={() => setIsAccountManagerOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {currentView === 'competition' && (
          <GroupCompetitionView
            students={appState?.students || []}
            weeklyRecords={appState?.weeklyRecords || []}
            classMetadata={appState?.classMetadata || {}}
            onUpdateRecords={(newRecords: any) =>
              setAppState((prev: any) => ({ ...prev, weeklyRecords: newRecords }))
            }
          />
        )}
        {currentView === 'weekly_table' && (
          <WeeklyScoreTable
            students={appState?.students || []}
            weeklyRecords={appState?.weeklyRecords || []}
          />
        )}
        {currentView === 'morning_duty' && (
          <MorningDutyView
            records={appState?.morningDutyRecords || []}
            students={appState?.students || []}
          />
        )}
        {currentView === 'afternoon_session' && (
          <AfternoonSessionView
            records={appState?.afternoonRecords || []}
            students={appState?.students || []}
          />
        )}
        {currentView === 'reports' && (
          <ReportStatsView
            students={appState?.students || []}
            weeklyRecords={appState?.weeklyRecords || []}
          />
        )}
      </main>

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(role: any) =>
            setAppState((prev: any) => ({ ...prev, currentUserRole: role }))
          }
        />
      )}

      {isAccountManagerOpen && (
        <AccountManagerModal onClose={() => setIsAccountManagerOpen(false)} />
      )}

      {settingsOpen && (
        <ClassSettingsModal
          metadata={appState?.classMetadata || {}}
          onClose={() => setSettingsOpen(false)}
          onSave={(newMeta: any) =>
            setAppState((prev: any) => ({ ...prev, classMetadata: newMeta }))
          }
        />
      )}
    </div>
  );
}
