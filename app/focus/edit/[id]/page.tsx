"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { albionFormSchema, type AlbionFormInput } from "@/lib/schema/albion";
import { getPlayerById, updatePlayer, type AlbionPlayerData } from "@/lib/utils/albionStorage";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const playerId = params.id as string;
  
  const [player, setPlayer] = useState<AlbionPlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverMsg, setServerMsg] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AlbionFormInput>({
    resolver: zodResolver(albionFormSchema),
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const playerData = getPlayerById(playerId);
      if (playerData) {
        setPlayer(playerData);
        reset({
          email: playerData.email,
          nickname: playerData.nickname,
          focusRightNow: playerData.focusRightNow,
          region: playerData.region,
        });
      } else {
        setServerMsg("Player tidak ditemukan");
      }
      setLoading(false);
    }
  }, [playerId, reset]);

  const onSubmit = async (values: AlbionFormInput) => {
    setServerMsg("");
    
    try {
      const updated = updatePlayer(playerId, values);
      if (updated) {
        setServerMsg(`Data berhasil diupdate!`);
        setSubmitted(true);
        setTimeout(() => {
          router.push("/focus");
        }, 1500);
      } else {
        setServerMsg("Gagal mengupdate data");
      }
    } catch (error: any) {
      setServerMsg(error.message || "Gagal mengupdate data");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-rose-800 mb-4">Player tidak ditemukan</p>
          <Link
            href="/focus"
            className="inline-block rounded-xl bg-gradient-to-r from-[#473472] to-[#53629E] px-4 py-2 text-sm font-extrabold text-white shadow-md"
          >
            Kembali ke Calculator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <div className="h-3 w-14 rounded-full bg-gradient-to-r from-[#473472] to-[#53629E]" />
          <h1 className="text-2xl font-extrabold text-slate-900">Edit Player</h1>
        </div>
        <p className="text-slate-600">Edit data player: {player.nickname}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {submitted && serverMsg ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
            {serverMsg}
            <div className="mt-2 text-sm">Mengalihkan ke halaman utama...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            {/* Email */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-800">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="player@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[#53629E]/40 focus:ring-2"
              />
              {errors.email && (
                <p className="text-sm font-medium text-rose-600">{errors.email.message}</p>
              )}
            </div>

            {/* Nickname */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-800">
                Nickname <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register("nickname")}
                placeholder="Masukkan nickname"
                maxLength={20}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[#53629E]/40 focus:ring-2"
              />
              {errors.nickname && (
                <p className="text-sm font-medium text-rose-600">{errors.nickname.message}</p>
              )}
            </div>

            {/* Focus Right Now */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-800">
                Focus Right Now <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="30000"
                {...register("focusRightNow", { valueAsNumber: true })}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg font-bold text-slate-900 outline-none ring-[#53629E]/40 focus:ring-2"
              />
              {errors.focusRightNow && (
                <p className="text-sm font-medium text-rose-600">
                  {errors.focusRightNow.message}
                </p>
              )}
              <p className="text-xs text-slate-500">Maksimal 30,000 focus</p>
            </div>

            {/* Region */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-800">
                Region <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("region")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[#53629E]/40 focus:ring-2"
              >
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="west">West</option>
              </select>
              {errors.region && (
                <p className="text-sm font-medium text-rose-600">{errors.region.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-r from-[#473472] to-[#53629E] px-6 py-3 font-extrabold text-white shadow-md transition hover:shadow-lg disabled:opacity-75"
              >
                {isSubmitting ? "Mengupdate..." : "Update Data"}
              </button>
              <Link
                href="/focus"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 hover:bg-slate-50"
              >
                Batal
              </Link>
            </div>

            {serverMsg && !submitted && (
              <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-800">
                {serverMsg}
              </div>
            )}
          </form>
        )}

        <div className="mt-6 border-t border-slate-200 pt-4">
          <Link
            href="/focus"
            className="text-sm font-semibold text-[#53629E] hover:underline"
          >
            ← Kembali ke Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}