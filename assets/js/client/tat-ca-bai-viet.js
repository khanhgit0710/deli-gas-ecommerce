document.addEventListener('DOMContentLoaded', () => {
    const newsGrid = document.getElementById('newsGrid');
    const pagination = document.getElementById('newsPagination');
    const categoryList = document.getElementById('newsCategoryList');
    
    if (!newsGrid) return;
    
    const itemsPerPage = 9;
    let currentPage = 1;
    let allNews = [];
    let currentCategoryId = null;
    let currentSearchTerm = '';

    // Lấy ID danh mục từ URL (slug)
    const currentSlug = window.location.pathname.substring(1).replace('.html', '');
    if (currentSlug && currentSlug !== 'tat-ca-bai-viet') {
        const cat = ProductDB.getNewsCategories().find(c => c.slug === currentSlug);
        if (cat) {
            currentCategoryId = cat.id;
        }
    }

    // Helper: format date
    function formatDate(isoString) {
        if (!isoString) return 'Gần đây';
        const date = new Date(isoString);
        return 'Ngày ' + date.getDate() + ' Tháng ' + (date.getMonth() + 1) + ', ' + date.getFullYear();
    }
    
    function renderNewsCategories() {
        if (!categoryList || !ProductDB) return;
        const categories = ProductDB.getNewsCategories();
        
        let html = '';
        
        // Nút Tất cả
        const isAllActive = currentCategoryId === null ? 'active' : '';
        html += `<li><a href="/tat-ca-bai-viet" class="${isAllActive}" data-id="all"><h2>Tất cả</h2> <span>(${allNews.length})</span></a></li>`;
        
        // Render từng danh mục
        categories.forEach(cat => {
            const count = allNews.filter(n => n.categoryId === cat.id).length;
            const isActive = currentCategoryId === cat.id ? 'active' : '';
            html += `<li><a href="/${cat.slug}" class="${isActive}" data-id="${cat.id}"><h2>${cat.name}</h2> <span>(${count})</span></a></li>`;
        });
        
        categoryList.innerHTML = html;
        
        // Thêm sự kiện click để tải không cần load trang
        categoryList.querySelectorAll('a').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Cập nhật active class
                categoryList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                btn.classList.add('active');
                
                // Lọc tin tức
                const catId = btn.getAttribute('data-id');
                if (catId === 'all') {
                    currentCategoryId = null;
                } else {
                    currentCategoryId = parseInt(catId);
                }
                
                // Update URL history for SEO without reload
                const newUrl = btn.getAttribute('href');
                window.history.pushState({}, '', newUrl);

                renderPage(1);
            });
        });
    }

    function renderNews() {
        if (!ProductDB) return;
        allNews = ProductDB.getNews(false); // Lấy tin tức đang active
        
        // Sắp xếp theo ngày mới nhất
        allNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        renderNewsCategories();
        renderPage(1);
    }
    
    function renderPage(page) {
        currentPage = page;
        
        // Lọc theo danh mục
        let filteredNews = allNews;
        if (currentCategoryId !== null) {
            filteredNews = allNews.filter(n => n.categoryId === currentCategoryId);
        }
        
        // Lọc theo từ khóa tìm kiếm
        if (currentSearchTerm) {
            filteredNews = filteredNews.filter(n => {
                const titleMatch = n.title && n.title.toLowerCase().includes(currentSearchTerm);
                const contentMatch = n.content && n.content.toLowerCase().includes(currentSearchTerm);
                return titleMatch || contentMatch;
            });
        }
        
        const totalPages = Math.ceil(filteredNews.length / itemsPerPage) || 1;
        
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = filteredNews.slice(start, end);
        
        if (pageItems.length === 0) {
            newsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Chưa có bài viết nào trong chuyên mục này.</p>';
            pagination.innerHTML = '';
            return;
        }
        
        newsGrid.innerHTML = pageItems.map(item => {
            const catName = ProductDB.getNewsCategories().find(c => c.id === item.categoryId)?.name || 'Khác';
            return `
                <div class="nb-archive-card">
                    <img loading="lazy" src="${item.image || '/assets/images/local/img_20.jpg'}" alt="${item.title}" onerror="this.src='/assets/images/local/img_20.jpg'">
                    <div class="nb-archive-card-body">
                        <span class="nb-cat">${catName}</span>
                        <h3><a href="/${item.slug}">${item.title}</a></h3>
                        <p>${ProductDB.stripHtml ? ProductDB.stripHtml(item.content).substring(0, 100) + '...' : item.title}</p>
                        <div class="nb-meta">${formatDate(item.createdAt)}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        renderPagination(totalPages);
    }
    
    function renderPagination(totalPages) {
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let html = '';
        html += `<a href="#" class="page-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}"><i class="fa-solid fa-chevron-left"></i></a>`;
        
        for (let i = 1; i <= totalPages; i++) {
            html += `<a href="#" class="page-num ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`;
        }
        
        html += `<a href="#" class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}"><i class="fa-solid fa-chevron-right"></i></a>`;
        
        pagination.innerHTML = html;
        
        // Add events
        pagination.querySelectorAll('a').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (btn.classList.contains('disabled')) return;
                const p = parseInt(btn.getAttribute('data-page'));
                if (p && p >= 1 && p <= totalPages) {
                    renderPage(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    const searchInput = document.querySelector('.nb-search-box input');
    const searchBtn = document.querySelector('.nb-search-box button');
    
    if (searchInput && searchBtn) {
        const handleSearch = () => {
            currentSearchTerm = searchInput.value.trim().toLowerCase();
            renderPage(1);
        };
        
        searchBtn.addEventListener('click', handleSearch);
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
        
        searchInput.addEventListener('input', () => {
            currentSearchTerm = searchInput.value.trim().toLowerCase();
            renderPage(1);
        });
    }

    renderNews();
});
