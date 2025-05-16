
document.addEventListener('DOMContentLoaded', function () {
      document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      });
      document.addEventListener('copy', function (e) {
        e.preventDefault();
      });
    });
  
    const placeholders = [
        "Hey! What can I help you find?",
        "Search the web...",
        "Search anything, anytime...",
        "Type a question or keyword...",
        "Explore the web your way...",
        "What's trending now?",
        "Search latest headlines...",
        "Search for products, brands, or categories...",
        "Search for facts, terms, or definitions..."
    ];

    let index = 0;
    const typingSpeed = 100; // Time between each character (ms)
    const delayBetweenPhrases = 2000; // Time to wait after each phrase (ms)

    const input = document.getElementById('search');

    function typePlaceholder(text, callback) {
      let charIndex = 0;
      input.placeholder = "";

      const type = () => {
        if (charIndex < text.length) {
          input.placeholder += text.charAt(charIndex);
          charIndex++;
          setTimeout(type, typingSpeed);
        } else {
          // After the full text is typed, wait then call callback
          setTimeout(callback, delayBetweenPhrases);
        }
      };

      type();
    }

    function startTypingCycle() {
      typePlaceholder(placeholders[index], () => {
        index = (index + 1) % placeholders.length;
        startTypingCycle(); // Repeat the cycle
      });
    }

    // Start the animation
    startTypingCycle();
    