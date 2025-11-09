import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { ArrowRight, CheckCircle } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";

export default function Homepage() {
  const features = [
    {
      icon: "mdi:hospital-box",
      title: "Continuing Education",
      description: "Training and certification programs for orthopedic and traumatology specialists"
    },
    {
      icon: "mdi:people-outline",
      title: "Professional Community",
      description: "Indonesia's largest network of specialist doctors with the highest ethical standards"
    },
    {
      icon: "mdi:book-open-outline",
      title: "Research & Innovation",
      description: "Supporting research and development in orthopedics and traumatology"
    },
    {
      icon: "mdi:heart-outline",
      title: "Healthcare Services",
      description: "Improving the quality of orthopedic healthcare services throughout Indonesia"
    }
  ];

  const programs = [
    {
      title: "Education Program",
      description: "Orthopedic and traumatology specialist training with international curriculum",
      icon: "mdi:school-outline"
    },
    {
      title: "Annual Conference",
      description: "Annual scientific meeting with leading international speakers",
      icon: "mdi:presentation-play"
    },
    {
      title: "Professional Certification",
      description: "Certification program to enhance specialist doctor competencies",
      icon: "mdi:certificate-outline"
    }
  ];

  return (
    <HomepageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Indonesian College of Orthopedics & Traumatology
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 leading-relaxed">
                A leading professional organization committed to improving the quality of orthopedic and traumatology healthcare services in Indonesia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/cms/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Join Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#about"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-blue-500 bg-opacity-30 rounded-2xl p-8 border border-blue-400 border-opacity-50">
                <Icon icon="mdi:hospital-box" className="w-32 h-32 text-blue-100 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 sm:py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">5000+</div>
              <p className="text-gray-600 font-medium">Active Members</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">50+</div>
              <p className="text-gray-600 font-medium">Regional Branches</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">30+</div>
              <p className="text-gray-600 font-medium">Years Established</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-gray-600 font-medium">Professional</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              About Us
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The Indonesian College of Orthopedics & Traumatology is a professional organization established to improve the standards of orthopedic and traumatology healthcare services in Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                <Icon icon={feature.icon} className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Various flagship programs to support professional development and improve healthcare service quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100 hover:border-blue-300 transition-colors">
                <Icon icon={program.icon} className="w-16 h-16 text-blue-600 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{program.title}</h3>
                <p className="text-gray-600 mb-6">{program.description}</p>
                <Link href="#" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
                Benefits of Membership
              </h2>
              <ul className="space-y-4">
                {[
                  "Access to continuing education and training programs",
                  "Professional network with leading specialist doctors",
                  "International certification and credentials",
                  "Access to scientific journals and publications",
                  "Career development support",
                  "Supportive community for knowledge sharing"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-12 border border-blue-200">
              <Icon icon="mdi:check-circle-outline" className="w-48 h-48 text-blue-600 mx-auto opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 sm:py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Join Us?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Register now and become part of Indonesia's largest professional orthopedic and traumatology community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cms/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Register Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+62274515151"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
}