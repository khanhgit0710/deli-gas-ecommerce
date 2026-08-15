/**
 * Admin Reviews Module
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const reviewsSearch = document.getElementById('reviewsSearch');
    const reviewFilterStatus = document.getElementById('reviewFilterStatus');
    
    // Event Listeners
    if (reviewsSearch) {
        reviewsSearch.addEventListener('input', () => {
            renderReviews();
        });
    }

    if (reviewFilterStatus) {
        reviewFilterStatus.addEventListener('change', () => {
            renderReviews();
        });
    }

    window.renderReviews = function() {
        const tbody = document.getElementById('reviewsTableBody');
        const countText = document.getElementById('reviewCountText');
        if (!tbody) return;

        let reviews = ProductDB.getReviews(true) || [];
        
        // Filter by Status
        const statusFilter = reviewFilterStatus ? reviewFilterStatus.value : 'all';
        if (statusFilter !== 'all') {
            reviews = reviews.filter(r => r.status === statusFilter);
        }

        // Search
        const searchTerm = reviewsSearch ? reviewsSearch.value.trim().toLowerCase() : '';
        if (searchTerm) {
            reviews = reviews.filter(r => {
                const p = ProductDB.getById(r.productId);
                const pName = p ? p.name.toLowerCase() : '';
                return r.name.toLowerCase().includes(searchTerm) || 
                       r.content.toLowerCase().includes(searchTerm) ||
                       pName.includes(searchTerm);
            });
        }

        // Sort: newest first
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (countText) {
            countText.textContent = `${reviews.length} đánh giá`;
        }

        if (reviews.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="table-empty"><i class="fa-solid fa-star"></i>Chưa có đánh giá nào</td></tr>';
            return;
        }

        tbody.innerHTML = reviews.map(r => {
            const product = ProductDB.getById(r.productId);
            const productName = product ? product.name : 'Sản phẩm đã bị xóa';
            const date = new Date(r.createdAt).toLocaleDateString('vi-VN');
            
            let statusBadge = '';
            if (r.status === 'pending') statusBadge = '<span class="status-badge" style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; font-size: 13px; font-weight: 500;">Chờ duyệt</span>';
            else if (r.status === 'approved') statusBadge = '<span class="status-badge" style="background: #22c55e; color: white; padding: 4px 8px; border-radius: 4px; font-size: 13px; font-weight: 500;">Đã duyệt</span>';
            else if (r.status === 'rejected') statusBadge = '<span class="status-badge" style="background: #6b7280; color: white; padding: 4px 8px; border-radius: 4px; font-size: 13px; font-weight: 500;">Bị từ chối</span>';

            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= r.rating) starsHtml += '<i class="fa-solid fa-star" style="color: #f59e0b;"></i>';
                else starsHtml += '<i class="fa-regular fa-star" style="color: #d1d5db;"></i>';
            }

            let imagesHtml = '';
            if (r.images && r.images.length > 0) {
                imagesHtml = '<div style="margin-top: 8px; display: flex; gap: 5px; flex-wrap: wrap;">';
                r.images.forEach(img => {
                    imagesHtml += `<img src="${img}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; cursor: pointer;" onclick="window.open(this.src, '_blank')">`;
                });
                imagesHtml += '</div>';
            }

            return `
                <tr>
                    <td style="color:var(--admin-text-dim);font-size:13px">#${r.id}</td>
                    <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${productName}"><strong>${productName}</strong></td>
                    <td>
                        <div style="font-weight: 500;">${r.name}</div>
                        <div style="font-size: 12px; color: var(--admin-text-muted);">${r.phone || ''}</div>
                        <div style="font-size: 11px; color: var(--admin-text-muted);">${date}</div>
                    </td>
                    <td>${starsHtml}</td>
                    <td style="max-width: 250px;">
                        <div style="max-height: 80px; overflow-y: auto; white-space: pre-wrap; word-break: break-word; line-height: 1.5; color: var(--admin-text); padding-right: 5px;" title="${r.content}">${r.content}</div>
                        ${imagesHtml}
                    </td>
                    <td style="text-align: center;">${statusBadge}</td>
                    <td style="text-align: center;">
                        <div class="actions-cell" style="justify-content: center;">
                            ${r.status !== 'approved' ? `<button class="btn-icon success" title="Duyệt" onclick="updateReviewStatus(${r.id}, 'approved')"><i class="fa-solid fa-check"></i></button>` : ''}
                            ${r.status !== 'rejected' ? `<button class="btn-icon warning" title="Từ chối" onclick="updateReviewStatus(${r.id}, 'rejected')"><i class="fa-solid fa-ban"></i></button>` : ''}
                            <button class="btn-icon danger" title="Xóa" onclick="confirmDeleteReview(${r.id})"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    };

    window.updateReviewStatus = function(id, status) {
        if (ProductDB.updateReviewStatus(id, status)) {
            renderReviews();
            if (typeof updateContactBadge === 'function') updateContactBadge();
            if (typeof showToast === 'function') {
                if (status === 'approved') showToast('Đã duyệt đánh giá', 'success');
                else if (status === 'rejected') showToast('Đã từ chối đánh giá', 'warning');
            }
        }
    };

    window.confirmDeleteReview = function(id) {
        if (typeof window.showConfirm === 'function') {
            window.showConfirm('Xóa đánh giá', 'Bạn có chắc chắn muốn xóa đánh giá này không?', () => {
                if (ProductDB.deleteReview(id)) {
                    renderReviews();
                    if (typeof updateContactBadge === 'function') updateContactBadge();
                    showToast('Đã xóa đánh giá', 'success');
                }
            });
        } else {
            if (confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) {
                if (ProductDB.deleteReview(id)) {
                    renderReviews();
                    if (typeof updateContactBadge === 'function') updateContactBadge();
                    if (typeof showToast === 'function') showToast('Đã xóa đánh giá', 'success');
                }
            }
        }
    };

    // Initially render reviews when script loads
    if (document.getElementById('section-reviews')) {
        renderReviews();
    }
});
