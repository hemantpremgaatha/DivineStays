"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Faq = {
  id: string;
  question: string;
  answer: string;
};

export default function FaqsManager({ propertyId, faqs }: { propertyId: string; faqs: Faq[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function addFaq(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAdding(true);
    const data = new FormData(e.currentTarget);
    await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        question: data.get("question"),
        answer: data.get("answer"),
      }),
    }).catch(() => {});
    formRef.current?.reset();
    setAdding(false);
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" }).catch(() => {});
    router.refresh();
  }

  return (
    <div>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="rounded-xl border border-[#e7e0d4] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{faq.question}</p>
              <button onClick={() => remove(faq.id)} className="text-xs text-red-600 underline">
                Delete
              </button>
            </div>
            <p className="mt-1 text-sm text-[#6f6a61]">{faq.answer}</p>
          </div>
        ))}
        {faqs.length === 0 && <p className="text-sm text-[#8a8378]">No FAQs yet.</p>}
      </div>

      <form ref={formRef} onSubmit={addFaq} className="mt-4 grid gap-2 rounded-xl border border-dashed border-[#e7e0d4] p-4">
        <input name="question" required placeholder="Question" className="rounded-lg border border-[#e7e0d4] px-3 py-2 text-sm" />
        <textarea name="answer" required placeholder="Answer" rows={2} className="rounded-lg border border-[#e7e0d4] px-3 py-2 text-sm" />
        <button disabled={adding} className="rounded-lg bg-[#1b1a18] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {adding ? "Adding…" : "Add FAQ"}
        </button>
      </form>
    </div>
  );
}
