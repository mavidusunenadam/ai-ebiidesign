export type StyleKey =
  | "rockwell"
  | "ghibli"
  | "anime"
  | "caricature";

export type StyleResult = {
  key: StyleKey;
  label: string;
  prompt: string;
  url: string;
};

export type GenerateStylesResponse = {
  success: boolean;
  originalUrl?: string;
  results?: StyleResult[];
  error?: string;
};