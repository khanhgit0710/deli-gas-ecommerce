document.addEventListener('ProductDBReady', () => {
    // -------------------------------------------------------------------------
    // Sale Off UI LOGIC
    // -------------------------------------------------------------------------
    const tableBody = document.getElementById('flashDealsTableBody');
    const modal = document.getElementById('manageFlashDealsModal');
    const btnManage = document.getElementById('btnManageFlashDeals');
    const searchInput = document.getElementById('flashDealsSearchInput');
    const selectionTable = document.getElementById('flashDealsSelectionTable');

    function renderFlashDealsTable() {
        if (!tableBody) return;
        const products = ProductDB.getFlashDealProducts();
        
        if (products.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">Chưa có sản phẩm Sale Off nào.</td></tr>`;
            return;
        }

        tableBody.innerHTML = products.map(p => `
            <tr>
                <td style="color:var(--admin-text-dim);font-weight:600">#${p.id}</td>
                <td>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <img src="${p.image}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; border:1px solid var(--admin-border)">
                        <strong>${p.name}</strong>
                    </div>
                </td>
                <td>
                    <span style="font-weight: 500; color: var(--color-primary);">${p.flashDealPrice ? ProductDB.formatPrice(p.flashDealPrice) : 'Chưa nhập'}</span>
                </td>
                <td>
                    <span style="font-size: 13px;">${p.flashDealDesc || '<em style="color:#aaa">Chưa có mô tả</em>'}</span>
                </td>
                <td style="text-align:center;">
                    <div class="actions-cell" style="justify-content:center;">
                        <button class="btn-icon warning" title="Chỉnh sửa Deal" onclick="openEditFlashDealModal(${p.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon danger" title="Bỏ khỏi Sale Off" onclick="toggleFlashDealStatus(${p.id}, false)"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Modal Handling
    window.openEditFlashDealModal = function(id) {
        const product = ProductDB.getById(id);
        if (!product) return;

        document.getElementById('editFlashDealId').value = product.id;
        document.getElementById('editFlashDealProductName').innerText = product.name;
        document.getElementById('editFlashDealPrice').value = product.flashDealPrice ? product.flashDealPrice.toLocaleString('vi-VN').replace(/,/g, '.') : '';
        document.getElementById('editFlashDealDesc').value = product.flashDealDesc || '';
        
        document.getElementById('editFlashDealModal').classList.add('active');
    };

    window.saveFlashDealEdit = function() {
        const id = document.getElementById('editFlashDealId').value;
        const priceRaw = document.getElementById('editFlashDealPrice').value;
        const price = priceRaw ? priceRaw.replace(/\./g, '') : '';
        const desc = document.getElementById('editFlashDealDesc').value;

        if (ProductDB.updateFlashDealData(id, desc, price)) {
            showToast('Đã lưu thông tin Sale Off!', 'success');
            document.getElementById('editFlashDealModal').classList.remove('active');
            renderFlashDealsTable();
            renderSelectionTable();
        } else {
            showToast('Có lỗi xảy ra!', 'error');
        }
    };

    // Export functions to global scope for inline event handlers
    window.updateFlashDealData = function(id, desc, price) {
        ProductDB.updateFlashDealData(id, desc, price);
        showToast('Đã cập nhật dữ liệu deal', 'success');
    };

    window.toggleFlashDealStatus = function(id, status) {
        ProductDB.toggleFlashDeal(id, status);
        renderFlashDealsTable();
        renderFlashDealsSelection();
        if (!status) {
            showToast('Đã gỡ khỏi Sale Off', 'info');
        } else {
            showToast('Đã thêm vào Sale Off', 'success');
        }
    };

    // -------------------------------------------------------------------------
    // Sale Off MODAL LOGIC
    // -------------------------------------------------------------------------
    let selectionSearchQuery = '';

    function renderFlashDealsSelection() {
        if (!selectionTable) return;
        // Fetch all products from localStorage directly for management view
        const _getProducts = () => JSON.parse(localStorage.getItem('gasviet_products') || '[]');
        let products = _getProducts().filter(p => p.active !== false);

        if (selectionSearchQuery) {
            const q = selectionSearchQuery.toLowerCase();
            products = products.filter(p => p.name.toLowerCase().includes(q) || p.id.toString() === q);
        }

        selectionTable.innerHTML = products.map(p => `
            <tr>
                <td style="text-align: center;">
                    <input type="checkbox" ${p.isFlashDeal ? 'checked' : ''} 
                           onchange="toggleFlashDealStatus(${p.id}, this.checked)"
                           style="width: 16px; height: 16px; cursor: pointer;">
                </td>
                <td style="color:var(--admin-text-dim)">#${p.id}</td>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${p.image}" style="width:30px; height:30px; object-fit:cover; border-radius:4px;">
                        <span>${p.name}</span>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    if (btnManage) {
        btnManage.addEventListener('click', () => {
            selectionSearchQuery = '';
            if (searchInput) searchInput.value = '';
            renderFlashDealsSelection();
            modal.classList.add('active');
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            selectionSearchQuery = e.target.value;
            renderFlashDealsSelection();
        });
    }

    // Format currency for Sale Off edit modal
    const editPriceInput = document.getElementById('editFlashDealPrice');
    if (editPriceInput) {
        editPriceInput.addEventListener('input', function(e) {
            let val = e.target.value.replace(/\D/g, '');
            if (val) {
                e.target.value = parseInt(val).toLocaleString('vi-VN').replace(/,/g, '.');
            } else {
                e.target.value = '';
            }
        });
    }

    // Initial render
    renderFlashDealsTable();
});
