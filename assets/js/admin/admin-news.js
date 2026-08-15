/**
 * Admin news Module
 */
document.addEventListener('DOMContentLoaded', () => {
    // ========== NEWS ==========
    window.renderNews = function() {
        const news = ProductDB.getNews(true); // true means isAdmin (returns all including inactive)
        const searchValRaw = document.getElementById('newsSearch') ? document.getElementById('newsSearch').value.trim() : '';
        const searchVal = window.removeVietnameseTones(searchValRaw);
        const tbody = document.getElementById('newsTableBody');

        if (!tbody) return;

        let filteredNews = news;
        if (searchVal) {
            filteredNews = news.filter(n => 
                window.removeVietnameseTones(n.title).includes(searchVal) || 
                (n.slug && n.slug.toLowerCase().includes(searchVal))
            );
        }

        if (filteredNews.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="table-empty"><i class="fa-solid fa-newspaper"></i>Chưa có tin tức nào</td></tr>';
            return;
        }

        tbody.innerHTML = filteredNews.map(n => {
            const dateStr = n.createdAt ? new Date(n.createdAt).toLocaleDateString('vi-VN') : '—';
            
            const catName = n.categoryId ? (ProductDB.getNewsCategoryById(n.categoryId)?.name || 'Chưa phân loại') : 'Chưa phân loại';
            
            let posBadge = '';
            if (n.position === 'hero_main') posBadge = '<span class="badge" style="background:#e8f4fd;color:#0369a1;padding:4px 8px;border-radius:4px;font-size:12px;">Bài nổi bật (Chính)</span>';
            else if (n.position === 'hero_sub') posBadge = '<span class="badge" style="background:#f0f9ff;color:#0284c7;padding:4px 8px;border-radius:4px;font-size:12px;">Bài nổi bật (Phụ)</span>';
            else if (n.position === 'trending_main') posBadge = '<span class="badge" style="background:#fff7ed;color:#c2410c;padding:4px 8px;border-radius:4px;font-size:12px;">Tin cập nhật (Chính)</span>';
            else posBadge = '<span class="badge" style="background:#f1f5f9;color:#64748b;padding:4px 8px;border-radius:4px;font-size:12px;">Mặc định</span>';

            return `
                <tr>
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
                    <td class="hide-mobile" style="text-align: left;">${n.active !== false ? '<span class="badge badge-success" style="background:#d4edda;color:#155724;padding:4px 8px;border-radius:4px;font-size:14px">Đang hiện</span>' : '<span class="badge badge-danger" style="background:#f8d7da;color:#721c24;padding:4px 8px;border-radius:4px;font-size:14px">Đang ẩn</span>'}</td>
                    <td class="hide-mobile" style="text-align: left;">${dateStr}</td>
                    <td style="text-align: left;">
                        <div class="actions-cell" style="justify-content: flex-start;">
                            <button class="btn-icon success" title="Sửa" onclick="editNews(${n.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-icon danger" title="Xóa" onclick="deleteNews(${n.id}, '${n.title.replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash-can"></i></button>
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
        catSelect.innerHTML = '<option value="">-- Chọn danh mục --</option>' + 
            categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

        if (newsItem) {
            title.textContent = 'Sửa tin tức';
            document.getElementById('newsId').value = newsItem.id;
            document.getElementById('newsTitle').value = newsItem.title || '';
            document.getElementById('newsSlug').value = newsItem.slug || '';
            document.getElementById('newsAuthor').value = newsItem.author || '';
            document.getElementById('newsAuthorAvatar').value = newsItem.authorAvatar || '';
            document.getElementById('newsImage').value = newsItem.image || '';
            document.getElementById('newsContent').value = newsItem.content || '';
            if (typeof quillEditor !== 'undefined') quillEditor.root.innerHTML = newsItem.content || '';
            
            document.getElementById('newsCategorySelect').value = newsItem.categoryId || '';
            document.getElementById('newsPosition').value = newsItem.position || 'default';
            
            document.getElementById('newsActive').checked = newsItem.active !== false;
            updateNewsImagePreview();
        } else {
            title.textContent = 'Thêm tin tức mới';
            document.getElementById('newsSlug').value = '';
            document.getElementById('newsAuthorAvatar').value = '';
            document.getElementById('newsContent').value = '';
            if (typeof quillEditor !== 'undefined') quillEditor.root.innerHTML = '';
            
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
        showConfirm('Xóa tin tức', `Bạn có chắc muốn xóa tin tức "${title}"?`, () => {
            const newsItem = ProductDB.getNewsById(id);
            if (newsItem && newsItem.image) {
                fetch('/delete-image.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paths: [newsItem.image] })
                }).catch(e => console.error('Error deleting image from host', e));
            }
            ProductDB.deleteNews(id);
            showToast('Đã xóa tin tức thành công!', 'success');
            renderNews();
        });
    };

    document.getElementById('newsTitle')?.addEventListener('input', function(e) {
        const slug = e.target.value.toLowerCase()
            .replace(/đ/g, 'd')
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
            box.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'><i class=\\'fa-solid fa-image-slash\\'></i>Hình ảnh không hợp lệ</div>'">`;
        } else {
            box.innerHTML = '<div class="placeholder"><i class="fa-solid fa-image"></i>Xem trước hình ảnh</div>';
        }
    }
    
    document.getElementById('newsImage')?.addEventListener('input', updateNewsImagePreview);

    const newsImageUpload = document.getElementById('newsImageUpload');
    if (newsImageUpload) {
        newsImageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showToast('Vui lòng chọn ảnh có kích thước dưới 2MB!', 'error');
                    this.value = '';
                    return;
                }
                window.compressImage(file, 800, function(dataUrl) {
                    if (dataUrl) {
                        document.getElementById('newsImage').value = dataUrl;
                        updateNewsImagePreview();
                    }
                });
            }
        });
    }

    const newsAuthorAvatarUpload = document.getElementById('newsAuthorAvatarUpload');
    if (newsAuthorAvatarUpload) {
        newsAuthorAvatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 1024 * 1024) {
                    showToast('Vui lòng chọn ảnh có kích thước dưới 1MB!', 'error');
                    this.value = '';
                    return;
                }
                window.compressImage(file, 400, function(dataUrl) {
                    if (dataUrl) {
                        document.getElementById('newsAuthorAvatar').value = dataUrl;
                    }
                });
            }
        });
    }

    document.getElementById('btnSaveNews')?.addEventListener('click', async (e) => {
        if(e) e.preventDefault();
        const title = document.getElementById('newsTitle').value.trim();
        if (!title) {
            showToast('Vui lòng nhập tiêu đề tin tức!', 'error');
            return;
        }

        const catId = document.getElementById('newsCategorySelect').value;
        if (!catId) {
            showToast('Vui lòng chọn danh mục tin tức!', 'error');
            return;
        }

        let mainImage = document.getElementById('newsImage').value.trim();
        const btnSave = document.getElementById('btnSaveNews');
        const originalBtnText = btnSave.innerHTML;

        try {
            btnSave.disabled = true;
            btnSave.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Đang lưu...';

            if (mainImage.startsWith('data:image')) {
                const res = await fetch('/upload-image.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: mainImage, type: 'news' })
                });
                const textResponse = await res.text();
                try {
                    const resData = JSON.parse(textResponse);
                    if (resData.success) {
                        mainImage = resData.url;
                    } else {
                        throw new Error(resData.message);
                    }
                } catch (e) {
                    console.warn('PHP upload failed, falling back to Base64 (Local Environment)');
                    // Keep mainImage as Base64
                }
            }

            let autoSeoDesc = document.getElementById('newsSeoDesc') ? document.getElementById('newsSeoDesc').value.trim() : '';
            if (!autoSeoDesc && window.newsQuill) {
                let cleanText = window.newsQuill.getText().trim();
                autoSeoDesc = cleanText.substring(0, 150) + (cleanText.length > 150 ? '...' : '');
            }

            const data = {
                title: document.getElementById('newsTitle').value.trim(),
                slug: document.getElementById('newsSlug').value.trim(),
                author: document.getElementById('newsAuthor').value.trim(),
                authorAvatar: document.getElementById('newsAuthorAvatar').value.trim(),
                image: mainImage,
                content: document.getElementById('newsContent').value.trim(),
                categoryId: parseInt(catId),
                position: document.getElementById('newsPosition').value,
                active: document.getElementById('newsActive').checked,
                seoDesc: autoSeoDesc
            };

            const editId = document.getElementById('newsId').value;
            if (editId) {
                ProductDB.updateNews(editId, data);
                showToast('Cập nhật tin tức thành công!', 'success');
            } else {
                ProductDB.addNews(data);
                showToast('Thêm tin tức mới thành công!', 'success');
            }

            closeNewsModal();
            renderNews();
        } catch (error) {
            console.error(error);
            showToast('Đã xảy ra lỗi: ' + error.message + ' (Bạn có đang chạy trên môi trường có hỗ trợ PHP không?)', 'error');
        } finally {
            if(btnSave) {
                btnSave.disabled = false;
                btnSave.innerHTML = originalBtnText;
            }
        }
    });

    document.getElementById('btnAddNews')?.addEventListener('click', () => openNewsModal());

    // ========== RELOAD DATABASE ==========
    document.getElementById('btnResetDB').addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm('Bạn có chắc chắn muốn Khôi phục dữ liệu gốc không? Thao tác này sẽ xóa mọi thay đổi hiện tại.')) { 
            localStorage.clear(); 
            window.location.reload(); 
        }
    });


});
