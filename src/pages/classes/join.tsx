import { useState } from "react";
import { useNavigate } from "react-router";
import { useNotification } from "@refinedev/core";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BACKEND_BASE_URL } from "@/constants";

const ClassesJoin = () => {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { open } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!code.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}classes/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: code.trim() }),
      });

      const json = await response.json();

      if (!response.ok) {
        open?.({
          type: "error",
          message: "Unable to join class",
          description: json?.error ?? "Please check the code and try again.",
        });
        return;
      }

      open?.({
        type: "success",
        message: "Joined class!",
        description: `You're now enrolled in ${json.data.className}.`,
      });

      navigate(`/classes/show/${json.data.classId}`);
    } catch (error) {
      console.error("Join class error:", error);
      open?.({
        type: "error",
        message: "Unable to join class",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "px-6",
        "py-16",
      )}
    >
      <Card className={cn("sm:w-105", "p-8")}>
        <CardHeader className={cn("px-0")}>
          <CardTitle className={cn("text-2xl", "font-semibold")}>
            Join a class
          </CardTitle>
          <CardDescription>
            Ask your teacher for the invite code and enter it below.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className={cn("px-0", "pt-6")}>
          <form onSubmit={handleSubmit} className={cn("flex", "flex-col", "gap-4")}>
            <div className={cn("flex", "flex-col", "gap-2")}>
              <Label htmlFor="code">Invite code</Label>
              <Input
                id="code"
                placeholder="e.g. X7K2QM"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                autoFocus
                required
                className={cn("uppercase", "tracking-widest", "text-center")}
              />
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className={cn("flex", "items-center", "gap-2")}>
                  Joining...
                  <Loader2 className={cn("h-4", "w-4", "animate-spin")} />
                </span>
              ) : (
                "Join Class"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassesJoin;