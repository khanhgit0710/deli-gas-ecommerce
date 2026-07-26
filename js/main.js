document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. SLIDER LOGIC
       ========================================================================== */
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideIntervalTime = 5000; // 5 seconds
    let slideTimer;

    function goToSlide(index) {
        // Remove active class from current
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        // Update index
        currentSlide = index;

        // Add active class to new
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slides.length) {
            newIndex = 0;
        }
        goToSlide(newIndex);
    }

    function startSlider() {
        slideTimer = setInterval(nextSlide, slideIntervalTime);
    }

    function resetSlider() {
        clearInterval(slideTimer);
        startSlider();
    }

    // Dot click events
    dots.forEach(dot => {
        dot.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            goToSlide(index);
            resetSlider(); // Reset timer on manual click
        });
    });

    // Start auto slide
    startSlider();


    /* ==========================================================================
       2. MOBILE MENU & SIDEBAR TOGGLE
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const categorySidebar = document.getElementById('categorySidebar');

    if (mobileMenuBtn && categorySidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            // Toggle sidebar visibility on mobile
            categorySidebar.classList.toggle('mobile-active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            const isClickInsideSidebar = categorySidebar && categorySidebar.contains(e.target);
            const isClickOnBtn = mobileMenuBtn && mobileMenuBtn.contains(e.target);

            if (!isClickInsideSidebar && !isClickOnBtn && categorySidebar && categorySidebar.classList.contains('mobile-active')) {
                categorySidebar.classList.remove('mobile-active');
            }
        }
    });

    /* ==========================================================================
       2.5 DYNAMIC HEADER HAMBURGER MENU
       ========================================================================== */
    const headerInner = document.querySelector('.header-inner');
    const mainNav = document.querySelector('.main-nav');

    if (headerInner && mainNav && !document.getElementById('headerMobileBtn')) {
        const btn = document.createElement('button');
        btn.id = 'headerMobileBtn';
        btn.className = 'header-mobile-btn';
        btn.innerHTML = '<i class="fa-solid fa-bars"></i>';

        // Insert before main-nav or actions
        const actions = document.querySelector('.header-actions');
        if (actions) {
            headerInner.insertBefore(btn, actions);
        } else {
            headerInner.appendChild(btn);
        }

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('mobile-active');
        });

        // Close nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !btn.contains(e.target) && mainNav.classList.contains('mobile-active')) {
                mainNav.classList.remove('mobile-active');
            }
        });
    }

    /* ==========================================================================
       3. CUSTOM SEARCH CATEGORY DROPDOWN LOGIC
       ========================================================================== */
    const customSelect = document.getElementById('customSearchSelect');
    if (customSelect) {
        const selected = customSelect.querySelector('.search-select-selected');
        const items = customSelect.querySelector('.search-select-items');
        const hiddenInput = document.getElementById('searchCategory');
        const searchInput = document.querySelector('.search-input');
        const optionDivs = items.querySelectorAll('div');

        // Toggle dropdown
        selected.addEventListener('click', function (e) {
            e.stopPropagation();
            items.classList.toggle('select-hide');
            this.classList.toggle('select-arrow-active');
        });

        // Option click
        optionDivs.forEach(div => {
            div.addEventListener('click', function (e) {
                // Update selected text
                selected.innerHTML = this.innerHTML;
                // Update hidden input value
                if (hiddenInput) hiddenInput.value = this.getAttribute('data-value');

                // Update active state
                optionDivs.forEach(opt => opt.classList.remove('same-as-selected'));
                this.classList.add('same-as-selected');

                // Close dropdown
                items.classList.add('select-hide');
                selected.classList.remove('select-arrow-active');

                // Update placeholder
                if (searchInput) {
                    searchInput.placeholder = `Tìm kiếm trong ${this.innerText}...`;
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!customSelect.contains(e.target)) {
                items.classList.add('select-hide');
                selected.classList.remove('select-arrow-active');
            }
        });
    }
    /* ==========================================================================
       4. FEATURED PRODUCTS SLIDER
       ========================================================================== */
    const featuredSlider = document.getElementById('featuredSlider');
    const prevFeaturedBtn = document.getElementById('prevFeaturedBtn');
    const nextFeaturedBtn = document.getElementById('nextFeaturedBtn');

    if (featuredSlider && prevFeaturedBtn && nextFeaturedBtn) {
        let currentFeaturedIndex = 0;

        const updateSliderPosition = () => {
            const card = featuredSlider.querySelector('.product-card');
            if (!card) return;
            const cardWidth = card.offsetWidth + 20; // card width + gap
            featuredSlider.style.transform = `translateX(-${currentFeaturedIndex * cardWidth}px)`;
        };

        nextFeaturedBtn.addEventListener('click', () => {
            const cards = featuredSlider.querySelectorAll('.product-card');
            if (cards.length === 0) return;
            // Calculate visible cards
            const visibleCards = Math.floor(featuredSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
            const maxIndex = cards.length - visibleCards;

            if (currentFeaturedIndex < maxIndex) {
                currentFeaturedIndex++;
            } else {
                currentFeaturedIndex = 0; // loop back
            }
            updateSliderPosition();
        });

        prevFeaturedBtn.addEventListener('click', () => {
            if (currentFeaturedIndex > 0) {
                currentFeaturedIndex--;
            } else {
                const cards = featuredSlider.querySelectorAll('.product-card');
                if (cards.length === 0) return;
                const visibleCards = Math.floor(featuredSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
                currentFeaturedIndex = Math.max(0, cards.length - visibleCards);
            }
            updateSliderPosition();
        });

        // Handle resize
        window.addEventListener('resize', () => {
            currentFeaturedIndex = 0;
            updateSliderPosition();
        });
    }

    // COMBO SLIDER LOGIC
    const comboSlider = document.getElementById('comboSlider');
    const prevComboBtn = document.getElementById('prevComboBtn');
    const nextComboBtn = document.getElementById('nextComboBtn');

    if (comboSlider && prevComboBtn && nextComboBtn) {
        let currentComboIndex = 0;

        const updateComboPosition = () => {
            const card = comboSlider.querySelector('.product-card');
            if (!card) return;
            const cardWidth = card.offsetWidth + 20; // card width + gap
            comboSlider.style.transform = `translateX(-${currentComboIndex * cardWidth}px)`;
        };

        nextComboBtn.addEventListener('click', () => {
            const cards = comboSlider.querySelectorAll('.product-card');
            if (cards.length === 0) return;
            // Calculate visible cards
            const visibleCards = Math.floor(comboSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
            const maxIndex = cards.length - visibleCards;

            if (currentComboIndex < maxIndex) {
                currentComboIndex++;
            } else {
                currentComboIndex = 0; // loop back
            }
            updateComboPosition();
        });

        prevComboBtn.addEventListener('click', () => {
            if (currentComboIndex > 0) {
                currentComboIndex--;
            } else {
                const cards = comboSlider.querySelectorAll('.product-card');
                if (cards.length === 0) return;
                const visibleCards = Math.floor(comboSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
                currentComboIndex = Math.max(0, cards.length - visibleCards);
            }
            updateComboPosition();
        });

        window.addEventListener('resize', () => {
            currentComboIndex = 0;
            updateComboPosition();
        });
    }

    /* ==========================================================================
       5. RELATED PRODUCTS SLIDER
       ========================================================================== */
    const relatedSlider = document.getElementById('relatedSlider');
    const prevRelatedBtn = document.getElementById('prevRelatedBtn');
    const nextRelatedBtn = document.getElementById('nextRelatedBtn');

    if (relatedSlider && prevRelatedBtn && nextRelatedBtn) {
        let currentRelatedIndex = 0;

        const updateRelatedPosition = () => {
            const card = relatedSlider.querySelector('.product-card');
            if (!card) return;
            const cardWidth = card.offsetWidth + 20; // card width + gap
            relatedSlider.style.transform = `translateX(-${currentRelatedIndex * cardWidth}px)`;
        };

        nextRelatedBtn.addEventListener('click', () => {
            const cards = relatedSlider.querySelectorAll('.product-card');
            if (cards.length === 0) return;
            const visibleCards = Math.floor(relatedSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
            const maxIndex = cards.length - visibleCards;

            if (currentRelatedIndex < maxIndex) {
                currentRelatedIndex++;
            } else {
                currentRelatedIndex = 0; // loop back
            }
            updateRelatedPosition();
        });

        prevRelatedBtn.addEventListener('click', () => {
            if (currentRelatedIndex > 0) {
                currentRelatedIndex--;
            } else {
                const cards = relatedSlider.querySelectorAll('.product-card');
                if (cards.length === 0) return;
                const visibleCards = Math.floor(relatedSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
                currentRelatedIndex = Math.max(0, cards.length - visibleCards);
            }
            updateRelatedPosition();
        });

        window.addEventListener('resize', () => {
            currentRelatedIndex = 0;
            updateRelatedPosition();
        });
    }

    /* ==========================================================================
       2. CUSTOM DROPDOWN
       ========================================================================== */
    const sortDropdown = document.getElementById('sortDropdown');
    if (sortDropdown) {
        const selected = sortDropdown.querySelector('.dropdown-selected');
        const selectedText = selected.querySelector('span');
        const options = sortDropdown.querySelectorAll('.dropdown-options li');

        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            sortDropdown.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', function (e) {
                e.stopPropagation();
                // Remove active class from all
                options.forEach(opt => opt.classList.remove('active'));

                // Add active to clicked
                this.classList.add('active');

                // Update selected text
                selectedText.textContent = this.textContent;

                // Close dropdown
                sortDropdown.classList.remove('open');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!sortDropdown.contains(e.target)) {
                sortDropdown.classList.remove('open');
            }
        });
    }

    /* ==========================================================================
       3. FLASH DEAL COUNTDOWN TIMER
       ========================================================================== */
    const flashDealTimer = document.getElementById('flashDealTimer');
    if (flashDealTimer) {
        // Set deal end time (e.g. 2 days, 12 hours from now for demo)
        const dealEndDate = new Date();
        dealEndDate.setDate(dealEndDate.getDate() + 2);
        dealEndDate.setHours(dealEndDate.getHours() + 12);
        dealEndDate.setMinutes(dealEndDate.getMinutes() + 45);
        dealEndDate.setSeconds(dealEndDate.getSeconds() + 30);

        const daysEl = document.getElementById('dealDays');
        const hrsEl = document.getElementById('dealHrs');
        const minsEl = document.getElementById('dealMins');
        const secsEl = document.getElementById('dealSecs');

        function updateTimer() {
            const now = new Date();
            const timeDiff = dealEndDate - now;

            if (timeDiff <= 0) {
                // Timer finished
                daysEl.textContent = '00';
                hrsEl.textContent = '00';
                minsEl.textContent = '00';
                secsEl.textContent = '00';
                return;
            }

            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            daysEl.textContent = days.toString().padStart(2, '0');
            hrsEl.textContent = hours.toString().padStart(2, '0');
            minsEl.textContent = minutes.toString().padStart(2, '0');
            secsEl.textContent = seconds.toString().padStart(2, '0');
        }

        updateTimer(); // Initial call
        setInterval(updateTimer, 1000);
    }

    /* ==========================================================================
       4. FLASH DEAL SLIDER LOGIC
       ========================================================================== */
    const flashDealSlider = document.getElementById('flashDealSlider');
    const prevFlashDealBtn = document.getElementById('prevFlashDealBtn');
    const nextFlashDealBtn = document.getElementById('nextFlashDealBtn');

    if (flashDealSlider && prevFlashDealBtn && nextFlashDealBtn) {
        let currentFlashDealIndex = 0;

        const updateFlashDealPosition = () => {
            const card = flashDealSlider.querySelector('.deal-horizontal-card');
            if (!card) return;
            const cardWidth = card.offsetWidth + 20; // card width + gap (20px)
            flashDealSlider.style.transform = `translateX(-${currentFlashDealIndex * cardWidth}px)`;
        };

        nextFlashDealBtn.addEventListener('click', () => {
            const cards = flashDealSlider.querySelectorAll('.deal-horizontal-card');
            if (cards.length === 0) return;
            // Calculate visible cards
            const visibleCards = Math.floor(flashDealSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
            const maxIndex = cards.length - visibleCards;

            if (currentFlashDealIndex < maxIndex) {
                currentFlashDealIndex++;
            } else {
                currentFlashDealIndex = 0; // loop back
            }
            updateFlashDealPosition();
        });

        prevFlashDealBtn.addEventListener('click', () => {
            if (currentFlashDealIndex > 0) {
                currentFlashDealIndex--;
            } else {
                const cards = flashDealSlider.querySelectorAll('.deal-horizontal-card');
                if (cards.length === 0) return;
                const visibleCards = Math.floor(flashDealSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
                currentFlashDealIndex = Math.max(0, cards.length - visibleCards);
            }
            updateFlashDealPosition();
        });

        window.addEventListener('resize', () => {
            currentFlashDealIndex = 0;
            updateFlashDealPosition();
        });
    }

    /* ==========================================================================
       CONTACT FORM VALIDATION
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const nameInput = document.getElementById('contactName');
        const phoneInput = document.getElementById('contactPhone');
        const phoneError = document.getElementById('phoneError');

        // Auto capitalize first letter of each word
        nameInput.addEventListener('input', function (e) {
            let val = e.target.value;
            // Split by space, capitalize first letter, join back
            val = val.split(' ').map(word => {
                if (word.length > 0) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
                return word;
            }).join(' ');
            e.target.value = val;
        });

        // Phone number input restriction (only numbers)
        phoneInput.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        // Form submit validation
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const phoneVal = phoneInput.value;
            const phoneRegex = /^0[0-9]{8,9}$/;

            if (!phoneRegex.test(phoneVal)) {
                phoneError.style.display = 'block';
                phoneInput.style.borderColor = 'red';
                return;
            }

            phoneError.style.display = 'none';
            phoneInput.style.borderColor = '#ddd';

            const btn = contactForm.querySelector('.btn-submit-contact');
            const btnText = btn.querySelector('.text');
            const btnIcon = btn.querySelector('.icon-arrow i');
            const originalText = btnText.textContent;

            // Start success animation
            btn.classList.add('success');

            // Instantly change text and icon while they slide to their new positions
            btnIcon.className = 'fa-solid fa-check';
            btnText.textContent = 'Thành công!';

            // Reset form and button after 3.5 seconds
            setTimeout(() => {
                contactForm.reset();
                btn.classList.remove('success');
                btnIcon.className = 'fa-solid fa-arrow-right';
                btnText.textContent = originalText;
            }, 3500);
        });
    }

    // --- GLOBAL SCROLL ANIMATION ---
    // --- GLOBAL SCROLL ANIMATION ---
    const elementsToAnimate = document.querySelectorAll(`
        .section-header > *, 
        .section-title,
        .features-badge-section .features-badge-wrapper > *,
        .features-badge-section .feature-item,
        .full-banner-section .slide,
        .about-page-wrapper section .container > *,
        .about-page-wrapper .mission-content > *,
        .about-page-wrapper .mission-images > *,
        .about-page-wrapper .menu-title-col > *,
        .about-page-wrapper .category-square,
        .about-page-wrapper .about-features-badge > *,
        .about-page-wrapper .featured-header-new > *,
        .value-card,
        .info-block,
        .contact-title > *,
        .custom-contact-form .form-group,
        .custom-contact-form .btn-submit-contact,
        .qr-col > *,
        .badge-item,
        .image-grid-creative img,
        .mission-list-item,
        .about-story-img,
        .about-story-content > *,
        
        .truck-anim,
        .category-card,
        .category-section-title-wrapper > *,
        .flash-deal-section > *,
        .products-grid > *,
        .products-flex > *,
        .step-card,
        .testimonial-card,
        .brand-logo,
        .bento-showcase-container,
        .bento-spotlight,
        .bento-item,
        .featured-slider-wrapper,
        .pd-gallery-col,
        .pd-info > *,
        .pd-tabs-wrapper,
        .pd-tab-pane > *,
        .pd-review-item,
        .combo-box,
        .faq-item,
        .cart-table tbody tr,
        .order-summary > *,
        .features-section .feature-item,
        .order-summary > *,
        .features-section .feature-item,
        .newsletter-section > *,
        .nb-page-header > *,
        .nb-archive-sidebar > *,
        .nb-archive-card,
        .nb-detail-header > *,
        .nb-toc,
        .nb-detail-featured-img,
        .nb-detail-content > *,
        .nb-detail-content > *,
        .nb-tags,
        .nb-author-box,
        .nb-hero > *,
        .nb-dest-header > *,
        .nb-dest-card,
        .nb-latest-header > *,
        .nb-latest-main,
        .nb-latest-item
    `);

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scrolled-in');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });

    elementsToAnimate.forEach((el, index) => {
        // Exclude featured products elements explicitly just in case
        if (el.closest('.featured-slider-container') || (el.closest('.featured-products-section') && !el.closest('.bento-showcase-container'))) {
            // Keep featured header but ignore products
            if (!el.parentElement.classList.contains('featured-header-new')) {
                return;
            }
        }

        let animClass = 'scroll-fade-up'; // Default

        const tagName = el.tagName.toLowerCase();
        if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4') {
            animClass = 'scroll-fade-right';
        } else if (tagName === 'p' || tagName === 'span' || tagName === 'a' || tagName === 'button') {
            animClass = 'scroll-fade-up';
        } else if (tagName === 'img') {
            animClass = 'scroll-zoom-in';
        }

        if (el.classList.contains('truck-anim')) {
            animClass = '';
        }

        el.classList.add('scroll-hidden');
        if (animClass) {
            el.classList.add(animClass);
        }

        // Add stagger effect based on DOM order for groups of items
        if (el.classList.contains('feature-item') ||
            el.classList.contains('info-block') ||
            el.classList.contains('value-card') ||
            el.classList.contains('badge-item') ||
            el.classList.contains('form-group') ||
            el.classList.contains('mission-list-item') ||
            el.classList.contains('category-card') ||
            el.classList.contains('category-square') ||
            el.classList.contains('step-card') ||
            el.classList.contains('testimonial-card') ||
            el.classList.contains('brand-logo') ||
            el.classList.contains('bento-spotlight') ||
            el.classList.contains('bento-item') ||
            el.classList.contains('pd-review-item') ||
            el.classList.contains('pd-thumb') ||
            el.classList.contains('combo-box') ||
            el.classList.contains('faq-item') ||
            el.classList.contains('nb-archive-card') ||
            el.classList.contains('nb-dest-card') ||
            el.classList.contains('nb-latest-item') ||
            (el.tagName === 'IMG' && el.parentElement && el.parentElement.classList.contains('image-grid-creative'))) {
            const staggerDelay = (index % 6) + 1;
            el.classList.add(`stagger-${staggerDelay}`);
        }

        // Stagger children of specific parents
        if (el.parentElement) {
            if (el.parentElement.classList.contains('hero-content') ||
                el.parentElement.classList.contains('about-story-content') ||
                el.parentElement.classList.contains('contact-title') ||
                el.parentElement.classList.contains('section-header') ||
                el.parentElement.classList.contains('features-badge-wrapper') ||
                el.parentElement.classList.contains('mission-content') ||
                el.parentElement.classList.contains('mission-images') ||
                el.parentElement.classList.contains('menu-title-col') ||
                el.parentElement.classList.contains('featured-header-new') ||
                el.parentElement.classList.contains('about-features-badge') ||
                el.parentElement.classList.contains('pd-info') ||
                el.parentElement.classList.contains('pd-tab-pane') ||
                el.parentElement.classList.contains('pd-trust-badges') ||
                el.parentElement.classList.contains('qr-col') ||
                el.parentElement.classList.contains('order-summary') ||
                el.parentElement.classList.contains('newsletter-section') ||
                el.parentElement.classList.contains('nb-page-header') ||
                el.parentElement.classList.contains('nb-archive-sidebar') ||
                el.parentElement.classList.contains('nb-detail-header') ||
                el.parentElement.classList.contains('nb-detail-content') ||
                el.parentElement.classList.contains('nb-hero') ||
                el.parentElement.classList.contains('nb-dest-header') ||
                el.parentElement.classList.contains('nb-latest-header') ||
                el.parentElement.tagName === 'TBODY') {
                const siblings = Array.from(el.parentElement.children);
                const childIndex = siblings.indexOf(el);
                el.classList.add(`stagger-${Math.min(childIndex + 1, 6)}`);
            }
        }

        scrollObserver.observe(el);
    });

    /* ==========================================================================
       9. HEADER SCROLL LOGIC
       ========================================================================== */
    const header = document.querySelector('.header');
    if (header) {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 150) {
                if (currentScrollY > lastScrollY) {
                    // Kéo xuống -> ẩn header
                    header.classList.add('header-hidden');
                    document.body.classList.add('is-header-hidden');
                } else {
                    // Kéo lên -> hiện header
                    header.classList.remove('header-hidden');
                    document.body.classList.remove('is-header-hidden');
                }
            } else {
                // Ở trên cùng -> luôn hiện
                header.classList.remove('header-hidden');
                document.body.classList.remove('is-header-hidden');
            }

            lastScrollY = currentScrollY;
        });
    }

    /* ==========================================================================
       CART LOGIC
       ========================================================================== */
    if (!localStorage.getItem('gas_cart_seeded')) {
        const initialCart = [
            { name: 'Bình Gas Saigon Petro 12kg', price: 360000, image: 'https://iwater.vn/Image/Picture/Sai-gon-petro/Gas-Saigon-Petro-12kg-binh-xanh.jpg', quantity: 4 },
            { name: 'Van điều áp Namilux', price: 120000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_BSCB0RlaM-2dmmWS1_nf8DCFzNet3deIGB5wFdF_6w&s', quantity: 2 },
            { name: 'Dây Dẫn Gas Thái Lan', price: 80000, image: 'https://gasleminh.com/wp-content/uploads/2022/10/screenshot_1677840360.png', quantity: 1 }
        ];
        localStorage.setItem('gas_cart', JSON.stringify(initialCart));
        localStorage.setItem('gas_cart_seeded', 'true');
    }

    // Update product counts dynamically based on actual DOM elements
    const sectionsWithCount = document.querySelectorAll('.section-header');
    sectionsWithCount.forEach(header => {
        const countSpan = header.querySelector('.product-count');
        if (countSpan) {
            const section = header.closest('section') || header.closest('.main-content-section');
            if (section) {
                const productCards = section.querySelectorAll('.product-card');
                if (productCards.length > 0) {
                    countSpan.textContent = `(${productCards.length} sản phẩm)`;
                }
            }
        }
    });

    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    function showToast(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position:fixed; top:100px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px; pointer-events:none;';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.textContent = message;
        const bgColor = type === 'error' ? '#e74c3c' : 'var(--color-accent)';
        const textColor = type === 'error' ? 'white' : 'red';
        toast.style.cssText = `background-color:${bgColor}; color:${textColor}; padding:12px 20px; border-radius:4px; box-shadow:0 2px 10px rgba(0,0,0,0.2); font-weight:700; font-family:inherit; font-size: 0.95rem; opacity:0; transform:translateX(20px); transition:all 0.3s ease;`;
        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    const cartBtns = document.querySelectorAll('.cart-btn-primary');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            window.location.href = 'gio-hang.html';
        });
    });

    function getCart() {
        return JSON.parse(localStorage.getItem('gas_cart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('gas_cart', JSON.stringify(cart));
        updateCartBadge();
    }

    function updateCartBadge() {
        const cart = getCart();
        let totalItems = 0;
        cart.forEach(item => { totalItems += item.quantity });
        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(b => b.textContent = totalItems);
    }

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            if (!productCard) return;

            const name = productCard.querySelector('h3').innerText.trim();
            const priceText = productCard.querySelector('.price-current').innerText;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            const imgSrc = productCard.querySelector('img').src;

            const cart = getCart();
            const existingItem = cart.find(i => i.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    image: imgSrc,
                    quantity: 1
                });
            }
            saveCart(cart);

            // Show toast popup
            showToast('Đã thêm sản phẩm vào giỏ hàng!', 'success');
        });
    });

    // Add to cart on Product Detail page
    const pdAddToCartBtn = document.querySelector('.pd-info .pd-btn-outline');
    if (pdAddToCartBtn) {
        pdAddToCartBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const name = document.querySelector('.pd-title').innerText.trim();
            const priceText = document.querySelector('.pd-price').innerText;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            const imgSrc = document.querySelector('#pdMainImage').src;
            const qtyInput = document.getElementById('qtyInput');
            const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

            const cart = getCart();
            const existingItem = cart.find(i => i.name === name);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    image: imgSrc,
                    quantity: quantity
                });
            }
            saveCart(cart);

            showToast('Đã thêm sản phẩm vào giỏ hàng!', 'success');
        });
    }

    const cartTableBody = document.querySelector('.cart-table tbody');
    if (cartTableBody) {
        function renderCart() {
            const cart = getCart();
            cartTableBody.innerHTML = '';

            if (cart.length === 0) {
                cartTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:40px; color:#666;">Giỏ hàng của bạn đang trống.<br><br><a href="trang-chu.html" class="btn-green" style="text-decoration:none; display:inline-block; margin-top:10px;">Tiếp tục mua sắm</a></td></tr>';
                updateCartTotals(0, 0);

                const cartActions = document.querySelector('.cart-actions');
                if (cartActions) cartActions.style.display = 'none';
                return;
            }

            const cartActions = document.querySelector('.cart-actions');
            if (cartActions) cartActions.style.display = 'flex';

            let totalAmount = 0;
            let totalItems = 0;

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                totalAmount += itemTotal;
                totalItems += item.quantity;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="product-col">
                            <button class="remove-btn" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
                            <img src="${item.image}" alt="${item.name}" class="cart-product-img">
                            <div class="cart-product-info">
                                <h4>${item.name}</h4>
                            </div>
                        </div>
                    </td>
                    <td style="font-weight: 500;">${item.price.toLocaleString('vi-VN')}đ</td>
                    <td>
                        <div class="qty-controls">
                            <button class="qty-btn qty-minus" data-index="${index}"><i class="fa-solid fa-minus"></i></button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1" readonly>
                            <button class="qty-btn qty-plus" data-index="${index}"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    </td>
                    <td style="font-weight: 600; color: #333;">${itemTotal.toLocaleString('vi-VN')}đ</td>
                `;
                cartTableBody.appendChild(tr);
            });

            updateCartTotals(totalItems, totalAmount);
            attachCartEvents();
        }

        function updateCartTotals(items, amount) {
            const subtotalEl = document.getElementById('cart-subtotal');
            const totalEl = document.getElementById('cart-total');
            const itemsCountEl = document.querySelector('.summary-row:first-child span:last-child');
            const bannerQtyEl = document.querySelector('.cart-banner-content h2 strong');

            const formattedAmount = amount.toLocaleString('vi-VN') + 'đ';
            if (subtotalEl) subtotalEl.textContent = formattedAmount;
            if (totalEl) totalEl.textContent = formattedAmount;
            if (itemsCountEl) itemsCountEl.textContent = items;
            if (bannerQtyEl) bannerQtyEl.textContent = items;
        }

        function attachCartEvents() {
            const minuses = document.querySelectorAll('.qty-minus');
            const pluses = document.querySelectorAll('.qty-plus');
            const removes = document.querySelectorAll('.remove-btn');
            const clearBtn = document.querySelector('.btn-clear');

            minuses.forEach(btn => {
                btn.addEventListener('click', function () {
                    const idx = this.getAttribute('data-index');
                    const cart = getCart();
                    if (cart[idx].quantity > 1) {
                        cart[idx].quantity -= 1;
                        saveCart(cart);
                        renderCart();
                    }
                });
            });

            pluses.forEach(btn => {
                btn.addEventListener('click', function () {
                    const idx = this.getAttribute('data-index');
                    const cart = getCart();
                    cart[idx].quantity += 1;
                    saveCart(cart);
                    renderCart();
                });
            });

            removes.forEach(btn => {
                btn.addEventListener('click', function () {
                    const idx = this.getAttribute('data-index');
                    const cart = getCart();
                    cart.splice(idx, 1);
                    saveCart(cart);
                    renderCart();
                    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'error');
                });
            });

            if (clearBtn) {
                const newClearBtn = clearBtn.cloneNode(true);
                clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
                newClearBtn.addEventListener('click', function (e) {
                    e.preventDefault();

                    const modalOverlay = document.createElement('div');
                    modalOverlay.className = 'custom-confirm-overlay';
                    modalOverlay.innerHTML = `
                        <div class="custom-confirm-modal">
                            <div class="confirm-content">
                                <p>Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?</p>
                            </div>
                            <div class="confirm-actions">
                                <button class="btn-confirm-cancel">Huỷ</button>
                                <button class="btn-confirm-agree">Đồng ý</button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(modalOverlay);

                    setTimeout(() => {
                        modalOverlay.classList.add('show');
                        modalOverlay.querySelector('.custom-confirm-modal').classList.add('show');
                    }, 10);

                    const cancelBtn = modalOverlay.querySelector('.btn-confirm-cancel');
                    const agreeBtn = modalOverlay.querySelector('.btn-confirm-agree');

                    function closeModal() {
                        modalOverlay.classList.remove('show');
                        modalOverlay.querySelector('.custom-confirm-modal').classList.remove('show');
                        setTimeout(() => {
                            if (document.body.contains(modalOverlay)) {
                                document.body.removeChild(modalOverlay);
                            }
                        }, 300);
                    }

                    cancelBtn.addEventListener('click', closeModal);

                    agreeBtn.addEventListener('click', () => {
                        saveCart([]);
                        renderCart();
                        showToast('Đã xóa toàn bộ giỏ hàng', 'error');
                        closeModal();
                    });
                });
            }
        }

        renderCart();
    }

    updateCartBadge();
    /* ==========================================================================
       COMBO PRICE CALCULATION
       ========================================================================== */
    const comboChecks = document.querySelectorAll('.combo-check');
    const comboTotalEl = document.querySelector('.combo-total');

    if (comboChecks.length > 0 && comboTotalEl) {
        function updateComboPrice() {
            let total = 0;
            let checkedCount = 0;
            comboChecks.forEach(check => {
                if (check.checked) {
                    const priceText = check.closest('.combo-item').querySelector('.combo-item-price').textContent;
                    const price = parseInt(priceText.replace(/[^0-9]/g, ''));
                    total += price;
                    checkedCount++;
                }
            });

            const saveEl = document.querySelector('.combo-save');
            if (checkedCount === comboChecks.length) {
                comboTotalEl.textContent = new Intl.NumberFormat('vi-VN').format(total) + 'đ';
                if (saveEl) saveEl.style.display = 'block';
            } else {
                comboTotalEl.textContent = new Intl.NumberFormat('vi-VN').format(total) + 'đ';
                if (saveEl) saveEl.style.display = 'none';
            }
        }

        comboChecks.forEach(check => {
            check.addEventListener('change', updateComboPrice);
        });

        // Initialize
        updateComboPrice();
    }

    /* ==========================================================================
       COUNT-UP ANIMATION FOR STATS
       ========================================================================== */
    const countUpElements = document.querySelectorAll('.count-up');

    if (countUpElements.length > 0) {
        const animateCountUp = (el) => {
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            let current = 0;
            const increment = target / (duration / 16); // 60fps

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.innerText = target;
                    clearInterval(timer);
                } else {
                    el.innerText = Math.floor(current);
                }
            }, 16);
        };

        // Use Intersection Observer to trigger when visible
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCountUp(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        countUpElements.forEach(el => observer.observe(el));
    }
});