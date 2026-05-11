document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        const navHeight = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll Reveal Observer
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, we don't need to observe it anymore
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(section => {
    revealObserver.observe(section);
  });

  // Fetch Latest Version from GitHub
  async function updateVersion() {
    const versionSpan = document.getElementById('leef-version');
    if (!versionSpan) return;
    
    try {
      const response = await fetch('https://api.github.com/repos/git-QTech/leef/releases/latest');
      if (response.ok) {
        const data = await response.json();
        if (data.tag_name) {
          versionSpan.textContent = data.tag_name;
        }
      }
    } catch (error) {
      console.log('GitHub API fetch failed, using fallback version.');
    }
  }

  updateVersion();
});
