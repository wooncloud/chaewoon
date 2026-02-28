"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      await login(username, password);
      router.push("/admin");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold pearl-text">채운 彩雲</h1>
          <p className="mt-2 text-sm text-neutral-500">관리자 로그인</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm text-neutral-400">
                <User className="h-3.5 w-3.5" />
                아이디
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
                autoComplete="username"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm text-neutral-400">
                <Lock className="h-3.5 w-3.5" />
                비밀번호
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-6 w-full"
            disabled={isLoading || !username.trim() || !password.trim()}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
