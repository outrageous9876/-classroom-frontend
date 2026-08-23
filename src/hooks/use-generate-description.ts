import { useState } from "react";
import { useNotification } from "@refinedev/core";

import { BACKEND_BASE_URL } from "@/constants";

type GenerateDescriptionParams = {
  type: "class" | "subject";
  name: string;
  context?: string;
};

export const useGenerateDescription = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { open } = useNotification();

  const generateDescription = async ({
    type,
    name,
    context,
  }: GenerateDescriptionParams): Promise<string | null> => {
    if (!name.trim()) {
      open?.({
        type: "error",
        message: "Name required",
        description: "Enter a name before generating a description.",
      });
      return null;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}ai/generate-description`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ type, name, context }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        open?.({
          type: "error",
          message: "Unable to generate description",
          description: json?.error ?? "Please try again.",
        });
        return null;
      }

      return json.data.description as string;
    } catch (error) {
      console.error("Generate description error:", error);
      open?.({
        type: "error",
        message: "Unable to generate description",
        description: "Something went wrong. Please try again.",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateDescription, isGenerating };
};
