import React, { useState } from 'react';
import { X, Send, ShieldCheck, Check, MessageSquare, User, MapPin } from 'lucide-react';

const ContactModal = ({ isOpen, item, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen || !item) return null;

  const defaultTemplate = `Hi ${item.reportedBy?.name || 'there'}, I saw your report for "${item.title}" on FindIt. I believe this is mine / I have information regarding it. Please reach out to me so we can verify details.`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message || defaultTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#6D28D9] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Contact Reporter</h3>
              <p className="text-xs text-gray-500">Reach out regarding {item.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Reporter details badge */}
          <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-100/70 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <User className="w-4 h-4 text-[#6D28D9]" />
              <span>Reported by: {item.reportedBy?.name || 'FindIt Member'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-purple-600" />
              <span>Reported Location: {item.location}</span>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-amber-800 text-xs leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Safety Reminder:</strong> Ask specific identifying questions (e.g., unique marks, contents, wallpaper) to verify ownership. Always arrange handover in public spaces like the library reception or campus security office.
            </span>
          </div>

          {sent ? (
            <div className="p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-gray-900">Inquiry Sent!</h4>
              <p className="text-xs text-gray-500">
                The reporter has been notified. They will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Inquiry / Verification Details
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={defaultTemplate}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-200 outline-none text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                  {copied ? 'Copied Message' : 'Copy Text'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#6D28D9] hover:bg-[#5B21B6] transition shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Inquiry
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
