/**
 * Admin categories Module
 */
document.addEventListener('DOMContentLoaded', () => {
    // ========== CATEGORIES ==========
    window.renderCategories = function() {
        const categories = ProductDB.getCategories();
        const tbody = document.getElementById('categoriesTableBody');

        if (categories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="table-empty"><i class="fa-solid fa-folder-tree"></i>ChÆ°a cÃ³ danh má»¥c nÃ o</td></tr>';
            return;
        }

        tbody.innerHTML = categories.map(c => {
            const count = ProductDB.getProductCountByCategory(c.id);
            return `
                <tr>
                    <td style="color:var(--admin-text-dim);font-weight:600">#${c.id}</td>
                    <td><strong>${c.name}</strong></td>
                    <td style="color:var(--admin-text-dim);font-family:monospace;font-size:12px">${c.slug}</td>
                    <td style="text-align: center;"><span class="cat-product-count">${count}</span></td>
                    <td style="text-align: center;">
                        <div class="actions-cell" style="justify-content: center;">
                            <button class="btn-icon success" title="Sá»­a" onclick="editCategory(${c.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-icon danger" title="XÃ³a" onclick="deleteCategory(${c.id}, '${c.name.replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Keep sidebar category tree in sync
        renderSidebarCategories();
    }

    // Category modal
    window.openCategoryModal = function (category = null) {
        const modal = document.getElementById('categoryModal');
        const title = document.getElementById('categoryModalTitle');

        document.getElementById('categoryId').value = '';
        document.getElementById('categoryName').value = '';
        document.getElementById('categorySlug').value = '';
        document.getElementById('categorySeoDesc').value = '';

        if (category) {
            title.textContent = 'Sá»­a danh má»¥c';
            document.getElementById('categoryId').value = category.id;
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categorySlug').value = category.slug;
            document.getElementById('categorySeoDesc').value = category.seoDesc || '';
        } else {
            title.textContent = 'ThÃªm danh má»¥c má»›i';
        }

        modal.classList.add('active');
    };

    document.getElementById('categoryName').addEventListener('input', function(e) {
        const slug = e.target.value.toLowerCase()
            .replace(/Ä‘/g, 'd')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        document.getElementById('categorySlug').value = slug;
    });

    window.closeCategoryModal = function () {
        document.getElementById('categoryModal').classList.remove('active');
    };

    window.editCategory = function (id) {
        const cat = ProductDB.getCategoryById(id);
        if (cat) openCategoryModal(cat);
    };

    window.deleteCategory = function (id, name) {
        showConfirm('XÃ³a danh má»¥c', `Báº¡n cÃ³ cháº¯c muá»‘n xÃ³a danh má»¥c "${name}"?`, () => {
            const result = ProductDB.deleteCategory(id);
            if (result.success) {
                showToast('ÄÃ£ xÃ³a danh má»¥c thÃ nh cÃ´ng!', 'success');
                renderCategories();
            } else {
                showToast(result.message, 'error');
            }
        });
    };

    document.getElementById('btnSaveCategory').addEventListener('click', () => {
        const name = document.getElementById('categoryName').value.trim();
        if (!name) {
            showToast('Vui lÃ²ng nháº­p tÃªn danh má»¥c!', 'error');
            return;
        }

        const slug = document.getElementById('categorySlug').value.trim();
        const seoDesc = document.getElementById('categorySeoDesc').value.trim();
        const editId = document.getElementById('categoryId').value;

        if (editId) {
            ProductDB.updateCategory(editId, { name, slug, seoDesc });
            showToast('Cáº­p nháº­t danh má»¥c thÃ nh cÃ´ng!', 'success');
        } else {
            ProductDB.addCategory({ name, slug, seoDesc });
            showToast('ThÃªm danh má»¥c má»›i thÃ nh cÃ´ng!', 'success');
        }

        closeCategoryModal();
        renderCategories();
    });

    document.getElementById('btnAddCategory').addEventListener('click', () => openCategoryModal());

    // ========== QUILL JS INIT ==========
    let quillEditor = null;
    if (document.getElementById('newsContentEditor')) {
        quillEditor = new Quill('#newsContentEditor', {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link', 'image', 'video'],
                        ['clean']
                    ],
                    handlers: {
                        image: function() {
                            const value = prompt('Nháº­p Ä‘Æ°á»ng dáº«n (URL) cá»§a hÃ¬nh áº£nh:');
                            if (value) {
                                const cursorPosition = this.quill.getSelection()?.index || 0;
                                this.quill.insertEmbed(cursorPosition, 'image', value);
                                this.quill.setSelection(cursorPosition + 1);
                            }
                        }
                    }
                }
            }
        });
        
        quillEditor.on('text-change', function() {
            document.getElementById('newsContent').value = quillEditor.root.innerHTML;
        });
    }


});
