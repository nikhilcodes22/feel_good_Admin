import { Heart, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Terms = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('type') === 'organization' ? 'organization' : 'volunteer';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground fill-current" />
            </div>
            <span className="font-display font-bold text-lg">FeelGood</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Terms & Conditions
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: January 2026
        </p>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="volunteer">For Volunteers</TabsTrigger>
            <TabsTrigger value="organization">For Organizations</TabsTrigger>
          </TabsList>

          <TabsContent value="volunteer" className="space-y-6">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                FeelGood Volunteer Terms & Conditions
              </h2>
              <p className="text-muted-foreground mb-4">
                By creating an account on FeelGood, you agree to the following terms:
              </p>

              <div className="space-y-6">
                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    1. Account Responsibility
                  </h3>
                  <p className="text-muted-foreground">
                    You must provide accurate information when creating your account and keep your credentials secure. You are responsible for all activity that occurs under your account. Notify us immediately if you suspect unauthorized access.
                  </p>
                </section>

                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    2. Volunteer Conduct
                  </h3>
                  <p className="text-muted-foreground">
                    You agree to honor your commitments to organizations. If you are unable to attend a scheduled volunteer event, you must communicate promptly with the organization. Repeated no-shows may result in account restrictions.
                  </p>
                </section>

                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    3. Privacy & Data
                  </h3>
                  <p className="text-muted-foreground">
                    We collect your name, phone number, and/or email address for the purpose of matching you with organizations. Your contact details are shared only with organizations you choose to engage with. We do not sell your personal information to third parties.
                  </p>
                </section>

                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    4. Content Guidelines
                  </h3>
                  <p className="text-muted-foreground">
                    You agree not to share inappropriate, offensive, or misleading content on the platform. This includes profile information, messages, and any other user-generated content. Violations may result in account suspension.
                  </p>
                </section>

                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    5. Liability
                  </h3>
                  <p className="text-muted-foreground">
                    FeelGood serves as a platform to connect volunteers with organizations but is not responsible for incidents that occur during volunteer activities. Organizations are responsible for providing safe environments for volunteers. We recommend exercising due diligence before participating in any volunteer opportunity.
                  </p>
                </section>

                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    6. Account Termination
                  </h3>
                  <p className="text-muted-foreground">
                    We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or abuse the platform in any way. You may also request account deletion at any time.
                  </p>
                </section>

                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    7. Modifications
                  </h3>
                  <p className="text-muted-foreground">
                    We may update these terms from time to time. Continued use of the platform after changes are made constitutes acceptance of the modified terms. We will notify you of significant changes via email or in-app notification.
                  </p>
                </section>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="organization" className="space-y-6">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                FeelGood Organization Terms & Conditions
              </h2>
              <p className="text-muted-foreground mb-4">
                By registering your organization on FeelGood, you agree to the following terms:
              </p>

              <div className="space-y-6">
                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    1. Legitimate Purpose
                  </h3>
                  <p className="text-muted-foreground">
                    You confirm that your organization operates for legitimate social, charitable, religious, or community purposes. Misrepresentation of your organization's purpose or activities is grounds for immediate removal from the platform.
                  </p>
                </section>

                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    2. Volunteer Safety
                  </h3>
                  <p className="text-muted-foreground">
                    You agree to provide a safe environment for volunteers during all activities. This includes appropriate supervision, clear communication of expectations, and compliance with local safety regulations. You are responsible for the well-being of volunteers while they are participating in your activities.
                  </p>
                </section>

                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    3. Asset Management
                  </h3>
                  <p className="text-muted-foreground">
                    You are responsible for managing any assets lent or tracked through the platform. FeelGood is not liable for lost, damaged, or stolen items. You should maintain accurate records and communicate clearly with borrowers about return expectations.
                  </p>
                </section>

                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    4. Data Handling
                  </h3>
                  <p className="text-muted-foreground">
                    Volunteer information shared with you must be used only for coordination purposes related to your activities. You must not share volunteer personal data with third parties, use it for marketing without consent, or retain it beyond the necessary period.
                  </p>
                </section>

                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    5. Accurate Representation
                  </h3>
                  <p className="text-muted-foreground">
                    All organization details, events, and volunteer requests must be accurate and not misleading. This includes your organization's description, contact information, and the nature of volunteer opportunities you post.
                  </p>
                </section>

                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    6. Communication
                  </h3>
                  <p className="text-muted-foreground">
                    You agree to respond to volunteer inquiries in a timely manner and honor scheduled commitments. If circumstances require cancellation of an event, you must notify registered volunteers as soon as possible.
                  </p>
                </section>

                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    7. Liability
                  </h3>
                  <p className="text-muted-foreground">
                    You assume responsibility for all volunteer activities conducted under your organization. This includes any incidents, injuries, or disputes that may arise during volunteer participation. We recommend maintaining appropriate insurance coverage.
                  </p>
                </section>

                <section className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    8. Termination
                  </h3>
                  <p className="text-muted-foreground">
                    FeelGood reserves the right to remove organizations that violate these terms, receive consistent negative feedback from volunteers, or fail to maintain accurate and up-to-date information. You may also request removal of your organization at any time.
                  </p>
                </section>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Section */}
        <div className="mt-12 bg-card rounded-xl p-6 border border-border text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Questions about these terms?
          </h3>
          <p className="text-muted-foreground mb-4">
            If you have any questions or concerns about these Terms & Conditions, please contact us.
          </p>
          <Link 
            to="/" 
            className="text-primary hover:underline font-medium"
          >
            Contact Support
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Terms;
