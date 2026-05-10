export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last Updated: April 2026</p>

                <div className="prose prose-sm max-w-none dark:prose-invert space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
                        <p>At Kahustle, we collect information to provide better services to all our users. This includes:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li><strong>Account Information:</strong> Your name, email address, phone number, and password when you register.</li>
                            <li><strong>Listing Data:</strong> Information you provide when posting an ad, including photos, location, and item descriptions.</li>
                            <li><strong>Payment Information:</strong> Transaction details (e.g., M-Pesa reference numbers) for Silver or Gold memberships. We do not store full credit card details.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
                        <p>We use the information collected to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Facilitate the buying and selling process between users.</li>
                            <li>Process payments and activate membership benefits.</li>
                            <li>Improve our website functionality and user experience.</li>
                            <li>Send technical notices, updates, and support messages.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">3. Information Sharing and Disclosure</h2>
                        <p>We do not sell your personal data to third parties. However, we may share information in the following ways:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li><strong>Public Listings:</strong> Any information you include in a public ad (phone number, location) will be visible to other users.</li>
                            <li><strong>Service Providers:</strong> We may share data with trusted partners who help us operate our website (e.g., payment processors).</li>
                            <li><strong>Legal Requirements:</strong> We may disclose information if required by the laws of Kenya or in response to valid legal requests.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
                        <p>We take the security of your personal information seriously. We implement a variety of security measures to maintain the safety of your data when you enter, submit, or access your personal information.</p>
                        <p className="mt-4 italic">Note: While we strive for maximum security, no method of transmission over the internet is 100% secure. We encourage users to use strong passwords and avoid sharing sensitive login details.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">5. Cookies</h2>
                        <p>Kahustle uses cookies to enhance your browsing experience. Cookies help us remember your preferences and understand how you interact with our platform. You can choose to disable cookies through your browser settings, but some features of the site may not function properly.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Rights</h2>
                        <p>Under Kenyan data protection laws, you have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Access the personal data we hold about you.</li>
                            <li>Request the correction of inaccurate data.</li>
                            <li>Request the deletion of your account and associated personal information.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">7. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy or how your data is handled, please contact us at:</p>
                        <div className="mt-4 space-y-1">
                            <p><strong>Email:</strong> info@kahustle.co.ke</p>
                            <p><strong>Website:</strong> kahustle.co.ke/contact</p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}
