import emailjs from '@emailjs/browser';
import { jsPDF } from 'jspdf';
import { ChevronLeft, ChevronRight, Download, Send } from 'lucide-react';
import { useRef, useState } from 'react';

const SERVICE_ID = 'service_f2eyn5j';
const TEMPLATE_ID = 'template_d9gl81s';
const USER_ID = '3YLlUQa6Bs9ksulX7';

interface Step {
  title: string;
  description: string;
}

interface Feature {
  name: string;
  percentage: number;
  selected: boolean;
}

const steps: Step[] = [
  { title: 'Project Type', description: 'What type of project do you need?' },
  {
    title: 'Technical Features',
    description: 'Select the technical features required for your project',
  },
  {
    title: 'Project Scale',
    description: 'What is your expected number of users?',
  },
  {
    title: 'Design Level',
    description: 'Select your preferred design approach',
  },
  {
    title: 'Timeline',
    description: 'What is your preferred development timeline?',
  },
  {
    title: 'Summary & Quote',
    description: 'Review your selections and request a detailed quote',
  },
];

const ProjectCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectType, setProjectType] = useState<string>('');
  const [features, setFeatures] = useState<Feature[]>([
    { name: 'Database Integration', percentage: 15, selected: false },
    { name: 'User Authentication', percentage: 15, selected: false },
    { name: 'API Integration', percentage: 12, selected: false },
    { name: 'Real-time Features', percentage: 20, selected: false },
    { name: 'Search Functionality', percentage: 10, selected: false },
    { name: 'Multi-language Support', percentage: 10, selected: false },
    { name: 'Light & Dark Theme', percentage: 5, selected: false },
    { name: 'Analytics Integration', percentage: 10, selected: false },
  ]);
  const [scale, setScale] = useState<string>('');
  const [design, setDesign] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const formRef = useRef<HTMLFormElement>(null);

  const calculateBasePrice = () => {
    switch (projectType) {
      case 'web':
        return 500;
      case 'mobile':
        return 900;
      case 'both':
        return 1200;
      default:
        return 0;
    }
  };

  const calculateTotalPrice = () => {
    let total = calculateBasePrice();

    // Add feature costs
    features.forEach((feature) => {
      if (feature.selected) {
        total += (total * feature.percentage) / 100;
      }
    });

    // Add scale multiplier
    switch (scale) {
      case 'medium':
        total *= 1.15;
        break;
      case 'large':
        total *= 1.3;
        break;
      case 'enterprise':
        total *= 1.5;
        break;
    }

    // Add design costs
    switch (design) {
      case 'premium':
        total *= 1.4;
        break;
      case 'custom':
        total *= 1.8;
        break;
    }

    // Add timeline costs
    switch (timeline) {
      case 'accelerated':
        total *= 1.3;
        break;
      case 'urgent':
        total *= 1.6;
        break;
    }

    return Math.round(total);
  };

  const generateSummary = () => {
    const selectedFeatures = features
      .filter((f) => f.selected)
      .map((f) => f.name);

    return {
      projectType:
        projectType === 'web'
          ? 'Web App'
          : projectType === 'mobile'
          ? 'Mobile App'
          : 'Web & Mobile Apps',
      features:
        selectedFeatures.length > 0
          ? selectedFeatures
          : ['No additional features selected'],
      scale: scale || 'Not specified',
      design:
        design === 'basic'
          ? 'Basic Design'
          : design === 'premium'
          ? 'Premium Design'
          : 'Custom Design',
      timeline:
        timeline === 'standard'
          ? 'Standard (2-3 months)'
          : timeline === 'accelerated'
          ? 'Accelerated (1-2 months)'
          : 'Urgent (1 month or less)',
      totalCost: calculateTotalPrice(),
    };
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const summary = generateSummary();

    try {
      // Create template parameters for EmailJS
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        project_type: summary.projectType,
        features: summary.features.join(', '),
        scale: summary.scale,
        design: summary.design,
        timeline: summary.timeline,
        total_cost: `USD $${summary.totalCost.toLocaleString()}`,
      };

      // Send the email using EmailJS
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);

      setSubmitStatus('success');

      // Clear form fields after successful submission
      setMessage('');
    } catch (error) {
      console.error('Error submitting quote:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const createPDF = () => {
    const summary = generateSummary();

    // Create new PDF document
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: 'Project Quote Summary',
      subject: 'Project Cost Estimation',
      author: 'Project Calculator',
      creator: 'Project Calculator Tool',
    });

    // Add background color (light version of the site's dark theme)
    doc.setFillColor(18, 31, 52);
    doc.rect(0, 0, 210, 297, 'F');

    // Set text colors similar to the website
    doc.setTextColor(230, 241, 255); // Light text color

    // Add title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Project Quote Summary', 105, 20, { align: 'center' });

    // Add divider
    doc.setDrawColor(100, 255, 218); // Teal color for lines
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Set font for content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Add content
    const startY = 40;
    const lineHeight = 10;

    // Project type
    doc.setFont('helvetica', 'bold');
    doc.text('Project Type:', 20, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(summary.projectType, 80, startY);

    // Features
    doc.setFont('helvetica', 'bold');
    doc.text('Features:', 20, startY + lineHeight);
    doc.setFont('helvetica', 'normal');

    let featureY = startY + lineHeight;
    summary.features.forEach((feature, index) => {
      featureY += lineHeight;
      doc.text(`• USD ${feature}`, 80, featureY);
    });

    // Scale
    featureY += lineHeight;
    doc.setFont('helvetica', 'bold');
    doc.text('Scale:', 20, featureY + lineHeight);
    doc.setFont('helvetica', 'normal');
    doc.text(summary.scale, 80, featureY + lineHeight);

    // Design
    doc.setFont('helvetica', 'bold');
    doc.text('Design:', 20, featureY + 2 * lineHeight);
    doc.setFont('helvetica', 'normal');
    doc.text(summary.design, 80, featureY + 2 * lineHeight);

    // Timeline
    doc.setFont('helvetica', 'bold');
    doc.text('Timeline:', 20, featureY + 3 * lineHeight);
    doc.setFont('helvetica', 'normal');
    doc.text(summary.timeline, 80, featureY + 3 * lineHeight);

    // Add divider before total
    doc.setDrawColor(100, 255, 218);
    doc.setLineWidth(0.3);
    doc.line(20, featureY + 4 * lineHeight, 190, featureY + 4 * lineHeight);

    // Total Estimated Cost
    doc.setFontSize(16);
    doc.setTextColor(100, 255, 218); // Teal color for total cost
    doc.setFont('helvetica', 'bold');
    doc.text('Total Estimated Cost:', 20, featureY + 5 * lineHeight);
    doc.setFontSize(20);
    doc.text(
      `USD $${summary.totalCost.toLocaleString()}`,
      190,
      featureY + 5 * lineHeight,
      { align: 'right' },
    );

    // Footer with contact info
    doc.setFontSize(10);
    doc.setTextColor(230, 241, 255);
    doc.text(
      'For more information, please contact us at info@aldeazadigital.com',
      105,
      260,
      { align: 'center' },
    );
    doc.text(
      'This quote is valid for 30 days from the date of generation.',
      105,
      270,
      { align: 'center' },
    );

    // Current date at the bottom
    const today = new Date();
    const dateStr = today.toLocaleDateString();
    doc.text(`Generated on: ${dateStr}`, 20, 280);

    return doc;
  };

  const downloadPDF = () => {
    const doc = createPDF();
    doc.save('project-quote.pdf');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4 vh-3">
            <button
              className={`w-full p-4 rounded-lg transition-all border ${
                projectType === 'web'
                  ? 'bg-[#64ffdb7d] text-[#08111e] border-[#64ffda]'
                  : 'border-[#64ffdb82] hover:bg-[#1a2942c5]'
              }`}
              onClick={() => setProjectType('web')}
            >
              Web App (Landing Page only)
            </button>
            <button
              className={`w-full p-4 rounded-lg transition-all border ${
                projectType === 'mobile'
                  ? 'bg-[#64ffdb7d] text-[#08111e] border-[#64ffda]'
                  : 'border-[#64ffdb82] hover:bg-[#1a2942c5]'
              }`}
              onClick={() => setProjectType('mobile')}
            >
              Mobile App (iOS/Android)
            </button>
            <button
              className={`w-full p-4 rounded-lg transition-all border ${
                projectType === 'both'
                  ? 'bg-[#64ffdb7d] text-[#08111e] border-[#64ffda]'
                  : 'border-[#64ffdb82] hover:bg-[#1a2942c5]'
              }`}
              onClick={() => setProjectType('both')}
            >
              Both Web & Mobile Applications
            </button>
          </div>
        );

      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <button
                key={index}
                className={`w-full p-4 rounded-lg transition-all border ${
                  feature.selected
                    ? 'bg-[#64ffdb7d] text-[#08111e] border-[#64ffda]'
                    : 'border-[#64ffdb82] hover:bg-[#1a2942c5]'
                }`}
                onClick={() => {
                  const newFeatures = [...features];
                  newFeatures[index].selected = !newFeatures[index].selected;
                  setFeatures(newFeatures);
                }}
              >
                <div className="flex justify-between items-center">
                  <span>{feature.name}</span>
                  <span>+{feature.percentage}%</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {[
              {
                value: 'small',
                label: 'Small (<100 users)',
                modifier: 'Base pricing',
              },
              {
                value: 'medium',
                label: 'Medium (100-1,000 users)',
                modifier: '+15%',
              },
              {
                value: 'large',
                label: 'Large (1,000-5,000 users)',
                modifier: '+30%',
              },
              {
                value: 'enterprise',
                label: 'Enterprise (5,000+ users)',
                modifier: '+50%',
              },
              {
                value: 'unsure',
                label: 'Not sure yet',
                modifier: 'Medium pricing',
              },
            ].map((option) => (
              <button
                key={option.value}
                className={`w-full p-4 rounded-lg transition-all ${
                  scale === option.value
                    ? 'bg-[#64ffdb7d] text-[#08111e] border-[#64ffda]'
                    : 'border-[#64ffdb82] hover:bg-[#1a2942c5]'
                }`}
                onClick={() => setScale(option.value)}
              >
                <div className="flex justify-between items-center">
                  <span>{option.label}</span>
                  <span>{option.modifier}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            {[
              {
                value: 'basic',
                label: 'Basic Design',
                description:
                  'Clean and functional design with standard components',
                modifier: 'Included',
              },
              {
                value: 'premium',
                label: 'Premium Design',
                description:
                  'Custom design with enhanced UI components and animations',
                modifier: '+40%',
              },
              {
                value: 'custom',
                label: 'Custom Design',
                description:
                  'Fully customized unique design with advanced animations',
                modifier: '+80%',
              },
            ].map((option) => (
              <button
                key={option.value}
                className={`w-full p-4 rounded-lg transition-all ${
                  design === option.value
                    ? 'bg-[#64ffdb7d] text-[#08111e] border-[#64ffda]'
                    : 'border-[#64ffdb82] hover:bg-[#1a2942c5]'
                }`}
                onClick={() => setDesign(option.value)}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{option.label}</span>
                    <span>{option.modifier}</span>
                  </div>
                  <p className="text-sm opacity-80">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            {[
              {
                value: 'standard',
                label: 'Standard (2-3 months)',
                modifier: 'Base price',
              },
              {
                value: 'accelerated',
                label: 'Accelerated (1-2 months)',
                modifier: '+30%',
              },
              {
                value: 'urgent',
                label: 'Urgent (1 month or less)',
                modifier: '+60%',
              },
            ].map((option) => (
              <button
                key={option.value}
                className={`w-full p-4 rounded-lg transition-all ${
                  timeline === option.value
                    ? 'bg-[#64ffdb7d] text-[#08111e] border-[#64ffda]'
                    : 'border-[#64ffdb82] hover:bg-[#1a2942c5]'
                }`}
                onClick={() => setTimeline(option.value)}
              >
                <div className="flex justify-between items-center">
                  <span>{option.label}</span>
                  <span>{option.modifier}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 5:
        const summary = generateSummary();
        return (
          <div className="space-y-6 ">
            <div className="bg-[#1a29427d] text-[#ffffff] rounded-lg p-6 space-y-4 ">
              <h3 className="text-xl font-bold mb-4">Project Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="opacity-80">Project Type:</span>
                  <span className="font-semibold">{summary.projectType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Features:</span>
                  <div className="text-right">
                    {summary.features.map((feature, index) => (
                      <div key={index}>{feature}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Scale:</span>
                  <span className="font-semibold">{summary.scale}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Design:</span>
                  <span className="font-semibold">{summary.design}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Timeline:</span>
                  <span className="font-semibold">{summary.timeline}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-[#64ffda]/20">
                  <span className="text-lg">Total Estimated Cost:</span>
                  <span className="text-2xl font-bold text-[#64ffda]">
                    USD ${summary.totalCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmitQuote}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-[#ffffff]"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="user_name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1a29427d] border border-[#64ffda]/20 focus:border-[#64ffda] focus:outline-none transition-colors"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-[#ffffff]"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="user_email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1a29427d] border border-[#64ffda]/20 focus:border-[#64ffda] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-[#ffffff]"
                >
                  Additional Details (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-20 p-3 rounded-lg bg-[#1a29427d] border border-[#64ffda]/20 focus:border-[#64ffda] focus:outline-none transition-colors"
                  rows={4}
                  placeholder="Any specific requirements or questions?"
                />
              </div>

              {/* Hidden fields to send with the form */}
              <input
                type="hidden"
                name="project_type"
                value={summary.projectType}
              />
              <input
                type="hidden"
                name="features"
                value={summary.features.join(', ')}
              />
              <input type="hidden" name="scale" value={summary.scale} />
              <input type="hidden" name="design" value={summary.design} />
              <input type="hidden" name="timeline" value={summary.timeline} />
              <input
                type="hidden"
                name="total_cost"
                value={`USD $${summary.totalCost.toLocaleString()}`}
              />

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={downloadPDF}
                  className="flex-1 flex items-center justify-centerrounded-lg text-[#ffffff] hover:text-[#64ffda] hover:border-[#64ffda] transition-all btn-sm"
                >
                  <Download className="mr-2" />
                  Download PDF
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 flex items-center justify-center px-1 py-2 rounded-lg transition-all ${
                    isSubmitting
                      ? 'bg-[#64ffda]/50 cursor-not-allowed'
                      : 'bg-[#64ffda] hover:bg-[#4cd9b6]'
                  } text-[#08111e]`}
                >
                  <Send className="mr-2" />
                  {isSubmitting ? 'Sending...' : 'Request Quote'}
                </button>
              </div>
              {submitStatus === 'success' && (
                <div className="p-2 rounded-lg bg-green-500/20 text-green-300">
                  Quote request sent successfully! We'll contact you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-2 rounded-lg bg-red-500/20 text-red-300">
                  There was an error sending your request. Please try again.
                </div>
              )}
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return projectType !== '';
      case 1:
        return true; // Features are optional
      case 2:
        return scale !== '';
      case 3:
        return design !== '';
      case 4:
        return timeline !== '';
      default:
        return false;
    }
  };
  return (
    <div className="p-4 md:p-8 rounded-lg pt-5 backdrop-blur-lg max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg max-h-[90%] lg:max-h-[80%] mx-auto inset-0">
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 ${
                  index < currentStep
                    ? 'bg-[#64ffda]'
                    : index === currentStep
                    ? 'bg-[#64ffda]'
                    : 'bg-[#112240]'
                } h-2 rounded-full mx-1 transition-all duration-300`}
              />
            ))}
          </div>
          <div className="text-center pt-2">
            <h2 className="text-2xl font-bold mb-2 text-[#ffffff]">
              {steps[currentStep].title}
            </h2>
            <p className="text-[#ffffffce]">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Calculator content */}
        <div className="bg-[#112240]/50 border border-[#64ffda]/30 rounded-xl p-3 mb-6">
          {renderStep()}
        </div>

        {/* Running total */}
        {currentStep < 5 && (
          <div className="bg-[#112240]/50 border border-[#64ffda]/30 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-lg">Estimated Cost:</span>
              <span className="text-3xl font-bold text-[#64ffda]">
                USD ${calculateTotalPrice().toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-lg transition-all ${
              currentStep === 0
                ? 'opacity-50 cursor-not-allowed bg-[#112240]/50 border border-[#64ffda]/30'
                : 'bg-[#112240]/50 border border-[#64ffda]/30 hover:border-[#64ffda]/60'
            }`}
          >
            <ChevronLeft className="mr-2" />
            Back
          </button>

          {currentStep < steps.length - 1 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                !canProceed()
                  ? 'opacity-50 cursor-not-allowed bg-[#112240]/50 border border-[#64ffda]/30'
                  : 'bg-[#64ffda] text-[#0a192f] hover:bg-[#64ffda]/90 font-semibold'
              }`}
            >
              Next
              <ChevronRight className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCalculator;
