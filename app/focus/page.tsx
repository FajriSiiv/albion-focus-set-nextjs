"use client"

import { calculateFocus, DAILY_GAIN, MAX_FOCUS } from '@/lib/utils/focusCalculator';
import { getAllPlayers, deletePlayer, type AlbionPlayerData, updateFocusByTime } from '@/lib/utils/albionStorage';
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link';
import { checkAndNotifyFullFocus, disableNotification, enableNotification, isNotificationEnabled, registerServiceWorker, requestNotificationPermission } from '@/lib/utils/notification';

// Helper untuk format number 
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Albion = () => {
  const [currentFocus, setCurrentFocus] = useState(8529);
  const [targetFocus, setTargetFocus] = useState(MAX_FOCUS);
  const [dailyGain, setDailyGain] = useState(DAILY_GAIN);
  const [mounted, setMounted] = useState(false);
  const [savedPlayers, setSavedPlayers] = useState<AlbionPlayerData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setMounted(true);
    // setSavedPlayers(getAllPlayers());
    loadAndUpdatePlayers();
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    if (typeof window === 'undefined') return;

    // Register service worker
    await registerServiceWorker();

    // Check permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      setNotificationEnabled(isNotificationEnabled());
    }

    // Check focus setiap 5 menit
    const interval = setInterval(() => {
      updateFocusByTime(DAILY_GAIN);
      checkAndNotifyFullFocus();
      loadAndUpdatePlayers();
    }, 5 * 60 * 1000); // 5 menit

    // Check sekali saat load
    checkAndNotifyFullFocus();

    return () => clearInterval(interval);
  };

  const loadAndUpdatePlayers = () => {
    const updatedCount = updateFocusByTime(DAILY_GAIN);
    const players = getAllPlayers();
    setSavedPlayers(players);

    // Check dan notify jika ada yang full
    checkAndNotifyFullFocus();

    if (updatedCount > 0) {
      setLastUpdate(`Updated ${updatedCount} player(s) - ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`);
      setTimeout(() => setLastUpdate(""), 3000);
    }
  };

  // Refresh players list (bisa dipanggil setelah delete)
  const refreshPlayers = () => {
    loadAndUpdatePlayers();
  };

  // Toggle notification
  const handleToggleNotification = async () => {
    if (notificationPermission === 'default') {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setNotificationEnabled(true);
      }
    } else if (notificationPermission === 'granted') {
      if (notificationEnabled) {
        disableNotification();
        setNotificationEnabled(false);
      } else {
        enableNotification();
        setNotificationEnabled(true);
      }
    }
  };  

  const handleTestNotification = () => {
    if (Notification.permission !== 'granted') {
      alert('Notification permission belum diberikan. Enable notification terlebih dahulu.');
      return;
    }

    // Test dengan notifikasi yang mirip dengan notifikasi real
    new Notification('🎉 Test Notification!', {
      body: 'Notifikasi berfungsi dengan baik! Anda akan mendapat notifikasi saat focus player mencapai 30,000.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'test-notification',
      requireInteraction: false,
      vibrate: [200, 100, 200],
    } as any);
  };



  const result = useMemo(
    () => calculateFocus(currentFocus, targetFocus, dailyGain),
    [currentFocus, targetFocus, dailyGain]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
       <Link
            href="/"
            className="absolute top-5 left-5 rounded-xl bg-gradient-to-r from-[#473472] to-[#53629E] px-4 py-2 text-sm font-extrabold text-white shadow-md transition hover:shadow-lg"
          >
            Kembali 
          </Link>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="h-3 w-14 rounded-full bg-gradient-to-r from-[#473472] to-[#53629E]" />
            <h1 className="text-2xl font-extrabold text-slate-900">Albion Focus Calculator</h1>
          </div>
          <p className="text-slate-600">Hitung berapa lama untuk cap focus maksimal</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Notification Toggle */}
          {mounted && typeof window !== 'undefined' && 'Notification' in window && (
            <button
              onClick={handleToggleNotification}
              className={`rounded-xl px-4 py-2 text-sm font-extrabold shadow-md transition ${
                notificationEnabled && notificationPermission === 'granted'
                  ? 'bg-gradient-to-r from-[#473472] to-[#53629E] text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              title={
                notificationPermission === 'denied'
                  ? 'Notification permission denied. Enable in browser settings.'
                  : notificationEnabled
                  ? 'Disable notifications'
                  : 'Enable notifications for full focus alerts'
              }
            >
              {notificationEnabled && notificationPermission === 'granted' ? '🔔 On' : '🔕 Off'}
            </button>
          )}


          {/* {notificationEnabled && notificationPermission === 'granted' && (
                <button
                  onClick={handleTestNotification}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-600"
                  title="Test notification untuk memastikan notifikasi berfungsi"
                >
                  🧪 Test
                </button>
          )} */}
          <Link
            href="/focus/add-albion"
            className="rounded-xl bg-gradient-to-r from-[#473472] to-[#53629E] px-4 py-2 text-sm font-extrabold text-white shadow-md transition hover:shadow-lg"
          >
            + Tambah Player
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Saved Players List */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">
              Players ({savedPlayers.length})
            </h2>
            {savedPlayers.length > 0 && (
              <div className="flex items-center gap-2">
                {lastUpdate && (
                  <span className="text-xs text-emerald-600 font-semibold">
                    {lastUpdate}
                  </span>
                )}
                <button
                  onClick={refreshPlayers}
                  className="text-xs font-semibold text-[#53629E] hover:underline"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>

          {savedPlayers.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500 mb-4">Belum ada player yang tersimpan</p>
              <Link
                href="/focus/add-albion"
                className="inline-block rounded-xl bg-gradient-to-r from-[#473472] to-[#53629E] px-4 py-2 text-sm font-extrabold text-white shadow-md transition hover:shadow-lg"
              >
                Tambah Player Pertama
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[700px] overflow-y-auto">
              {savedPlayers.map((player) => {
                const playerCalc = calculateFocus(player.focusRightNow, MAX_FOCUS, DAILY_GAIN);
                return (
                  <div
                    key={player.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 text-lg">{player.nickname}</div>
                        <div className="text-xs text-slate-500 mt-1">{player.email}</div>
                      </div>
                      <span className="rounded-full bg-[#473472] px-3 py-1 text-xs font-semibold text-white capitalize">
                        {player.region}
                      </span>
                    </div>

                    <div className="grid gap-2 rounded-lg bg-white p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Focus Sekarang:</span>
                        <span className="font-bold text-slate-900">
                          {formatNumber(player.focusRightNow)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Sisa ke 30k:</span>
                        <span className="font-bold text-rose-600">
                          {formatNumber(playerCalc.remaining)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                        <span className="text-sm font-semibold text-slate-700">Waktu Cap:</span>
                        <span className="text-lg font-extrabold text-[#473472]">
                          {playerCalc.hoursNeeded}j {playerCalc.minutesNeeded}m
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-slate-500">
                            {playerCalc.progressPercent.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#473472] to-[#53629E] transition-all"
                            style={{ width: `${playerCalc.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <Link
                          href={`/focus/edit/${player.id}`}
                          className="text-[#53629E] hover:text-[#473472] font-semibold"
                        >
                          Edit
                        </Link>
                      <span>
                        {new Date(player.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus player ${player.nickname}?`)) {
                            deletePlayer(player.id);
                            refreshPlayers();
                          }
                        }}
                        className="text-rose-600 hover:text-rose-700 font-semibold"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
    </div>
  )
}

export default Albion