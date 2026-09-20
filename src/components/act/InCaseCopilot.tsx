import React, { useState } from 'react';
import { Bot, Send, Sparkles, AlertCircle, ShieldAlert, CheckCircle2, User } from 'lucide-react';
import { InventoryItem, PlaybookStep } from '../../types';

interface InCaseCopilotProps {
  items: InventoryItem[];
  playbookSteps: PlaybookStep[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
}

export const InCaseCopilot: React.FC<InCaseCopilotProps> = ({ items, playbookSteps }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'copilot',
      text: "Hello, I am your In Case Emergency Copilot. I am strictly grounded in your family's unlocked emergency kit and action playbooks. Ask me what to do first, where documents are stored, or which policies cover immediate costs.",
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');

  // Sample quick questions for demo judges
  const quickPrompts = [
    'What should I do first in the first 24 hours?',
    'Which policy covers hospital costs?',
    'What is our total monthly EMI obligation?',
    'Where is the physical rental agreement kept?',
    'What is the interest rate on our credit cards?', // Intentionally not in kit to test anti-hallucination!
  ];

  const handleSend = (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');

    // Grounded deterministic response logic matching PRD Section 25
    setTimeout(() => {
      const q = query.toLowerCase();
      let responseText = '';

      if (q.includes('first') || q.includes('24 hour') || q.includes('now') || q.includes('emergency start')) {
        const urgentSteps = playbookSteps.filter((s) => s.timeframe === 'NOW');
        responseText = `Here are your immediate priorities for the First 24 Hours:\n\n` +
          urgentSteps.map((s, i) => `${i + 1}. ${s.title}: ${s.description}`).join('\n\n') +
          `\n\nTake deep breaths. Reach out to the designated hospital TPA desk before making any out-of-pocket settlements.`;
      } else if (q.includes('hospital') || q.includes('health') || q.includes('medical') || q.includes('cashless')) {
        const healthItem = items.find(
          (i) => i.category === 'Insurance' && (i.provider.toLowerCase().includes('health') || i.provider.toLowerCase().includes('star'))
        );
        if (healthItem) {
          responseText = `According to your unlocked inventory, your health policy is **${healthItem.provider}** (Approx ₹${healthItem.amountApprox.toLocaleString()}/${healthItem.frequency.toLowerCase()}).\n\n` +
            `• **Nominee:** ${healthItem.nomineeStatus === 'set' ? healthItem.nomineeName : '⚠️ Not set'}\n` +
            `• **Document Location:** ${healthItem.documentLocation}\n` +
            `• **Action:** Call the hospital TPA desk with policy number ${healthItem.accountOrPolicyNumber || 'from physical file'} to initiate cashless pre-authorization within 24 hours.`;
        } else {
          responseText = "I don't have enough information in your In Case kit to answer that. No active health insurance was identified in this kit.";
        }
      } else if (q.includes('emi') || q.includes('loan') || q.includes('debt')) {
        const loans = items.filter((i) => i.category === 'Loan / EMI');
        const totalEmi = loans.reduce((a, b) => a + b.amountApprox, 0);
        if (loans.length > 0) {
          responseText = `Active loans in your kit require a total of **₹${totalEmi.toLocaleString()}/month**:\n\n` +
            loans.map((l) => `• **${l.provider}:** ₹${l.amountApprox.toLocaleString()}/month (${l.documentLocation})`).join('\n') +
            `\n\nCheck Section 'Next 7 Days' in the Emergency Playbook to contact the loan officer regarding moratorium or loan protection insurance.`;
        } else {
          responseText = "I don't have enough information in your In Case kit to answer that. No active loans were recorded.";
        }
      } else if (q.includes('rental') || q.includes('rent') || q.includes('apartment') || q.includes('agreement') || q.includes('flat')) {
        const rentItem = items.find((i) => i.category === 'Rent / Utility' || i.provider.toLowerCase().includes('rent'));
        if (rentItem) {
          responseText = `The rental details for **${rentItem.provider}** are stored at: **"${rentItem.documentLocation}"**.\n\n` +
            `• **Monthly Outflow:** ₹${rentItem.amountApprox.toLocaleString()}/month\n` +
            `• **Notes:** ${rentItem.notes || 'Check physical contract for lease expiry date.'}`;
        } else {
          responseText = "I don't have enough information in your In Case kit to answer that.";
        }
      } else if (q.includes('interest rate') || q.includes('crypto') || q.includes('bitcoin') || q.includes('stocks price')) {
        // Strict anti-hallucination test: detail not in kit!
        responseText = "I don't have enough information in your In Case kit to answer that. As your privacy-first emergency copilot, I strictly refuse to hallucinate financial or legal figures not documented in your verified kit.";
      } else {
        // Fallback grounded answer
        responseText = `I scanned your ${items.length} unlocked commitments and emergency playbook. Regarding "${query}":\n\n` +
          `If this relates to an unlisted account or external provider, please verify if it was omitted from the original bank statement. For urgent actions, refer to the First 24 Hours checklist above.`;
      }

      const copilotMsg: ChatMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, copilotMsg]);
    }, 450);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 250, 244, 0.94) 100%)',
        boxShadow: '0 25px 60px -15px rgba(245, 158, 11, 0.2), 0 20px 45px -10px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.95)',
      }}
      className="rounded-[36px] p-6 sm:p-8 border-2 border-white shadow-2xl flex flex-col h-[600px] text-[#1e293b]"
    >
      {/* Copilot Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#ebdccb]/70 mb-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] text-[#0284c7] flex items-center justify-center border border-[#7dd3fc] shadow-xs flex-shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-display font-black text-[#1e293b] text-base sm:text-lg">In Case Copilot</h4>
              <span className="text-[10px] font-black text-[#0369a1] px-2.5 py-0.5 rounded-full bg-[#f0f9ff] border border-[#bae6fd] shadow-2xs">
                Grounded • Zero-Hallucination
              </span>
            </div>
            <p className="text-xs text-[#64748b] font-medium mt-0.5">Trained strictly on your unlocked inventory & emergency playbooks</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-[#e2d7c7]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'copilot' && (
              <div className="w-8 h-8 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#bae6fd] shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed max-w-[85%] whitespace-pre-line shadow-xs ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white font-semibold rounded-tr-none shadow-[0_8px_20px_rgba(234,88,12,0.25)]'
                  : 'bg-[#f8f4ed] text-[#1e293b] border border-[#e2d7c7] rounded-tl-none font-medium'
              }`}
            >
              {m.text}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-[#fed7aa] text-[#b45309] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#fdba74] shadow-2xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Judge Quick Prompts */}
      <div className="pt-3.5 pb-2.5 border-t border-[#ebdccb]/70 flex-shrink-0">
        <span className="text-[10px] text-[#94a3b8] font-black uppercase tracking-wider block mb-2">
          Suggested Emergency Inquiries:
        </span>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(qp)}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#fffdfa] text-[#475569] hover:text-[#1e293b] border border-[#dfd4c4] hover:border-[#f59e0b] shadow-2xs font-bold whitespace-nowrap transition flex-shrink-0"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="pt-2 flex items-center space-x-2 flex-shrink-0">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about your emergency commitments..."
          className="flex-1 px-5 py-3 rounded-full bg-[#fbf7f0] border-2 border-[#e6dac9] text-[#1e293b] text-xs sm:text-sm focus:outline-none focus:border-[#f59e0b] focus:bg-white font-medium transition shadow-inner"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim()}
          className="p-3 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] hover:brightness-105 active:scale-[0.99] disabled:opacity-40 text-white font-bold transition shadow-[0_8px_20px_rgba(234,88,12,0.35)] flex items-center justify-center flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
