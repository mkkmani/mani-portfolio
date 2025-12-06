'use client';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background pt-24 px-6">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto py-12">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-card-bg border border-glass-border text-accent text-sm font-medium">
              Privacy First
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Privacy Policy
          </h1>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Your privacy is my priority. Here&apos;s everything you need to know about how I handle your data.
          </p>
          <p className="text-foreground/40 text-sm mt-4">Last updated: November 2025</p>
        </div>

        {/* Commitment Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-card-bg backdrop-blur-sm border border-glass-border p-8 hover:border-accent/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/10 border border-accent/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3 text-foreground">Your Privacy Matters</h2>
                <p className="text-foreground/80 leading-relaxed">
                  At Manikanta&apos;s Portfolio, I respect your privacy and am committed to protecting your personal information.
                  This policy outlines how I collect, use, and safeguard your data with complete transparency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Information Collection */}
          <section>
            <div className="bg-card-bg backdrop-blur-sm border border-glass-border p-8 hover:border-foreground/20 transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-foreground/10 border border-foreground/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2 text-foreground">Information Collection</h2>
                  <p className="text-foreground/60">What data I collect when you reach out</p>
                </div>
              </div>
              <p className="text-foreground/80 mb-4">When you contact me through the contact form, I collect:</p>
              <div className="grid gap-3">
                {[
                  { icon: "👤", text: "Your name" },
                  { icon: "📧", text: "Email address or phone number (your choice)" },
                  { icon: "💬", text: "Your message" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-foreground/5 hover:bg-foreground/10 transition-colors border border-foreground/5">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-foreground/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How I Use Your Information */}
          <section>
            <div className="bg-card-bg backdrop-blur-sm border border-glass-border p-8 hover:border-foreground/20 transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-foreground/10 border border-foreground/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2 text-foreground">How I Use Your Information</h2>
                  <p className="text-foreground/60">Clear guidelines on data usage</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Will Do */}
                <div className="p-5 bg-foreground/5 border border-accent/20">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-accent/20 border border-accent/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-lg text-accent">I will ONLY use your information to:</h3>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Respond to your inquiry promptly and professionally",
                      "Communicate about potential projects or opportunities",
                      "Provide you with the information you requested"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-foreground/80">
                        <span className="text-accent mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Will Never Do */}
                <div className="p-5 bg-foreground/5 border border-foreground/20">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-foreground/10 border border-foreground/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-lg text-foreground/80">I will NEVER:</h3>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Share your information with third parties without consent",
                      "Use your data for marketing or promotional purposes",
                      "Sell your information to anyone, ever",
                      "Send unsolicited emails or messages"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-foreground/80">
                        <span className="text-foreground/40 mt-1">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="bg-card-bg backdrop-blur-sm border border-glass-border p-8 hover:border-foreground/20 transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-foreground/10 border border-foreground/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2 text-foreground">Data Security</h2>
                  <p className="text-foreground/60">How I protect your information</p>
                </div>
              </div>
              <div className="grid gap-4">
                {[
                  {
                    icon: "🔐",
                    title: "Encrypted Storage",
                    desc: "Your contact information is stored securely in an encrypted database with industry-standard protection"
                  },
                  {
                    icon: "🔑",
                    title: "OTP Verification",
                    desc: "One-time password verification ensures the authenticity and security of all submissions"
                  },
                  {
                    icon: "🛡️",
                    title: "Restricted Access",
                    desc: "Access to your data is strictly limited and protected with multiple layers of security"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors border border-foreground/5">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-foreground/90 mb-1">{item.title}</h4>
                      <p className="text-sm text-foreground/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="bg-card-bg backdrop-blur-sm border border-glass-border p-8 hover:border-foreground/20 transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-foreground/10 border border-foreground/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2 text-foreground">Your Rights</h2>
                  <p className="text-foreground/60">You have complete control over your data</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: "🗑️", title: "Right to Delete", desc: "Request deletion of your data at any time, no questions asked" },
                  { icon: "👁️", title: "Right to Know", desc: "Ask what information I have about you and how it's used" },
                  { icon: "🔕", title: "Right to Opt-Out", desc: "Unsubscribe from future communications instantly" }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-foreground/5 hover:bg-foreground/10 transition-all duration-300 text-center border border-foreground/5 group/card">
                    <div className="text-4xl mb-3 group-hover/card:scale-110 transition-transform">{item.icon}</div>
                    <h4 className="font-semibold text-foreground/90 mb-2">{item.title}</h4>
                    <p className="text-sm text-foreground/70">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <div className="bg-card-bg backdrop-blur-sm border border-glass-border p-8 hover:border-accent/30 transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2 text-foreground">Questions?</h2>
                  <p className="text-foreground/60 mb-4">
                    If you have any questions about this privacy policy or how your data is handled, I&apos;m here to help.
                  </p>
                  <a
                    href="mailto:manikantaketha1@gmail.com"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-medium hover:bg-accent/90 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    manikantaketha1@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Promise Banner */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-card-bg backdrop-blur-sm border border-accent/30 p-8 text-center">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 mx-auto bg-accent/10 border border-accent/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">
              My Simple Promise
            </h3>
            <p className="text-xl text-foreground/90 font-medium">
              Your data stays private. No spam. No sharing. Period.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
