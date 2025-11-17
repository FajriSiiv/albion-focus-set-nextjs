import { z } from "zod";

export const regionEnum = z.enum(["europe", "asia", "west"], {
  error: "Pilih region: europe, asia, atau west",
});

export const albionFormSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  nickname: z
    .string()
    .min(3, "Nickname minimal 3 karakter")
    .max(20, "Nickname maksimal 20 karakter"),
  focusRightNow: z
    .number()
    .min(0, "Focus tidak boleh negatif")
    .max(30000, "Focus maksimal 30,000"),
  region: regionEnum,
});

export type AlbionFormInput = z.infer<typeof albionFormSchema>;
