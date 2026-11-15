// Main Application Logic
const App = {
  theme: 'dark',

  init() {
    this.initTheme();
    this.renderSkills('all');
    this.renderProjects('all');
    this.setupNavigation();
    this.setupWhatsAppForm();
    this.setupEmailToggle();
    this.setupContactForm();
    this.setupModals();
    BlogEngine.init();
  },

  // Theme Management
  initTheme() {
    const savedTheme = localStorage.getItem('shahinur_theme') || 'dark';
    this.setTheme(savedTheme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const nextTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(nextTheme);
      });
    }
  },

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('shahinur_theme', theme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'dark' ? Icons.sun : Icons.moon;
      toggleBtn.setAttribute('title', theme === 'dark' ? 'লাইট মোডে পরিবর্তন করুন' : 'ডার্ক মোডে পরিবর্তন করুন');
    }
  },

  // Setup Navigation & Mobile Drawer
  setupNavigation() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    if (hamburgerBtn && mobileDrawer) {
      hamburgerBtn.addEventListener('click', () => {
        mobileDrawer.classList.toggle('open');
      });

      // Close mobile drawer on link click
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
        });
      });
    }

    // Scroll spy for active navbar link
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 120;
      const sections = document.querySelectorAll('section[id]');

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);

        if (link) {
          if (scrollPos >= top && scrollPos < top + height) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });
    });
  },

  // Render Skills
  renderSkills(category = 'all') {
    const container = document.getElementById('skillsGrid');
    const filterButtons = document.querySelectorAll('#skillsTabs .tab-btn');
    if (!container) return;

    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.skillCat === category);
      btn.onclick = () => this.renderSkills(btn.dataset.skillCat);
    });

    const filtered = category === 'all' 
      ? PortfolioData.skills 
      : PortfolioData.skills.filter(s => s.category === category);

    container.innerHTML = filtered.map(skill => {
      const iconSvg = Icons[skill.icon] || Icons.code;
      return `
        <div class="skill-card">
          <div class="skill-header">
            <div class="skill-name-wrap">
              <div class="skill-icon">${iconSvg}</div>
              <span>${skill.name}</span>
            </div>
            <span class="skill-level-text">${skill.level}%</span>
          </div>
          <div class="skill-bar-bg">
            <div class="skill-bar-fill" style="width: ${skill.level}%"></div>
          </div>
        </div>
      `;
    }).join('');
  },

  // Render Projects
  renderProjects(category = 'all') {
    const container = document.getElementById('projectsGrid');
    const filterButtons = document.querySelectorAll('#projectsFilter .tab-btn');
    if (!container) return;

    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.projectCat === category);
      btn.onclick = () => this.renderProjects(btn.dataset.projectCat);
    });

    const filtered = category === 'all'
      ? PortfolioData.projects
      : PortfolioData.projects.filter(p => p.category === category);

    container.innerHTML = filtered.map(project => {
      const tags = project.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('');
      return `
        <div class="project-card">
          <div class="project-media">
            <img src="${project.image}" alt="${project.title}" loading="lazy" />
            <span class="project-badge-category">${project.categoryName}</span>
          </div>
          <div class="project-body">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-desc">${project.summary}</p>
            <div class="project-tech-tags">${tags}</div>
            <div class="project-footer">
              <a href="${project.liveUrl}" class="project-link-btn" target="_blank" rel="noopener">
                লাইভ ডেমো ${Icons.externalLink}
              </a>
              <a href="${project.githubUrl}" class="project-link-btn" target="_blank" rel="noopener">
                ${Icons.github} গিটহাব কোড
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  // Setup Primary WhatsApp Messaging (01903516116)
  setupWhatsAppForm() {
    const form = document.getElementById('whatsappForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements['name'].value.trim();
      const phone = form.elements['phone'] ? form.elements['phone'].value.trim() : '';
      const subject = form.elements['subject'] ? form.elements['subject'].value.trim() : '';
      const message = form.elements['message'].value.trim();

      if (!name || !message) {
        this.showToast('দয়া করে আপনার নাম এবং বার্তা লিখুন!', 'error');
        return;
      }

      // Format WhatsApp message text
      let text = `হ্যালো Shahinur ভাই,\n\n`;
      text += `*নাম:* ${name}\n`;
      if (phone) text += `*ফোন/পরিচয়:* ${phone}\n`;
      if (subject) text += `*বিষয়:* ${subject}\n`;
      text += `\n*বার্তা:*\n${message}\n\n_(পোর্টফোলিও ওয়েবসাইট থেকে প্রেরিত)_`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=8801903516116&text=${encodeURIComponent(text)}`;

      this.showToast('🎉 আপনার বার্তা প্রস্তুত! সরাসরি WhatsApp ওপেন হচ্ছে...', 'success');
      form.reset();

      // Open directly in same click event (no setTimeout) so browser popup blocker does NOT block it
      try {
        const win = window.open(whatsappUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          window.location.href = whatsappUrl;
        }
      } catch (err) {
        window.location.href = whatsappUrl;
      }
    });
  },

  // Setup Checkbox Toggle for Optional Email Form
  setupEmailToggle() {
    const checkbox = document.getElementById('emailFormCheckbox');
    const container = document.getElementById('emailFormContainer');

    if (!checkbox || !container) return;

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        container.style.display = 'none';
      }
    });
  },

  // Setup Contact Form with Direct Email Delivery (srkhancucse@gmail.com)
  setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'বার্তা পাঠান ✉️';

      const name = form.elements['name'].value.trim();
      const email = form.elements['email'].value.trim();
      const subject = form.elements['subject'].value.trim();
      const message = form.elements['message'].value.trim();

      if (!name || !email || !message) {
        this.showToast('দয়া করে আপনার নাম, ইমেইল এবং বার্তা লিখুন!', 'error');
        return;
      }

      // Show Loading State
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'পাঠানো হচ্ছে... ⏳';
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/srkhancucse@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: subject ? `[Portfolio] ${subject} - ${name}` : `[Portfolio Message] from ${name}`,
            message: message,
            _replyto: email,
            _template: 'table',
            _captcha: 'false'
          })
        });

        const result = await response.json();

        if (response.ok && result.success === 'true') {
          this.showToast('🎉 ধন্যবাদ! আপনার বার্তাটি সরাসরি Shahinur-এর ইনবক্সে পাঠানো হয়েছে।', 'success');
          form.reset();
        } else if (result.message && result.message.toLowerCase().includes('activation')) {
          this.showToast('📩 ফর্মটি সচল করতে আপনার srkhancucse@gmail.com ইনবক্সে আসা "Activate Form" লিংকে একবার ক্লিক করুন!', 'success');
          form.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (error) {
        console.warn('FormSubmit AJAX fallback to mailto:', error);
        // Fallback to mailto link
        const mailtoLink = `mailto:${PortfolioData.profile.email}?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(`নাম: ${name}\nইমেইল: ${email}\n\nবার্তা:\n${message}`)}`;
        this.showToast('আপনার বার্তাটি প্রস্তুত করা হয়েছে। ইমেইল অ্যাপ ওপেন হচ্ছে...', 'success');
        form.reset();
        setTimeout(() => {
          window.location.href = mailtoLink;
        }, 1000);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  },

  // Setup Modals (backdrop click, escape key, close buttons)
  setupModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      });

      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
        });
      }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modals.forEach(m => m.classList.remove('active'));
        document.body.style.overflow = 'auto';
      }
    });
  },

  // Toast Notification System
  showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const iconSvg = type === 'success' ? Icons.check : Icons.close;
    toast.innerHTML = `
      <span style="color: ${type === 'success' ? 'var(--accent-emerald)' : '#ef4444'}">${iconSvg}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

