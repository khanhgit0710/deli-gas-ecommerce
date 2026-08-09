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
            tbody.innerHTML = '<tr><td colspan="4" class="table-empty"><i class="fa-solid fa-tags"></i>ChÆ°a cÃ³ danh má»¥c tin tá»©c nÃ o</td></tr>';
            return;
        }

        tbody.innerHTML = categories.map(c => {
            const count = news.filter(n => n.categoryId === c.id).length;
            return `
                <tr>
                    <td style="color:var(--admin-text-dim);font-weight:600;">#${c.id}</td>
                    <td style="font-weight:600;color:var(--admin-text);">${c.name}</td>
                    <td style="font-family:monospace;color:var(--admin-text-muted);">${c.slug}</td>
                    <td style="font-weight:500;">${count} bÃ i viáº¿t</td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-icon success" title="Sá»­a" onclick="editNewsCategory(${c.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-icon danger" title="XÃ³a" onclick="deleteNewsCategory(${c.id}, '${c.name.replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash-can"></i></button>
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
            title.textContent = 'Sá»­a danh má»¥c tin tá»©c';
            document.getElementById('newsCategoryId').value = cat.id;
            document.getElementById('newsCategoryName').value = cat.name;
            document.getElementById('newsCategorySlug').value = cat.slug || '';
            document.getElementById('newsCategorySeoDesc').value = cat.seoDesc || '';
        } else {
            title.textContent = 'ThÃªm danh má»¥c tin tá»©c';
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
        showConfirm('XÃ³a danh má»¥c', `Báº¡n cÃ³ cháº¯c muá»‘n xÃ³a danh má»¥c tin tá»©c "${name}"?`, () => {
            const res = ProductDB.deleteNewsCategory(id);
            if (res.success) {
                showToast('ÄÃ£ xÃ³a danh má»¥c tin tá»©c!', 'success');
                renderNewsCategories();
            } else {
                showToast(res.message || 'Lá»—i khi xÃ³a', 'error');
            }
        });
    };

    document.getElementById('newsCategoryName')?.addEventListener('input', function(e) {
        const slug = e.target.value.toLowerCase()
            .replace(/Ä‘/g, 'd')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        document.getElementById('newsCategorySlug').value = slug;
    });

    document.getElementById('btnSaveNewsCategory')?.addEventListener('click', () => {
        const name = document.getElementById('newsCategoryName').value.trim();
        if (!name) {
            showToast('Vui lÃ²ng nháº­p tÃªn danh má»¥c!', 'error');
            return;
        }

        const slug = document.getElementById('newsCategorySlug').value.trim();
        const seoDesc = document.getElementById('newsCategorySeoDesc').value.trim();
        const editId = document.getElementById('newsCategoryId').value;

        let res;
        if (editId) {
            res = ProductDB.updateNewsCategory(editId, { name, slug, seoDesc });
        } else {
            res = ProductDB.addNewsCategory({ name, slug, seoDesc });
        }

        if (res.success) {
            showToast(editId ? 'Cáº­p nháº­t thÃ nh cÃ´ng!' : 'ThÃªm danh má»¥c má»›i thÃ nh cÃ´ng!', 'success');
            closeNewsCategoryModal();
            renderNewsCategories();
        } else {
            showToast(res.message || 'Lá»—i khi lÆ°u danh má»¥c', 'error');
        }
    });

    document.getElementById('btnAddNewsCategory')?.addEventListener('click', () => openNewsCategoryModal());


});
