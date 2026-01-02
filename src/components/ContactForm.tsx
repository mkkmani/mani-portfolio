'use client';

import { useState } from 'react';
import { Send, CheckCircle, Loader } from 'lucide-react';

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
      <section className="py-20 px-6 bg-background min-h-[60vh] flex items-center justify-center">
        <div className="max-w-xl w-full">
          <div className="text-center py-12 border border-accent/30 bg-accent/5 ">
            <CheckCircle className="mx-auto mb-4 text-accent" size={48} />
            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
            <p className="text-foreground/60 max-w-sm mx-auto">
              Thank you for reaching out. I'll get back to you shortly.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 px-6 bg-background">
      <div className="max-w-4xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Let's work <br />
              <span className="text-accent">together</span>
            </h2>
            <p className="text-foreground/60 text-lg mb-8 max-w-sm">
              Have a project in mind? Fill out the form and I'll get back to you within 24 hours.
            </p>

            <div className="space-y-4 text-sm text-foreground/50">
              <p>Based in India, available worldwide.</p>
              <p>Specialized in MERN Stack & Next.js</p>
            </div>
          </div>

          {/* Form */}
          <div>
            {step === 'form' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-foreground/50">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none transition-colors text-sm "
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-foreground/50">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none transition-colors text-sm "
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-foreground/50">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    placeholder="Tell me about your project..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none transition-colors resize-none text-sm "
                    required
                  />
                </div>

                <div>
                  <label className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.privacyAccepted}
                      onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                      className="mt-1 w-4 h-4 accent-accent"
                      required
                    />
                    <span className="text-xs text-foreground/50 group-hover:text-foreground/70 transition-colors leading-relaxed">
                      I agree to the privacy policy and processing of my data.
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs ">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-accent text-black font-bold text-sm hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 "
                >
                  {loading ? <Loader className="animate-spin" size={16} /> : <Send size={16} />}
                  {loading ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6 text-center bg-white/5 p-8 border border-white/10 ">
                <div>
                  <h3 className="text-xl font-bold mb-2">Verify Email</h3>
                  <p className="text-sm text-foreground/60">
                    Code sent to <span className="text-accent">{formData.email}</span>
                  </p>
                </div>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-black border border-white/20 focus:border-accent outline-none transition-colors text-center text-2xl tracking-[0.5em] font-mono "
                  required
                />

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs ">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3 bg-accent text-black font-bold text-sm hover:bg-white transition-all disabled:opacity-50 "
                  >
                    {loading ? 'VERIFYING...' : 'VERIFY CODE'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="w-full py-2 text-xs text-foreground/60 hover:text-accent transition-colors"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
