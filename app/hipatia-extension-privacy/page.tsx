export default function HipatiaExtensionPrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hipatia Kindle Extension respects your privacy. This policy
              explains how we collect, use, and protect your information.
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-card rounded-lg p-6 shadow-sm border">
              <ol className="space-y-6">
                <li className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground border-l-4 border-primary pl-4">
                    1. Information We Collect
                  </h2>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                    <li>
                      Your Gmail email address (used to send content to your
                      Kindle).
                    </li>
                    <li>
                      Content you choose to send (articles, newsletters, or
                      documents).
                    </li>
                    <li>
                      Basic usage data for debugging and improving the
                      Extension.
                    </li>
                  </ul>
                </li>

                <li className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground border-l-4 border-primary pl-4">
                    2. How We Use Your Information
                  </h2>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                    <li>
                      To send the content you select from Gmail to your Kindle.
                    </li>
                    <li>To improve the Extension and fix bugs.</li>
                  </ul>
                </li>

                <li className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground border-l-4 border-primary pl-4">
                    3. Sharing of Information
                  </h2>
                  <p className="text-muted-foreground ml-4">
                    We do not sell, rent, or share your personal data with third
                    parties.
                  </p>
                  <p className="text-muted-foreground ml-4">
                    Data may be shared if required by law.
                  </p>
                </li>

                <li className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground border-l-4 border-primary pl-4">
                    4. Data Storage and Security
                  </h2>
                  <p className="text-muted-foreground ml-4">
                    We store your data temporarily and securely.
                  </p>
                  <p className="text-muted-foreground ml-4">
                    We implement standard security practices to protect your
                    information.
                  </p>
                </li>

                <li className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground border-l-4 border-primary pl-4">
                    5. Your Choices
                  </h2>
                  <p className="text-muted-foreground ml-4">
                    You can stop using the Extension at any time.
                  </p>
                  <p className="text-muted-foreground ml-4">
                    You can revoke access through your Google account
                    permissions.
                  </p>
                </li>

                <li className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground border-l-4 border-primary pl-4">
                    6. Contact
                  </h2>
                  <p className="text-muted-foreground ml-4">
                    If you have questions about this policy, email us at:
                    <a
                      href="mailto:harryseldon1994@gmail.com"
                      className="text-primary hover:underline ml-1"
                    >
                      harryseldon1994@gmail.com
                    </a>
                  </p>
                </li>
              </ol>
            </section>
          </div>

          <div className="text-center mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
