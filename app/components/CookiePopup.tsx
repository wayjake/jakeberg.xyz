import { useState, useEffect } from "react";

export function CookiePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the popup
    const dismissed = sessionStorage.getItem("cookiePopupDismissed");
    if (!dismissed) {
      // Show popup after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("cookiePopupDismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Darkened backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleDismiss}
      />

      {/* Bottom popup */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-2xl border-t-4 border-blue-600 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  🍪 We Actually Don't Use Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  I'm not tracking you. I really despise these popups. I thought
                  popups were bad enough in the 90's when they gave us viruses,
                  but now this? We've been threatened with fines of 4% of revenue
                  if we don't post these. Talk about extortion.
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={handleDismiss}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  Fine, I Get It 🙄
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all whitespace-nowrap text-sm"
                >
                  Make This Annoyance Disappear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add slide-up animation */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
