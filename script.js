document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for internal anchor links only
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return; // Ignore empty anchors
      
      try {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      } catch (err) {
        // Not a valid selector (likely an external link), let browser handle it
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

  // Download Dropdown Toggle
  const downloadBtn = document.getElementById('download-btn');
  const downloadMenu = document.getElementById('download-menu');

  if (downloadBtn && downloadMenu) {
    downloadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadMenu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      downloadMenu.classList.remove('active');
    });
  }

  // Fetch Latest Version and Download Link from GitHub
  async function updateVersionAndLinks() {
    const versionSpan = document.getElementById('leef-version');
    const winDownload = document.getElementById('win-download');
    
    try {
      const response = await fetch('https://api.github.com/repos/git-QTech/leef/releases/latest');
      if (response.ok) {
        const data = await response.json();
        
        // Update Version Text
        if (data.tag_name && versionSpan) {
          versionSpan.textContent = data.tag_name;
        }

        // Update Windows Download Link
        if (data.assets && winDownload) {
          const exeAsset = data.assets.find(asset => asset.name.endsWith('.exe'));
          if (exeAsset) {
            winDownload.href = exeAsset.browser_download_url;
          }
        }
      }
    } catch (error) {
      console.log('GitHub API fetch failed, using fallback links.');
    }
  }

  updateVersionAndLinks();
});
