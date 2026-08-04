/**
 * Admin news-categories Module
 */
document.addEventListener('DOMContentLoaded', () => {
    // ========== NEWS CATEGORIES ==========
    window.renderNewsCategories = function() {
        const categories = ProductDB.getNewsCategories();
        const news = ProductDB.getNews(true); // to count articles per category
        const tbody = document.getElementById('newsCategoriesTableBody');

        if (!tbody) return;

        if (categories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="table-empty"><i class="fa-solid fa-tags"></i>Chưa có danh mục tin tức nào</td></tr>';
            return;
        }

        tbody.innerHTML = categories.map(c => {
            const count = news.filter(n => n.categoryId === c.id).length;
            return `
                <tr>
                    <td style="color:var(--admin-text-dim);font-weight:600;">#${c.id}</td>
                    <td style="font-weight:600;color:var(--admin-text);">${c.name}</td>
                    <td style="font-family:monospace;color:var(--admin-text-muted);">${c.slug}</td>
                    <td style="font-weight:500;">${count} bài viết</td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-icon success" title="Sửa" onclick="editNewsCategory(${c.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-icon danger" title="Xóa" onclick="deleteNewsCategory(${c.id}, '${c.name.replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.openNewsCategoryModal = function(cat = null) {
        const modal = document.getElementById('newsCategoryModal');
        const title = document.getElementById('newsCategoryModalTitle');
        const form = document.getElementById('newsCategoryForm');

        form.reset();
        document.getElementById('newsCategoryId').value = '';

        if (cat) {
            title.textContent = 'Sửa danh mục tin tức';
            document.getElementById('newsCategoryId').value = cat.id;
            document.getElementById('newsCategoryName').value = cat.name;
            document.getElementById('newsCategorySlug').value = cat.slug || '';
        } else {
            title.textContent = 'Thêm danh mục tin tức';
        }
        modal.classList.add('active');
    };

    window.closeNewsCategoryModal = function() {
        document.getElementById('newsCategoryModal').classList.remove('active');
    };

    window.editNewsCategory = function(id) {
        const cat = ProductDB.getNewsCategoryById(id);
        if (cat) openNewsCategoryModal(cat);
    };

    window.deleteNewsCategory = function(id, name) {
        showConfirm('Xóa danh mục', `Bạn có chắc muốn xóa danh mục tin tức "${name}"?`, () => {
            const res = ProductDB.deleteNewsCategory(id);
            if (res.success) {
                showToast('Đã xóa danh mục tin tức!', 'success');
                renderNewsCategories();
            } else {
                showToast(res.message || 'Lỗi khi xóa', 'error');
            }
        });
    };

    document.getElementById('newsCategoryName')?.addEventListener('input', function(e) {
        const slug = e.target.value.toLowerCase()
            .replace(/đ/g, 'd')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        document.getElementById('newsCategorySlug').value = slug;
    });

    document.getElementById('btnSaveNewsCategory')?.addEventListener('click', () => {
        const name = document.getElementById('newsCategoryName').value.trim();
        if (!name) {
            showToast('Vui lòng nhập tên danh mục!', 'error');
            return;
        }

        const slug = document.getElementById('newsCategorySlug').value.trim();
        const editId = document.getElementById('newsCategoryId').value;

        let res;
        if (editId) {
            res = ProductDB.updateNewsCategory(editId, { name, slug });
        } else {
            res = ProductDB.addNewsCategory({ name, slug });
        }

        if (res.success) {
            showToast(editId ? 'Cập nhật thành công!' : 'Thêm danh mục mới thành công!', 'success');
            closeNewsCategoryModal();
            renderNewsCategories();
        } else {
            showToast(res.message || 'Lỗi khi lưu danh mục', 'error');
        }
    });

    document.getElementById('btnAddNewsCategory')?.addEventListener('click', () => openNewsCategoryModal());


});
