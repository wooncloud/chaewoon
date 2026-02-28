"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendContact, showApiError } from "@/lib/api";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await sendContact({
        name,
        email,
        phone: phone || undefined,
        message,
      });
      setSubmitted(true);
    } catch (err) {
      showApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <CheckCircle className="h-16 w-16 text-emerald-400" />
        </motion.div>
        <h1 className="text-xl font-bold">문의가 접수되었습니다</h1>
        <p className="text-center text-sm text-muted">
          확인 후 빠른 시일 내에 답변드리겠습니다.
          <br />
          감사합니다.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mb-2 text-2xl font-bold">문의하기</h1>
        <p className="mb-8 text-sm text-muted">
          작품에 대한 문의, 주문 관련 질문, 또는 커스텀 제작 요청 등 무엇이든
          편하게 남겨주세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              이름 <span className="text-rose-400">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              이메일 <span className="text-rose-400">*</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              전화번호 <span className="text-xs text-muted">(선택)</span>
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              문의 내용 <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="문의하실 내용을 입력해주세요. (최소 10자)"
              required
              minLength={10}
              maxLength={2000}
              rows={6}
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
            <p className="mt-1 text-right text-xs text-muted">
              {message.length}/2000
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            <Send className="mr-2 h-4 w-4" />
            {submitting ? "전송 중..." : "문의 보내기"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
