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
    const winDownloadPage = document.getElementById('win-download-page');
    const currentVersionSpans = document.querySelectorAll('.current-version');
    
    try {
      const response = await fetch('https://api.github.com/repos/git-QTech/leef/releases/latest');
      if (response.ok) {
        const data = await response.json();
        
        // Update Version Text
        if (data.tag_name) {
          if (versionSpan) versionSpan.textContent = data.tag_name;
          currentVersionSpans.forEach(span => {
            span.textContent = data.tag_name;
          });
        }

        // Update Windows Download Links
        if (data.assets) {
          const exeAsset = data.assets.find(asset => asset.name.endsWith('.exe'));
          if (exeAsset) {
            if (winDownload) winDownload.href = exeAsset.browser_download_url;
            if (winDownloadPage) winDownloadPage.href = exeAsset.browser_download_url;
          }
        }
      }
    } catch (error) {
      console.log('GitHub API fetch failed, using fallback links.');
    }
  }

  updateVersionAndLinks();
});

// Modal Logic
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('instructions-modal');
  const openBtn = document.getElementById('open-instructions');
  const closeBtn = document.getElementById('close-instructions');
  
  if (openBtn && modal && closeBtn) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scroll
    });
    
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});
