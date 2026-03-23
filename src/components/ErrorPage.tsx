'use client'

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ErrorPageProps {
  errorType?: "404" | "500" | "loading" | "network";
  title?: string;
  description?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showSearchSuggestions?: boolean;
  customActions?: React.ReactNode;
}

export const ErrorPage = ({
  errorType = "404",
  title,
  description,
  showBackButton = true,
  showHomeButton = true,
  showSearchSuggestions = true,
  customActions
}: ErrorPageProps) => {
  const getErrorConfig = () => {
    switch (errorType) {
      case "404":
        return {
          defaultTitle: "Page Not Found",
          defaultDescription: "The page you're looking for doesn't exist or has been moved.",
          errorCode: "404"
        };
      case "500":
        return {
          defaultTitle: "Internal Server Error",
          defaultDescription: "Something went wrong on our end. Please try again later.",
          errorCode: "500"
        };
      case "loading":
        return {
          defaultTitle: "Loading Content",
          defaultDescription: "Please wait while we fetch your content...",
          errorCode: ""
        };
      case "network":
        return {
          defaultTitle: "Connection Error",
          defaultDescription: "Unable to connect to our servers. Please check your internet connection.",
          errorCode: "Network"
        };
      default:
        return {
          defaultTitle: "Something went wrong",
          defaultDescription: "An unexpected error occurred.",
          errorCode: "Error"
        };
    }
  };

  const config = getErrorConfig();
  const displayTitle = title || config.defaultTitle;
  const displayDescription = description || config.defaultDescription;

  const popularPages = [
    {
      label: "Manufacturing Services",
      href: "/manufacturing-services",
      description: "Explore our comprehensive manufacturing solutions"
    },
    {
      label: "Precision Engineering",
      href: "/cost-engineering",
      description: "Discover our engineering precision capabilities"
    },
    {
      label: "AI-Powered Solutions",
      href: "/solutions/ai",
      description: "Learn about our AI manufacturing solutions"
    },
    {
      label: "Blog & Insights",
      href: "/blog",
      description: "Read our latest manufacturing insights"
    },
    {
      label: "Contact Us",
      href: "/contact",
      description: "Get in touch with our team"
    }
  ];

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 border-b border-border/30 overflow-hidden" style={{backgroundColor: 'rgb(18, 26, 33)'}}>
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4fd3d4_1px,transparent_1px),linear-gradient(to_bottom,#4fd3d4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 pt-4 sm:pt-5 md:pt-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Error Code */}
                {config.errorCode && (
                  <div className="text-8xl md:text-9xl font-bold opacity-20 text-emuski-teal select-none">
                    {config.errorCode}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight px-2">
                  {displayTitle}
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-2">
                  {displayDescription}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                  {showBackButton && (
                    <Button
                      variant="outline"
                      className="border-emuski-teal/50 bg-emuski-teal/10 text-white hover:bg-emuski-teal hover:text-white hover:border-emuski-teal px-8 py-3"
                      onClick={handleGoBack}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Go Back
                    </Button>
                  )}

                  {showHomeButton && (
                    <Link href="/">
                      <Button className="bg-emuski-teal-dark hover:bg-emuski-teal-darker text-white px-8 py-3">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Home
                      </Button>
                    </Link>
                  )}

                  {customActions}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Pages Section */}
      {showSearchSuggestions && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center space-x-3 mb-8">
                <div className="h-1 w-12 bg-emuski-teal-dark rounded"></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore Our Pages</h2>
              </div>

              <p className="text-gray-600 mb-8 text-lg">
                Maybe you're looking for one of these pages instead?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularPages.map((page) => (
                  <Link key={page.href} href={page.href}>
                    <Card className="group overflow-hidden bg-white border-gray-200 hover:border-emuski-teal/50 transition-all duration-300 h-full shadow-sm hover:shadow-md cursor-pointer p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emuski-teal-dark transition-colors">
                        {page.label}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {page.description}
                      </p>
                      <div className="flex items-center text-emuski-teal-darker font-medium text-sm">
                        Learn More
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1">
                          <path d="m9 18 6-6-6-6"></path>
                        </svg>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Search Suggestion */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 text-gray-600">
                  <Search className="h-5 w-5 text-emuski-teal-dark" />
                  <span className="text-base">
                    Still can't find what you're looking for?{" "}
                    <Link href="/" className="font-medium text-emuski-teal-dark hover:text-emuski-teal-darker underline">
                      Visit our homepage
                    </Link>
                    {" "}or{" "}
                    <Link href="/contact" className="font-medium text-emuski-teal-dark hover:text-emuski-teal-darker underline">
                      contact our team
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// Export specialized error page components
export const NotFoundPage = (props: Partial<ErrorPageProps>) => (
  <ErrorPage errorType="404" {...props} />
);

export const ServerErrorPage = (props: Partial<ErrorPageProps>) => (
  <ErrorPage errorType="500" {...props} />
);

export const LoadingPage = (props: Partial<ErrorPageProps>) => (
  <ErrorPage errorType="loading" showSearchSuggestions={false} {...props} />
);

export const NetworkErrorPage = (props: Partial<ErrorPageProps>) => (
  <ErrorPage errorType="network" {...props} />
);
