"use client";

import { useState, useEffect } from "react";

type Ticket = {
  attributes: {
    title: string;
    status: string;
    messages: unknown[];
    createdAt: string;
  };
};

export default function SingleTicketPage({
  params,
}: {
  params: { ticketId: string };
}) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      // Fetch from your new local API route
      const res = await fetch(`/api/tickets/${params.ticketId}`);
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
      }
      setIsLoading(false);
    };
    fetchTicket();
  }, [params.ticketId]);

  if (isLoading) return <p className="text-center p-24">در حال بارگذاری...</p>;
  if (!ticket) return <p className="text-center p-24">تیکت یافت نشد.</p>;

  const { title, status, messages, createdAt } = ticket.attributes;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-right">{title}</h1>
        <p className="text-gray-400 text-right mb-8">
          ایجاد شده در: {new Date(createdAt).toLocaleDateString("fa-IR")}
        </p>

        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                msg.isResponse
                  ? "bg-gray-700 text-left"
                  : "bg-blue-800/50 text-right"
              }`}
            >
              <p className="font-bold text-white mb-2">
                {msg.author?.data?.attributes?.username || "You"}
              </p>
              <p className="whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
