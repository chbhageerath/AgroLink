import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Send } from "lucide-react";

export default function Chat() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    api.get("/messages/threads").then(({ data }) => {
      setThreads(data);
      if (data[0]) setSelected(data[0]);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.get(`/messages/${selected.thread_id}`).then(({ data }) => setMessages(data));
    const t = setInterval(() => {
      api.get(`/messages/${selected.thread_id}`).then(({ data }) => setMessages(data));
    }, 4000);
    return () => clearInterval(t);
  }, [selected]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!text.trim() || !selected) return;
    await api.post("/messages", { receiver_id: selected.other_user_id, content: text });
    setText("");
    const { data } = await api.get(`/messages/${selected.thread_id}`);
    setMessages(data);
  };

  return (
    <div className="min-h-screen bg-earth-bg">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        <h1 className="font-serif text-4xl text-earth-text mb-8">Messages</h1>

        <div className="grid md:grid-cols-3 gap-6 h-[600px]">
          <div className="bg-white rounded-2xl border border-earth-border soft-shadow overflow-y-auto">
            {threads.length === 0 ? (
              <p className="text-sm text-earth-subtle p-6">No conversations yet.</p>
            ) : threads.map(t => (
              <button key={t.thread_id} data-testid={`thread-${t.thread_id}`} onClick={() => setSelected(t)} className={`w-full text-left p-4 border-b border-earth-border hover:bg-earth-muted/50 transition-colors ${selected?.thread_id === t.thread_id ? "bg-earth-muted" : ""}`}>
                <p className="font-medium text-earth-text">{t.other_user_name}</p>
                <p className="text-xs text-earth-subtle truncate mt-1">{t.last_message}</p>
              </button>
            ))}
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl border border-earth-border soft-shadow flex flex-col">
            {selected ? (
              <>
                <div className="p-4 border-b border-earth-border">
                  <p className="font-serif text-lg text-earth-text">{selected.other_user_name}</p>
                  <p className="text-xs text-earth-subtle capitalize">{selected.other_user_role}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(m => (
                    <div key={m.message_id} className={`flex ${m.sender_id === user?.user_id ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${m.sender_id === user?.user_id ? "bg-earth-primary text-white" : "bg-earth-muted text-earth-text"}`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>
                <div className="p-4 border-t border-earth-border flex gap-2">
                  <input data-testid="chat-input" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-full border border-earth-border bg-earth-bg focus:outline-none focus:ring-2 focus:ring-earth-primary" />
                  <button data-testid="chat-send-btn" onClick={send} className="w-10 h-10 rounded-full bg-earth-primary text-white flex items-center justify-center hover:bg-earth-primary/90 active:scale-95 transition-all"><Send size={16} /></button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-earth-subtle">Select a conversation</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
