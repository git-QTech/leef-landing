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
    threshold: 0.05
  });

  document.querySelectorAll('.reveal').forEach(section => {
    // Immediately activate elements already visible in the viewport on load
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      section.classList.add('active');
    } else {
      revealObserver.observe(section);
    }
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

    const macDownload = document.getElementById('mac-download');
    const macDownloadStatus = document.getElementById('mac-download-status');
    const macDownloadPage = document.getElementById('mac-download-page');
    const macCard = document.getElementById('mac-card');
    const macPill = document.getElementById('mac-pill');
    const macVersionTag = document.getElementById('mac-version-tag');
    const macBtnPlaceholder = document.getElementById('mac-btn-placeholder');
    const openInstructions = document.getElementById('open-instructions');
    const macRequirement = document.getElementById('mac-requirement');

    const linuxDownload = document.getElementById('linux-download');
    const linuxDownloadStatus = document.getElementById('linux-download-status');
    const linuxDownloadPage = document.getElementById('linux-download-page');
    const linuxCard = document.getElementById('linux-card');
    const linuxPill = document.getElementById('linux-pill');
    const linuxVersionTag = document.getElementById('linux-version-tag');
    const linuxBtnPlaceholder = document.getElementById('linux-btn-placeholder');

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

        // Update Download Links
        if (data.assets) {
          // Windows (.exe)
          const exeAsset = data.assets.find(asset => asset.name.endsWith('.exe'));
          if (exeAsset) {
            if (winDownload) winDownload.href = exeAsset.browser_download_url;
            if (winDownloadPage) winDownloadPage.href = exeAsset.browser_download_url;
          }

          // macOS (.dmg / .pkg)
          const dmgAsset = data.assets.find(asset => asset.name.endsWith('.dmg') || asset.name.endsWith('.pkg'));
          if (dmgAsset) {
            // Enable macOS Dropdown Download Link
            if (macDownload) {
              macDownload.href = dmgAsset.browser_download_url;
              macDownload.classList.remove('disabled');
            }
            if (macDownloadStatus) {
              macDownloadStatus.textContent = 'Direct Download (.dmg)';
            }

            // Enable macOS Downloads Page Card
            if (macCard) {
              macCard.classList.remove('disabled');
              macCard.classList.add('featured');
            }
            if (macPill) {
              macPill.textContent = 'Stable';
              macPill.classList.remove('beta');
            }
            if (macVersionTag) {
              macVersionTag.innerHTML = `Version <span class="current-version">${data.tag_name}</span> (Universal)`;
            }
            if (macDownloadPage) {
              macDownloadPage.href = dmgAsset.browser_download_url;
              macDownloadPage.style.display = 'inline-flex';
            }
            if (macBtnPlaceholder) {
              macBtnPlaceholder.style.display = 'none';
            }
            if (openInstructions) {
              openInstructions.style.display = 'inline-flex';
            }
            if (macRequirement) {
              macRequirement.style.opacity = '1';
              macRequirement.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                  stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                macOS 11.0 or later
              `;
            }
          }

          // Linux (.deb / .rpm / .AppImage)
          const linuxAsset = data.assets.find(asset => asset.name.endsWith('.deb') || asset.name.endsWith('.rpm') || asset.name.endsWith('.AppImage'));
          if (linuxAsset) {
            // Enable Linux Dropdown Download Link (takes to GitHub Release page)
            if (linuxDownload) {
              linuxDownload.href = data.html_url;
              linuxDownload.classList.remove('disabled');
            }
            if (linuxDownloadStatus) {
              linuxDownloadStatus.textContent = 'Choose Package (.deb, .rpm, .AppImage)';
            }

            // Enable Linux Downloads Page Card
            if (linuxCard) {
              linuxCard.classList.remove('disabled');
            }
            if (linuxPill) {
              linuxPill.textContent = 'Stable';
              linuxPill.classList.remove('beta');
            }
            if (linuxVersionTag) {
              linuxVersionTag.innerHTML = `Version <span class="current-version">${data.tag_name}</span>`;
            }
            if (linuxDownloadPage) {
              linuxDownloadPage.href = data.html_url;
              linuxDownloadPage.style.display = 'inline-flex';
            }
            if (linuxBtnPlaceholder) {
              linuxBtnPlaceholder.style.display = 'none';
            }
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

// Interactive Elements Logic
document.addEventListener('DOMContentLoaded', () => {
  // Data Sold Ticker Animation
  const dataSoldTicker = document.getElementById('data-valuation-value');
  if (dataSoldTicker) {
    const dataSoldObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let duration = 2000; // 2 seconds spin
          let start = Date.now();

          let spinInterval = setInterval(() => {
            let now = Date.now();
            if (now - start > duration) {
              clearInterval(spinInterval);
              dataSoldTicker.textContent = '$ 0.00';
              dataSoldTicker.classList.add('snapped');
            } else {
              let randomVal = (Math.random() * 100000).toFixed(2);
              dataSoldTicker.textContent = '$ ' + parseFloat(randomVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
          }, 40);

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    // Find the parent section to observe so it triggers a bit earlier
    const privacySection = document.getElementById('privacy');
    if (privacySection) {
      dataSoldObserver.observe(privacySection);
    } else {
      dataSoldObserver.observe(dataSoldTicker);
    }
  }

  // Slop Wiper Showcase (Sticky Scroll-based)
  const slopWiper = document.getElementById('slop-wiper-container');
  const scrollWrapper = document.querySelector('.slop-wiper-scroll-wrapper');
  if (slopWiper && scrollWrapper) {
    const calculateWiper = () => {
      const wrapperRect = scrollWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      let progress = 0;
      if (wrapperRect.top <= 80) {
        progress = Math.abs(wrapperRect.top - 80) / windowHeight;
      }

      progress = Math.max(0, Math.min(1, progress));

      slopWiper.style.setProperty('--wipe', `${progress * 100}%`);
    };

    window.addEventListener('scroll', calculateWiper);
    calculateWiper(); // Run once to set initial state
  }

  // Weight Animation — progressive sinking
  const weightIcon   = document.getElementById('weight-icon');
  const weightShadow = document.getElementById('weight-shadow');
  const weightLabel  = document.getElementById('weight-label');
  const browserImg   = document.getElementById('weight-browser-img');
  const leefImg      = document.getElementById('weight-leef-img');
  const badges = [
    document.getElementById('wb1'),
    document.getElementById('wb2'),
    document.getElementById('wb3'),
    document.getElementById('wb4'),
    document.getElementById('wb5'),
  ];
  const leefBadges = [
    document.getElementById('lb1'),
    document.getElementById('lb2'),
    document.getElementById('lb3'),
    document.getElementById('lb4'),
  ];

  // Sink capped at 14px — icon-wrap is 120px tall so shadow stays inside it
  const sinkSteps   = [2, 5, 8, 11, 14];
  const squishSteps = [1, 0.98, 0.96, 0.94, 0.92];
  const shadowWidths = [70, 88, 104, 122, 142];
  const shadowAlphas = [0.12, 0.18, 0.25, 0.32, 0.40];

  function setSunk(step) {
    const sink = sinkSteps[step];
    const squish = squishSteps[step];
    weightIcon.style.transform    = `translateY(${sink}px) scaleY(${squish})`;
    // Counter the parent's translateY so the shadow stays fixed on screen
    weightShadow.style.transform  = `translateX(-50%) translateY(${-sink}px)`;
    weightShadow.style.width      = shadowWidths[step] + 'px';
    weightShadow.style.background = `radial-gradient(ellipse, rgba(0,0,0,${shadowAlphas[step]}) 0%, transparent 70%)`;
  }

  function resetSunk() {
    weightIcon.style.transform    = '';
    weightShadow.style.transform  = ''; // CSS translateX(-50%) takes over again
    weightShadow.style.width      = '';
    weightShadow.style.background = '';
  }

  if (weightIcon && badges[0] && browserImg && leefImg) {
    const clearAt   = 500 + (badges.length - 1) * 420 + 1100;
    const loopTotal = clearAt + 2800 + 600;

    function runWeightLoop() {
      // Reset: browser icon, clear all badges
      browserImg.classList.remove('weight-swap-hidden');
      leefImg.classList.add('weight-swap-hidden');
      weightIcon.classList.remove('clean');
      resetSunk();
      badges.forEach(b => b.classList.remove('visible'));
      leefBadges.forEach(b => b.classList.remove('visible'));

      // Drop each negative badge, sink the icon progressively
      badges.forEach((b, i) => {
        setTimeout(() => {
          b.classList.add('visible');
          setSunk(i);
        }, 500 + i * 420);
      });

      // Spring clean: swap to Leef, pop in green badges
      setTimeout(() => {
        badges.forEach(b => b.classList.remove('visible'));
        browserImg.classList.add('weight-swap-hidden');
        leefImg.classList.remove('weight-swap-hidden');
        weightIcon.classList.add('clean');
        weightIcon.style.transform    = 'translateY(-6px) scaleY(1)';
        // Icon springs up 6px, counter so shadow stays fixed
        weightShadow.style.transform  = 'translateX(-50%) translateY(6px)';
        weightShadow.style.width      = '44px';
        weightShadow.style.background = 'radial-gradient(ellipse, rgba(90,239,126,0.18) 0%, transparent 70%)';
        weightLabel.textContent = 'LEEF';
        weightLabel.classList.add('leef-state');

        // Stagger in the positive badges
        leefBadges.forEach((b, i) => {
          setTimeout(() => b.classList.add('visible'), 200 + i * 160);
        });
      }, clearAt);

      // Reset for next loop
      setTimeout(() => {
        leefBadges.forEach(b => b.classList.remove('visible'));
        weightLabel.textContent = 'A TYPICAL BROWSER';
        weightLabel.classList.remove('leef-state');
      }, clearAt + 2800);
    }

    runWeightLoop();
    setInterval(runWeightLoop, loopTotal);
  }

  // Languages text animation
  const helloText = document.getElementById('hello-text');
  if (helloText) {
    const phrases = [
      "Parlez-vous",
      "¿Hablas",
      "Spreek je",
      "Do you speak",
      "Parli",
      "Sprichst du"
    ];
    let phraseIndex = 0;

    // Set initial explicit width so we can transition it
    helloText.style.width = helloText.offsetWidth + 'px';

    setInterval(() => {
      const oldWidth = helloText.offsetWidth;
      helloText.classList.add('hidden');
      
      // Wait for fade-out transition
      setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        
        // Temporarily turn off transition to measure new width instantly
        helloText.style.transition = 'none';
        helloText.style.width = 'auto';
        helloText.textContent = phrases[phraseIndex];
        
        const newWidth = helloText.offsetWidth;
        
        // Revert to old width and turn transition back on
        helloText.style.width = oldWidth + 'px';
        // Force reflow
        void helloText.offsetHeight; 
        
        helloText.style.transition = ''; // Restore CSS transitions
        
        // Now trigger the animation to new width and fade in
        helloText.style.width = newWidth + 'px';
        helloText.classList.remove('hidden');
      }, 400); // Matches the 0.4s transition in CSS
    }, 2500); // Changes every 2.5s
  }


});
