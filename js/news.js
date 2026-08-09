document.addEventListener('DOMContentLoaded', () => {
    // Check if ProductDB is ready, if not wait for event
    if (localStorage.getItem('gasviet_db_initialized_v9')) {
        initNewsJS();
    } else {
        document.addEventListener('ProductDBReady', initNewsJS);
    }
});

function initNewsJS() {
    const isNewsList = document.getElementById('news-hero-container');
    const isNewsDetail = document.getElementById('news-detail-container');

    if (isNewsList) {
        renderNewsList();
    } else if (isNewsDetail) {
        renderNewsDetail();
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    return `Ngày ${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

function renderNewsList() {
    const allNews = ProductDB.getNews(false); // only active
    const categories = ProductDB.getNewsCategories();

    // 1. Hero
    const heroMain = allNews.find(n => n.position === 'hero_main') || allNews[0];
    const heroSubs = allNews.filter(n => n.position === 'hero_sub').slice(0, 2);
    
    if (heroMain) {
        let heroHtml = `
            <div class="nb-hero-text">
                <h2>${heroMain.title}</h2>
                <p>${(heroMain.content || '').replace(/<[^>]+>/g, '').substring(0, 150)}...</p>
                <a href="/chi-tiet-tin-tuc/${heroMain.slug}" class="nb-btn-dark">Đọc bài nổi bật</a>
            </div>
            <div class="nb-hero-images">
                <div class="nb-img-large">
                    <img src="${heroMain.image}" alt="${heroMain.title}">
                </div>
                <div class="nb-img-small-stack">
        `;
        heroSubs.forEach(sub => {
            heroHtml += `<img src="${sub.image}" alt="${sub.title}" onclick="window.location.href='/chi-tiet-tin-tuc/${sub.slug}'" style="cursor:pointer; transition: transform 0.3s; border-radius: 8px;">`;
        });
        heroHtml += `
                </div>
            </div>
        `;
        document.getElementById('news-hero-container').innerHTML = heroHtml;
    }

    // 2. Chuyên Mục Yêu Thích
    let filtersHtml = `<div class="nb-tab-indicator" id="nb-tab-indicator"></div>`;
    filtersHtml += `<a href="javascript:void(0)" class="active" onclick="filterNewsGrid(null, this)"><h3>Tất cả</h3></a>`;
    categories.slice(0, 4).forEach(c => {
        filtersHtml += `<a href="javascript:void(0)" onclick="filterNewsGrid(${c.id}, this)"><h3>${c.name}</h3></a>`;
    });
    if(document.getElementById('news-category-filters')) document.getElementById('news-category-filters').innerHTML = filtersHtml;

    window.updateNbTabIndicator = function(element) {
        const indicator = document.getElementById('nb-tab-indicator');
        if (indicator && element) {
            indicator.style.width = element.offsetWidth + 'px';
            indicator.style.height = element.offsetHeight + 'px';
            indicator.style.left = element.offsetLeft + 'px';
            indicator.style.top = element.offsetTop + 'px';
        }
    };

    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('#news-category-filters a.active');
        if(activeTab) updateNbTabIndicator(activeTab);
    });

    // Grid items (default position)
    const defaultNews = allNews.filter(n => n.position === 'default');
    
    window.filterNewsGrid = function(categoryId, element) {
        // Update active class
        const links = document.querySelectorAll('#news-category-filters a');
        links.forEach(l => l.classList.remove('active'));
        if(element) {
            element.classList.add('active');
            updateNbTabIndicator(element);
        }
        
        let filtered = defaultNews;
        if (categoryId !== null) {
            filtered = defaultNews.filter(n => n.categoryId === categoryId);
        }
        
        const gridNews = filtered.slice(0, 4);
        let gridHtml = '';
        if (gridNews.length === 0) {
            gridHtml = '<p style="text-align:center; width:100%; grid-column:1/-1;">Đang cập nhật bài viết cho chuyên mục này.</p>';
        } else {
            gridNews.forEach(n => {
                const catName = ProductDB.getNewsCategoryById(n.categoryId)?.name || 'Khác';
                gridHtml += `
                    <div class="nb-dest-card" onclick="window.location.href='/chi-tiet-tin-tuc/${n.slug}'" style="cursor:pointer;">
                        <img src="${n.image}" alt="${n.title}">
                        <div class="nb-dest-card-info">
                            <h4><a href="/chi-tiet-tin-tuc/${n.slug}">${n.title}</a></h4>
                            <span><a href="javascript:void(0)" style="color:white; text-decoration:none;">${catName}</a></span>
                        </div>
                    </div>
                `;
            });
        }
        if(document.getElementById('news-favorites-grid')) document.getElementById('news-favorites-grid').innerHTML = gridHtml;
    };

    // Initial render
    if(document.getElementById('news-favorites-grid')) {
        window.filterNewsGrid(null, document.querySelector('#news-category-filters a.active'));
        setTimeout(() => {
            const activeTab = document.querySelector('#news-category-filters a.active');
            if(activeTab) updateNbTabIndicator(activeTab);
        }, 100);
    }

    // 3. Tin Cập Nhật
    const trendingMain = allNews.find(n => n.position === 'trending_main') || allNews[allNews.length - 1];
    const latestList = allNews.filter(n => n.position === 'default' && n.id !== trendingMain?.id).slice(4, 8);
    
    let latestHtml = '';
    if (trendingMain) {
        const catName = ProductDB.getNewsCategoryById(trendingMain.categoryId)?.name || 'Khác';
        latestHtml += `
            <div class="nb-latest-main">
                <img src="${trendingMain.image}" alt="${trendingMain.title}" onclick="window.location.href='/chi-tiet-tin-tuc/${trendingMain.slug}'" style="cursor:pointer;">
                <div class="nb-latest-main-info">
                    <span class="nb-cat">${catName}</span>
                    <h3><a href="/chi-tiet-tin-tuc/${trendingMain.slug}">${trendingMain.title}</a></h3>
                    <div class="nb-meta">${formatDate(trendingMain.createdAt)}</div>
                    <p>${(trendingMain.content || '').replace(/<[^>]+>/g, '').substring(0, 150)}...</p>
                </div>
            </div>
            <div class="nb-latest-list">
        `;
        
        latestList.forEach(n => {
            const cat = ProductDB.getNewsCategoryById(n.categoryId)?.name || 'Khác';
            latestHtml += `
                <div class="nb-list-item">
                    <img src="${n.image}" alt="${n.title}" onclick="window.location.href='/chi-tiet-tin-tuc/${n.slug}'" style="cursor:pointer;">
                    <div class="nb-list-item-info">
                        <span class="nb-cat">${cat}</span>
                        <h3><a href="/chi-tiet-tin-tuc/${n.slug}">${n.title}</a></h3>
                        <div class="nb-meta">${formatDate(n.createdAt)}</div>
                    </div>
                </div>
            `;
        });
        
        latestHtml += `</div>`;
        if(document.getElementById('news-latest-container')) document.getElementById('news-latest-container').innerHTML = latestHtml;
    }
}

function renderNewsDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    let slug = urlParams.get('slug');
    
    // Nếu Nginx bẻ link ngầm, trình duyệt sẽ không có ?slug=, cần lấy từ pathname
    if (!slug) {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        if (pathSegments.length >= 2 && pathSegments[0] === 'chi-tiet-tin-tuc') {
            slug = pathSegments[1].replace('.html', '');
        }
    }

    const allNews = ProductDB.getNews(false);
    
    let newsItem = null;
    if (slug) {
        newsItem = allNews.find(n => n.slug === slug);
    } else if (allNews.length > 0) {
        // Fallback to first article
        newsItem = allNews[0];
    }
    
    if (!newsItem) {
        document.getElementById('news-detail-container').innerHTML = '<div style="text-align:center; padding: 100px;"><h2>Không tìm thấy bài viết!</h2><br><a href="tin-tuc.html" class="btn" style="background:var(--primary);color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:20px;">Quay lại danh sách</a></div>';
        return;
    }

    const catName = ProductDB.getNewsCategoryById(newsItem.categoryId)?.name || 'Chưa phân loại';
    document.title = newsItem.seoTitle || `${newsItem.title} | Gas Việt`;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = newsItem.seoDesc || newsItem.content.replace(/<[^>]+>/g, '').substring(0, 160);

    // Related
    const related = allNews.filter(n => n.categoryId === newsItem.categoryId && n.id !== newsItem.id).slice(0, 3);
    let relatedHtml = '';
    related.forEach(n => {
        relatedHtml += `
            <div class="nb-archive-card">
                <img src="${n.image}" alt="${n.title}" onclick="window.location.href='/chi-tiet-tin-tuc/${n.slug}'" style="cursor:pointer">
                <div class="nb-archive-card-body">
                    <span class="nb-cat">${catName}</span>
                    <h3><a href="/chi-tiet-tin-tuc/${n.slug}">${n.title}</a></h3>
                    <p>${(n.content || '').replace(/<[^>]+>/g, '').substring(0, 80)}...</p>
                    <div class="nb-meta">${formatDate(n.createdAt)}</div>
                </div>
            </div>
        `;
    });

    const detailHtml = `
        <div class="nb-detail-header">
            <span class="nb-cat-detail">${catName}</span>
            <h1 id="h1-title">${newsItem.title}</h1>
            <div class="nb-detail-meta">
                <div class="nb-author">
                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
                        alt="Author">
                    <div>
                        <strong>${newsItem.author || 'Ban Biên Tập'}</strong>
                    </div>
                </div>
                <div class="nb-date">
                    <i class="fa-regular fa-clock"></i> <span class="hide-text-mobile">Đăng ngày:</span> ${formatDate(newsItem.createdAt)}
                </div>
            </div>
        </div>

        <div class="nb-detail-featured-img">
            <img src="${newsItem.image}" alt="${newsItem.title}" style="width:100%; border-radius:12px; margin-bottom:30px; object-fit:cover; max-height:500px;">
        </div>

        <div class="nb-detail-content">
            <div class="nb-content-inner" style="font-size: 16px; line-height: 1.8; color: #334155;">
                ${newsItem.content}
            </div>
            
            <!-- Share and Tags -->
            <div class="nb-detail-footer" style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px;">
                <div class="nb-tags" style="display: flex; align-items: center;">
                    <strong>Từ khoá:</strong>
                    <a href="javascript:void(0)" style="margin-left:8px; padding: 2px 12px; background: #f1f5f9; border-radius: 20px; text-decoration: none; border: 1px solid #64748b; color: #64748b; font-size: 14px; display: inline-block;">${catName}</a>
                </div>
                <div class="nb-share" style="display: flex; align-items: center;">
                    <strong>Chia sẻ:</strong>
                    <a href="javascript:void(0)" class="share-btn fb"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="javascript:void(0)" class="share-btn mess"><i class="fa-brands fa-facebook-messenger"></i></a>
                    <a href="javascript:void(0)" onclick="navigator.clipboard.writeText(window.location.href); alert('Đã copy link bài viết!');" class="share-btn link"><i class="fa-solid fa-link"></i></a>
                </div>
            </div>

            <!-- Related Articles -->
            ${related.length > 0 ? `
            <div class="nb-related" style="margin-top: 20px;">
                <h3 style="font-size: 24px; margin-bottom: 20px; color: #0f172a;">Bài viết liên quan</h3>
                <div class="nb-archive-grid">
                    ${relatedHtml}
                </div>
            </div>
            ` : ''}
        </div>
    `;

    document.getElementById('news-detail-container').innerHTML = detailHtml;
}
