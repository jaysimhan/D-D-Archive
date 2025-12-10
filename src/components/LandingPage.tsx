import { BookOpen, Wand2, Dices, FileText, Sparkles, Shield, Settings } from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: "library" | "creator" | "admin") => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: BookOpen,
      title: "Universal Library",
      description:
        "Browse comprehensive archives of spells, classes, races, items, and backgrounds from both 2014 and 2024 editions.",
      action: () => onNavigate("library"),
      buttonText: "Explore Library",
      color: "from-red-600 to-red-800",
    },
    {
      icon: Wand2,
      title: "Character Creator",
      description:
        "Build your perfect character with our intelligent step-by-step wizard featuring automatic rules validation.",
      action: () => onNavigate("creator"),
      buttonText: "Create Character",
      color: "from-purple-600 to-indigo-800",
    },
    {
      icon: Settings,
      title: "Content Manager",
      description:
        "Add, edit, and manage D&D content. Import SRD data or create your own homebrew content with full validation.",
      action: () => onNavigate("admin"),
      buttonText: "Manage Content",
      color: "from-amber-600 to-orange-800",
    },
  ];

  const additionalFeatures = [
    {
      icon: Sparkles,
      title: "Edition Support",
      description: "Full support for both 2014 Legacy and 2024 Revised rulesets",
    },
    {
      icon: Dices,
      title: "Dice Roller",
      description: "Built-in physics-based dice roller with roll history",
    },
    {
      icon: FileText,
      title: "PDF Export",
      description: "Generate professional character sheets in PDF format",
    },
    {
      icon: Shield,
      title: "Rules Engine",
      description: "Intelligent validation ensures legal character builds",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <Dices className="w-16 h-16 text-purple-400" />
            <h1 className="text-white text-6xl">The D&D Omni-Archive</h1>
          </div>

          <p className="text-2xl text-purple-200 mb-4 max-w-3xl mx-auto">
            Your Complete Library & Character Builder for Dungeons & Dragons 5th Edition
          </p>

          <p className="text-lg text-purple-300 mb-12 max-w-2xl mx-auto">
            Supporting both Legacy (2014) and Revised (2024) rulesets with intelligent
            rules validation and comprehensive content archives
          </p>

          {/* Main Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-white text-2xl mb-4">{feature.title}</h2>
                  <p className="text-purple-200 mb-6">{feature.description}</p>
                  <button
                    onClick={feature.action}
                    className={`px-8 py-3 bg-gradient-to-r ${feature.color} text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all`}
                  >
                    {feature.buttonText}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <Icon className="w-10 h-10 text-purple-400 mb-4 mx-auto" />
                  <h3 className="text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-purple-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-white text-3xl text-center mb-12">
            Everything You Need for Your D&D Adventures
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl text-purple-400 mb-2">1000+</div>
              <div className="text-purple-200">Spells & Items</div>
            </div>
            <div>
              <div className="text-4xl text-purple-400 mb-2">73+</div>
              <div className="text-purple-200">Classes & Subclasses</div>
            </div>
            <div>
              <div className="text-4xl text-purple-400 mb-2">84+</div>
              <div className="text-purple-200">Races & Subraces</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-purple-300 text-sm">
            Built with React & Tailwind CSS • Mock data for demonstration purposes
          </p>
          <p className="text-purple-400 text-xs mt-2">
            Not affiliated with Wizards of the Coast • For educational purposes
          </p>
        </div>
      </div>
    </div>
  );
}