"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Mail, Phone } from "lucide-react";
import { fetchContacts, showApiError } from "@/lib/api";
import { ContactMessage } from "@/types";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts()
      .then(setContacts)
      .catch(showApiError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="pearl-text">로딩 중...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <MessageSquare className="h-6 w-6" />
        <h1 className="text-xl font-bold">문의 관리</h1>
        <span className="text-sm text-muted">({contacts.length}건)</span>
      </div>

      {contacts.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 text-muted">
          <MessageSquare className="h-10 w-10 opacity-50" />
          <p className="text-sm">접수된 문의가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="font-semibold">{c.name}</span>
                <span className="flex items-center gap-1 text-muted">
                  <Mail className="h-3.5 w-3.5" />
                  {c.email}
                </span>
                {c.phone && (
                  <span className="flex items-center gap-1 text-muted">
                    <Phone className="h-3.5 w-3.5" />
                    {c.phone}
                  </span>
                )}
                <span className="ml-auto text-xs text-muted">
                  {new Date(c.createdAt).toLocaleString("ko-KR")}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
                {c.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
