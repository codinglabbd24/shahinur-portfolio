// Blog Management & Publishing Engine for Shahinur Rahman Khan's Portfolio
const BlogEngine = {
  storageKey: 'shahinur_portfolio_blogs_v1',
  blogs: [],
  activeCategory: 'all',
  searchQuery: '',

  // Initialize Blog System
  init() {
    this.loadBlogs();
    this.renderCategoryPills();
    this.renderBlogGrid();
    this.setupEventListeners();
  },

  // Load from LocalStorage or Fallback to Default Data
  loadBlogs() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.blogs = JSON.parse(stored);
      } else {
        this.blogs = [...PortfolioData.defaultBlogs];
        this.saveBlogs();
      }
    } catch (e) {
      console.error('Error loading blogs from localStorage:', e);
      this.blogs = [...PortfolioData.defaultBlogs];
    }
  },

  // Save to LocalStorage
  saveBlogs() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.blogs));
    } catch (e) {
      console.error('Error saving blogs:', e);
    }
  },

  // Get distinct categories
  getCategories() {
    const categories = new Set(this.blogs.map(b => b.category));
    return ['all', ...Array.from(categories)];
  },

  // Render Category Filter Pills
  renderCategoryPills() {
    const container = document.getElementById('blogCategoryFilter');
    if (!container) return;

    const categories = this.getCategories();
    container.innerHTML = categories.map(cat => {
      const label = cat === 'all' ? 'সব ব্লগ (All)' : cat;
      const isActive = this.activeCategory === cat ? 'active' : '';
      return `<button class="tab-btn ${isActive}" data-category="${cat}">${label}</button>`;
    }).join('');

    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeCategory = btn.dataset.category;
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderBlogGrid();
      });
    });
  },

  // Filter Blogs by Category and Search Term
  getFilteredBlogs() {
    return this.blogs.filter(blog => {
      const matchesCategory = this.activeCategory === 'all' || blog.category.toLowerCase() === this.activeCategory.toLowerCase();
      const q = this.searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.summary.toLowerCase().includes(q) ||
        (blog.tags && blog.tags.some(t => t.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  },

  // Render Grid Cards
  renderBlogGrid() {
    const grid = document.getElementById('blogGrid');
    const countBadge = document.getElementById('blogCountBadge');
    if (!grid) return;

    const filtered = this.getFilteredBlogs();
    if (countBadge) {
      countBadge.textContent = `${filtered.length} টি ব্লগ`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📝</div>
          <h3 style="margin-bottom: 0.5rem;">কোনো ব্লগ পাওয়া যায়নি</h3>
          <p style="margin-bottom: 1.5rem;">আপনার সার্চ কোয়েরি পরিবর্তন করুন অথবা এখনই নতুন ব্লগ পাবলিশ করুন।</p>
          <button class="btn btn-primary" id="emptyPublishBtn">
            ${Icons.penSquare} নতুন ব্লগ লিখুন
          </button>
        </div>
      `;
      const btn = document.getElementById('emptyPublishBtn');
      if (btn) btn.addEventListener('click', () => this.openPublishModal());
      return;
    }

    grid.innerHTML = filtered.map(blog => {
      const fallbackImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';
      const cover = blog.coverImage && blog.coverImage.trim() ? blog.coverImage : fallbackImage;

      return `
        <article class="blog-card" data-blog-id="${blog.id}">
          <div class="blog-card-media">
            <img src="${cover}" alt="${this.escapeHtml(blog.title)}" loading="lazy" onerror="this.src='${fallbackImage}'" />
            <span class="blog-category-tag">${this.escapeHtml(blog.category)}</span>
          </div>
          <div class="blog-card-body">
            <div class="blog-meta-top">
              <span>${Icons.calendar} ${blog.date}</span>
              <span>${Icons.clock} ${blog.readTime || '৫ মিনিট পাঠ'}</span>
            </div>
            <h3 class="blog-title">${this.escapeHtml(blog.title)}</h3>
            <p class="blog-summary">${this.escapeHtml(blog.summary)}</p>
            <div class="blog-card-footer">
              <div class="blog-author-info">
                <img src="assets/images/profile.jpg" alt="Shahinur" class="blog-author-avatar" onerror="this.style.display='none'">
                <span>Shahinur Rahman</span>
              </div>
              <span class="blog-read-btn">
                পড়ুন ${Icons.arrowRight}
              </span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach click handlers to open reader
    grid.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.blogId;
        this.openReaderModal(id);
      });
    });
  },

  // Setup Event Listeners
  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('blogSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderBlogGrid();
      });
    }

    // Publish New Blog Button
    const publishTriggers = document.querySelectorAll('.trigger-publish-blog');
    publishTriggers.forEach(btn => {
      btn.addEventListener('click', () => this.openPublishModal());
    });

    // Publish Form Submit
    const form = document.getElementById('blogPublishForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePublishSubmit(form);
      });
    }

    // Export Blogs Button
    const exportBtn = document.getElementById('exportBlogsBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportBlogsJSON());
    }

    // Reset Defaults Button
    const resetBtn = document.getElementById('resetBlogsBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetDefaultBlogs());
    }
  },

  // Open Publish Blog Modal
  openPublishModal() {
    const modal = document.getElementById('blogPublishModal');
    if (!modal) return;

    // Clear / reset form
    const form = document.getElementById('blogPublishForm');
    if (form) form.reset();

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  // Close Modals
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  },

  // Handle Form Submission
  handlePublishSubmit(form) {
    const title = form.elements['title'].value.trim();
    const category = form.elements['category'].value.trim() || 'General';
    const tagsInput = form.elements['tags'].value.trim();
    const readTime = form.elements['readTime'].value.trim() || '৪ মিনিট পাঠ';
    const coverImage = form.elements['coverImage'].value.trim() || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80';
    const summary = form.elements['summary'].value.trim();
    const content = form.elements['content'].value.trim();

    if (!title || !content) {
      App.showToast('দয়া করে ব্লগের শিরোনাম এবং মূল বক্তব্য পূরণ করুন!', 'error');
      return;
    }

    // Format current date in Bengali
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const now = new Date();
    const formattedDate = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`;

    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [category];

    const newBlog = {
      id: 'blog-' + Date.now(),
      title,
      category,
      tags,
      date: formattedDate,
      readTime,
      coverImage,
      summary: summary || (content.length > 140 ? content.substring(0, 140) + '...' : content),
      content
    };

    // Add to start of array
    this.blogs.unshift(newBlog);
    this.saveBlogs();

    this.renderCategoryPills();
    this.renderBlogGrid();
    this.closeModal('blogPublishModal');

    App.showToast('🎉 আপনার ব্লগটি সফলভাবে প্রকাশিত হয়েছে!', 'success');
  },

  // Open Blog Reader Modal
  openReaderModal(blogId) {
    const blog = this.blogs.find(b => b.id === blogId);
    if (!blog) return;

    const modal = document.getElementById('blogReaderModal');
    const container = document.getElementById('blogReaderBody');
    if (!modal || !container) return;

    const cover = blog.coverImage || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80';
    const htmlContent = this.parseSimpleMarkdown(blog.content);

    container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem;">
          <span class="tech-tag" style="background: rgba(16, 185, 129, 0.18); color: var(--accent-primary); font-weight: 700;">${this.escapeHtml(blog.category)}</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">${blog.date}</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">• ${blog.readTime || '৫ মিনিট পাঠ'}</span>
        </div>
        <h1 style="font-size: 2.2rem; line-height: 1.3; margin-bottom: 1rem;">${this.escapeHtml(blog.title)}</h1>
        
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="assets/images/profile.jpg" alt="Shahinur" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-primary);">
            <div>
              <div style="font-weight: 700; font-size: 0.95rem;">Shahinur Rahman Khan</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary);">Software Developer & Entrepreneur</div>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" id="deleteBlogBtn" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.4);" title="ব্লগ মুছে ফেলুন">
            ${Icons.trash} মুছুন
          </button>
        </div>
      </div>

      <div style="border-radius: var(--radius-md); overflow: hidden; margin-bottom: 2rem; max-height: 400px;">
        <img src="${cover}" alt="${this.escapeHtml(blog.title)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'">
      </div>

      <div class="blog-reader-content">
        ${htmlContent}
      </div>

      ${blog.tags && blog.tags.length ? `
        <div style="margin-top: 2.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-color); display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">ট্যাগ:</span>
          ${blog.tags.map(t => `<span class="tech-tag">#${this.escapeHtml(t)}</span>`).join('')}
        </div>
      ` : ''}
    `;

    // Attach delete handler
    const deleteBtn = document.getElementById('deleteBlogBtn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm(`আপনি কি নিশ্চিত যে "${blog.title}" ব্লগটি মুছে ফেলতে চান?`)) {
          this.deleteBlog(blog.id);
          this.closeModal('blogReaderModal');
        }
      });
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  // Delete Blog
  deleteBlog(id) {
    this.blogs = this.blogs.filter(b => b.id !== id);
    this.saveBlogs();
    this.renderCategoryPills();
    this.renderBlogGrid();
    App.showToast('ব্লগটি সফলভাবে মুছে ফেলা হয়েছে।', 'success');
  },

  // Export Blogs as JSON backup
  exportBlogsJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.blogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `shahinur_blogs_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    App.showToast('ব্লগ ব্যাকআপ JSON ফাইল ডাউনলোড সম্পন্ন!', 'success');
  },

  // Reset to Default Blogs
  resetDefaultBlogs() {
    if (confirm('আপনি কি ডিফল্ট ব্লগে রিসেট করতে চান? আপনার নিজস্ব যোগ করা ব্লগ মুছে যাবে না যদি আপনি ব্যাকআপ নেন।')) {
      this.blogs = [...PortfolioData.defaultBlogs];
      this.saveBlogs();
      this.activeCategory = 'all';
      this.renderCategoryPills();
      this.renderBlogGrid();
      App.showToast('ডিফল্ট ব্লগ রিস্টোর সম্পন্ন!', 'success');
    }
  },

  // Simple Markdown to HTML parser
  parseSimpleMarkdown(text) {
    if (!text) return '';
    let html = text;

    // Code blocks
    html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code>${this.escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code style="background:var(--bg-input); padding:2px 6px; border-radius:4px; font-size:0.88em; color:var(--accent-primary);">$1</code>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Blockquote
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr style="border:none; border-top:1px solid var(--border-color); margin:1.5rem 0;" />');

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Paragraphs and Lists
    const lines = html.split('\n');
    let inList = false;
    let result = [];

    for (let line of lines) {
      let trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          result.push('<ul>');
          inList = true;
        }
        result.push(`<li>${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        if (trimmed.length > 0 && !trimmed.startsWith('<h') && !trimmed.startsWith('<pre') && !trimmed.startsWith('<blockquote') && !trimmed.startsWith('<hr')) {
          result.push(`<p>${line}</p>`);
        } else {
          result.push(line);
        }
      }
    }
    if (inList) result.push('</ul>');

    return result.join('\n');
  },

  // Helper Escape HTML
  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

