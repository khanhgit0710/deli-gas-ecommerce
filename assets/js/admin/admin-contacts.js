/**
 * Admin Contacts Module
 */
document.addEventListener('DOMContentLoaded', () => {
    // ========== CONTACTS ==========
    // Notification Dropdown logic
    const bellToggle = document.getElementById('bellNotificationToggle');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationList = document.getElementById('notificationList');
    const markAllReadBtn = document.getElementById('markAllReadBtn');

    if (bellToggle && notificationDropdown) {
        bellToggle.addEventListener('click', (e) => {
            // Ignore click if clicking inside the dropdown but not on the bell icon itself or mark all read
            if (e.target.closest('#notificationDropdown') && !e.target.closest('#markAllReadBtn')) {
                return;
            }
            if (e.target.closest('#markAllReadBtn')) {
                e.preventDefault();
                const contacts = ProductDB.getContacts();
                contacts.forEach(c => {
                    if (c.status === 'new') ProductDB.markContactAsRead(c.id);
                });
                renderContacts();
                updateContactBadge();
                renderNotifications();
                return;
            }
            
            if (notificationDropdown.style.display === 'none') {
                notificationDropdown.style.display = 'block';
                renderNotifications();
            } else {
                notificationDropdown.style.display = 'none';
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!bellToggle.contains(e.target)) {
                notificationDropdown.style.display = 'none';
            }
        });
    }

    window.renderNotifications = function() {
        if (!notificationList) return;
        
        const contacts = ProductDB.getContacts().map(c => ({...c, type: 'contact'}));
        const pendingReviews = (ProductDB.getReviews(true) || []).filter(r => r.status === 'pending').map(r => ({...r, type: 'review'}));
        
        const allItems = [...contacts, ...pendingReviews]
            .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);
            
        const unreadCount = ProductDB.getUnreadContactCount() + ProductDB.getPendingReviewCount();
        
        if (markAllReadBtn) {
            markAllReadBtn.style.display = unreadCount > 0 ? 'block' : 'none';
        }

        if (allItems.length === 0) {
            notificationList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--admin-text-muted); font-size: 13px;">Chưa có thông báo nào</div>';
            return;
        }

        notificationList.innerHTML = allItems.map(item => {
            const date = new Date(item.createdAt);
            const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            
            if (item.type === 'contact') {
                const isUnread = item.status === 'new';
                return `
                    <div style="padding: 12px 15px; border-bottom: 1px solid var(--admin-border); background: ${isUnread ? 'rgba(239, 68, 68, 0.05)' : '#fff'}; cursor: pointer; display: flex; gap: 10px; transition: background 0.2s;" 
                         onclick="notificationItemClick(event, ${item.id}, 'contact')">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background: ${isUnread ? 'var(--admin-danger)' : 'var(--admin-border)'}; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px;">
                            <i class="fa-solid fa-user"></i>
                        </div>
                        <div style="flex: 1; overflow: hidden;">
                            <div style="font-size: 13px; color: var(--admin-text); line-height: 1.4;">
                                <strong style="color: var(--admin-text);">${item.name}</strong> vừa gửi thông tin liên hệ mới.
                            </div>
                            <div style="font-size: 11px; color: var(--admin-text-muted); margin-top: 4px; display: flex; align-items: center; gap: 5px;">
                                <i class="fa-regular fa-clock"></i> ${timeStr}
                            </div>
                        </div>
                        ${isUnread ? '<div style="width: 8px; height: 8px; border-radius: 50%; background: var(--admin-danger); align-self: center;"></div>' : ''}
                    </div>
                `;
            } else {
                // Review
                const isUnread = true; // Pending reviews are always unread
                return `
                    <div style="padding: 12px 15px; border-bottom: 1px solid var(--admin-border); background: 'rgba(245, 158, 11, 0.05)'; cursor: pointer; display: flex; gap: 10px; transition: background 0.2s;" 
                         onclick="notificationItemClick(event, ${item.id}, 'review')">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--color-warning); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px;">
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <div style="flex: 1; overflow: hidden;">
                            <div style="font-size: 13px; color: var(--admin-text); line-height: 1.4;">
                                <strong style="color: var(--admin-text);">${item.name}</strong> vừa để lại đánh giá ${item.rating} sao.
                            </div>
                            <div style="font-size: 11px; color: var(--admin-text-muted); margin-top: 4px; display: flex; align-items: center; gap: 5px;">
                                <i class="fa-regular fa-clock"></i> ${timeStr}
                            </div>
                        </div>
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-warning); align-self: center;"></div>
                    </div>
                `;
            }
        }).join('');
    };

    window.notificationItemClick = function(e, id, type = 'contact') {
        e.preventDefault();
        e.stopPropagation();
        if(notificationDropdown) notificationDropdown.style.display = 'none';
        
        if (type === 'contact') {
            ProductDB.markContactAsRead(id);
            updateContactBadge();
            
            if (document.getElementById('section-contacts') && document.getElementById('section-contacts').classList.contains('active')) {
                renderContacts();
            } else {
                if(typeof switchSection === 'function') switchSection('contacts');
            }
        } else if (type === 'review') {
            // Let the review be pending until admin explicitly approves/rejects it
            updateContactBadge();
            if (document.getElementById('section-reviews') && document.getElementById('section-reviews').classList.contains('active')) {
                if (typeof renderReviews === 'function') renderReviews();
            } else {
                if(typeof switchSection === 'function') switchSection('reviews');
            }
        }
    };

    window.renderContacts = function() {
        const contacts = ProductDB.getContacts();
        const tbody = document.getElementById('contactsTableBody');

        if (!tbody) return;

        if (contacts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="table-empty"><i class="fa-solid fa-envelope-open-text"></i>Chưa có liên hệ nào</td></tr>';
            return;
        }

        tbody.innerHTML = contacts.map(c => {
            const date = new Date(c.createdAt);
            const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            
            const statusBadge = c.status === 'new' 
                ? '<span class="status-badge status-active" style="background: var(--color-red); color: white;">Chưa đọc</span>'
                : '<span class="status-badge" style="background: var(--admin-border); color: var(--admin-text-dim);">Đã đọc</span>';

            return `
                <tr style="${c.status === 'new' ? 'background-color: rgba(239, 68, 68, 0.05);' : ''}">
                    <td style="color:var(--admin-text-dim);font-size:13px">${timeStr}</td>
                    <td><strong>${c.name}</strong></td>
                    <td><a href="tel:${c.phone}" style="color: var(--admin-primary); font-weight: 500; text-decoration: none;">${c.phone}</a></td>
                    <td><span class="badge" style="background: rgba(59, 130, 246, 0.1); color: var(--color-primary);">${c.source}</span></td>
                    <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${c.message}">${c.message}</td>
                    <td style="text-align: center;">${statusBadge}</td>
                    <td style="text-align: center;">
                        <div class="actions-cell" style="justify-content: center;">
                            ${c.status === 'new' ? `<button class="btn-icon success" title="Đánh dấu đã đọc" onclick="markContactAsRead(${c.id})"><i class="fa-solid fa-check"></i></button>` : ''}
                            <button class="btn-icon" style="color: var(--color-primary);" title="Gọi ngay" onclick="window.location.href='tel:${c.phone}'"><i class="fa-solid fa-phone"></i></button>
                            <button class="btn-icon" style="color: #0068ff;" title="Zalo" onclick="window.open('https://zalo.me/${c.phone}', '_blank')"><i class="fa-solid fa-comment-sms"></i></button>
                            <button class="btn-icon danger" title="Xóa" onclick="deleteContact(${c.id})"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        updateContactBadge();
    };

    window.markContactAsRead = function(id) {
        if(ProductDB.markContactAsRead(id)) {
            renderContacts();
            showToast('Đã đánh dấu đã đọc');
        }
    };

    window.deleteContact = function(id) {
        window.showConfirmDialog('Xóa liên hệ này?', 'Hành động này không thể hoàn tác.', () => {
            if(ProductDB.deleteContact(id)) {
                renderContacts();
                showToast('Đã xóa liên hệ');
            }
        });
    };

    window.updateContactBadge = function() {
        const unreadContacts = ProductDB.getUnreadContactCount();
        const pendingReviews = ProductDB.getPendingReviewCount();
        const count = unreadContacts + pendingReviews;
        
        const badge = document.getElementById('contactBadge');
        if (badge) {
            if (unreadContacts > 0) {
                badge.textContent = unreadContacts > 99 ? '99+' : unreadContacts;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
        
        const revBadge = document.getElementById('reviewBadge');
        if (revBadge) {
            if (pendingReviews > 0) {
                revBadge.textContent = pendingReviews > 99 ? '99+' : pendingReviews;
                revBadge.style.display = 'inline-block';
            } else {
                revBadge.style.display = 'none';
            }
        }
        
        const bellBadge = document.getElementById('bellBadge');
        if (bellBadge) {
            if (count > 0) {
                bellBadge.textContent = count > 99 ? '99+' : count;
                bellBadge.style.display = 'block';
            } else {
                bellBadge.style.display = 'none';
            }
        }
        
        // Update document title
        const baseTitle = document.getElementById('pageTitle') ? document.getElementById('pageTitle').textContent + ' | Admin' : 'Quản trị Gas Lê Mạnh';
        if (count > 0) {
            document.title = `(${count}) ${baseTitle}`;
        } else {
            document.title = baseTitle;
        }
    };

    // Listen to contact added event (for same window / tab)
    window.addEventListener('gasviet_contact_added', () => {
        updateContactBadge();
        if (notificationDropdown && notificationDropdown.style.display === 'block') {
            renderNotifications();
        }
        if (document.getElementById('section-contacts') && document.getElementById('section-contacts').classList.contains('active')) {
            renderContacts();
        }
    });

    window.addEventListener('gasviet_review_added', () => {
        updateContactBadge();
        if (notificationDropdown && notificationDropdown.style.display === 'block') {
            renderNotifications();
        }
        if (document.getElementById('section-reviews') && document.getElementById('section-reviews').classList.contains('active')) {
            if(typeof renderReviews === 'function') renderReviews();
        }
    });

    // Listen to storage event (for cross-tab)
    window.addEventListener('storage', (e) => {
        if (e.key === 'gasviet_contacts' || e.key === 'gasviet_reviews') {
            let isNewItem = false;
            let msg = '';
            
            if (e.key === 'gasviet_contacts') {
                const oldValue = e.oldValue ? JSON.parse(e.oldValue) : [];
                const newValue = e.newValue ? JSON.parse(e.newValue) : [];
                if (newValue.length > oldValue.length) {
                    isNewItem = true;
                    msg = '🔔 Bạn có khách hàng vừa gửi liên hệ/tư vấn!';
                }
            } else if (e.key === 'gasviet_reviews') {
                const oldValue = e.oldValue ? JSON.parse(e.oldValue) : [];
                const newValue = e.newValue ? JSON.parse(e.newValue) : [];
                if (newValue.length > oldValue.length) {
                    isNewItem = true;
                    msg = '🔔 Có khách hàng vừa gửi đánh giá sản phẩm!';
                }
            }
            
            // Check if a new item was added
            if (isNewItem) {
                if (typeof window.showToast === 'function') {
                    window.showToast(msg, 'success');
                } else {
                    console.log(msg);
                }
                
                // Play notification sound
                try {
                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const playDing = (freq, startTime, duration) => {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
                        gain.gain.setValueAtTime(0, audioCtx.currentTime + startTime);
                        gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + startTime + 0.05);
                        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTime + duration);
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        osc.start(audioCtx.currentTime + startTime);
                        osc.stop(audioCtx.currentTime + startTime + duration);
                    };
                    // Play "reng reng" (Two quick bell sounds)
                    playDing(880, 0, 0.5);    // A5
                    playDing(1108.73, 0.1, 0.8); // C#6
                } catch(err) {
                    console.log("Audio not supported");
                }
            }

            updateContactBadge();
            const notificationDropdown = document.getElementById('notificationDropdown');
            if (notificationDropdown && notificationDropdown.style.display === 'block') {
                if(typeof renderNotifications === 'function') renderNotifications();
            }
            if (e.key === 'gasviet_contacts' && document.getElementById('section-contacts') && document.getElementById('section-contacts').classList.contains('active')) {
                renderContacts();
            }
            if (e.key === 'gasviet_reviews' && document.getElementById('section-reviews') && document.getElementById('section-reviews').classList.contains('active')) {
                if(typeof renderReviews === 'function') renderReviews();
            }
        }
    });

    // Init
    setTimeout(updateContactBadge, 500);
});
