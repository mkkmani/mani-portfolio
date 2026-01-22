'use client';

import { useState } from 'react';
import { Send, CheckCircle, Loader, ArrowRight } from 'lucide-react';

export default function ContactForm() {
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contactId, setContactId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    privacyAccepted: true,
  });

  const [otp, setOtp] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          contactValue: formData.email,
          message: formData.message,
          contactMethod: 'email',
          privacyAccepted: formData.privacyAccepted,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setContactId(data.contactId);
        setStep('otp');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <section className="py-48 px-6 bg-black min-h-screen flex items-center justify-center">
        <div className="max-w-xl w-full text-center space-y-12">
          <div className="inline-flex p-8 border border-accent/20 bg-accent/5">
            <CheckCircle className="text-accent" size={48} />
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Transmission<br />Complete</h3>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 leading-relaxed italic lowercase">
              // message successfully logged in the system.<br />
              // expected response window: 24_hours.
            </p>
          </div>
          <button
            onClick={() => setStep('form')}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-accent border-b border-accent/20 pb-2 hover:border-accent transition-all duration-500"
          >
            New Transmission
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-20 px-6 bg-black md:pl-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
              [ CONTACT.01 // INQUIRY ]
            </span>
            <h2 className="text-6xl md:text-8xl font-serif uppercase tracking-tighter text-white leading-[0.8]">
              Connect<br />Together
            </h2>
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/20 md:text-right leading-relaxed max-w-xs">
            // OPENING DIRECT CHANNEL.<br />
            // STATUS: LISTENING
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-8">
            <p className="text-xl md:text-2xl text-foreground/50 leading-[1.3] font-light lowercase italic">
              have a vision for a <span className="text-white italic">digital monolith</span>?
              initiate contact to begin the architectural process.
            </p>

            <div className="space-y-6 pt-6 border-t border-white/5">
              <div className="space-y-2">
                <span className="text-[8px] font-black tracking-[0.5em] text-foreground/20 uppercase">Availability</span>
                <p className="text-sm text-foreground/40 lowercase italic font-light">worldwide // remote preferred</p>
              </div>
              <div className="space-y-2">
                <span className="text-[8px] font-black tracking-[0.5em] text-foreground/20 uppercase">Response Time</span>
                <p className="text-sm text-foreground/40 lowercase italic font-light">&lt; 24 hours</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {step === 'form' ? (
              <form onSubmit={handleSubmit} className="space-y-px bg-white/5 border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
                  <div className="p-6 bg-black">
                    <label className="block text-[8px] font-black mb-4 uppercase tracking-[0.3em] text-foreground/20">
                      IDENTIFIER / NAME
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 focus:border-accent outline-none py-2 text-white font-serif italic lowercase transition-colors"
                      placeholder="e.g. john doe"
                      required
                    />
                  </div>
                  <div className="p-6 bg-black">
                    <label className="block text-[8px] font-black mb-4 uppercase tracking-[0.3em] text-foreground/20">
                      ADDRESS / EMAIL
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. name@domain.com"
                      className="w-full bg-transparent border-b border-white/10 focus:border-accent outline-none py-2 text-white font-serif italic lowercase transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="p-6 bg-black">
                  <label className="block text-[8px] font-black mb-4 uppercase tracking-[0.3em] text-foreground/20">
                    TRANSMISSION / MESSAGE
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    placeholder="describe the structure of your proposal..."
                    className="w-full bg-transparent border-b border-white/10 focus:border-accent outline-none py-2 text-white font-serif italic lowercase transition-colors resize-none"
                    required
                  />
                </div>

                <div className="p-8 bg-black">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={formData.privacyAccepted}
                          onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                          className="sr-only"
                          required
                        />
                        <div className={`w-4 h-4 border transition-all ${formData.privacyAccepted ? 'bg-accent border-accent' : 'border-white/20 bg-transparent group-hover:border-white/40'}`} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 group-hover:text-foreground/40 transition-colors">
                        Accept Privacy Protocols
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white border border-white/10 px-8 py-4 hover:border-accent hover:text-accent transition-all duration-500 disabled:opacity-50"
                    >
                      {loading ? <Loader className="animate-spin" size={12} /> : <Send size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                      {loading ? 'TRANSMITTING' : 'INITIATE'}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-6 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] border-t border-red-500/20">
                    // ERR: {error}
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-px bg-white/5 border border-white/5">
                <div className="p-12 bg-black space-y-12">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white">Security Check</h3>
                    <p className="text-[10px] text-foreground/40 uppercase tracking-[0.3em] italic">
                      // code transmitted to <span className="text-accent">{formData.email}</span>
                    </p>
                  </div>

                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full bg-transparent border-b border-white/10 focus:border-accent outline-none text-center text-4xl tracking-[0.8em] font-mono text-white transition-all py-4"
                    required
                  />

                  {error && (
                    <div className="p-4 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] border border-red-500/20">
                      // {error}
                    </div>
                  )}

                  <div className="flex flex-col gap-6">
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.5em] hover:bg-accent transition-all disabled:opacity-20"
                    >
                      {loading ? 'VERIFYING' : 'VERIFY_IDENTITY'}
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-white transition-all"
                    >
                      // Resend Protocol
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
