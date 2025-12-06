import { Check } from "lucide-react";
import { Contact } from ".";

interface Props {
    contacts: Contact[];
    setSelectedContact: (contact: Contact | null) => void;
    selectedContact: Contact | null;
    handleReply: (contactId: string) => void;
    replyText: string;
    setReplyText: (text: string) => void;
}

export default function ContactsView({ contacts, setSelectedContact, selectedContact, handleReply, replyText, setReplyText }: Props) {
  return (
    <div className="grid gap-4">
      {contacts.map((contact) => (
        <div key={contact._id} className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 p-8 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{contact.name}</h3>
                  <p className="text-accent text-sm font-medium">{contact.contactValue}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-3 py-1.5 bg-black/40 border border-white/10 text-foreground/60">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                  {contact.replied && (
                    <span className="text-[10px] font-bold px-3 py-1.5 bg-accent/20 text-accent flex items-center gap-1.5 uppercase">
                      <Check size={10} /> Replied
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-black/30 border-l-2 border-accent/30 p-6">
                <p className="text-foreground/90 leading-relaxed">
                  {contact.message}
                </p>
              </div>

              {contact.adminReply && (
                <div className="bg-accent/5 border-l-2 border-accent p-6">
                  <p className="text-[10px] text-accent font-bold mb-2 uppercase tracking-widest">Your Reply</p>
                  <p className="text-foreground/80 leading-relaxed">{contact.adminReply}</p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex items-start">
              <button
                onClick={() => setSelectedContact(selectedContact?._id === contact._id ? null : contact)}
                className="px-6 py-3 text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/20 hover:bg-accent hover:text-black hover:border-accent transition-all"
              >
                {selectedContact?._id === contact._id ? 'Close' : 'Reply'}
              </button>
            </div>
          </div>

          {/* Reply Form */}
          {selectedContact?._id === contact._id && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                className="w-full bg-black/50 border border-white/20 p-4 text-sm mb-4 focus:border-accent focus:bg-black/70 outline-none transition-all"
                rows={4}
              />
              <button
                onClick={() => handleReply(contact._id)}
                disabled={!replyText.trim()}
                className="px-8 py-3 bg-accent text-black text-xs font-bold uppercase tracking-wider hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Reply
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}