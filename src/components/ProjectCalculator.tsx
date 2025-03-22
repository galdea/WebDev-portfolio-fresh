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
    { name: 'Blog Functionality', percentage: 15, selected: false },
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

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const summary = generateSummary();

    try {
      // Create the PDF document
      const doc = createPDF();
      // Convert PDF to base64 data URL
      const pdfDataUrl = doc.output('datauristring');

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
        pdf_attachment: pdfDataUrl,
      };

      // Send the email using EmailJS
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);

      setSubmitStatus('success');
      setMessage('');
    } catch (error) {
      console.error('Error submitting quote:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };
  const createPDF = () => {
    const summary = generateSummary();

    // Create new PDF document
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: 'Web Development Project Quote',
      subject: 'Professional Quote for Web Development Services',
      author: 'Gabriel Aldea',
      creator: 'Web Development Portfolio',
    });

    // Use only the specified color palette (hex to RGB conversion)
    const colors = {
      teal: [100, 255, 218], // #64ffda - Primary accent
      darkBlue: [18, 31, 52], // #121f34 - Medium dark background
      deepBlue: [8, 17, 30], // #08111e - Darkest background
      lightText: [230, 241, 255], // #e6f1ff - Bright text
      mutedText: [136, 146, 175], // #8892af - Muted text
    };

    // Set page background to the darkest blue
    doc.setFillColor(
      colors.deepBlue[0],
      colors.deepBlue[1],
      colors.deepBlue[2],
    );
    doc.rect(0, 0, 210, 297, 'F');

    // Add a professional header section
    doc.setFillColor(
      colors.darkBlue[0],
      colors.darkBlue[1],
      colors.darkBlue[2],
    );
    doc.rect(0, 0, 210, 50, 'F');

    // Add a subtle accent strip on top
    doc.setFillColor(colors.teal[0], colors.teal[1], colors.teal[2]);
    doc.rect(0, 0, 210, 3, 'F');

    // Add title with clean, professional styling
    doc.setTextColor(
      colors.lightText[0],
      colors.lightText[1],
      colors.lightText[2],
    );
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('WEB DEVELOPMENT', 25, 20);

    doc.setTextColor(colors.teal[0], colors.teal[1], colors.teal[2]);
    doc.setFontSize(26);
    doc.text('PROJECT QUOTE', 25, 32);

    // Add subtitle
    doc.setTextColor(
      colors.mutedText[0],
      colors.mutedText[1],
      colors.mutedText[2],
    );
    doc.setFontSize(9);
    doc.text('Professional web solutions', 25, 42);

    // Add document date
    const today = new Date();
    const dateStr = today.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.setFontSize(8);
    doc.text(`Generated: ${dateStr}`, 150, 42);

    // Add content sections with clean, modern styling
    const startY = 65;
    let currentY = startY;

    // Project section
    // Add section divider
    doc.setDrawColor(
      colors.mutedText[0],
      colors.mutedText[1],
      colors.mutedText[2],
    );
    doc.setLineWidth(0.2);
    doc.line(15, currentY - 8, 195, currentY - 8);
    doc.setTextColor(
      colors.mutedText[0],
      colors.mutedText[1],
      colors.mutedText[2],
    );
    doc.setFontSize(8);
    doc.text('PROJECT SPECIFICATIONS', 15, currentY - 10);
    currentY += 5;

    // Project type
    doc.setFillColor(
      colors.darkBlue[0],
      colors.darkBlue[1],
      colors.darkBlue[2],
    );
    doc.roundedRect(15, currentY - 5, 180, 14, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colors.teal[0], colors.teal[1], colors.teal[2]);
    doc.text('PROJECT TYPE:', 20, currentY + 2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(
      colors.lightText[0],
      colors.lightText[1],
      colors.lightText[2],
    );
    doc.text(summary.projectType, 80, currentY + 2);
    currentY += 18;

    currentY += 2;

    // Project parameters section
    doc.setDrawColor(
      colors.mutedText[0],
      colors.mutedText[1],
      colors.mutedText[2],
    );
    doc.setLineWidth(0.2);
    doc.line(15, currentY - 3, 195, currentY - 3);
    doc.setTextColor(
      colors.mutedText[0],
      colors.mutedText[1],
      colors.mutedText[2],
    );
    doc.setFontSize(8);
    doc.text('PROJECT PARAMETERS', 15, currentY - 5);
    currentY += 8;

    // Create a grid layout for specifications
    const createSpecBox = (label, value, posY) => {
      doc.setFillColor(
        colors.darkBlue[0],
        colors.darkBlue[1],
        colors.darkBlue[2],
      );
      doc.roundedRect(15, posY - 5, 55, 25, 2, 2, 'F');

      // Label with clean styling
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(colors.teal[0], colors.teal[1], colors.teal[2]);
      doc.text(label.toUpperCase(), 20, posY + 2);

      // Value
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(
        colors.lightText[0],
        colors.lightText[1],
        colors.lightText[2],
      );
      doc.text(value, 20, posY + 12);
    };

    // Create specification boxes in a grid layout
    createSpecBox('Features', summary.features, currentY);
    createSpecBox('Scale', summary.scale, currentY);
    createSpecBox('Design', summary.design, currentY);
    createSpecBox('Timeline', summary.timeline, currentY + 30);

    currentY += 65;

    // Quote box with clean styling
    doc.setDrawColor(colors.teal[0], colors.teal[1], colors.teal[2]);
    doc.setLineWidth(0.5);
    doc.setFillColor(
      colors.darkBlue[0],
      colors.darkBlue[1],
      colors.darkBlue[2],
    );
    doc.roundedRect(15, currentY - 5, 180, 40, 3, 3, 'FD');

    // Add pricing label
    doc.setTextColor(
      colors.mutedText[0],
      colors.mutedText[1],
      colors.mutedText[2],
    );
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('TOTAL ESTIMATED COST', 25, currentY + 10);

    // Price with clean styling
    doc.setTextColor(colors.teal[0], colors.teal[1], colors.teal[2]);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${summary.totalCost.toLocaleString()} USD`, 25, currentY + 20, {
      align: 'left', // Align text to the left
    });

    // Add disclaimer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(
      colors.mutedText[0],
      colors.mutedText[1],
      colors.mutedText[2],
    );
    doc.text(
      '*  This quote is provided for reference purposes only and requires further discussion.',
      25,
      currentY + 45,
    );

    // Footer section
    const footerY = 250;

    // Add professionally styled footer
    doc.setFillColor(
      colors.darkBlue[0],
      colors.darkBlue[1],
      colors.darkBlue[2],
    );
    doc.rect(0, footerY - 5, 250, 52, 'F');

    // Add footer accent
    doc.setFillColor(colors.teal[0], colors.teal[1], colors.teal[2]);
    doc.rect(0, footerY - 5, 250, 1, 'F');

    // Contact information with modern styling
    doc.setFontSize(10);
    doc.setTextColor(
      colors.mutedText[0],
      colors.mutedText[1],
      colors.mutedText[2],
    );
    doc.text('CONTACT INFORMATION', 20, footerY + 5);

    // Email
    doc.setTextColor(
      colors.lightText[0],
      colors.lightText[1],
      colors.lightText[2],
    );
    doc.text('Email:', 20, footerY + 15);
    doc.setTextColor(colors.teal[0], colors.teal[1], colors.teal[2]);
    doc.text('galdea@uc.cl', 60, footerY + 15);

    // Website
    doc.setTextColor(
      colors.lightText[0],
      colors.lightText[1],
      colors.lightText[2],
    );
    doc.text('Website:', 20, footerY + 25);
    doc.setTextColor(colors.teal[0], colors.teal[1], colors.teal[2]);
    doc.text('https://gabrielaldea.netlify.app', 60, footerY + 25);

    // Whatsapp
    doc.setTextColor(
      colors.lightText[0],
      colors.lightText[1],
      colors.lightText[2],
    );
    doc.text('Whatsapp:', 20, footerY + 35);
    doc.setTextColor(colors.teal[0], colors.teal[1], colors.teal[2]);
    doc.text('(+569) 93441532', 60, footerY + 35);

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
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[60vh]">
              {features.map((feature, index) => (
                <button
                  key={index}
                  className={`w-full p-3 sm:p-4 rounded-lg transition-all border ${
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
                    <span className="text-sm sm:text-base">{feature.name}</span>
                    <span className="text-sm sm:text-base">
                      +{feature.percentage}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
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
          <div className="space-y-6">
            <div className="bg-[#1a29427d] text-[#ffffff] rounded-lg p-6 space-y-4 hidden sm:block">
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
              </div>
            </div>

            {/* Estimated Cost - Always visible */}
            <div className="bg-[#112240]/50 border border-[#64ffda]/30 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg sm:text-xl">
                  Total Estimated Cost:
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-[#64ffda]">
                  USD ${summary.totalCost.toLocaleString()}
                </span>
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
                value={` $${summary.totalCost.toLocaleString()}`}
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
        <div className="sm:mb-2 md:mb-6 lg:mb-6">
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
            <p className="text-[#ffffffce] hidden sm:block">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Calculator content */}
        <div className="bg-[#112240]/50 border border-[#64ffda]/30 rounded-xl p-3 mb-2 sm:mb-2 md:mb-6 lg:mb-6 ">
          {renderStep()}
        </div>

        {/* Running total */}
        {currentStep < 5 && (
          <div className="bg-[#112240]/50 border border-[#64ffda]/30 rounded-xl p-4 mb-2 sm:mb-2 md:mb-6 lg:mb-6">
            {' '}
            <div className="flex justify-between items-center">
              <span className="text-base sm:text-lg">
                Estimated Cost (USD):
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-[#64ffda]">
                ${calculateTotalPrice().toLocaleString()}
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
