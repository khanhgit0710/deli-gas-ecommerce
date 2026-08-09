/**
 * Admin news Module
 */
document.addEventListener('DOMContentLoaded', () => {
    // ========== NEWS ==========
    window.renderNews = function() {
        const news = ProductDB.getNews(true); // true means isAdmin (returns all including inactive)
        const searchVal = document.getElementById('newsSearch') ? document.getElementById('newsSearch').value.trim().toLowerCase() : '';
        const tbody = document.getElementById('newsTableBody');

        if (!tbody) return;

        let filteredNews = news;
        if (searchVal) {
            filteredNews = news.filter(n => 
                n.title.toLowerCase().includes(searchVal) || 
                (n.slug && n.slug.toLowerCase().includes(searchVal))
            );
        }

        if (filteredNews.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="table-empty"><i class="fa-solid fa-newspaper"></i>ChÆ°a cÃ³ tin tá»©c nÃ o</td></tr>';
            return;
        }

        tbody.innerHTML = filteredNews.map(n => {
            const dateStr = n.createdAt ? new Date(n.createdAt).toLocaleDateString('vi-VN') : 'â€”';
            
            const catName = n.categoryId ? (ProductDB.getNewsCategoryById(n.categoryId)?.name || 'ChÆ°a phÃ¢n loáº¡i') : 'ChÆ°a phÃ¢n loáº¡i';
            
            let posBadge = '';
            if (n.position === 'hero_main') posBadge = '<span class="badge" style="background:#e8f4fd;color:#0369a1;padding:4px 8px;border-radius:4px;font-size:12px;">BÃ i ná»•i báº­t (ChÃ­nh)</span>';
            else if (n.position === 'hero_sub') posBadge = '<span class="badge" style="background:#f0f9ff;color:#0284c7;padding:4px 8px;border-radius:4px;font-size:12px;">BÃ i ná»•i báº­t (Phá»¥)</span>';
            else if (n.position === 'trending_main') posBadge = '<span class="badge" style="background:#fff7ed;color:#c2410c;padding:4px 8px;border-radius:4px;font-size:12px;">Tin cáº­p nháº­t (ChÃ­nh)</span>';
            else posBadge = '<span class="badge" style="background:#f1f5f9;color:#64748b;padding:4px 8px;border-radius:4px;font-size:12px;">Máº·c Ä‘á»‹nh</span>';

            return `
                <tr>
                    <td style="color:var(--admin-text-dim);font-weight:600;text-align:left;">#${n.id}</td>
                    <td>
                        <div class="product-cell">
                            <img src="${n.image}" alt="${n.title}" onerror="this.src='https://via.placeholder.com/44?text=No+Img'">
                            <div class="product-cell-info">
                                <span class="product-cell-name">${n.title}</span>
                                <span class="product-cell-cat" style="font-family:monospace;">${n.slug}</span>
                            </div>
                        </div>
                    </td>
                    <td class="hide-mobile" style="text-align: left;"><span class="badge" style="background:#f1f5f9;color:#475569;padding:4px 8px;border-radius:4px;font-size:13px"><i class="fa-solid fa-tag"></i> ${catName}</span></td>
                    <td class="hide-mobile" style="text-align: left;">${posBadge}</td>
                    <td class="hide-mobile" style="text-align: left;">${n.active !== false ? '<span class="badge badge-success" style="background:#d4edda;color:#155724;padding:4px 8px;border-radius:4px;font-size:14px">Äang hiá»‡n</span>' : '<span class="badge badge-danger" style="background:#f8d7da;color:#721c24;padding:4px 8px;border-radius:4px;font-size:14px">Äang áº©n</span>'}</td>
                    <td class="hide-mobile" style="text-align: left;">${dateStr}</td>
                    <td style="text-align: left;">
                        <div class="actions-cell" style="justify-content: flex-start;">
                            <button class="btn-icon success" title="Sá»­a" onclick="editNews(${n.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-icon danger" title="XÃ³a" onclick="deleteNews(${n.id}, '${n.title.replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (document.getElementById('newsSearch')) {
        document.getElementById('newsSearch').addEventListener('input', renderNews);
    }

    // News modal
    window.openNewsModal = function (newsItem = null) {
        const modal = document.getElementById('newsModal');
        const title = document.getElementById('newsModalTitle');
        const form = document.getElementById('newsForm');

        form.reset();
        document.getElementById('newsId').value = '';
        updateNewsImagePreview();

        // Populate Categories
        const catSelect = document.getElementById('newsCategorySelect');
        const categories = ProductDB.getNewsCategories();
        catSelect.innerHTML = '<option value="">-- Chá»n danh má»¥c --</option>' + 
            categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

        if (newsItem) {
            title.textContent = 'Sá»­a tin tá»©c';
            document.getElementById('newsId').value = newsItem.id;
            document.getElementById('newsTitle').value = newsItem.title;
            document.getElementById('newsSlug').value = newsItem.slug || '';
            document.getElementById('newsAuthor').value = newsItem.author || '';
            document.getElementById('newsImage').value = newsItem.image || '';
            document.getElementById('newsContent').value = newsItem.content || '';
            if (quillEditor) quillEditor.root.innerHTML = newsItem.content || '';
            
            document.getElementById('newsCategorySelect').value = newsItem.categoryId || '';
            document.getElementById('newsPosition').value = newsItem.position || 'default';
            
            document.getElementById('newsActive').checked = newsItem.active !== false;
            updateNewsImagePreview();
        } else {
            title.textContent = 'ThÃªm tin tá»©c má»›i';
            document.getElementById('newsSlug').value = '';
            document.getElementById('newsContent').value = '';
            if (quillEditor) quillEditor.root.innerHTML = '';
            
            document.getElementById('newsCategorySelect').value = '';
            document.getElementById('newsPosition').value = 'default';
            
            document.getElementById('newsActive').checked = true;
        }

        modal.classList.add('active');
    };

    window.closeNewsModal = function () {
        document.getElementById('newsModal').classList.remove('active');
    };

    window.editNews = function (id) {
        const newsItem = ProductDB.getNewsById(id);
        if (newsItem) openNewsModal(newsItem);
    };

    window.deleteNews = function (id, title) {
        showConfirm('XÃ³a tin tá»©c', `Báº¡n cÃ³ cháº¯c muá»‘n xÃ³a tin tá»©c "${title}"?`, () => {
            ProductDB.deleteNews(id);
            showToast('ÄÃ£ xÃ³a tin tá»©c thÃ nh cÃ´ng!', 'success');
            renderNews();
        });
    };

    document.getElementById('newsTitle')?.addEventListener('input', function(e) {
        const slug = e.target.value.toLowerCase()
            .replace(/Ä‘/g, 'd')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        document.getElementById('newsSlug').value = slug;
    });

    function updateNewsImagePreview() {
        const url = document.getElementById('newsImage').value;
        const box = document.getElementById('newsImagePreview');
        if (url) {
            box.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'><i class=\\'fa-solid fa-image-slash\\'></i>HÃ¬nh áº£nh khÃ´ng há»£p lá»‡</div>'">`;
        } else {
            box.innerHTML = '<div class="placeholder"><i class="fa-solid fa-image"></i>Xem trÆ°á»›c hÃ¬nh áº£nh</div>';
        }
    }
    
    document.getElementById('newsImage')?.addEventListener('input', updateNewsImagePreview);

    const newsImageUpload = document.getElementById('newsImageUpload');
    if (newsImageUpload) {
        newsImageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showToast('Vui lÃ²ng chá»n áº£nh cÃ³ kÃ­ch thÆ°á»›c dÆ°á»›i 2MB!', 'error');
                    this.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const base64Str = evt.target.result;
                    document.getElementById('newsImage').value = base64Str;
                    updateNewsImagePreview();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    document.getElementById('btnSaveNews')?.addEventListener('click', () => {
        const title = document.getElementById('newsTitle').value.trim();
        if (!title) {
            showToast('Vui lÃ²ng nháº­p tiÃªu Ä‘á» tin tá»©c!', 'error');
            return;
        }

        const catId = document.getElementById('newsCategorySelect').value;
        if (!catId) {
            showToast('Vui lÃ²ng chá»n danh má»¥c tin tá»©c!', 'error');
            return;
        }

        const data = {
            title,
            slug: document.getElementById('newsSlug').value.trim(),
            author: document.getElementById('newsAuthor').value.trim(),
            image: document.getElementById('newsImage').value.trim(),
            content: document.getElementById('newsContent').value.trim(),
            categoryId: parseInt(catId),
            position: document.getElementById('newsPosition').value,
            active: document.getElementById('newsActive').checked
        };

        const editId = document.getElementById('newsId').value;
        if (editId) {
            ProductDB.updateNews(editId, data);
            showToast('Cáº­p nháº­t tin tá»©c thÃ nh cÃ´ng!', 'success');
        } else {
            ProductDB.addNews(data);
            showToast('ThÃªm tin tá»©c má»›i thÃ nh cÃ´ng!', 'success');
        }

        closeNewsModal();
        renderNews();
    });

    document.getElementById('btnAddNews')?.addEventListener('click', () => openNewsModal());

    // ========== RELOAD DATABASE ==========
    document.getElementById('btnResetDB').addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm('Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n KhÃ´i phá»¥c dá»¯ liá»‡u gá»‘c khÃ´ng? Thao tÃ¡c nÃ y sáº½ xÃ³a má»i thay Ä‘á»•i hiá»‡n táº¡i.')) { 
            localStorage.clear(); 
            window.location.reload(); 
        }
    });


});
