// @ts-ignore - IDE TS Server cache issue workaround
import { clsx } from "clsx";
// @ts-ignore - IDE TS Server cache issue workaround
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
