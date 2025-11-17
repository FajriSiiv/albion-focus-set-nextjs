"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { albionFormSchema, type AlbionFormInput } from "@/lib/schema/albion";
import Link from "next/link";
import { AlbionPlayerData, getAllPlayers, savePlayer } from "@/lib/utils/albionStorage";

export default function AlbionFormPage() {
  const [serverMsg, setServerMsg] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [savedPlayers, setSavedPlayers] = useState<AlbionPlayerData[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AlbionFormInput>({
    resolver: zodResolver(albionFormSchema),
    defaultValues: {
      email: "",
      nickname: "",
      focusRightNow: 0,
      region: "europe",
    },
  });

  useEffect(() => {
    setSavedPlayers(getAllPlayers());
  }, []);

  const onSubmit = async (values: AlbionFormInput) => {
    setServerMsg("");

    try {
      const saved = savePlayer(values);
      setSavedPlayers(getAllPlayers());
      setServerMsg(`Data berhasil disimpan! ID: ${saved.id}`);
      setSubmitted(true);
      reset();
    } catch (error: any) {
      setServerMsg(error.message || "Gagal menyimpan data");
    }
  };


  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <div className="h-3 w-14 rounded-full bg-gradient-to-r from-[#473472] to-[#53629E]" />
          <h1 className="text-2xl font-extrabold text-slate-900">Albion Player Form</h1>
        </div>
        <p className="text-slate-600">Isi data player untuk tracking focus</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {submitted && serverMsg ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
            {serverMsg}
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
                {isSubmitting ? "Menyimpan..." : "Simpan Data"}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setServerMsg("");
                  setSubmitted(false);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 hover:bg-slate-50"
              >
                Reset
              </button>
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
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}