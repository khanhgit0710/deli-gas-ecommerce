/**
 * Admin Core Module
 * Handles initialization, auth, navigation, and utilities.
 */
// Expose global variables so other modules can use them
let pageTitle, sectionsList, sidebarLinks;

document.addEventListener('DOMContentLoaded', async () => {
    await ProductDB.initAsync();
    
    // Apply logo to admin screen if exists
    const adminSettings = ProductDB.getSettings();
    if (adminSettings && adminSettings.logo) {
        const loginLogo = document.querySelector('.login-logo img');
        if (loginLogo) loginLogo.src = adminSettings.logo;
        const sidebarLogo = document.querySelector('.sidebar-header img');
        if (sidebarLogo) sidebarLogo.src = adminSettings.logo;
    }

    // ========== AUTHENTICATION ==========
    const loginOverlay = document.getElementById('adminLoginOverlay');
    const adminLayout = document.getElementById('adminLayout');
    const loginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');

    // Check login state
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (adminLayout) adminLayout.style.display = 'flex';
    } else {
        if (loginOverlay) loginOverlay.style.display = 'flex';
        if (adminLayout) adminLayout.style.display = 'none';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('loginUsername').value;
            const pass = document.getElementById('loginPassword').value;

            if (user === 'admin' && pass === 'admin') {
                sessionStorage.setItem('adminLoggedIn', 'true');
                loginOverlay.style.display = 'none';
                adminLayout.style.display = 'flex';
                // Trigger dashboard initial render
                switchSection('dashboard');
            } else {
                loginError.style.display = 'block';
            }
        });
    }

    // Add logout functionality
    const topbarRight = document.querySelector('.topbar-right');
    if (topbarRight && !document.getElementById('btnLogout')) {
        const logoutBtn = document.createElement('a');
        logoutBtn.id = 'btnLogout';
        logoutBtn.href = '#';
        logoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> ÄÄƒng xuáº¥t';

        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('adminLoggedIn');
            window.location.reload();
        });
        topbarRight.appendChild(logoutBtn);
    }

    // ========== NAVIGATION ==========
    sidebarLinks = document.querySelectorAll('.sidebar-menu a[data-section]');
    sectionsList = document.querySelectorAll('.admin-section');
    pageTitle = document.getElementById('pageTitle');

    const sectionTitles = {
        'dashboard': 'Báº£ng Ä‘iá»u khiá»ƒn',
        'products': 'Quáº£n lÃ½ sáº£n pháº©m',
        'flash-deals': 'Quáº£n lÃ½ Sale Off',
        'categories': 'Quáº£n lÃ½ danh má»¥c',
        news: 'Quáº£n lÃ½ tin tá»©c',
        'news-categories': 'Danh má»¥c tin tá»©c',
        settings: 'Cáº¥u hÃ¬nh chung'
    };

    window.switchSection = function(sectionId) {
        sectionsList.forEach(s => s.classList.remove('active'));
        sidebarLinks.forEach(l => l.classList.remove('active'));
        const target = document.getElementById('section-' + sectionId);
        const link = document.querySelector(`a[data-section="${sectionId}"]`);
        if (target) target.classList.add('active');
        if (link) link.classList.add('active');
        if (pageTitle) pageTitle.textContent = sectionTitles[sectionId] || sectionId;

        // Refresh data when switching
        if (sectionId === 'dashboard') renderDashboard();
        if (sectionId === 'products') renderProducts();
        if (sectionId === 'categories') renderCategories();
        if (sectionId === 'news') renderNews();
        if (sectionId === 'news-categories') renderNewsCategories();
        if (sectionId === 'settings') renderSettings();
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
            // Close mobile sidebar
            document.getElementById('adminSidebar').classList.remove('open');
        });
    });

    window.filterProductsByCategory = function(catId) {
        switchSection('products');
        const filter = document.getElementById('categoryFilter');
        if (filter) {
            filter.value = catId;
            filter.dispatchEvent(new Event('change'));
        }
    };

    window.renderSidebarCategories = function() {
        const tree = document.getElementById('sidebarCategoryTree');
        if (!tree) return;
        const categories = ProductDB.getCategories();
        let html = '';
        categories.forEach(cat => {
            html += `<li><a href="#" onclick="event.preventDefault(); window.filterProductsByCategory(${cat.id});"><i class="fa-solid fa-angle-right" style="font-size: 10px;"></i> ${cat.name}</a></li>`;
        });
        tree.innerHTML = html;
    }

    // Mobile toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('adminSidebar');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Click outside to close sidebar on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    // ========== TOAST ==========
    window.showToast = function (message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-xmark',
            warning: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${icons[type]} toast-icon"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
        `;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // ========== CONFIRM DIALOG ==========
    let confirmCallback = null;

    window.showConfirm = function (title, message, callback) {
        const overlay = document.getElementById('confirmDialog');
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        confirmCallback = callback;
        overlay.classList.add('active');
    };

    window.closeConfirm = function () {
        document.getElementById('confirmDialog').classList.remove('active');
        confirmCallback = null;
    };

    document.getElementById('btnConfirmAction').addEventListener('click', () => {
        if (confirmCallback) confirmCallback();
        closeConfirm();
    });

    // ========== GLOBAL INIT ==========
    setTimeout(() => {
        if (typeof window.renderSidebarCategories === 'function') {
            window.renderSidebarCategories();
        }
        if (sessionStorage.getItem('adminLoggedIn') === 'true') {
            if (typeof window.switchSection === 'function') {
                window.switchSection('dashboard');
            }
        }
    }, 100);

});
