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

import {
  loadAppState,
  saveAppState,
  type AppState,
} from './utils/storage';

// ============================================================================
// CẤU HÌNH ĐỒNG BỘ ĐÁM MÂY FIREBASE (PROJECT: trang-9618d)
// ============================================================================
const CANDIDATE_URLS = [
  'https://trang-9618d-default-rtdb.asia-southeast1.firebasedatabase.app',
  'https://trang-9618d-default-rtdb.firebaseio.com',
];

let activeFirebaseUrl = CANDIDATE_URLS[0];
let isSyncingFromCloud = false;
let lastSyncedTimestamp = 0;

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

async function syncToCloud(stateToSync: AppState) {
  if (isSyncingFromCloud) return;
  try {
    const now = Date.now();
    lastSyncedTimestamp = now;

    // Không đẩy phiên đăng nhập cá nhân (currentUserRole/currentAccountId) đè lên máy người khác
    const { currentUserRole, currentAccountId, ...sharedData } = stateToSync;

    const payload = {
      appData: sharedData,
      updatedAt: now,
    };

    await fetch(`${activeFirebaseUrl}/thcs_nenep_data.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Lỗi lưu đám mây Firebase:', err);
  }
}

export default function App() {
  // Khởi tạo trạng thái ứng dụng từ bộ nhớ cục bộ (LocalStorage)
  const [appState, setAppState] = useState<AppState>(loadAppState);

  // Quản lý các view màn hình và trạng thái hiển thị Modal
  const [currentView, setCurrentView] = useState<string>('competition');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountManagerOpen, setIsAccountManagerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Đồng bộ dữ liệu ban đầu từ Firebase Realtime Database khi ứng dụng khởi chạy
  useEffect(() => {
    resolveFirebaseUrl().then((url) => {
      fetch(`${url}/thcs_nenep_data.json`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.appData) {
            isSyncingFromCloud = true;
            setAppState((prev) => ({
              ...prev,
              ...data.appData,
            }));
            isSyncingFromCloud = false;
          }
        })
        .catch((err) => console.error('Lỗi tải dữ liệu từ Firebase:', err));
    });
  }, []);

  // Tự động lưu vào LocalStorage và đẩy lên đám mây khi `appState` thay đổi
  useEffect(() => {
    saveAppState(appState);
    syncToCloud(appState);
  }, [appState]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
      {/* Header điều hướng chính của ứng dụng */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        userRole={appState.currentUserRole}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAccountManager={() => setIsAccountManagerOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Vùng hiển thị nội dung chính theo từng View */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {currentView === 'competition' && (
          <GroupCompetitionView
            students={appState.students}
            weeklyRecords={appState.weeklyRecords}
            classMetadata={appState.classMetadata}
            onUpdateRecords={(newRecords) =>
              setAppState((prev) => ({ ...prev, weeklyRecords: newRecords }))
            }
          />
        )}
        {currentView === 'weekly_table' && (
          <WeeklyScoreTable
            students={appState.students}
            weeklyRecords={appState.weeklyRecords}
          />
        )}
        {currentView === 'morning_duty' && (
          <MorningDutyView
            records={appState.morningDutyRecords}
            students={appState.students}
          />
        )}
        {currentView === 'afternoon_session' && (
          <AfternoonSessionView
            records={appstate_afternoonRecords_fix(appState)}
            students={appState.students}
          />
        )}
        {currentView === 'reports' && (
          <ReportStatsView
            students={appState.students}
            weeklyRecords={appState.weeklyRecords}
          />
        )}
      </main>

      {/* Các hộp thoại Modal hệ thống */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(role) =>
            setAppState((prev) => ({ ...prev, currentUserRole: role }))
          }
        />
      )}

      {isAccountManagerOpen && (
        <AccountManagerModal onClose={() => setIsAccountManagerOpen(false)} />
      )}

      {settingsOpen && (
        <ClassSettingsModal
          metadata={appState.classMetadata}
          onClose={() => setSettingsOpen(false)}
          onSave={(newMeta) =>
            setAppState((prev) => ({ ...prev, classMetadata: newMeta }))
          }
        />
      )}
    </div>
  );
}

// Hàm bổ trợ nhỏ tránh lỗi thiếu thuộc tính nếu state chưa định nghĩa đúng tên
function appstate_afternoonRecords_fix(state: AppState) {
  return (state as any).afternoonRecords || [];
}
