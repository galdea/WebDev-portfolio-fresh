import Navbar from '@/components/Navbar';

export default function HipatiaExtensionPrivacyPage() {
  return (
    <div className="min-h-screen bg-background dark:from-bg-dark dark:to-dark">
      <Navbar />
      <main className="pt-24 px-4 md:px-8 lg:px-16 max-w-4xl mx-auto">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

          <p className="mb-6">
            Hipatia Kindle Extension respects your privacy. This policy explains
            how we collect, use, and protect your information.
          </p>

          <ol className="list-decimal list-inside space-y-4">
            <li>
              <h2 className="text-xl font-semibold mb-2">
                Information We Collect
              </h2>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  Your Gmail email address (used to send content to your
                  Kindle).
                </li>
                <li>
                  Content you choose to send (articles, newsletters, or
                  documents).
                </li>
                <li>
                  Basic usage data for debugging and improving the Extension.
                </li>
              </ul>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  To send the content you select from Gmail to your Kindle.
                </li>
                <li>To improve the Extension and fix bugs.</li>
              </ul>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">
                Sharing of Information
              </h2>
              <p className="ml-4 mb-2">
                We do not sell, rent, or share your personal data with third
                parties.
              </p>
              <p className="ml-4">Data may be shared if required by law.</p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">
                Data Storage and Security
              </h2>
              <p className="ml-4 mb-2">
                We store your data temporarily and securely.
              </p>
              <p className="ml-4">
                We implement standard security practices to protect your
                information.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">Your Choices</h2>
              <p className="ml-4 mb-2">
                You can stop using the Extension at any time.
              </p>
              <p className="ml-4">
                You can revoke access through your Google account permissions.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold mb-2">Contact</h2>
              <p className="ml-4">
                If you have questions about this policy, email us at:
                harryseldon1994@gmail.com
              </p>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
}
