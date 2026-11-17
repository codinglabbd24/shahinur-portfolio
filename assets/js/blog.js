// ========================================================
// Blog Engine 2.0 (v2) for Shahinur Rahman Khan's Portfolio
// Features: Reactions, Comments, Reading Progress, Social Sharing,
// Markdown Toolbar, Code Copying, Bookmarks & LocalStorage
// ========================================================

const BlogEngine = {
  storageKey: 'shahinur_portfolio_blogs_v2',
  reactionsKey: 'shahinur_blog_reactions_v2',
  commentsKey: 'shahinur_blog_comments_v2',
  bookmarksKey: 'shahinur_blog_bookmarks_v2',

  blogs: [],
  reactions: {},
  comments: {},
  bookmarks: new Set(),
  activeCategory: 'all',
  searchQuery: '',
  currentReaderBlogId: null,

  // Initialize Blog System v2
  init() {
    this.loadData();
    this.renderCategoryPills();
    this.renderBlogGrid();
    this.setupEventListeners();
    this.setupEditorToolbar();
  },

  // Load from LocalStorage or Fallback
  loadData() {
    // 1. Load Blogs
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.blogs = JSON.parse(stored);
      } else {
        // Check v1 data or fallback to PortfolioData
        const v1 = localStorage.getItem('shahinur_portfolio_blogs_v1');
        this.blogs = v1 ? JSON.parse(v1) : [...PortfolioData.defaultBlogs];
        this.saveBlogs();
      }
    } catch (e) {
      this.blogs = [...PortfolioData.defaultBlogs];
    }

    // 2. Load Reactions
    try {
      const storedReactions = localStorage.getItem(this.reactionsKey);
      this.reactions = storedReactions ? JSON.parse(storedReactions) : {};
    } catch (e) {
      this.reactions = {};
    }

    // Seed default reactions for initial blogs if not present
    this.blogs.forEach((b, idx) => {
      if (!this.reactions[b.id]) {
        this.reactions[b.id] = {
          love: 14 + (idx * 5),
          clap: 8 + (idx * 3),
          idea: 5 + (idx * 2),
          userReacted: {}
        };
      }
    });

    // 3. Load Comments
    try {
      const storedComments = localStorage.getItem(this.commentsKey);
      this.comments = storedComments ? JSON.parse(storedComments) : {};
    } catch (e) {
      this.comments = {};
    }

    // Seed default comments if empty
    if (Object.keys(this.comments).length === 0) {
      this.comments['blog-1'] = [
        {
          id: 'c-1',
          name: 'তানভীর আহমেদ',
          text: 'অসাধারণ পোস্ট শাহিনুর ভাই! ডেভেলপারদের জন্য MVP ফোকাসড হওয়াটা সত্যিই সময় বাঁচায়।',
          date: 'নভেম্বর ০৭, ২০২৬'
        }
      ];
      this.comments['blog-2'] = [
        {
          id: 'c-2',
          name: 'Shakil Hasan',
          text: 'Great explanation of Edge caching and database connection pooling in 2026 stack!',
          date: 'নভেম্বর ০২, ২০২৬'
        }
      ];
      this.saveComments();
    }

    // 4. Load Bookmarks
    try {
      const storedBookmarks = localStorage.getItem(this.bookmarksKey);
      this.bookmarks = new Set(storedBookmarks ? JSON.parse(storedBookmarks) : []);
    } catch (e) {
      this.bookmarks = new Set();
    }
  },

  // Save Helpers
  saveBlogs() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.blogs));
    } catch (e) {
      console.error(e);
    }
  },

  saveReactions() {
    try {
      localStorage.setItem(this.reactionsKey, JSON.stringify(this.reactions));
    } catch (e) {
      console.error(e);
    }
  },

  saveComments() {
    try {
      localStorage.setItem(this.commentsKey, JSON.stringify(this.comments));
    } catch (e) {
      console.error(e);
    }
  },

  saveBookmarks() {
    try {
      localStorage.setItem(this.bookmarksKey, JSON.stringify(Array.from(this.bookmarks)));
    } catch (e) {
      console.error(e);
    }
  },

  // Get distinct categories
  getCategories() {
    const categories = new Set(this.blogs.map(b => b.category));
    return ['all', 'bookmarked', ...Array.from(categories)];
  },

  // Render Category Filter Pills v2
  renderCategoryPills() {
    const container = document.getElementById('blogCategoryFilter');
    if (!container) return;

    const categories = this.getCategories();
    container.innerHTML = categories.map(cat => {
      let label = cat;
      if (cat === 'all') label = 'সব ব্লগ (All)';
      if (cat === 'bookmarked') label = `🔖 বুকমার্ককৃত (${this.bookmarks.size})`;

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

  // Filter Blogs by Category, Search, and Bookmarks
  getFilteredBlogs() {
    return this.blogs.filter(blog => {
      // Category / Bookmark match
      let matchesCategory = true;
      if (this.activeCategory === 'bookmarked') {
        matchesCategory = this.bookmarks.has(blog.id);
      } else if (this.activeCategory !== 'all') {
        matchesCategory = blog.category.toLowerCase() === this.activeCategory.toLowerCase();
      }

      // Search match
      const q = this.searchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        blog.title.toLowerCase().includes(q) || 
        blog.summary.toLowerCase().includes(q) ||
        (blog.tags && blog.tags.some(t => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  },

  // Render Grid Cards v2
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
        <div style="grid-column: 1/-1; text-align: center; padding: 3.5rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📝</div>
          <h3 style="margin-bottom: 0.5rem;">কোনো ব্লগ পাওয়া যায়নি</h3>
          <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">আপনার সার্চ কোয়েরি পরিবর্তন করুন অথবা এখনই নতুন ব্লগ পাবলিশ করুন।</p>
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
      
      const r = this.reactions[blog.id] || { love: 0, clap: 0, idea: 0 };
      const totalReactions = (r.love || 0) + (r.clap || 0) + (r.idea || 0);
      const commentsCount = (this.comments[blog.id] || []).length;
      const isBookmarked = this.bookmarks.has(blog.id);

      return `
        <article class="blog-card" data-blog-id="${blog.id}">
          <div class="blog-card-media">
            <img src="${cover}" alt="${this.escapeHtml(blog.title)}" loading="lazy" onerror="this.src='${fallbackImage}'" />
            <span class="blog-category-tag">${this.escapeHtml(blog.category)}</span>
            <button class="btn-bookmark-card" data-bookmark-id="${blog.id}" style="position: absolute; top: 12px; right: 12px; background: rgba(10, 17, 14, 0.75); border: 1px solid var(--border-color); color: ${isBookmarked ? 'var(--accent-secondary)' : '#fff'}; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(8px);" title="${isBookmarked ? 'বুকমার্ক সরান' : 'বুকমার্ক করুন'}">
              ${Icons.bookmark}
            </button>
          </div>
          <div class="blog-card-body">
            <div class="blog-meta-top">
              <span>${Icons.calendar} ${blog.date}</span>
              <span>${Icons.clock} ${blog.readTime || '৫ মিনিট পাঠ'}</span>
            </div>
            <h3 class="blog-title">${this.escapeHtml(blog.title)}</h3>
            <p class="blog-summary">${this.escapeHtml(blog.summary)}</p>
            
            <div class="blog-card-footer">
              <div class="blog-card-stats">
                <span title="রিঅ্যাকশন">❤️ ${totalReactions}</span>
                <span title="মন্তব্য">${Icons.messageSquare} ${commentsCount}</span>
              </div>
              <span class="blog-read-btn">
                পড়ুন ${Icons.arrowRight}
              </span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach click handlers to open reader (excluding bookmark button)
    grid.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-bookmark-card')) return;
        const id = card.dataset.blogId;
        this.openReaderModal(id);
      });
    });

    // Attach bookmark click handlers
    grid.querySelectorAll('.btn-bookmark-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.bookmarkId;
        this.toggleBookmark(id);
      });
    });
  },

  // Toggle Bookmark
  toggleBookmark(blogId) {
    if (this.bookmarks.has(blogId)) {
      this.bookmarks.delete(blogId);
      App.showToast('বুকমার্ক থেকে সরানো হয়েছে।', 'success');
    } else {
      this.bookmarks.add(blogId);
      App.showToast('🔖 ব্লগটি বুকমার্কে সংরক্ষিত হয়েছে!', 'success');
    }
    this.saveBookmarks();
    this.renderCategoryPills();
    this.renderBlogGrid();
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

    // Publish New Blog Button triggers
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

    // Reading Progress Tracker on Reader Modal Scroll
    const readerContainer = document.getElementById('blogReaderContainer');
    const progressBar = document.getElementById('readingProgressBar');
    if (readerContainer && progressBar) {
      readerContainer.addEventListener('scroll', () => {
        const scrollTop = readerContainer.scrollTop;
        const scrollHeight = readerContainer.scrollHeight - readerContainer.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      });
    }
  },

  // Setup Editor Toolbar v2
  setupEditorToolbar() {
    const toolbar = document.getElementById('editorToolbar');
    const textarea = document.getElementById('blogContent');
    const wordCountSpan = document.getElementById('editorWordCount');
    const readTimeSpan = document.getElementById('editorCalcReadTime');

    if (!toolbar || !textarea) return;

    // Word counter & Read time calculator
    const updateStats = () => {
      const text = textarea.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      const readMinutes = Math.max(1, Math.ceil(words / 180));
      if (wordCountSpan) wordCountSpan.textContent = `${words} শব্দ`;
      if (readTimeSpan) readTimeSpan.textContent = `${readMinutes} মিনিট পাঠ`;
    };

    textarea.addEventListener('input', updateStats);

    // Toolbar button clicks
    toolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.insertMarkdown(textarea, action);
        updateStats();
      });
    });
  },

  // Insert Markdown Helpers
  insertMarkdown(textarea, action) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    let replacement = '';

    switch (action) {
      case 'h2':
        replacement = `\n## ${selected || 'নতুন হেডিং'}\n`;
        break;
      case 'h3':
        replacement = `\n### ${selected || 'সাব-হেডিং'}\n`;
        break;
      case 'bold':
        replacement = `**${selected || 'বোল্ড লেখা'}**`;
        break;
      case 'italic':
        replacement = `*${selected || 'ইটালিক লেখা'}*`;
        break;
      case 'quote':
        replacement = `\n> ${selected || 'উদ্ধৃতি বা কোটেশন লিখুন'}\n`;
        break;
      case 'code':
        replacement = `\n\`\`\`javascript\n${selected || '// এখানে কোড লিখুন'}\n\`\`\`\n`;
        break;
      case 'list':
        replacement = `\n- ${selected || 'তালিকা আইটেম ১'}\n- তালিকা আইটেম ২\n`;
        break;
      case 'hr':
        replacement = `\n---\n`;
        break;
      default:
        return;
    }

    textarea.setRangeText(replacement, start, end, 'select');
    textarea.focus();
  },

  // Open Publish Blog Modal
  openPublishModal() {
    const modal = document.getElementById('blogPublishModal');
    if (!modal) return;
    
    const form = document.getElementById('blogPublishForm');
    if (form) form.reset();
    
    // Reset stats
    const wordCountSpan = document.getElementById('editorWordCount');
    const readTimeSpan = document.getElementById('editorCalcReadTime');
    if (wordCountSpan) wordCountSpan.textContent = '০ শব্দ';
    if (readTimeSpan) readTimeSpan.textContent = '১ মিনিট পাঠ';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  // Close Modals
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    // Reset reader progress
    const progressBar = document.getElementById('readingProgressBar');
    if (progressBar) progressBar.style.width = '0%';
  },

  // Handle Form Submission
  handlePublishSubmit(form) {
    const title = form.elements['title'].value.trim();
    const category = form.elements['category'].value.trim() || 'General';
    const tagsInput = form.elements['tags'].value.trim();
    const coverImage = form.elements['coverImage'].value.trim() || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80';
    const summary = form.elements['summary'].value.trim();
    const content = form.elements['content'].value.trim();

    // Auto-calculate read time if left default
    const words = content.split(/\s+/).length;
    const calcMinutes = Math.max(1, Math.ceil(words / 180));
    const readTime = `${calcMinutes} মিনিট পাঠ`;

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

    // Initialize reaction counts
    this.reactions[newBlog.id] = { love: 1, clap: 1, idea: 1, userReacted: {} };
    this.saveReactions();

    this.renderCategoryPills();
    this.renderBlogGrid();
    this.closeModal('blogPublishModal');

    App.showToast('🎉 আপনার নতুন ব্লগটি সফলভাবে প্রকাশিত হয়েছে!', 'success');
  },

  // Open Blog Reader Modal v2
  openReaderModal(blogId) {
    const blog = this.blogs.find(b => b.id === blogId);
    if (!blog) return;

    this.currentReaderBlogId = blogId;

    const modal = document.getElementById('blogReaderModal');
    const container = document.getElementById('blogReaderBody');
    const progressBar = document.getElementById('readingProgressBar');
    if (!modal || !container) return;

    if (progressBar) progressBar.style.width = '0%';

    const cover = blog.coverImage || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80';
    const htmlContent = this.parseSimpleMarkdown(blog.content);

    // Reactions & Comments
    const r = this.reactions[blog.id] || { love: 0, clap: 0, idea: 0, userReacted: {} };
    const userReacted = r.userReacted || {};
    const blogComments = this.comments[blog.id] || [];

    // Current page URL for sharing
    const shareUrl = encodeURIComponent(window.location.origin + window.location.pathname + `#blog-${blog.id}`);
    const shareTitle = encodeURIComponent(blog.title);

    container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap;">
          <span class="tech-tag" style="background: rgba(16, 185, 129, 0.18); color: var(--accent-primary); font-weight: 700;">${this.escapeHtml(blog.category)}</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">${blog.date}</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">• ${blog.readTime || '৫ মিনিট পাঠ'}</span>
        </div>
        <h1 style="font-size: 2.2rem; line-height: 1.3; margin-bottom: 1rem;">${this.escapeHtml(blog.title)}</h1>
        
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="assets/images/profile.jpg" alt="Shahinur" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-primary);">
            <div>
              <div style="font-weight: 700; font-size: 0.95rem;">Shahinur Rahman Khan</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary);">Software Developer & Entrepreneur</div>
            </div>
          </div>
          
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm" id="readerBookmarkBtn" title="বুকমার্ক করুন">
              ${Icons.bookmark} <span id="readerBookmarkText">${this.bookmarks.has(blog.id) ? 'বুকমার্ককৃত' : 'বুকমার্ক'}</span>
            </button>
            <button class="btn btn-outline btn-sm" id="deleteBlogBtn" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.4);" title="ব্লগ মুছে ফেলুন">
              ${Icons.trash} মুছুন
            </button>
          </div>
        </div>
      </div>

      <div style="border-radius: var(--radius-md); overflow: hidden; margin-bottom: 2rem; max-height: 420px; background: var(--bg-card);">
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

      <!-- Reactions Bar v2 -->
      <div class="blog-reaction-bar">
        <div class="reaction-group">
          <button class="reaction-btn ${userReacted.love ? 'active' : ''}" data-type="love">
            ❤️ ভালোবাসা <span class="reaction-count">${r.love || 0}</span>
          </button>
          <button class="reaction-btn ${userReacted.clap ? 'active' : ''}" data-type="clap">
            👏 সাধুবাদ <span class="reaction-count">${r.clap || 0}</span>
          </button>
          <button class="reaction-btn ${userReacted.idea ? 'active' : ''}" data-type="idea">
            💡 দারুণ চিন্তা <span class="reaction-count">${r.idea || 0}</span>
          </button>
        </div>

        <div class="blog-share-group">
          <span class="share-label">শেয়ার:</span>
          <a href="https://api.whatsapp.com/send?text=${shareTitle}%0A${shareUrl}" target="_blank" rel="noopener" class="share-icon-btn" title="WhatsApp-এ শেয়ার করুন" style="color:#25D366;">
            ${Icons.whatsapp}
          </a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank" rel="noopener" class="share-icon-btn" title="LinkedIn-এ শেয়ার করুন">
            ${Icons.linkedin}
          </a>
          <a href="https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}" target="_blank" rel="noopener" class="share-icon-btn" title="Twitter-এ শেয়ার করুন">
            🐦
          </a>
          <button class="share-icon-btn" id="copyBlogLinkBtn" title="ব্লগ লিংক কপি করুন">
            ${Icons.copy}
          </button>
        </div>
      </div>

      <!-- Comments Section v2 -->
      <div class="blog-comments-section">
        <h3 class="comments-title">
          <span>${Icons.messageSquare}</span> মন্তব্যসমূহ (<span id="commentsCountText">${blogComments.length}</span>)
        </h3>

        <!-- Comment Input Form -->
        <div class="comment-input-card">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-primary);">আপনার মন্তব্য যোগ করুন:</h4>
          <form id="blogCommentForm">
            <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
              <input type="text" id="commentAuthorName" class="form-control" placeholder="আপনার নাম *" required style="padding: 0.6rem 0.9rem;" />
            </div>
            <div class="form-group" style="margin-bottom: 0.75rem;">
              <textarea id="commentAuthorText" class="form-control" style="min-height: 80px; padding: 0.6rem 0.9rem;" placeholder="এই আর্টিকেলের ওপর আপনার মতামত লিখুন..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">
              মন্তব্য প্রকাশ করুন 💬
            </button>
          </form>
        </div>

        <!-- Rendered Comments List -->
        <div class="comments-list" id="commentsList">
          ${this.renderCommentsHtml(blogComments)}
        </div>
      </div>
    `;

    // Setup Code Block Copy Buttons
    container.querySelectorAll('.code-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pre = btn.closest('.code-block-wrapper').querySelector('code');
        if (pre) {
          navigator.clipboard.writeText(pre.innerText).then(() => {
            btn.innerHTML = `${Icons.check} কপি হয়েছে!`;
            btn.style.background = 'var(--accent-primary)';
            setTimeout(() => {
              btn.innerHTML = `${Icons.copy} কপি`;
              btn.style.background = '';
            }, 2000);
          });
        }
      });
    });

    // Attach reaction clicks
    container.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.handleReaction(blog.id, type, btn);
      });
    });

    // Attach copy link button
    const copyBtn = document.getElementById('copyBlogLinkBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const url = window.location.origin + window.location.pathname + `#blog-${blog.id}`;
        navigator.clipboard.writeText(url).then(() => {
          App.showToast('📋 ব্লগের লিংক ক্লিপবোর্ডে কপি হয়েছে!', 'success');
        });
      });
    }

    // Attach Reader Bookmark button
    const readerBookmarkBtn = document.getElementById('readerBookmarkBtn');
    if (readerBookmarkBtn) {
      readerBookmarkBtn.addEventListener('click', () => {
        this.toggleBookmark(blog.id);
        const isBookmarked = this.bookmarks.has(blog.id);
        const textSpan = document.getElementById('readerBookmarkText');
        if (textSpan) textSpan.textContent = isBookmarked ? 'বুকমার্ককৃত' : 'বুকমার্ক';
      });
    }

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

    // Attach Comment Form Submit
    const commentForm = document.getElementById('blogCommentForm');
    if (commentForm) {
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCommentSubmit(blog.id, commentForm);
      });
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  // Handle Reactions v2
  handleReaction(blogId, type, btnElement) {
    if (!this.reactions[blogId]) {
      this.reactions[blogId] = { love: 0, clap: 0, idea: 0, userReacted: {} };
    }
    const r = this.reactions[blogId];
    if (!r.userReacted) r.userReacted = {};

    const countSpan = btnElement.querySelector('.reaction-count');

    if (r.userReacted[type]) {
      // Undo reaction
      r[type] = Math.max(0, (r[type] || 1) - 1);
      r.userReacted[type] = false;
      btnElement.classList.remove('active');
    } else {
      // Add reaction
      r[type] = (r[type] || 0) + 1;
      r.userReacted[type] = true;
      btnElement.classList.add('active');
      App.showToast('ধন্যবাদ আপনার রিঅ্যাকশনের জন্য! ✨', 'success');
    }

    if (countSpan) countSpan.textContent = r[type];
    this.saveReactions();
    this.renderBlogGrid();
  },

  // Render Comments HTML
  renderCommentsHtml(commentsList) {
    if (!commentsList || commentsList.length === 0) {
      return `<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1rem;">এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনিই করুন!</p>`;
    }

    return commentsList.map(c => {
      const initial = c.name ? c.name.charAt(0).toUpperCase() : 'U';
      return `
        <div class="comment-card">
          <div class="comment-header">
            <div class="comment-author-badge">
              <div class="comment-avatar-circle">${initial}</div>
              <span class="comment-author-name">${this.escapeHtml(c.name)}</span>
            </div>
            <span class="comment-date">${c.date}</span>
          </div>
          <p class="comment-text">${this.escapeHtml(c.text)}</p>
        </div>
      `;
    }).join('');
  },

  // Handle Comment Submission
  handleCommentSubmit(blogId, form) {
    const nameInput = document.getElementById('commentAuthorName');
    const textInput = document.getElementById('commentAuthorText');
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) return;

    if (!this.comments[blogId]) {
      this.comments[blogId] = [];
    }

    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const now = new Date();
    const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`;

    const newComment = {
      id: 'c-' + Date.now(),
      name,
      text,
      date: dateStr
    };

    this.comments[blogId].unshift(newComment);
    this.saveComments();

    // Update Reader Comments View
    const listContainer = document.getElementById('commentsList');
    const countBadge = document.getElementById('commentsCountText');
    if (listContainer) {
      listContainer.innerHTML = this.renderCommentsHtml(this.comments[blogId]);
    }
    if (countBadge) {
      countBadge.textContent = this.comments[blogId].length;
    }

    form.reset();
    this.renderBlogGrid();
    App.showToast('💬 আপনার মন্তব্যটি সফলভাবে যুক্ত হয়েছে!', 'success');
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

  // Simple Markdown to HTML parser v2 (with Code block copy wrappers)
  parseSimpleMarkdown(text) {
    if (!text) return '';
    let html = text;

    // Code blocks with Copy Button
    html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `
        <div class="code-block-wrapper">
          <button class="code-copy-btn">${Icons.copy} কপি</button>
          <pre><code class="language-${lang || 'text'}">${this.escapeHtml(code.trim())}</code></pre>
        </div>
      `;
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
        if (trimmed.length > 0 && !trimmed.startsWith('<h') && !trimmed.startsWith('<pre') && !trimmed.startsWith('<div class="code-block-wrapper"') && !trimmed.startsWith('<blockquote') && !trimmed.startsWith('<hr')) {
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
