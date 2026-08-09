/**
 * ProductDB â€” localStorage Database Layer for Gas Viá»‡t
 * Manages products, categories with full CRUD operations
 */
const ProductDB = (() => {
    const PRODUCTS_KEY = 'gasviet_products';
    const CATEGORIES_KEY = 'gasviet_categories';
    const SETTINGS_KEY = 'gasviet_settings';
    const NEWS_KEY = 'gasviet_news';
    const NEWS_CATEGORIES_KEY = 'gasviet_news_categories';
    const INIT_KEY = 'gasviet_db_initialized_v9';

    // ========== SEED DATA ==========
    const seedCategories = [
        { id: 1, name: 'Gas Saigon Petro', slug: 'gas-saigon-petro', seoDesc: 'Äáº¡i lÃ½ phÃ¢n phá»‘i Gas Saigon Petro chÃ­nh hÃ£ng. CÃ¡c loáº¡i bÃ¬nh gas xÃ¡m, Ä‘á», xanh 12kg an toÃ n, cháº¥t lÆ°á»£ng cao, giÃ¡ tá»‘t nháº¥t thá»‹ trÆ°á»ng.' },
        { id: 2, name: 'Gas Petrolimex', slug: 'gas-petrolimex', seoDesc: 'Äá»•i bÃ¬nh Gas Petrolimex chÃ­nh hÃ£ng 12kg, 48kg, van chá»¥p, van ngang an toÃ n tuyá»‡t Ä‘á»‘i. GiÃ¡ gas Petrolimex cáº­p nháº­t má»›i nháº¥t.' },
        { id: 3, name: 'Gas Gia ÄÃ¬nh', slug: 'gas-gia-dinh', seoDesc: 'PhÃ¢n phá»‘i Gas Gia ÄÃ¬nh chÃ­nh hÃ£ng, ngá»n lá»­a xanh mÆ°á»£t tiáº¿t kiá»‡m gas. Giao gas nhanh chÃ³ng, an toÃ n, cÃ³ báº£o hiá»ƒm chÃ¡y ná»•.' },
        { id: 4, name: 'Gas Thá»§ Äá»©c', slug: 'gas-thu-duc', seoDesc: 'Cung cáº¥p bÃ¬nh Gas Thá»§ Äá»©c 12kg, 45kg chÃ­nh hÃ£ng, van an toÃ n. Dá»‹ch vá»¥ Ä‘á»•i gas Thá»§ Äá»©c táº­n nhÃ  nhanh chÃ³ng, uy tÃ­n.' },
        { id: 5, name: 'Gas Elf', slug: 'gas-elf', seoDesc: 'BÃ¬nh Gas Elf PhÃ¡p Ä‘á» 12kg, 6kg, 45kg an toÃ n, cháº¥t lÆ°á»£ng ChÃ¢u Ã‚u. Giao gas Elf chÃ­nh hÃ£ng táº­n nhÃ  vá»›i nhiá»u Æ°u Ä‘Ã£i.' },
        { id: 6, name: 'Báº¿p Há»“ng Ngoáº¡i', slug: 'bep-hong-ngoai', seoDesc: 'Mua báº¿p Ä‘iá»‡n há»“ng ngoáº¡i Ä‘Æ¡n, Ä‘Ã´i chÃ­nh hÃ£ng Sunhouse, Kangaroo, Bosch. Báº¿p há»“ng ngoáº¡i cao cáº¥p, Ä‘un náº¥u nhanh, khÃ´ng kÃ©n ná»“i.' },
        { id: 7, name: 'Báº¿p Gas Ã‚m', slug: 'bep-gas-am', seoDesc: 'CÃ¡c dÃ²ng báº¿p gas Ã¢m cao cáº¥p Rinnai, Paloma, Electrolux, Sunhouse. Thiáº¿t káº¿ sang trá»ng, tiáº¿t kiá»‡m gas, an toÃ n tuyá»‡t Ä‘á»‘i.' },
        { id: 8, name: 'Phá»¥ Kiá»‡n (Van, DÃ¢y)', slug: 'phu-kien-van-day', seoDesc: 'Phá»¥ kiá»‡n gas chÃ­nh hÃ£ng: van ngáº¯t gas tá»± Ä‘á»™ng, dÃ¢y dáº«n gas bá»c inox chá»‘ng chuá»™t, van Namilux, Katsura cao cáº¥p.' },
        { id: 9, name: 'Combo Khuyáº¿n MÃ£i', slug: 'combo-khuyen-mai', seoDesc: 'Tá»•ng há»£p cÃ¡c bá»™ combo bÃ¬nh gas, báº¿p gas, van dÃ¢y giÃ¡ siÃªu tiáº¿t kiá»‡m. Mua trá»n bá»™ Ä‘á»ƒ nháº­n Æ°u Ä‘Ã£i lá»›n vÃ  quÃ  táº·ng háº¥p dáº«n.' }
    ];

    const seedNewsCategories = [
        { id: 1, name: 'An toÃ n Gas', slug: 'an-toan-gas', seoDesc: 'Tin tá»©c vÃ  cáº©m nang vá» an toÃ n sá»­ dá»¥ng gas' },
        { id: 2, name: 'Máº¹o váº·t nhÃ  báº¿p', slug: 'meo-vat-nha-bep', seoDesc: 'CÃ¡c máº¹o váº·t há»¯u Ã­ch cho khÃ´ng gian báº¿p cá»§a báº¡n' },
        { id: 3, name: 'Khuyáº¿n mÃ£i', slug: 'khuyen-mai', seoDesc: 'Cáº­p nháº­t cÃ¡c chÆ°Æ¡ng trÃ¬nh Æ°u Ä‘Ã£i vÃ  giáº£m giÃ¡ má»›i nháº¥t' },
        { id: 4, name: 'Sáº£n pháº©m má»›i', slug: 'san-pham-moi', seoDesc: 'Giá»›i thiá»‡u cÃ¡c dÃ²ng sáº£n pháº©m gas vÃ  báº¿p gas má»›i' },
        { id: 5, name: 'áº¨m thá»±c', slug: 'am-thuc', seoDesc: 'KhÃ¡m phÃ¡ áº©m thá»±c vÃ  cÃ¡c mÃ³n ngon má»—i ngÃ y' },
        { id: 6, name: 'Ká»¹ thuáº­t', slug: 'ky-thuat', seoDesc: 'Chia sáº» kiáº¿n thá»©c ká»¹ thuáº­t vá» gas vÃ  thiáº¿t bá»‹ báº¿p' }
    ];

    const seedNews = [
        {
            id: 1,
            title: 'Cáº©m Nang ToÃ n Táº­p Vá» NgÃ nh Gas (LPG) & HÆ°á»›ng Dáº«n Sá»­ Dá»¥ng Báº¿p Gas An ToÃ n',
            slug: 'cam-nang-toan-tap-ve-nganh-gas-lpg',
            image: 'https://i.pinimg.com/control1/1200x/36/db/be/36dbbe7534d0fb076fa0e8e9f425340b.jpg',
            content: '<h2>Tá»•ng quan vá» ngÃ nh cÃ´ng nghiá»‡p Gas (LPG) táº¡i Viá»‡t Nam</h2><p>NgÃ nh cÃ´ng nghiá»‡p khÃ­ hÃ³a lá»ng (LPG - Liquefied Petroleum Gas) Ä‘Ã³ng vai trÃ² sá»‘ng cÃ²n trong sá»± phÃ¡t triá»ƒn kinh táº¿ vÃ  Ä‘á»i sá»‘ng sinh hoáº¡t cá»§a hÃ ng triá»‡u gia Ä‘Ã¬nh Viá»‡t Nam. Tá»« nhá»¯ng nÄƒm Ä‘áº§u phÃ¡t triá»ƒn cho Ä‘áº¿n nay, LPG Ä‘Ã£ trá»Ÿ thÃ nh nguá»“n nhiÃªn liá»‡u khÃ´ng thá»ƒ thiáº¿u.</p><h3>KhÃ­ Gas (LPG) thá»±c cháº¥t lÃ  gÃ¬?</h3><p>KhÃ­ LPG lÃ  há»—n há»£p hydrocarbon nháº¹, chá»§ yáº¿u bao gá»“m <strong>Propane (C3H8)</strong> vÃ  <strong>Butane (C4H10)</strong>. Trong Ä‘iá»u kiá»‡n nhiá»‡t Ä‘á»™ vÃ  Ã¡p suáº¥t bÃ¬nh thÆ°á»ng, LPG tá»“n táº¡i á»Ÿ thá»ƒ khÃ­. Tuy nhiÃªn, Ä‘á»ƒ thuáº­n tiá»‡n cho viá»‡c lÆ°u trá»¯ vÃ  váº­n chuyá»ƒn, chÃºng Ä‘Æ°á»£c nÃ©n dÆ°á»›i Ã¡p suáº¥t cao Ä‘á»ƒ chuyá»ƒn sang thá»ƒ lá»ng.</p><h4>Äáº·c Ä‘iá»ƒm váº­t lÃ½ vÃ  hÃ³a há»c cá»§a LPG</h4><ul><li><strong>KhÃ´ng mÃ u, khÃ´ng mÃ¹i:</strong> NguyÃªn báº£n LPG khÃ´ng cÃ³ mÃ¹i. MÃ¹i Ä‘áº·c trÆ°ng mÃ  chÃºng ta thÆ°á»ng ngá»­i tháº¥y (mÃ¹i báº¯p cáº£i thá»‘i) lÃ  do nhÃ  sáº£n xuáº¥t pha thÃªm cháº¥t táº¡o mÃ¹i Mercaptan (Ethyl Mercaptan) Ä‘á»ƒ dá»… dÃ ng phÃ¡t hiá»‡n rÃ² rá»‰.</li><li><strong>Náº·ng hÆ¡n khÃ´ng khÃ­:</strong> Khi bá»‹ rÃ² rá»‰, khÃ­ gas sáº½ chÃ¬m xuá»‘ng sÃ¡t máº·t Ä‘áº¥t vÃ  tÃ­ch tá»¥ á»Ÿ nhá»¯ng vÃ¹ng trÅ©ng, táº¡o nÃªn nguy cÆ¡ chÃ¡y ná»• tiá»m áº©n náº¿u cÃ³ tia lá»­a Ä‘iá»‡n.</li><li><strong>Nhiá»‡t nÄƒng cá»±c cao:</strong> Khi chÃ¡y, LPG tá»a ra nhiá»‡t lÆ°á»£ng ráº¥t lá»›n (ngá»n lá»­a cÃ³ thá»ƒ Ä‘áº¡t tá»›i 1900Â°C), giÃºp náº¥u chÃ­n thá»©c Äƒn nhanh chÃ³ng.</li></ul><h2>CÃ¡c tiÃªu chuáº©n an toÃ n trong thiáº¿t káº¿ Báº¿p Gas hiá»‡n Ä‘áº¡i</h2><p>Báº¿p gas ngÃ y nay Ä‘Æ°á»£c trang bá»‹ ráº¥t nhiá»u cÃ´ng nghá»‡ tá»‘i tÃ¢n Ä‘á»ƒ Ä‘áº£m báº£o an toÃ n tuyá»‡t Ä‘á»‘i cho ngÆ°á»i sá»­ dá»¥ng.</p><h3>MÃ¢m chia lá»­a vÃ  há»‡ thá»‘ng cáº£m biáº¿n tá»± ngáº¯t</h3><p>MÃ¢m chia lá»­a (Burner) lÃ  bá»™ pháº­n quan trá»ng nháº¥t quyáº¿t Ä‘á»‹nh Ä‘áº¿n hiá»‡u suáº¥t Ä‘á»‘t chÃ¡y vÃ  Ä‘á»™ bá»n cá»§a báº¿p. CÃ¡c loáº¡i mÃ¢m chia lá»­a báº±ng Ä‘á»“ng thau nguyÃªn khá»‘i (Brass) hoáº·c há»£p kim Sabaf (Ã) luÃ´n Ä‘Æ°á»£c Ä‘Ã¡nh giÃ¡ cao nhá» kháº£ nÄƒng chá»‹u nhiá»‡t tá»‘t vÃ  khÃ´ng cong vÃªnh.</p><h4>CÃ´ng nghá»‡ ngáº¯t gas tá»± Ä‘á»™ng (Thermocouple)</h4><p>ÄÃ¢y lÃ  tÃ­nh nÄƒng an toÃ n cao cáº¥p nháº¥t trÃªn cÃ¡c báº¿p gas hiá»‡n Ä‘áº¡i. Cáº£m biáº¿n Thermocouple Ä‘Æ°á»£c Ä‘áº·t ngay cáº¡nh mÃ¢m chia lá»­a. Khi ngá»n lá»­a Ä‘á»™t ngá»™t táº¯t do giÃ³ thá»•i hoáº·c nÆ°á»›c trÃ o, cáº£m biáº¿n sáº½ nguá»™i Ä‘i vÃ  ngay láº­p tá»©c kÃ­ch hoáº¡t há»‡ thá»‘ng van tá»« (Solenoid Valve) Ä‘Ã³ng luá»“ng gas láº¡i, ngÄƒn cháº·n tuyá»‡t Ä‘á»‘i tÃ¬nh tráº¡ng rÃ² rá»‰ khÃ­ gas ra ngoÃ i mÃ´i trÆ°á»ng.</p><h2>HÆ°á»›ng dáº«n chi tiáº¿t sá»­ dá»¥ng Báº¿p Gas an toÃ n táº¡i gia Ä‘Ã¬nh</h2><h3>Quy táº¯c "VÃ ng" khi láº¯p Ä‘áº·t bÃ¬nh gas</h3><p>Vá»‹ trÃ­ Ä‘áº·t bÃ¬nh gas pháº£i thÃ´ng thoÃ¡ng, cÃ¡ch xa nguá»“n nhiá»‡t vÃ  cÃ¡c thiáº¿t bá»‹ phÃ¡t sinh tia lá»­a Ä‘iá»‡n (á»• cáº¯m, cÃ´ng táº¯c) Ã­t nháº¥t 1.5 mÃ©t. Tuyá»‡t Ä‘á»‘i khÃ´ng Ä‘áº·t bÃ¬nh gas trong tá»§ báº¿p kÃ­n mÃ­t khÃ´ng cÃ³ lá»— thÃ´ng hÆ¡i.</p><h3>CÃ¡ch xá»­ lÃ½ kháº©n cáº¥p khi ngá»­i tháº¥y mÃ¹i gas rÃ² rá»‰</h3><p>Náº¿u báº¡n bÆ°á»›c vÃ o báº¿p vÃ  ngá»­i tháº¥y mÃ¹i gas ná»“ng náº·c, hÃ£y giá»¯ bÃ¬nh tÄ©nh vÃ  thá»±c hiá»‡n ngay cÃ¡c bÆ°á»›c sau:</p><h4>1. Tuyá»‡t Ä‘á»‘i khÃ´ng phÃ¡t sinh tia lá»­a Ä‘iá»‡n</h4><p>KhÃ´ng báº­t/táº¯t cÃ´ng táº¯c Ä‘iá»‡n, khÃ´ng dÃ¹ng Ä‘iá»‡n thoáº¡i di Ä‘á»™ng, khÃ´ng báº­t quáº¡t mÃ¡y, khÃ´ng dÃ¹ng báº­t lá»­a. Báº¥t ká»³ tia lá»­a nhá» nÃ o cÅ©ng cÃ³ thá»ƒ kÃ­ch ná»• khá»‘i khÃ­ gas Ä‘ang tÃ­ch tá»¥.</p><h4>2. KhÃ³a van bÃ¬nh gas ngay láº­p tá»©c</h4><p>Tiáº¿n Ä‘áº¿n bÃ¬nh gas vÃ  váº·n nÃºm van theo chiá»u kim Ä‘á»“ng há»“ (chiá»u Ä‘Ã³ng) Ä‘á»ƒ cáº¯t Ä‘á»©t nguá»“n cung cáº¥p gas.</p><h4>3. Má»Ÿ toang má»i cá»­a sá»• vÃ  cá»­a ra vÃ o</h4><p>Viá»‡c nÃ y giÃºp khÃ´ng khÃ­ lÆ°u thÃ´ng, pha loÃ£ng ná»“ng Ä‘á»™ khÃ­ gas trong phÃ²ng. LÆ°u Ã½ dÃ¹ng bÃ¬a carton hoáº·c quáº¡t nan Ä‘á»ƒ quáº¡t Ä‘uá»•i khÃ­ gas ra ngoÃ i (chÃ¬m sÃ¡t máº·t Ä‘áº¥t).</p><h2>Káº¿t luáº­n</h2><p>Hiá»ƒu rÃµ vá» Ä‘áº·c tÃ­nh cá»§a LPG vÃ  tuÃ¢n thá»§ nghiÃªm ngáº·t cÃ¡c quy táº¯c sá»­ dá»¥ng báº¿p gas an toÃ n lÃ  cÃ¡ch tá»‘t nháº¥t Ä‘á»ƒ báº£o vá»‡ tá»• áº¥m cá»§a báº¡n. HÃ£y luÃ´n lá»±a chá»n nhá»¯ng Ä‘áº¡i lÃ½ gas uy tÃ­n, cung cáº¥p hÃ ng chÃ­nh hÃ£ng, cÃ³ tem niÃªm phong vÃ  báº£o hiá»ƒm chÃ¡y ná»• rÃµ rÃ ng nhÆ° <strong>Gas Viá»‡t</strong>.</p>',
            seoTitle: 'Cáº©m Nang NgÃ nh Gas (LPG) & HÆ°á»›ng Dáº«n DÃ¹ng Báº¿p Gas Chuáº©n H1, H2, H3 | Gas Viá»‡t',
            seoDesc: 'TÃ¬m hiá»ƒu sÃ¢u vá» LPG (Propane, Butane). HÆ°á»›ng dáº«n cáº¥u táº¡o mÃ¢m chia lá»­a, cÃ´ng nghá»‡ tá»± ngáº¯t Thermocouple, vÃ  quy trÃ¬nh chuáº©n xá»­ lÃ½ rÃ² rá»‰ gas an toÃ n.',
            categoryId: 1,
            position: 'hero_main',
            active: true,
            createdAt: '2026-07-20T10:00:00'
        },
        {
            id: 2,
            title: 'Náº¥u Äƒn vá»›i báº¿p gas mang láº¡i hÆ°Æ¡ng vá»‹ tuyá»‡t vá»i',
            slug: 'nau-an-voi-bep-gas',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThcCEN_u0qNOSj1q24gJ3k76Afm3QJfGNW78nzrKPNPA&s=10',
            content: '<h2>Lá»£i Ã­ch khi dÃ¹ng báº¿p gas</h2><p>Lá»­a tá»« báº¿p gas cung cáº¥p nhiá»‡t lÆ°á»£ng tá»©c thÃ¬ vÃ  dá»… dÃ ng Ä‘iá»u chá»‰nh. Äiá»u nÃ y giÃºp cÃ¡c mÃ³n chiÃªn, xÃ o Ä‘áº¡t Ä‘Æ°á»£c Ä‘á»™ chÃ­n hoÃ n háº£o vÃ  hÆ°Æ¡ng vá»‹ Ä‘áº·c trÆ°ng, cÃ²n gá»i lÃ  "hÆ°Æ¡ng vá»‹ cá»§a lá»­a".</p><ul><li>Nhiá»‡t Ä‘á»™ á»•n Ä‘á»‹nh</li><li>Dá»… dÃ ng tÃ¹y chá»‰nh má»©c lá»­a</li><li>ThÃ­ch há»£p vá»›i má»i loáº¡i ná»“i cháº£o</li></ul>',
            seoTitle: 'Náº¥u Äƒn vá»›i báº¿p gas mang láº¡i hÆ°Æ¡ng vá»‹ tuyá»‡t vá»i - áº¨m thá»±c',
            seoDesc: 'Báº¿p gas lÃ  lá»±a chá»n hoÃ n háº£o Ä‘á»ƒ cháº¿ biáº¿n mÃ³n Äƒn ngon. KhÃ¡m phÃ¡ cÃ¡ch ngá»n lá»­a gas táº¡o nÃªn "hÆ°Æ¡ng vá»‹ cá»§a lá»­a" cho cÃ¡c mÃ³n chiÃªn xÃ o.',
            categoryId: 5,
            position: 'hero_sub',
            active: true,
            createdAt: '2026-07-19T10:00:00'
        },
        {
            id: 3,
            title: 'LÃ m tháº¿ nÃ o Ä‘á»ƒ chá»n bÃ¬nh gas an toÃ n',
            slug: 'binh-gas-an-toan',
            image: 'https://kenh14cdn.com/zoom/700_438/203336854389633024/2024/8/20/anh-cat-dan-nghe-thuat-lich-ghi-nho-hinh-nen-may-tinh-22543283-1724149878897-17241498802971855222386-0-46-405-694-crop-1724149982222287470039.png',
            content: '<h2>CÃ¡c tiÃªu chÃ­ chá»n bÃ¬nh gas</h2><p>BÃ¬nh gas an toÃ n pháº£i cÃ³ nguá»“n gá»‘c xuáº¥t xá»© rÃµ rÃ ng, vá» bÃ¬nh khÃ´ng bá»‹ mÃ³p mÃ©o hay rá»‰ sÃ©t nhiá»u. Äáº·c biá»‡t, tem chá»‘ng hÃ ng giáº£ vÃ  niÃªm phong mÃ ng co pháº£i cÃ²n nguyÃªn váº¹n.</p><p>LuÃ´n Æ°u tiÃªn Ä‘á»•i gas táº¡i cÃ¡c Ä‘áº¡i lÃ½ chÃ­nh hÃ£ng, uy tÃ­n nhÆ° Gas Viá»‡t Ä‘á»ƒ Ä‘áº£m báº£o cháº¥t lÆ°á»£ng.</p>',
            seoTitle: 'LÃ m tháº¿ nÃ o Ä‘á»ƒ chá»n bÃ¬nh gas an toÃ n cho gia Ä‘Ã¬nh báº¡n',
            seoDesc: 'BÃ­ quyáº¿t chá»n bÃ¬nh gas chÃ­nh hÃ£ng, cháº¥t lÆ°á»£ng. TrÃ¡nh xa cÃ¡c loáº¡i gas giáº£, kÃ©m cháº¥t lÆ°á»£ng Ä‘á»ƒ báº£o vá»‡ an toÃ n chÃ¡y ná»• cho ngÃ´i nhÃ  báº¡n.',
            categoryId: 1,
            position: 'hero_sub',
            active: true,
            createdAt: '2026-07-18T10:00:00'
        },
        {
            id: 4,
            title: 'BÃ¬nh Gas Composite chá»‘ng chÃ¡y ná»•',
            slug: 'binh-gas-composite-chong-chay-no',
            image: 'https://vangas.com.vn/assets/binh-gas-composite-chong-chay-no-2-Sao.jpg',
            content: '<h2>Äá»™t phÃ¡ cÃ´ng nghá»‡ an toÃ n</h2><p>BÃ¬nh gas composite Ä‘Æ°á»£c lÃ m tá»« sá»£i thá»§y tinh siÃªu bá»n, chá»‹u Ã¡p lá»±c cao vÃ  hoÃ n toÃ n khÃ´ng bá»‹ Äƒn mÃ²n. Äáº·c biá»‡t, cháº¥t liá»‡u nÃ y khÃ´ng sinh ra tia lá»­a Ä‘iá»‡n khi va Ä‘áº­p, giÃºp loáº¡i bá» nguy cÆ¡ chÃ¡y ná»•.</p><img src="https://vangas.com.vn/assets/binh-gas-composite-chong-chay-no-2-Sao.jpg"><p>Sáº£n pháº©m nÃ y nháº¹ hÆ¡n bÃ¬nh thÃ©p thÃ´ng thÆ°á»ng Ä‘áº¿n 50%, giÃºp viá»‡c váº­n chuyá»ƒn dá»… dÃ ng hÆ¡n.</p>',
            seoTitle: 'BÃ¬nh Gas Composite chá»‘ng chÃ¡y ná»• tháº¿ há»‡ má»›i',
            seoDesc: 'TÃ¬m hiá»ƒu vá» bÃ¬nh gas composite bá»c sá»£i thá»§y tinh siÃªu nháº¹, khÃ´ng rá»‰ sÃ©t, an toÃ n tuyá»‡t Ä‘á»‘i chá»‘ng chÃ¡y ná»• cho gia Ä‘Ã¬nh.',
            categoryId: 1,
            position: 'default',
            active: true,
            createdAt: '2026-07-17T10:00:00'
        },
        {
            id: 5,
            title: 'Máº¹o vá»‡ sinh báº¿p gas sáº¡ch bong nhÆ° má»›i',
            slug: 'meo-ve-sinh-bep-gas-sach-bong',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREDfbpJN9BQsZcMUaDaz3hl4DxMfYHjrLkFJ10o4ugcCRPcoF6BtM-ZDA&s=10',
            content: '<h2>CÃ¡c bÆ°á»›c vá»‡ sinh báº¿p gas</h2><p>Dáº§u má»¡ bÃ¡m lÃ¢u ngÃ y khÃ´ng chá»‰ lÃ m máº¥t tháº©m má»¹ mÃ  cÃ²n gÃ¢y táº¯c ngháº½n khe thoÃ¡t lá»­a. Báº¡n cÃ³ thá»ƒ sá»­ dá»¥ng há»—n há»£p baking soda vÃ  giáº¥m Ä‘á»ƒ Ä‘Ã¡nh bay váº¿t báº©n.</p><ul><li>NgÃ¢m kiá»ng báº¿p trong nÆ°á»›c nÃ³ng hÃ²a baking soda.</li><li>DÃ¹ng khÄƒn áº©m lau bá» máº·t kÃ­nh.</li><li>DÃ¹ng bÃ n cháº£i nhá» lÃ m sáº¡ch mÃ¢m chia lá»­a.</li></ul>',
            seoTitle: 'Máº¹o vá»‡ sinh báº¿p gas sáº¡ch bong nhÆ° má»›i trong 5 phÃºt',
            seoDesc: 'HÆ°á»›ng dáº«n cÃ¡ch lÃ m sáº¡ch báº¿p gas bá»‹ bÃ¡m dáº§u má»¡ báº±ng nguyÃªn liá»‡u tá»± nhiÃªn nhÆ° giáº¥m, baking soda siÃªu nhanh, siÃªu tiáº¿t kiá»‡m.',
            categoryId: 2,
            position: 'default',
            active: true,
            createdAt: '2026-07-16T10:00:00'
        },
        {
            id: 6,
            title: 'Náº¥u Äƒn ngon vá»›i ngá»n lá»­a xanh',
            slug: 'nau-an-ngon-voi-lua-xanh',
            image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop',
            content: '<h2>Ngá»n lá»­a xanh - Dáº¥u hiá»‡u cá»§a báº¿p gas tá»‘t</h2><p>Lá»­a xanh cho tháº¥y khÃ­ gas Ä‘Æ°á»£c Ä‘á»‘t chÃ¡y hoÃ n toÃ n, sinh ra nhiá»‡t lÆ°á»£ng tá»‘i Ä‘a vÃ  khÃ´ng táº¡o muá»™i Ä‘en dÆ°á»›i Ä‘Ã¡y ná»“i. Náº¿u báº¿p nhÃ  báº¡n xuáº¥t hiá»‡n ngá»n lá»­a Ä‘á», Ä‘Ã³ cÃ³ thá»ƒ lÃ  dáº¥u hiá»‡u cáº§n vá»‡ sinh mÃ¢m chia lá»­a hoáº·c Ä‘iá»u chá»‰nh láº¡i há»‡ thá»‘ng giÃ³.</p>',
            seoTitle: 'Náº¥u Äƒn ngon vá»›i ngá»n lá»­a xanh | BÃ­ quyáº¿t nhÃ  báº¿p',
            seoDesc: 'Táº¡i sao báº¿p gas nÃªn cÃ³ ngá»n lá»­a xanh? CÃ¡ch kháº¯c phá»¥c tÃ¬nh tráº¡ng báº¿p gas bá»‹ lá»­a Ä‘á» lÃ m Ä‘en Ä‘Ã¡y ná»“i dá»… dÃ ng nháº¥t.',
            categoryId: 5,
            position: 'default',
            active: true,
            createdAt: '2026-07-15T10:00:00'
        },
        {
            id: 7,
            title: 'Quy trÃ¬nh láº¯p Ä‘áº·t gas an toÃ n táº¡i nhÃ ',
            slug: 'lap-dat-gas-an-toan-tai-nha',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdCLr1Drw3Zmm8R1xEIAdpHoAQb7b_9AZ0kbFWNdKrrg&s=10',
            content: '<h2>Äáº£m báº£o an toÃ n tá»« khÃ¢u láº¯p Ä‘áº·t</h2><p>QuÃ¡ trÃ¬nh láº¯p bÃ¬nh gas cáº§n sá»± cáº©n trá»ng tuyá»‡t Ä‘á»‘i. Pháº£i Ä‘áº£m báº£o van gas Ä‘Æ°á»£c váº·n cháº·t, khÃ´ng cÃ³ tiáº¿ng xÃ¬ vÃ  khÃ´ng cÃ³ mÃ¹i láº¡. Tá»‘t nháº¥t, hÃ£y Ä‘á»ƒ cÃ¡c ká»¹ thuáº­t viÃªn Ä‘Æ°á»£c Ä‘Ã o táº¡o bÃ i báº£n thá»±c hiá»‡n viá»‡c nÃ y.</p><p>Gas Viá»‡t cam káº¿t kiá»ƒm tra an toÃ n 100% báº±ng bá»t xÃ  phÃ²ng má»—i khi giao gas.</p>',
            seoTitle: 'Quy trÃ¬nh láº¯p Ä‘áº·t gas an toÃ n táº¡i nhÃ  Ä‘Ãºng chuáº©n',
            seoDesc: 'CÃ¡ch ká»¹ thuáº­t viÃªn chuyÃªn nghiá»‡p láº¯p Ä‘áº·t vÃ  kiá»ƒm tra rÃ² rá»‰ bÃ¬nh gas táº¡i nhÃ . Nhá»¯ng lÆ°u Ã½ báº¡n cáº§n quan tÃ¢m khi Ä‘á»•i gas.',
            categoryId: 6,
            position: 'default',
            active: true,
            createdAt: '2026-07-14T10:00:00'
        },
        {
            id: 8,
            title: 'GiÃ¡ gas thÃ¡ng 8 dá»± kiáº¿n giáº£m nháº¹, ngÆ°á»i tiÃªu dÃ¹ng hÆ°á»Ÿng lá»£i',
            slug: 'gia-gas-thang-8-du-kien-giam-nhe',
            image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2026/7/16/1736102/Cover-Gia-Gas-2.jpg',
            content: '<h2>Tin tá»©c thá»‹ trÆ°á»ng gas má»›i nháº¥t</h2><p>Theo bÃ¡o cÃ¡o tá»« cÃ¡c hiá»‡p há»™i nÄƒng lÆ°á»£ng, xu hÆ°á»›ng giÃ¡ dáº§u thÃ´ trÃªn tháº¿ giá»›i Ä‘ang háº¡ nhiá»‡t kÃ©o theo sá»± bÃ¬nh á»•n cá»§a giÃ¡ gas LPG. Dá»± kiáº¿n trong ká»³ Ä‘iá»u chá»‰nh ngÃ y 1 thÃ¡ng 8, giÃ¡ gas sáº½ giáº£m tá»« 5.000 Ä‘áº¿n 10.000 VNÄ cho bÃ¬nh 12kg.</p><p>ÄÃ¢y lÃ  má»™t tin vui Ä‘á»‘i vá»›i cÃ¡c há»™ gia Ä‘Ã¬nh vÃ  nhÃ  hÃ ng, giÃºp giáº£m thiá»ƒu Ä‘Ã¡ng ká»ƒ chi phÃ­ nhiÃªn liá»‡u hÃ ng thÃ¡ng.</p>',
            seoTitle: 'GiÃ¡ gas thÃ¡ng 8/2026 dá»± kiáº¿n giáº£m nháº¹ | Tin thá»‹ trÆ°á»ng',
            seoDesc: 'Cáº­p nháº­t diá»…n biáº¿n giÃ¡ gas thÃ¡ng 8 má»›i nháº¥t. GiÃ¡ gas LPG dá»± kiáº¿n giáº£m, giÃºp ngÆ°á»i tiÃªu dÃ¹ng tiáº¿t kiá»‡m chi phÃ­ sinh hoáº¡t.',
            categoryId: 3,
            position: 'trending_main',
            active: true,
            createdAt: '2026-07-14T10:00:00'
        },
        {
            id: 9,
            title: 'Cáº£nh giÃ¡c vá»›i cÃ¡c chiÃªu trÃ² lá»«a Ä‘áº£o Ä‘á»•i gas giáº£ máº¡o',
            slug: 'canh-giac-voi-cac-chieu-tro-lua-dao',
            image: 'https://motthegioi.vn/wp-content/uploads/2026/04/bep-gas-chay-bang-nuoc.jpg.webp',
            content: '<h2>Nháº­n diá»‡n káº» gian giáº£ danh nhÃ¢n viÃªn gas</h2><p>Thá»i gian gáº§n Ä‘Ã¢y, xuáº¥t hiá»‡n nhiá»u Ä‘á»‘i tÆ°á»£ng tá»± xÆ°ng lÃ  nhÃ¢n viÃªn cÃ´ng ty gas tá»›i nhÃ  kiá»ƒm tra báº¿p miá»…n phÃ­. Thá»±c cháº¥t, chÃºng lá»£i dá»¥ng sÆ¡ há»Ÿ Ä‘á»ƒ phÃ¡ há»ng linh kiá»‡n hoáº·c bÃ¡n van, dÃ¢y vá»›i giÃ¡ "cáº¯t cá»•".</p><p>HÃ£y cáº£nh giÃ¡c vÃ  tá»« chá»‘i cÃ¡c dá»‹ch vá»¥ "tá»« trÃªn trá»i rÆ¡i xuá»‘ng". Chá»‰ gá»i gas táº¡i Ä‘áº¡i lÃ½ uy tÃ­n cÃ³ thÃ´ng tin rÃµ rÃ ng.</p>',
            seoTitle: 'Cáº£nh giÃ¡c chiÃªu trÃ² lá»«a Ä‘áº£o Ä‘á»•i gas, báº£o dÆ°á»¡ng báº¿p gas máº¡o danh',
            seoDesc: 'Cáº£nh bÃ¡o thá»§ Ä‘oáº¡n lá»«a Ä‘áº£o giáº£ danh nhÃ¢n viÃªn kiá»ƒm tra gas Ä‘á»ƒ trá»¥c lá»£i. HÆ°á»›ng dáº«n cÃ¡ch phÃ²ng trÃ¡nh vÃ  chá»n Ä‘áº¡i lÃ½ gas uy tÃ­n.',
            categoryId: 1,
            position: 'default',
            active: true,
            createdAt: '2026-07-12T10:00:00'
        },
        {
            id: 10,
            title: 'CÃ¡ch nháº­n biáº¿t van gas tá»± ngáº¯t chÃ­nh hÃ£ng',
            slug: 'cach-nhan-biet-van-gas-tu-ngat',
            image: 'https://kingshop.vn/data/images/Van-gas-cao-ap-tu-ngat-an-toan-Namilux-NA-538SH-1.jpg',
            content: '<h2>PhÃ¢n biá»‡t van chÃ­nh hÃ£ng vÃ  hÃ ng nhÃ¡i</h2><p>Van gas tá»± ngáº¯t Ä‘Ã³ng vai trÃ² nhÆ° má»™t vá»‡ sÄ©, tá»± Ä‘á»™ng khÃ³a gas khi cÃ³ sá»± cá»‘ Ä‘á»©t dÃ¢y hay rÃ² rá»‰ lá»›n. Tuy nhiÃªn, hÃ ng nhÃ¡i trÃ n lan trÃªn thá»‹ trÆ°á»ng khÃ´ng cÃ³ chá»©c nÄƒng nÃ y.</p><ul><li>Logo Ä‘Æ°á»£c dáº­p ná»•i sáº¯c nÃ©t.</li><li>CÃ³ tem chá»‘ng giáº£ cá»§a nhÃ  sáº£n xuáº¥t (nhÆ° Namilux, Katsura).</li><li>Cáº§m náº·ng tay vÃ  gia cÃ´ng tá»‰ má»‰.</li></ul>',
            seoTitle: 'CÃ¡ch nháº­n biáº¿t van gas tá»± ngáº¯t chÃ­nh hÃ£ng vÃ  hÃ ng giáº£',
            seoDesc: 'Van gas tá»± ngáº¯t báº£o vá»‡ gia Ä‘Ã¬nh báº¡n khá»i rá»§i ro chÃ¡y ná»•. Há»c cÃ¡ch phÃ¢n biá»‡t van gas chÃ­nh hÃ£ng Namilux, Katsura vá»›i hÃ ng nhÃ¡i.',
            categoryId: 6,
            position: 'default',
            active: true,
            createdAt: '2026-07-10T10:00:00'
        },
        {
            id: 11,
            title: 'Khi nÃ o cáº§n thay dÃ¢y dáº«n gas? Dáº¥u hiá»‡u cáº§n biáº¿t ngay',
            slug: 'khi-nao-can-thay-day-dan-gas',
            image: 'https://cdn.tgdd.vn//News/542986//nhan-biet-may-dieu-hoa-thieu-gas-het-gas-2-730x487.jpg',
            content: '<h2>Báº£o vá»‡ an toÃ n Ä‘Æ°á»ng á»‘ng dáº«n gas</h2><p>DÃ¢y dáº«n gas Ä‘Æ°á»£c lÃ m báº±ng cao su, cÃ³ tuá»•i thá» khoáº£ng 2-3 nÄƒm. Tuy nhiÃªn, náº¿u báº¡n phÃ¡t hiá»‡n dÃ¢y cÃ³ dáº¥u hiá»‡u chai cá»©ng, ná»©t náº» hoáº·c bá»‹ chuá»™t cáº¯n, cáº§n thay ngay láº­p tá»©c.</p><p>NÃªn sá»­ dá»¥ng loáº¡i dÃ¢y cÃ³ bá»c káº½m chá»‘ng chuá»™t Ä‘á»ƒ tÄƒng cÆ°á»ng Ä‘á»™ bá»n vÃ  an toÃ n.</p>',
            seoTitle: 'Khi nÃ o cáº§n thay dÃ¢y dáº«n gas? Dáº¥u hiá»‡u cáº§n thay má»›i',
            seoDesc: 'DÃ¢y dáº«n gas cÅ©, ráº¡n ná»©t lÃ  nguyÃªn nhÃ¢n sá»‘ 1 gÃ¢y rÃ² rá»‰ gas. Dáº¥u hiá»‡u nháº­n biáº¿t vÃ  thá»i gian thay tháº¿ dÃ¢y dáº«n gas an toÃ n báº¡n cáº§n biáº¿t.',
            categoryId: 6,
            position: 'default',
            active: true,
            createdAt: '2026-07-08T10:00:00'
        },
        {
            id: 12,
            title: 'Sá»± tháº­t vá» bÃ¬nh gas vá» nhá»±a',
            slug: 'su-that-ve-binh-gas-vo-nhua',
            image: 'https://gassaigonvina.com/upload/product/7-8062.png',
            content: '<h2>Æ¯u Ä‘iá»ƒm cá»§a bÃ¬nh gas bá»c nhá»±a</h2><p>Nhiá»u ngÆ°á»i e ngáº¡i "vá» nhá»±a" dá»… chÃ¡y, nhÆ°ng thá»±c cháº¥t Ä‘Ã¢y lÃ  lá»›p nhá»±a cao cáº¥p bá»c ngoÃ i lá»›p sá»£i thá»§y tinh siÃªu bá»n. Thiáº¿t káº¿ nÃ y giÃºp bÃ¬nh khÃ´ng bá»‹ Äƒn mÃ²n trong mÃ´i trÆ°á»ng áº©m Æ°á»›t vÃ  dá»… dÃ ng quan sÃ¡t lÆ°á»£ng gas cÃ²n láº¡i bÃªn trong nhá» lá»›p nhá»±a bÃ¡n trong suá»‘t.</p>',
            seoTitle: 'Sá»± tháº­t vá» bÃ¬nh gas vá» nhá»±a (Composite) báº¡n chÆ°a biáº¿t',
            seoDesc: 'Giáº£i Ä‘Ã¡p tháº¯c máº¯c vá» Ä‘á»™ an toÃ n cá»§a bÃ¬nh gas vá» nhá»±a composite. Æ¯u nhÆ°á»£c Ä‘iá»ƒm so vá»›i bÃ¬nh gas thÃ©p truyá»n thá»‘ng.',
            categoryId: 4,
            position: 'default',
            active: true,
            createdAt: '2026-07-05T10:00:00'
        }
    ];

    const seedProducts = [
        // ===== 1. Gas Saigon Petro (3 SP) =====
        {
            id: 1,
            name: 'Gas Saigon Petro XÃ¡m 12kg',
            categoryId: 1,
            image: 'https://giaogasnhanh.vn/upload/product/images-(24)-9485_480x480.jpg',
            price: 510000,
            discount: 10,
            description: 'BÃ¬nh Gas Saigon Petro xÃ¡m 12kg sá»Ÿ há»¯u vá» bÃ¬nh thÃ©p chá»‹u lá»±c cao, sÆ¡n tÄ©nh Ä‘iá»‡n chá»‘ng gá»‰ sÃ©t. KhÃ­ gas hÃ³a lá»ng tinh khiáº¿t cho ngá»n lá»­a xanh Ä‘á»u, khÃ´ng táº¡o muá»™i lÃ m Ä‘en Ä‘Ã¡y ná»“i, giÃºp tiáº¿t kiá»‡m nhiÃªn liá»‡u tá»‘i Ä‘a.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Ngang (POL) / Van Chá»¥p\nThÃ nh pháº§n: KhÃ­ LPG tinh khiáº¿t (30% Propane - 70% Butane)\nÃp suáº¥t thá»­ vá»: 34kg/cmÂ²',
            featured: true,
            onSale: true,
            isSaleOff50: true,
            isFlashDeal: true,
            flashDealDesc: 'Giáº£m cá»±c máº¡nh dá»‹p cuá»‘i tuáº§n',
            createdAt: '2026-07-01T00:00:00',
            recommendedProducts: [42, 45]
        },
        {
            id: 2,
            name: 'Gas Saigon Petro Xanh 12kg',
            categoryId: 1,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNdoeB28ouCyXGjPABtIWE_FWaiFCooDDDoJcVbGgD4w&s=10',
            price: 510000,
            discount: 0,
            description: 'BÃ¬nh Gas Saigon Petro xanh 12kg Ä‘áº¡t tiÃªu chuáº©n kiá»ƒm Ä‘á»‹nh nghiÃªm ngáº·t. Gas chÃ¡y Ãªm, ngá»n lá»­a xanh nhiá»‡t lÆ°á»£ng cao, tÃ­ch há»£p mÃ ng co niÃªm phong vÃ  tem chá»‘ng hÃ ng giáº£ 3D an toÃ n tuyá»‡t Ä‘á»‘i.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Ngang (váº·n ren)\nMÃ u vá»: Xanh lÃ¡ / Xanh dÆ°Æ¡ng\nTiÃªu chuáº©n: TCVN 6223:2017',
            featured: false,
            onSale: false,
            isSaleOff50: true,
            createdAt: '2026-07-01T00:01:00'
        },
        {
            id: 3,
            name: 'Gas Saigon Petro Äá» 12kg',
            categoryId: 1,
            image: 'https://giaogasnhanh.vn/upload/product/gas-sp-saigon-petro-mau-do-12kg-600x584-2575_493.15068493151x480.jpg',
            price: 510000,
            discount: 5,
            description: 'Gas Saigon Petro Ä‘á» 12kg thiáº¿t káº¿ vá» bÃ¬nh dÃ y dáº·n chá»‹u Ã¡p suáº¥t cao. Sáº£n pháº©m mang Ä‘áº¿n nguá»“n nhiá»‡t á»•n Ä‘á»‹nh, an toÃ n cho cÄƒn báº¿p gia Ä‘Ã¬nh vÃ  dá»… dÃ ng nháº­n diá»‡n thÆ°Æ¡ng hiá»‡u chÃ­nh hÃ£ng.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Ngang POL\nMÃ u vá»: Äá»\nBáº£o hiá»ƒm: CÃ³ báº£o hiá»ƒm chÃ¡y ná»• chÃ­nh hÃ£ng',
            featured: false,
            onSale: true,
            createdAt: '2026-07-01T00:02:00'
        },

        // ===== 2. Gas Petrolimex (11 SP) =====
        {
            id: 4,
            name: 'BÃ¬nh Gas Petro Vietnam Xanh Biá»ƒn',
            categoryId: 2,
            image: 'https://gassaigonvina.com/upload/product/binh-gas-13kg-mau-xanh-gas-petrolimex-4524.png',
            price: 490000,
            discount: 0,
            description: 'BÃ¬nh mÃ u xanh biá»ƒn mang thÆ°Æ¡ng hiá»‡u uy tÃ­n. Cháº¥t lÆ°á»£ng khÃ­ gas tinh khiáº¿t, chÃ¡y sáº¡ch khÃ´ng Ä‘á»™c háº¡i, vá» bÃ¬nh Ä‘Æ°á»£c kiá»ƒm Ä‘á»‹nh Ã¡p suáº¥t Ä‘á»‹nh ká»³ Ä‘áº£m báº£o an toÃ n chÃ¡y ná»• cao.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Ngang\nÃp suáº¥t thiáº¿t káº¿: 17kg/cmÂ²',
            featured: true,
            onSale: false,
            createdAt: '2026-07-02T00:00:00'
        },
        {
            id: 5,
            name: 'Gas Petrovietnam Äá» 12kg',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkZ5DlTI-_oLYEKEq9BF9_NGr9dHGeBEqw0bZSGwxQ5g&s=10',
            price: 495000,
            discount: 0,
            description: 'DÃ²ng Gas Petrovietnam Ä‘á» 12kg chuáº©n chÃ­nh hÃ£ng, ngá»n lá»­a xanh mÆ°á»£t giÃºp Ä‘un náº¥u nhanh chÃ³ng. Vá» bÃ¬nh Ä‘Æ°á»£c dÃ¡n tem niÃªm phong Bá»™ CÃ´ng An, chá»‘ng rÃ² rá»‰ khÃ­ gas hiá»‡u quáº£.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Ngang\nXuáº¥t xá»©: Viá»‡t Nam',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:01:00'
        },
        {
            id: 6,
            name: 'Gas Petrovietnam XÃ¡m 12kg',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcC_Us_CIhkYN5WBmijxNfrYdcA0FThSWes6YdQfE2Fg&s=10',
            price: 495000,
            discount: 0,
            description: 'Gas Petrovietnam vá» xÃ¡m 12kg phá»• thÃ´ng, phÃ¹ há»£p vá»›i má»i khÃ´ng gian báº¿p. KhÃ­ gas chÃ¡y kiá»‡t khÃ´ng dÆ° thá»«a, tiáº¿t kiá»‡m chi phÃ­ sinh hoáº¡t cho gia Ä‘Ã¬nh hÃ ng thÃ¡ng.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Ngang\nMÃ u vá»: XÃ¡m tiÃªu chuáº©n',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:02:00'
        },
        {
            id: 7,
            name: 'Petrolimex 12kg Van Äá»©ng',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4IyrDhwtsUICtZpn4sW6xNKTZ-Td9iYycdHsHtTndhQ&s=10',
            price: 580000,
            discount: 8,
            description: 'BÃ¬nh Petrolimex 12kg trang bá»‹ van Ä‘á»©ng (Compact) báº¥m chá»¥p tiá»‡n lá»£i. Thao tÃ¡c thÃ¡o láº¯p cá»±c ká»³ dá»… dÃ ng vÃ  an toÃ n, phÃ¹ há»£p cho cÃ¡c cÄƒn há»™ chung cÆ° vÃ  gia Ä‘Ã¬nh hiá»‡n Ä‘áº¡i.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Chá»¥p 20mm (Van Ä‘á»©ng)\nMÃ u vá»: Xanh dÆ°Æ¡ng Petrolimex',
            featured: true,
            onSale: true,
            createdAt: '2026-07-02T00:03:00'
        },
        {
            id: 8,
            name: 'Petrolimex 12kg Van Shell',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz4Pm91Yvv_WR48xccfmHJzVW51g0CgsGoKFxFkWMGMw&s=10',
            price: 580000,
            discount: 0,
            description: 'DÃ²ng bÃ¬nh Petrolimex 12kg van Shell (van xoay POL) truyá»n thá»‘ng, ren váº·n cháº¯c cháº¯n chá»‘ng xÃ¬ gas. Vá» bÃ¬nh mÃ u xanh dÆ°Æ¡ng biá»ƒu trÆ°ng cho cháº¥t lÆ°á»£ng vÃ  Ä‘á»™ bá»n vÆ°á»£t trá»™i.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Shell (POL váº·n ren)\nMÃ u vá»: Xanh dÆ°Æ¡ng Petrolimex',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:04:00'
        },
        {
            id: 9,
            name: 'BÃ¬nh Petrolimex 12kg (Van ngang)',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC-VHklNs7aet5PN9DzXPHuvxBruDUlmfmvNJICw1F7g&s=10',
            price: 480000,
            discount: 0,
            description: 'BÃ¬nh Petrolimex 12kg van ngang chuyÃªn dá»¥ng, thiáº¿t káº¿ khá»›p ná»‘i chuáº©n xÃ¡c giÃºp dÃ²ng khÃ­ gas lÆ°u thÃ´ng á»•n Ä‘á»‹nh, giá»¯ ngá»n lá»­a luÃ´n xanh vÃ  Ä‘á»u.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Ngang\nTem chá»‘ng giáº£: Tem mÃ£ QR / Tem BCT',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:05:00'
        },
        {
            id: 10,
            name: 'BÃ¬nh Petrolimex 12kg (Van chá»¥p)',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjUmqf03RBWBdfKMem8XE4F0b31wJ53CtknxigqV-zaQ&s=10',
            price: 480000,
            discount: 0,
            description: 'BÃ¬nh Petrolimex 12kg tÃ­ch há»£p van chá»¥p tá»± Ä‘á»™ng ngáº¯t gas khi cÃ³ sá»± cá»‘. Vá» bÃ¬nh sÆ¡n tÄ©nh Ä‘iá»‡n cao cáº¥p, chá»‘ng Äƒn mÃ²n trong mÃ´i trÆ°á»ng báº¿p áº©m Æ°á»›t.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Chá»¥p bÃ¡m an toÃ n\nÃp suáº¥t thá»­: 34kg/cmÂ²',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:06:00'
        },
        {
            id: 11,
            name: 'BÃ¬nh Petrolimex 45kg (Van cÃ´ng nghiá»‡p)',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCBXtJgfeDbv6isnJWlZYNTvJJdSL5TvUClyN_-z_YJg&s=10',
            price: 1750000,
            discount: 0,
            description: 'BÃ¬nh gas cÃ´ng nghiá»‡p Petrolimex 45kg chuyÃªn dÃ¹ng cho nhÃ  hÃ ng, khÃ¡ch sáº¡n vÃ  báº¿p Äƒn táº­p thá»ƒ. Dung tÃ­ch lá»›n, Ã¡p suáº¥t gas á»•n Ä‘á»‹nh, Ä‘Ã¡p á»©ng táº§n suáº¥t Ä‘un náº¥u liÃªn tá»¥c.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 45kg Â± 200g\nLoáº¡i van: Van CÃ´ng Nghiá»‡p\nChiá»u cao bÃ¬nh: â‰ˆ 1200mm',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:07:00'
        },
        {
            id: 12,
            name: 'BÃ¬nh Petrolimex 48kg (Van cÃ´ng nghiá»‡p)',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-PiyHfvbts2VWVuEp13zY9yn2xOkHggt-qXdxIY8kFQ&s=10',
            price: 1850000,
            discount: 0,
            description: 'DÃ²ng bÃ¬nh gas cÃ´ng nghiá»‡p Petrolimex 48kg cÃ´ng suáº¥t lá»›n, tiáº¿t kiá»‡m thá»i gian Ä‘á»•i gas cho cÃ¡c cÆ¡ sá»Ÿ cháº¿ biáº¿n thá»±c pháº©m vÃ  quÃ¡n Äƒn quy mÃ´ lá»›n.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 48kg Â± 200g\nLoáº¡i van: Van CÃ´ng Nghiá»‡p\nÄÆ°á»ng kÃ­nh thÃ¢n bÃ¬nh: â‰ˆ 375mm',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:08:00'
        },
        {
            id: 13,
            name: 'Lon Gas Mini Petrolimex',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqU_Rq4J3mTQf-O8_ZilQDS6dBU8wNkAgbregJIqEj-A&s=10',
            price: 95000,
            discount: 15,
            description: 'Lon gas mini Petrolimex chá»©a khÃ­ gas tinh khiáº¿t, an toÃ n tuyá»‡t Ä‘á»‘i cho cÃ¡c loáº¡i báº¿p gas du lá»‹ch, báº¿p láº©u gia Ä‘Ã¬nh. Chá»‘ng ná»• hiá»‡u quáº£ khi Ä‘un náº¥u lÃ¢u.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 220g / lon\nThÃ nh pháº§n: 100% Butane\nQuy cÃ¡ch: Lon láº»',
            featured: false,
            onSale: true,
            createdAt: '2026-07-02T00:09:00'
        },
        {
            id: 14,
            name: 'ThÃ¹ng Lon Gas Mini Petrolimex',
            categoryId: 2,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNvMJMO5dTRWcqjwxSxBBawpD9ZvQtVu2sdcdjJLXU5w&s=10',
            price: 550000,
            discount: 0,
            description: 'ThÃ¹ng lon gas mini Petrolimex tiá»‡n lá»£i, giáº£i phÃ¡p tiáº¿t kiá»‡m cho cÃ¡c quÃ¡n láº©u, nÆ°á»›ng hoáº·c cÃ¡c chuyáº¿n picnic, dÃ£ ngoáº¡i Ä‘Ã´ng ngÆ°á»i.',
            specs: 'Quy cÃ¡ch Ä‘Ã³ng gÃ³i: ThÃ¹ng 28 lon\nDung tÃ­ch má»—i lon: 220g\nHáº¡n sá»­ dá»¥ng: 5 nÄƒm',
            featured: false,
            onSale: false,
            createdAt: '2026-07-02T00:10:00'
        },

        // ===== 3. Gas Gia ÄÃ¬nh (3 SP) =====
        {
            id: 15,
            name: 'Gia ÄÃ¬nh Gas 12kg (Van ngang)',
            categoryId: 3,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzWWiQEK-rq73NcInh7huxeR88ZiwveZODRrQDkaJiJw&s=10',
            price: 460000,
            discount: 0,
            description: 'Gia ÄÃ¬nh Gas 12kg van ngang sá»Ÿ há»¯u vá» bÃ¬nh Ä‘a sáº¯c hiá»‡n Ä‘áº¡i, lá»›p sÆ¡n tÄ©nh Ä‘iá»‡n má»‹n Ä‘áº¹p. Van váº·n ren chuáº©n an toÃ n, ngá»n lá»­a xanh mÆ°á»£t tiáº¿t kiá»‡m gas.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Ngang POL\nMÃ u sáº¯c vá»: Äa sáº¯c (XÃ¡m / Xanh / Há»“ng / VÃ ng)',
            featured: true,
            onSale: false,
            createdAt: '2026-07-03T00:00:00'
        },
        {
            id: 16,
            name: 'Gia ÄÃ¬nh Gas 12kg (Van chá»¥p)',
            categoryId: 3,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKaYlQDEBsnjnkVS91A1OayjqMMlSdytCsp6tIbIAEdg&s=10',
            price: 460000,
            discount: 10,
            description: 'Gia ÄÃ¬nh Gas 12kg trang bá»‹ van chá»¥p báº¥m nhanh, chá»‘ng rÃ² rá»‰ khÃ­ gas vÆ°á»£t trá»™i. Vá» bÃ¬nh thá»i trang giÃºp khÃ´ng gian báº¿p thÃªm pháº§n tráº» trung, sinh Ä‘á»™ng.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Chá»¥p Compact\nThÆ°Æ¡ng hiá»‡u: An PhÃ¡t Petrol',
            featured: false,
            onSale: true,
            createdAt: '2026-07-03T00:01:00'
        },
        {
            id: 17,
            name: 'Gia ÄÃ¬nh Gas 45kg (CÃ´ng nghiá»‡p)',
            categoryId: 3,
            image: 'https://mekongsen.vn/datafiles/47/2024-02/thumbs-97594329-G%C4%90-avt.jpg',
            price: 1680000,
            discount: 0,
            description: 'BÃ¬nh Gia ÄÃ¬nh Gas 45kg phá»¥c vá»¥ chuá»—i nhÃ  hÃ ng, quÃ¡n Äƒn. Vá» bÃ¬nh siÃªu bá»n, lÆ°u lÆ°á»£ng gas xáº£ Ä‘á»u giÃºp ngá»n lá»­a luÃ´n máº¡nh máº½.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 45kg Â± 200g\nLoáº¡i van: Van CÃ´ng Nghiá»‡p\nÃp suáº¥t thá»­: 34kg/cmÂ²',
            featured: false,
            onSale: false,
            createdAt: '2026-07-03T00:02:00'
        },

        // ===== 4. Gas Thá»§ Äá»©c (3 SP) =====
        {
            id: 18,
            name: 'Gas Thá»§ Äá»©c 12kg (Van ngang)',
            categoryId: 4,
            image: 'https://gasleminh.com/wp-content/uploads/2022/10/screenshot_1677840360.png',
            price: 450000,
            discount: 0,
            description: 'Gas Thá»§ Äá»©c 12kg van ngang ná»•i tiáº¿ng vá»›i vá» bÃ¬nh mÃ u xanh Ä‘en (Navy) Ä‘áº·c trÆ°ng. KhÃ­ gas cháº¥t lÆ°á»£ng cao, chÃ¡y sáº¡ch, van váº·n an toÃ n chuáº©n thá»‹ trÆ°á»ng phÃ­a Nam.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Ngang\nMÃ u vá»: Xanh Äen (Navy)',
            featured: true,
            onSale: false,
            createdAt: '2026-07-04T00:00:00'
        },
        {
            id: 19,
            name: 'Gas Thá»§ Äá»©c 12kg (Van chá»¥p)',
            categoryId: 4,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqqnKfgK14S6uaDZtOuoudXCTiLzRGN0yW5Wg9C3oJug&s=10',
            price: 450000,
            discount: 0,
            description: 'Gas Thá»§ Äá»©c 12kg van chá»¥p an toÃ n, thao tÃ¡c ngáº¯t má»Ÿ nháº¹ nhÃ ng. Sáº£n pháº©m Ä‘áº¡t tiÃªu chuáº©n cháº¥t lÆ°á»£ng PCCC, tem nhÃ£n chá»‘ng giáº£ rÃµ rÃ ng.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Chá»¥p\nTiÃªu chuáº©n: TCVN 6223:2017',
            featured: false,
            onSale: false,
            createdAt: '2026-07-04T00:01:00'
        },
        {
            id: 20,
            name: 'Gas Thá»§ Äá»©c 45kg (CÃ´ng nghiá»‡p)',
            categoryId: 4,
            image: 'https://thuducgas.vn/upload/images/b%C3%ACnh%20gas%20c%C3%B4ng%20nghi%E1%BB%87p%2045kg.png',
            price: 1650000,
            discount: 0,
            description: 'BÃ¬nh cÃ´ng nghiá»‡p Gas Thá»§ Äá»©c 45kg cho hiá»‡u suáº¥t nhiá»‡t cá»±c cao, vá» bÃ¬nh chá»‹u lá»±c tá»‘t, Ä‘Ã¡p á»©ng hoÃ n háº£o nhu cáº§u Ä‘un náº¥u cÃ´ng suáº¥t lá»›n.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 45kg Â± 200g\nLoáº¡i van: Van CÃ´ng Nghiá»‡p\ná»¨ng dá»¥ng: Báº¿p cÃ´ng nghiá»‡p / XÆ°á»Ÿng sáº£n xuáº¥t',
            featured: false,
            onSale: false,
            createdAt: '2026-07-04T00:02:00'
        },

        // ===== 5. Gas Elf (5 SP) =====
        {
            id: 21,
            name: 'Elf MÃ u Äá» - 6kg',
            categoryId: 5,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9OKER1KLe8rGOooF9CI8jezi5f2Jih1fi2J3irppcXg&s',
            price: 320000,
            discount: 12,
            description: 'BÃ¬nh Elf Gas 6kg nhá» gá»n, giáº£i phÃ¡p lÃ½ tÆ°á»Ÿng cho sinh viÃªn, cÄƒn há»™ chung cÆ° nhá» hoáº·c há»™ gia Ä‘Ã¬nh Ã­t náº¥u nÆ°á»›ng. Van chá»¥p an toÃ n chuáº©n ChÃ¢u Ã‚u.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 6kg Â± 50g\nLoáº¡i van: Van Chá»¥p Äá»\nThÆ°Æ¡ng hiá»‡u: TotalEnergies (PhÃ¡p)',
            featured: true,
            onSale: true,
            createdAt: '2026-07-05T00:00:00'
        },
        {
            id: 22,
            name: 'Gas Elf Äá» 12.5kg',
            categoryId: 5,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpLcfGmx_MR64O7EwtTraZHBNfTKvj_oAdVABgn8OdUA&s=10',
            price: 550000,
            discount: 0,
            description: 'Elf Gas Ä‘á» 12.5kg thÆ°Æ¡ng hiá»‡u TotalEnergies (PhÃ¡p). Thiáº¿t káº¿ vá» bÃ¬nh chuáº©n quá»‘c táº¿, cÃ´ng nghá»‡ khÃ³a van an toÃ n cao cáº¥p chá»‘ng rÃ² rá»‰ khÃ­ gas.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12.5kg Â± 100g\nLoáº¡i van: Van Chá»¥p / Van Ngang\nMÃ u vá»: Äá» máº£ng xÃ¡m',
            featured: false,
            onSale: false,
            createdAt: '2026-07-05T00:01:00'
        },
        {
            id: 23,
            name: 'Elf Gas 12kg (Van ngang)',
            categoryId: 5,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCItykuDDNEQdzLIeY9zSRL4oa5_zmaq_kINuHE8iRbA&s=10',
            price: 470000,
            discount: 0,
            description: 'Elf Gas 12kg van ngang káº¿t há»£p giá»¯a cháº¥t lÆ°á»£ng gas tiÃªu chuáº©n ChÃ¢u Ã‚u vÃ  van váº·n ren truyá»n thá»‘ng bá»n bá»‰, cho ngá»n lá»­a xanh vÃ  nhiá»‡t lÆ°á»£ng cao.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Ngang POL\nTiÃªu chuáº©n: EU Standard',
            featured: false,
            onSale: false,
            createdAt: '2026-07-05T00:02:00'
        },
        {
            id: 24,
            name: 'Elf Gas 12kg (Van chá»¥p)',
            categoryId: 5,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTarAan8NSN_SXdWEjFODiPJfE6zlFsoEtWdLlNFxtiHg&s=10',
            price: 470000,
            discount: 0,
            description: 'Elf Gas 12kg van chá»¥p Ä‘á» cao cáº¥p, thao tÃ¡c rÃºt khÃ³a nhanh gá»n, chá»‘ng xÃ¬ gas tá»‘i Ä‘a, mang láº¡i sá»± an tÃ¢m tuyá»‡t Ä‘á»‘i cho cÄƒn báº¿p gia Ä‘Ã¬nh.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 12kg Â± 100g\nLoáº¡i van: Van Chá»¥p rÃºt\nXuáº¥t xá»© thÆ°Æ¡ng hiá»‡u: PhÃ¡p',
            featured: false,
            onSale: false,
            createdAt: '2026-07-05T00:03:00'
        },
        {
            id: 25,
            name: 'Elf Gas 39kg / 45kg (CÃ´ng nghiá»‡p)',
            categoryId: 5,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW148byXQ8eDcrHqpAllXTVgC9DFRe7orAVWJoBw3OYA&s=10',
            price: 1690000,
            discount: 0,
            description: 'BÃ¬nh Elf Gas cÃ´ng nghiá»‡p 39kg/45kg chá»‹u Ã¡p suáº¥t cá»±c lá»›n, cung cáº¥p nguá»“n nÄƒng lÆ°á»£ng á»•n Ä‘á»‹nh cho cÃ¡c há»‡ thá»‘ng báº¿p trung tÃ¢m vÃ  nhÃ  mÃ¡y cháº¿ biáº¿n.',
            specs: 'Trá»ng lÆ°á»£ng ruá»™t: 39kg / 45kg\nLoáº¡i van: Van CÃ´ng Nghiá»‡p chuyÃªn dá»¥ng\nÃp suáº¥t thá»­: 34kg/cmÂ²',
            featured: false,
            onSale: false,
            createdAt: '2026-07-05T00:04:00'
        },

        // ===== 6. Báº¿p Há»“ng Ngoáº¡i (10 SP) =====
        {
            id: 26,
            name: 'Báº¿p há»“ng ngoáº¡i Sunhouse SHD6011 - Báº¿p Ä‘Æ¡n - 2000W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-USp9nnPYfDZ7LK3r0l0mRShzOeTHAPPuOPLZ3pnuyQ&s=10',
            price: 650000,
            discount: 0,
            description: 'Báº¿p há»“ng ngoáº¡i Ä‘Æ¡n Sunhouse SHD6011 cÃ´ng suáº¥t 2000W, máº·t kÃ­nh Ceramic chá»‹u nhiá»‡t trÃ n viá»n sang trá»ng. Báº£ng Ä‘iá»u khiá»ƒn tiáº¿ng Viá»‡t dá»… dÃ¹ng, khÃ´ng kÃ©n xoong ná»“i.',
            specs: 'Loáº¡i báº¿p: Báº¿p Ä‘Æ¡n\nCÃ´ng suáº¥t: 2000W\nMáº·t kÃ­nh: KÃ­nh Ceramic chá»‹u nhiá»‡t\nBáº£ng Ä‘iá»u khiá»ƒn: NÃºt báº¥m cÆ¡ / Tiáº¿ng Viá»‡t',
            featured: false,
            onSale: false,
            createdAt: '2026-07-06T00:00:00'
        },
        {
            id: 27,
            name: 'Báº¿p há»“ng ngoáº¡i Kangaroo HG368i - Báº¿p Ä‘Æ¡n - 2000W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfVQ6GMGrehYCpq6hCjhWLU38dm_GOL0H9q6g44AjNDg&s=10',
            price: 720000,
            discount: 0,
            description: 'Kangaroo HG368i sá»Ÿ há»¯u phÃ­m báº¥m cÆ¡ bá»n bá»‰, tÃ­ch há»£p tay cáº§m hai bÃªn tiá»‡n di chuyá»ƒn. Äa dáº¡ng cháº¿ Ä‘á»™ náº¥u nÆ°á»›ng tá»« láº©u, xÃ o Ä‘áº¿n nÆ°á»›ng trá»±c tiáº¿p trÃªn máº·t báº¿p.',
            specs: 'Loáº¡i báº¿p: Báº¿p Ä‘Æ¡n\nCÃ´ng suáº¥t: 2000W\nTiá»‡n Ã­ch: CÃ³ tay cáº§m xÃ¡ch tiá»‡n lá»£i\nHáº¹n giá»: CÃ³',
            featured: false,
            onSale: false,
            isFlashDeal: true,
            flashDealDesc: 'Khuyáº¿n mÃ£i Ä‘áº·c biá»‡t trong ngÃ y',
            createdAt: '2026-07-06T00:01:00'
        },
        {
            id: 28,
            name: 'Báº¿p há»“ng ngoáº¡i Sanaky SNK-2101HG - Báº¿p Ä‘Æ¡n - 2000W',
            categoryId: 6,
            image: 'https://gasleminh.com/wp-content/uploads/2022/10/screenshot_1677840360.png',
            price: 850000,
            discount: 0,
            description: 'Báº¿p há»“ng ngoáº¡i Sanaky SNK-2101HG trang bá»‹ phÃ­m cáº£m á»©ng mÆ°á»£t mÃ , mÃ n hÃ¬nh LED hiá»ƒn thá»‹ rÃµ rÃ ng. Äi kÃ¨m vá»‰ nÆ°á»›ng inox tiá»‡n lá»£i cho cÃ¡c buá»•i tiá»‡c gia Ä‘Ã¬nh.',
            specs: 'Loáº¡i báº¿p: Báº¿p Ä‘Æ¡n\nCÃ´ng suáº¥t: 2000W\nBáº£ng Ä‘iá»u khiá»ƒn: Cáº£m á»©ng\nKhÃ³a an toÃ n: CÃ³',
            featured: false,
            onSale: false,
            createdAt: '2026-07-06T00:02:00'
        },
        {
            id: 29,
            name: 'Báº¿p há»“ng ngoáº¡i Midea MIR-T2015DC - Báº¿p Ä‘Æ¡n - 2000W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCg3AAxwK6HltRWZMA9a525jHdjgab90E0sOxRNivrpA&s=10',
            price: 990000,
            discount: 10,
            description: 'Midea MIR-T2015DC phÃ¡ cÃ¡ch vá»›i nÃºm xoay Ä‘iá»u chá»‰nh cÃ´ng suáº¥t nhanh chÃ³ng. Máº·t kÃ­nh Ceramic Ä‘en bÃ³ng chá»‘ng tráº§y xÆ°á»›c, dá»… dÃ ng lau chÃ¹i sau khi náº¥u.',
            specs: 'Loáº¡i báº¿p: Báº¿p Ä‘Æ¡n\nCÃ´ng suáº¥t: 2000W\nÄiá»u khiá»ƒn: NÃºm xoay vÃ´ cáº¥p\nMáº·t kÃ­nh: Ceramic cao cáº¥p',
            featured: false,
            onSale: true,
            createdAt: '2026-07-06T00:03:00'
        },
        {
            id: 30,
            name: 'Báº¿p há»“ng ngoáº¡i Junger MT-21 - Báº¿p Ä‘Æ¡n - 2200W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTc-hvpwqlB-HFdPbcHDp7Kf7Lt9oG57h0NyKBuuOSWQ&s=10',
            price: 1850000,
            discount: 0,
            description: 'Báº¿p há»“ng ngoáº¡i cao cáº¥p Junger MT-21 nháº­p kháº©u, máº·t kÃ­nh Schott Ceran (Äá»©c) chá»‹u lá»±c chá»‹u nhiá»‡t Ä‘á»‰nh cao. CÃ´ng suáº¥t 2200W Ä‘un sÃ´i cá»±c nhanh, khÃ³a an toÃ n thÃ´ng minh.',
            specs: 'Loáº¡i báº¿p: Báº¿p Ä‘Æ¡n cao cáº¥p\nCÃ´ng suáº¥t: 2200W\nMáº·t kÃ­nh: Schott Ceran (Äá»©c)\nXuáº¥t xá»©: Linh kiá»‡n Äá»©c / Láº¯p rÃ¡p ThÃ¡i Lan',
            featured: true,
            onSale: false,
            isFlashDeal: true,
            flashDealDesc: 'HÃ ng Äá»©c cao cáº¥p giáº£m cá»±c sá»‘c',
            createdAt: '2026-07-06T00:04:00'
        },
        {
            id: 31,
            name: 'Báº¿p há»“ng ngoáº¡i Sunhouse Mama MMB9100VN - Báº¿p Ä‘Ã´i - 3600W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLezxdBy7vtw0cR6ZpGKT42Xl3UToyaaN8ef5FYo_6mg&s=10',
            price: 3490000,
            discount: 0,
            description: 'Báº¿p Ä‘Ã´i há»“ng ngoáº¡i Sunhouse Mama MMB9100VN thiáº¿t káº¿ Ã¢m/dÆ°Æ¡ng linh hoáº¡t. Máº·t kÃ­nh Kanger bo viá»n cao cáº¥p, 2 vÃ¹ng náº¥u riÃªng biá»‡t cÃ´ng suáº¥t tá»•ng 3600W.',
            specs: 'Loáº¡i báº¿p: Báº¿p Ä‘Ã´i Ã¢m/dÆ°Æ¡ng\nCÃ´ng suáº¥t: 3600W (TrÃ¡i: 1800W, Pháº£i: 1800W)\nMáº·t kÃ­nh: Kanger vÃ¡t cáº¡nh\nChá»©c nÄƒng: Inverter tiáº¿t kiá»‡m Ä‘iá»‡n',
            featured: false,
            onSale: false,
            createdAt: '2026-07-06T00:05:00'
        },
        {
            id: 32,
            name: 'Báº¿p há»“ng ngoáº¡i Kangaroo GD732IR - Báº¿p Ä‘Ã´i - 4000W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLSJHhYHRnWKumwq3zlFSN0svRyiD8AXvs9l4r0jL2YA&s=10',
            price: 4200000,
            discount: 0,
            description: 'Báº¿p Ä‘Ã´i láº¯p Ã¢m Kangaroo GD732IR cÃ´ng suáº¥t máº¡nh máº½ 4000W. Háº¹n giá» thÃ´ng minh, tá»± Ä‘á»™ng ngáº¯t khi quÃ¡ nhiá»‡t, tÃ´n lÃªn nÃ©t hiá»‡n Ä‘áº¡i cho gian báº¿p.',
            specs: 'Loáº¡i báº¿p: Báº¿p Ä‘Ã´i Ã¢m\nCÃ´ng suáº¥t: 4000W\nBáº£ng Ä‘iá»u khiá»ƒn: Slide trÆ°á»£t Ä‘á»™c láº­p\nKÃ­ch thÆ°á»›c Ä‘Ã¡ cáº¯t: â‰ˆ 680 Ã— 380mm',
            featured: false,
            onSale: false,
            createdAt: '2026-07-06T00:06:00'
        },
        {
            id: 33,
            name: 'Báº¿p há»“ng ngoáº¡i Canzy CZ 888I - Báº¿p Ä‘Ã´i - 4200W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhmo4OBLImALW5wgsocyE45UgS1P7KkiMutZybIyVWHA&s=10',
            price: 5800000,
            discount: 5,
            description: 'Báº¿p Ä‘Ã´i Canzy CZ 888I sá»­ dá»¥ng mÃ¢m nhiá»‡t E.G.O (Äá»©c) siÃªu bá»n. Máº·t kÃ­nh vÃ¡t cáº¡nh bo viá»n nhÃ´m báº£o vá»‡, cÃ´ng nghá»‡ biáº¿n táº§n tiáº¿t kiá»‡m Ä‘iá»‡n nÄƒng.',
            specs: 'Loáº¡i báº¿p: Báº¿p Ä‘Ã´i Ã¢m\nCÃ´ng suáº¥t: 4200W (Booster)\nMÃ¢m nhiá»‡t: E.G.O Germany\nKhÃ³a tráº» em: CÃ³',
            featured: true,
            onSale: true,
            createdAt: '2026-07-06T00:07:00'
        },
        {
            id: 34,
            name: 'Báº¿p há»“ng ngoáº¡i Malloca MHR 921 - Báº¿p Ä‘Ã´i - 4000W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlcVzN_VVw40nvIPU8ZP0U-dI9pSu2QzjKWDcMKthbig&s=10',
            price: 9200000,
            discount: 0,
            description: 'Báº¿p há»“ng ngoáº¡i Ä‘Ã´i Malloca MHR 921 chuáº©n phong cÃ¡ch TÃ¢y Ban Nha. Máº·t kÃ­nh EuroKera (PhÃ¡p) chá»‹u nhiá»‡t 1000Â°C, báº£ng Ä‘iá»u khiá»ƒn touch-slider hiá»‡n Ä‘áº¡i.',
            specs: 'Loáº¡i báº¿p: Báº¿p Ä‘Ã´i Ã¢m\nCÃ´ng suáº¥t: 4000W\nMáº·t kÃ­nh: EuroKera (KeraResist)\nThÆ°Æ¡ng hiá»‡u: TÃ¢y Ban Nha',
            featured: false,
            onSale: false,
            createdAt: '2026-07-06T00:08:00'
        },
        {
            id: 35,
            name: 'Báº¿p há»“ng ngoáº¡i Bosch PKN645FP1E - Báº¿p 4 vÃ¹ng náº¥u - 6600W',
            categoryId: 6,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROy-Y6K5k_oVe7MUHiCt7KiZaj8F0_BJyXKoQsv6lG6g&s=10',
            price: 11500000,
            discount: 8,
            description: 'Báº¿p há»“ng ngoáº¡i 4 vÃ¹ng náº¥u Bosch PKN645FP1E nháº­p kháº©u Äá»©c. Tá»•ng cÃ´ng suáº¥t 6600W, Ä‘iá»u khiá»ƒn DirectSelect 17 má»©c nhiá»‡t, giáº£i phÃ¡p hoÃ n háº£o cho cÄƒn báº¿p biá»‡t thá»± cao cáº¥p.',
            specs: 'Loáº¡i báº¿p: Báº¿p 4 vÃ¹ng náº¥u\nCÃ´ng suáº¥t: 6600W\nMáº·t kÃ­nh: Schott Ceran bo viá»n Inox\nXuáº¥t xá»©: Äá»©c (Germany)',
            featured: true,
            onSale: true,
            createdAt: '2026-07-06T00:09:00'
        },

        // ===== 7. Báº¿p Gas Ã‚m (6 SP) =====
        {
            id: 36,
            name: 'Báº¿p gas Ã¢m Rinnai RVB-2GI(B) - Báº¿p Ä‘Ã´i - Äáº§u Ä‘á»‘t Ä‘á»“ng thau',
            categoryId: 7,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLNdmNhbK95LNoCFz2DAgrI4sm8JqQoVd-Arjc5VX22A&s=10',
            price: 2850000,
            discount: 0,
            description: 'Báº¿p gas Ã¢m Rinnai RVB-2GI(B) trang bá»‹ máº·t kÃ­nh cÆ°á»ng lá»±c Ä‘en tuyá»n. Äáº§u Ä‘á»‘t báº±ng Ä‘á»“ng thau siÃªu bá»n, cho ngá»n lá»­a xoÃ¡y táº­p trung Ä‘Ã¡y ná»“i, tiáº¿t kiá»‡m gas.',
            specs: 'Sá»‘ lÃ² náº¥u: 2 lÃ²\nÄáº§u Ä‘á»‘t: Äá»“ng thau Ä‘Ãºc nguyÃªn khá»‘i\nÄÃ¡nh lá»­a: Pin IC 1.5V\nNgáº¯t gas tá»± Ä‘á»™ng: CÃ³',
            featured: true,
            onSale: false,
            createdAt: '2026-07-07T00:00:00'
        },
        {
            id: 37,
            name: 'Báº¿p gas Ã¢m Paloma PA-209J - Báº¿p Ä‘Ã´i - Cáº£m á»©ng ngáº¯t gas tá»± Ä‘á»™ng',
            categoryId: 7,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDSZb6Cg3qzWdLjJBBKm0XWkMKGxuulID7h7ONdEgs1g&s=10',
            price: 3600000,
            discount: 0,
            description: 'Báº¿p gas Ã¢m Paloma PA-209J nháº­p kháº©u Nháº­t Báº£n. Cá»¥m cáº£m á»©ng ngáº¯t gas tá»± Ä‘á»™ng khi trÃ n nÆ°á»›c hoáº·c giÃ³ thá»•i táº¯t báº¿p, an toÃ n tuyá»‡t Ä‘á»‘i cho ngÆ°á»i dÃ¹ng.',
            specs: 'Sá»‘ lÃ² náº¥u: 2 lÃ²\nXuáº¥t xá»©: Nháº­t Báº£n\nMáº·t báº¿p: KÃ­nh cÆ°á»ng lá»±c chá»‹u lá»±c 8mm\nLÆ°á»£ng gas tiÃªu thá»¥: 0.43kg/h',
            featured: false,
            onSale: false,
            createdAt: '2026-07-07T00:01:00'
        },
        {
            id: 38,
            name: 'Báº¿p gas Ã¢m Electrolux EGG7627S - Báº¿p Ä‘Ã´i - MÃ¢m chia lá»­a SABAF',
            categoryId: 7,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2VXY2znTJTjR3aGTMUR8B1juCd4_JUJwMUu641NpD2w&s=10',
            price: 3290000,
            discount: 0,
            description: 'Electrolux EGG7627S mang thiáº¿t káº¿ ChÃ¢u Ã‚u sang trá»ng. MÃ¢m chia lá»­a SABAF (Ã) cho ngá»n lá»­a xÃ²e Ä‘á»u, Ä‘Ã¡nh lá»­a báº±ng pin IC siÃªu nháº¡y.',
            specs: 'Sá»‘ lÃ² náº¥u: 2 lÃ²\nMÃ¢m chia lá»­a: SABAF (Nháº­p kháº©u Ã)\nKiá»ng báº¿p: Gang Ä‘Ãºc\nThÆ°Æ¡ng hiá»‡u: Thá»¥y Äiá»ƒn',
            featured: false,
            onSale: false,
            createdAt: '2026-07-07T00:02:00'
        },
        {
            id: 39,
            name: 'Báº¿p gas Ã¢m Sunhouse SHB5536 - Báº¿p Ä‘Ã´i - Kiá»ng gang Ä‘Ãºc chá»‘ng trÆ°á»£t',
            categoryId: 7,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMoVyKRj25gjwjfUv1YeR1QQ-OjRT10VrNXH3gXs8wFA&s=10',
            price: 2150000,
            discount: 15,
            description: 'Báº¿p gas Ã¢m Sunhouse SHB5536 trang bá»‹ kiá»ng gang Ä‘Ãºc nguyÃªn khá»‘i siÃªu bá»n, chá»‘ng trÆ¡n trÆ°á»£t ná»“i cháº£o. Máº·t kÃ­nh cÆ°á»ng lá»±c dÃ y 8mm chá»‹u lá»±c cá»±c tá»‘t.',
            specs: 'Sá»‘ lÃ² náº¥u: 2 lÃ²\nMáº·t kÃ­nh: KÃ­nh cÆ°á»ng lá»±c dÃ y 8mm\nCá»¥m kim phun: Äá»“ng thau\nHá»‡ thá»‘ng Ä‘Ã¡nh lá»­a: Magneto / IC',
            featured: false,
            onSale: true,
            createdAt: '2026-07-07T00:03:00'
        },
        {
            id: 40,
            name: 'Báº¿p gas Ã¢m Canzy CZ-102 - Báº¿p Ä‘Ã´i - Khay inox 304 cÃ³ cháº¿ Ä‘á»™ háº§m',
            categoryId: 7,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoT56q6Imn1ln6VO_0E_Gxgxcb9jKYbeBEOd06xCpH4A&s=10',
            price: 2450000,
            discount: 0,
            description: 'Canzy CZ-102 sá»Ÿ há»¯u khay Inox 304 khÃ´ng gá»‰ sÃ¡ng bÃ³ng. TÃ­ch há»£p cháº¿ Ä‘á»™ pÃ©p háº§m tiáº¿t kiá»‡m gas, thÃ­ch há»£p cho cÃ¡c mÃ³n ninh, háº§m thá»i gian dÃ i.',
            specs: 'Sá»‘ lÃ² náº¥u: 2 lÃ²\nKhay há»©ng: Inox 304 chá»‘ng gá»‰\nTÃ­nh nÄƒng: CÃ³ pÃ©p háº§m tiáº¿t kiá»‡m gas\nÄÃ¡nh lá»­a: Pin 1.5V',
            featured: false,
            onSale: false,
            createdAt: '2026-07-07T00:04:00'
        },
        {
            id: 41,
            name: 'Báº¿p gas Ã¢m Malloca DSG 732 - Báº¿p Ä‘Ã´i - KÃ­nh cÆ°á»ng lá»±c vÃ¡t cáº¡nh 8mm',
            categoryId: 7,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg5t3EqBjSEo9IzkQQtzHg3P3HEeSYtNtfexUtHnQcbg&s=10',
            price: 4800000,
            discount: 0,
            description: 'Báº¿p gas Ã¢m cao cáº¥p Malloca DSG 732 vá»›i máº·t kÃ­nh cÆ°á»ng lá»±c vÃ¡t cáº¡nh 8mm tinh táº¿. Cháº¿ Ä‘á»™ ngáº¯t gas tá»± Ä‘á»™ng van kim an toÃ n, kiá»ng tháº¿ há»‡ má»›i chá»‘ng va Ä‘áº­p.',
            specs: 'Sá»‘ lÃ² náº¥u: 2 lÃ²\nMáº·t kÃ­nh: KÃ­nh cÆ°á»ng lá»±c vÃ¡t cáº¡nh 8mm\nCáº£m á»©ng ngáº¯t gas: Van kim tá»± Ä‘á»™ng\nThÆ°Æ¡ng hiá»‡u: Malloca',
            featured: false,
            onSale: false,
            createdAt: '2026-07-07T00:05:00'
        },

        // ===== 8. Phá»¥ Kiá»‡n (Van, DÃ¢y) (6 SP) =====
        {
            id: 42,
            name: 'Van ngáº¯t gas tá»± Ä‘á»™ng Namilux NA-337S (Van ngang)',
            categoryId: 8,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF4eu_DgVyBuhH6pl1lpYTFCWrZJoYE55On5OipJvciA&s',
            price: 220000,
            discount: 0,
            description: 'Van ngang Namilux NA-337S tÃ­ch há»£p rÆ¡-le ngáº¯t gas tá»± Ä‘á»™ng khi phÃ¡t hiá»‡n sá»± cá»‘ rÃ² rá»‰ hoáº·c tuá»™t dÃ¢y. ThÃ¢n van Ä‘Ãºc báº±ng há»£p kim káº½m nguyÃªn khá»‘i chá»‘ng gá»‰.',
            specs: 'Loáº¡i van: Van ngang ngáº¯t tá»± Ä‘á»™ng\nCháº¥t liá»‡u: Há»£p kim káº½m nguyÃªn khá»‘i\nÃp suáº¥t Ä‘áº§u vÃ o: 0.7 - 7kg/cmÂ²\nÃp suáº¥t Ä‘áº§u ra: 350 Â± 50mm Hâ‚‚O',
            featured: false,
            onSale: false,
            createdAt: '2026-07-08T00:00:00'
        },
        {
            id: 43,
            name: 'Van chá»¥p gas Namilux NA-345S (Van chá»¥p)',
            categoryId: 8,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST1qawQCA6UDSMUK5JX2QrL_n8TsACg1hFkUHZIqJe0w&s=10',
            price: 260000,
            discount: 0,
            description: 'Van chá»¥p Namilux NA-345S chuyÃªn dá»¥ng cho cÃ¡c bÃ¬nh gas van chá»¥p (Gia ÄÃ¬nh, Petrolimex, Elf). Thao tÃ¡c khÃ³a/má»Ÿ báº±ng nÃºt báº¥m an toÃ n, báº£o vá»‡ tá»‘i Ä‘a cho chung cÆ°.',
            specs: 'Loáº¡i van: Van chá»¥p (Compact 20mm)\nTÃ­nh nÄƒng: Ngáº¯t gas tá»± Ä‘á»™ng\nÃp suáº¥t xáº£: TiÃªu chuáº©n an toÃ n PCCC',
            featured: false,
            onSale: false,
            createdAt: '2026-07-08T00:01:00'
        },
        {
            id: 44,
            name: 'Van gas cao cáº¥p Katsura V-2S (Van ngang)',
            categoryId: 8,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmLJ_1_CuDJRJn1tFhOc4-7W_7FK4pAL7uRRaQePYMzw&s',
            price: 380000,
            discount: 0,
            description: 'Van gas Katsura V-2S sáº£n xuáº¥t theo cÃ´ng nghá»‡ JIS Nháº­t Báº£n. Äá»™ bá»n trÃªn 10 nÄƒm, cÆ¡ cháº¿ xáº£ Ã¡p tá»± Ä‘á»™ng chá»‘ng chÃ¡y ná»• tuyá»‡t Ä‘á»‘i.',
            specs: 'Xuáº¥t xá»©: CÃ´ng nghá»‡ Nháº­t Báº£n (JIS Standard)\nLoáº¡i van: Van ngang cao cáº¥p\nTuá»•i thá» thiáº¿t káº¿: > 10 nÄƒm',
            featured: false,
            onSale: false,
            createdAt: '2026-07-08T00:02:00'
        },
        {
            id: 45,
            name: 'DÃ¢y dáº«n gas chá»‘ng chuá»™t Namilux (DÃ¢y bá»c inox)',
            categoryId: 8,
            image: 'https://gasleminh.com/wp-content/uploads/2022/10/screenshot_1677840360.png',
            price: 120000,
            discount: 0,
            description: 'DÃ¢y dáº«n gas Namilux 3 lá»›p cao cáº¥p, bÃªn ngoÃ i bá»c vá» lÃ² xo inox sÃ¡ng bÃ³ng chá»‘ng chuá»™t, giÃ¡n cáº¯n Ä‘á»©t. Chá»‹u Ä‘Æ°á»£c Ã¡p suáº¥t cá»±c cao vÃ  khÃ´ng bá»‹ gáº­p dÃ¢y.',
            specs: 'Chiá»u dÃ i: 1.5m\nCáº¥u táº¡o: 3 lá»›p (Cao su PVC + LÆ°á»›i sá»£i Nilon + Vá» lÃ² xo Inox)\nTá»± Ä‘á»™ng chá»‘ng chuá»™t: 100%',
            featured: false,
            onSale: false,
            createdAt: '2026-07-08T00:03:00'
        },
        {
            id: 46,
            name: 'DÃ¢y dáº«n gas HÃ n Quá»‘c Kogas (DÃ¢y lÃµi thÃ©p)',
            categoryId: 8,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqfHS6yU1Lf0Kzd2NSmypWEUq3NonkZJqRq3bqgw_W3g&s=10',
            price: 180000,
            discount: 0,
            description: 'DÃ¢y gas Kogas nháº­p kháº©u HÃ n Quá»‘c cáº¥u táº¡o tá»« cao su lÆ°u hÃ³a cao cáº¥p tÃ­ch há»£p lÆ°á»›i lÃµi thÃ©p dáº»o dai. Kháº£ nÄƒng chá»‘ng chÃ¡y, chá»‘ng Äƒn mÃ²n hÃ³a cháº¥t vÆ°á»£t trá»™i.',
            specs: 'Xuáº¥t xá»©: HÃ n Quá»‘c (Kogas)\nCáº¥u táº¡o: Cao su lÆ°u hÃ³a + LÆ°á»›i thÃ©p gia cÆ°á»ng\nÃp suáº¥t ná»•: > 10bar',
            featured: false,
            onSale: false,
            createdAt: '2026-07-08T00:04:00'
        },
        {
            id: 47,
            name: 'Bá»™ combo van dÃ¢y ngáº¯t tá»± Ä‘á»™ng Namilux',
            categoryId: 8,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC76n9joZyiYn9x2HaCsiIhcXU1R5KtawvTFBnmiD4Tw&s=10',
            price: 320000,
            discount: 10,
            description: 'Trá»n bá»™ Combo gá»“m 01 Van ngáº¯t gas tá»± Ä‘á»™ng Namilux + 01 DÃ¢y dáº«n gas chá»‘ng chuá»™t + 02 Äai siáº¿t inox. Giáº£i phÃ¡p an toÃ n Ä‘á»“ng bá»™, tiáº¿t kiá»‡m chi phÃ­ cho gia Ä‘Ã¬nh.',
            specs: 'Trá»n bá»™ gá»“m: 1 Van tá»± Ä‘á»™ng NA-337S + 1 DÃ¢y bá»c Inox 1.5m + 2 Äai siáº¿t Inox\nThÆ°Æ¡ng hiá»‡u: Namilux chÃ­nh hÃ£ng',
            featured: false,
            onSale: true,
            createdAt: '2026-07-08T00:05:00'
        },
        // ===== 9. Combo Khuyáº¿n MÃ£i (9 SP) =====
        {
            id: 101,
            name: 'Combo Báº¿p Gas ÄÃ´i + Bá»™ Van DÃ¢y Nháº­t Báº£n',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJZ-HwOA8Qu2AZHWWU-XTK5yHB9PH-uOD2m-f-7ORBEg&s=10',
            price: 690000,
            discount: 22,
            description: 'Combo hoÃ n háº£o cho gia Ä‘Ã¬nh báº¯t Ä‘áº§u lÃ m báº¿p má»›i. Bao gá»“m báº¿p gas Ä‘Ã´i máº·t kÃ­nh cÆ°á»ng lá»±c chá»‹u nhiá»‡t cao, Ä‘i kÃ¨m bá»™ van ngáº¯t gas tá»± Ä‘á»™ng Katsura cÃ´ng nghá»‡ Nháº­t Báº£n vÃ  dÃ¢y dáº«n gas chá»‘ng chuá»™t 3 lá»›p, Ä‘áº£m báº£o an toÃ n tuyá»‡t Ä‘á»‘i chá»‘ng rÃ² rá»‰.',
            specs: 'Trá»n bá»™ gá»“m: 01 Báº¿p gas Ä‘Ã´i máº·t kÃ­nh + 01 Van ngáº¯t tá»± Ä‘á»™ng Katsura + 01 DÃ¢y gas bá»c inox 1.5m\nMáº·t báº¿p: KÃ­nh cÆ°á»ng lá»±c vÃ¡t cáº¡nh 7mm\nHá»‡ thá»‘ng Ä‘Ã¡nh lá»­a: Magneto',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:01:00'
        },
        {
            id: 102,
            name: 'Combo Báº¿p Gas ÄÆ¡n Inox + BÃ¬nh Gas 12kg',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgPLowpg8EgN0ym9AefcONTThVfm5x0unJW2QR82qg2A&s=10',
            price: 490000,
            discount: 25,
            description: 'Äá»•i bÃ¬nh gas chÃ­nh hÃ£ng Petrolimex/Saigon Petro 12kg nháº­n ngay bá»™ van dÃ¢y an toÃ n. Äáº·c biá»‡t phÃ¹ há»£p cho khÃ¡ch hÃ ng cÃ³ nhu cáº§u thay tháº¿ bá»™ van dÃ¢y Ä‘Ã£ quÃ¡ háº¡n sá»­ dá»¥ng (trÃªn 2 nÄƒm) Ä‘á»ƒ phÃ²ng chá»‘ng chÃ¡y ná»•.',
            specs: 'Trá»n bá»™ gá»“m: 01 BÃ¬nh gas 12kg (Äá»•i khÃ­) + 01 Bá»™ van dÃ¢y tá»± Ä‘á»™ng Namilux\nChá»©ng nháº­n an toÃ n: CÃ³ báº£o hiá»ƒm trÃ¡ch nhiá»‡m 2 tá»· Ä‘á»“ng\nThá»i háº¡n sá»­ dá»¥ng khuyÃªn dÃ¹ng cho van dÃ¢y: 24 thÃ¡ng',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:02:00'
        },
        {
            id: 103,
            name: 'Combo Báº¿p Äiá»‡n Tá»« Há»“ng Ngoáº¡i + Cháº£o Chá»‘ng DÃ­nh',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuK9j6B8dhfrG0PqePi9Yg0eFpfTFqaO8TTC-bo3GZsA&s',
            price: 350000,
            discount: 22,
            description: 'Tiá»‡n lá»£i tá»‘i Ä‘a cho nhá»¯ng chuyáº¿n dÃ£ ngoáº¡i, sinh viÃªn á»Ÿ trá» hoáº·c Äƒn láº©u táº¡i nhÃ . Báº¿p gas mini Namilux vá»›i van an toÃ n Inline-Cut ngáº¯t gas trá»±c tiáº¿p tá»« bÃªn trong, kÃ¨m theo 5 lon gas mini Maxsun chÃ­nh hÃ£ng.',
            specs: 'Trá»n bá»™ gá»“m: 01 Báº¿p gas mini Namilux + 05 Lon gas mini Maxsun 250g\nCÃ´ng suáº¥t: 2.4 kW (2,050 kcal/h)\nTÃ­nh nÄƒng an toÃ n: Van ngáº¯t gas Inline-Cut (chá»‘ng ná»• lon gas)\nCháº¥t liá»‡u báº¿p: ThÃ©p sÆ¡n tÄ©nh Ä‘iá»‡n chá»‘ng gá»‰',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:03:00'
        },
        {
            id: 104,
            name: 'Combo BÃ¬nh ga Báº¿p Gas ÄÃ´i Van DÃ¢y Tá»± Äá»™ng',
            categoryId: 9,
            image: 'https://giadoibinhgaspetro6kg12kg45kg.com.vn/upload/elfinder/B%E1%BB%99%20b%C3%ACnh%20b%E1%BA%BFp%20%C4%91%C6%A1n/HIKUSHI.png',
            price: 790000,
            discount: 20,
            description: 'Giáº£i phÃ¡p toÃ n diá»‡n vÃ  cá»±c ká»³ tiáº¿t kiá»‡m cho sinh viÃªn, cÃ´ng nhÃ¢n hoáº·c gia Ä‘Ã¬nh 1-2 ngÆ°á»i. Mua 1 láº§n cÃ³ ngay trá»n bá»™ báº¿p vÃ  gas Ä‘á»ƒ náº¥u nÆ°á»›ng ngay láº­p tá»©c mÃ  khÃ´ng phÃ¡t sinh thÃªm chi phÃ­.',
            specs: 'Trá»n bá»™ gá»“m: 01 Báº¿p gas Ä‘Æ¡n máº·t inox + 01 BÃ¬nh gas 12kg + 01 Bá»™ van dÃ¢y an toÃ n\nCháº¥t liá»‡u máº·t báº¿p: Inox 304 khÃ´ng gá»‰ dá»… lau chÃ¹i\nLoáº¡i bÃ¬nh gas: TÃ¹y chá»n Saigon Petro / Gia ÄÃ¬nh / Pacific',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:04:00'
        },
        {
            id: 105,
            name: 'Combo Báº¿p Gas Ã‚m + Bá»™ Dao Thá»›t Cao Cáº¥p',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkxeq4ZkPtSTy1DiPFelccBrQnRu2l0_jYIi1jh9AlBA&s=10',
            price: 890000,
            discount: 25,
            description: 'á»¨ng dá»¥ng cÃ´ng nghá»‡ Ä‘áº§u Ä‘á»‘t há»“ng ngoáº¡i báº±ng gá»‘m Ceramic, Ä‘á»‘t chÃ¡y 100% lÆ°á»£ng gas tiÃªu thá»¥, khÃ´ng Ä‘en Ä‘Ã¡y ná»“i, khÃ´ng sá»£ giÃ³ thá»•i táº¯t lá»­a. Táº·ng kÃ¨m bá»™ 3 ná»“i Inox cao cáº¥p.',
            specs: 'Trá»n bá»™ gá»“m: 01 Báº¿p gas há»“ng ngoáº¡i Ä‘Ã´i + 01 Bá»™ 3 ná»“i Inox 430\nÄáº§u Ä‘á»‘t: Gá»‘m Ceramic há»“ng ngoáº¡i tiáº¿t kiá»‡m 30% gas\nMáº·t kÃ­nh: CÆ°á»ng lá»±c chá»‹u nhiá»‡t 700 Ä‘á»™ C',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:05:00'
        },
        {
            id: 106,
            name: 'Combo Äá»•i BÃ¬nh Gas 12kg + Thay DÃ¢y Van Má»›i',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoc3XBxNLZJVEWBA63ivUypqw-JxVHZLMKIyuksaXKfg&s',
            price: 1050000,
            discount: 22,
            description: 'Giáº£i phÃ¡p xÃ o náº¥u lá»­a lá»›n dÃ nh cho quÃ¡n Äƒn, nhÃ  hÃ ng Ã. Báº¿p khÃ¨ cÃ´ng nghiá»‡p cÃ¡n trung/cÃ¡n dÃ i cho ngá»n lá»­a xanh cá»±c máº¡nh, Ä‘i kÃ¨m van gas cao Ã¡p vÃ  dÃ¢y dáº«n chá»‹u lá»±c chá»‘ng chÃ¡y ná»•.',
            specs: 'Trá»n bá»™ gá»“m: 01 Báº¿p khÃ¨ cÃ´ng nghiá»‡p + 01 Van gas cao Ã¡p + 01 DÃ¢y gas cÃ´ng nghiá»‡p\nHá»‡ thá»‘ng Ä‘Ã¡nh lá»­a: Magneto Ä‘áº­p cá»±c nháº¡y\nCá»¥m Ä‘áº§u Ä‘á»‘t: Gang Ä‘Ãºc nguyÃªn khá»‘i chá»‹u nhiá»‡t cao\nNhiÃªn liá»‡u: Gas LPG Ã¡p cao',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:06:00'
        },
        {
            id: 107,
            name: 'Combo Báº¿p Há»“ng Ngoáº¡i + Ná»“i Láº©u Mini',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTstmIhceJ2flda51V8rVEiJp9t37h4Qc9Y9QeRlITOFQ&s',
            price: 650000,
            discount: 23,
            description: 'Giáº£i phÃ¡p thay tháº¿ an toÃ n cho báº¿p gas sinh viÃªn. Báº¿p tá»« Ä‘Æ¡n cÃ´ng suáº¥t lá»›n Ä‘un sÃ´i nÆ°á»›c chá»‰ trong 3 phÃºt, máº·t kÃ­nh pha lÃª dá»… lau chÃ¹i. Táº·ng kÃ¨m cháº£o chá»‘ng dÃ­nh Ä‘Ã¡y tá»« tiá»‡n dá»¥ng.',
            specs: 'Trá»n bá»™ gá»“m: 01 Báº¿p Ä‘iá»‡n tá»« Ä‘Æ¡n + 01 Cháº£o chá»‘ng dÃ­nh 24cm\nCÃ´ng suáº¥t: 2000W\nBáº£ng Ä‘iá»u khiá»ƒn: Cáº£m á»©ng cháº¡m (Touch Control) vá»›i 8 cháº¿ Ä‘á»™ náº¥u\nTÃ­nh nÄƒng: Háº¹n giá», khÃ³a tráº» em, tá»± ngáº¯t khi quÃ¡ nhiá»‡t',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:07:00'
        },
        {
            id: 108,
            name: 'Combo Báº¿p Tá»« ÄÃ´i + Táº·ng Bá»™ Ná»“i Inox 5 MÃ³n',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROwTl-FcMBOKZNOTiQNVJTBLqfxAiKcHffqAKyHgM4Zw&s=10',
            price: 5490000,
            discount: 20,
            description: 'Báº¿p tá»« Ä‘Ã´i cao cáº¥p cÃ´ng nghá»‡ Inverter tiáº¿t kiá»‡m 35% Ä‘iá»‡n nÄƒng. Thiáº¿t káº¿ bo viá»n nhÃ´m chá»‘ng va Ä‘áº­p gÃ³c kÃ­nh. Táº·ng trá»n bá»™ ná»“i Inox 3 Ä‘Ã¡y Ä‘un tá»« 5 mÃ³n cao cáº¥p Ä‘Ã¡p á»©ng má»i nhu cáº§u náº¥u nÆ°á»›ng.',
            specs: 'Trá»n bá»™ gá»“m: 01 Báº¿p tá»« Ä‘Ã´i + 01 Bá»™ ná»“i Inox 304 (5 mÃ³n)\nCÃ´ng suáº¥t: 4200W (Dual Booster)\nMáº·t kÃ­nh: Schott Ceran (Äá»©c) bo viá»n kim loáº¡i\nCÃ´ng nghá»‡: Inverter thÃ´ng minh duy trÃ¬ nhiá»‡t liu riu',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:08:00'
        },
        {
            id: 109,
            name: 'Combo Báº¿p KhÃ¨ CÃ´ng Nghiá»‡p + Van Cao Ãp',
            categoryId: 9,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhKuGhKtxMfgacnPk3zIkjIQ0XWS8T_5zMP1qW8cRTew&s',
            price: 3990000,
            discount: 23,
            description: 'Bá»™ Ä‘Ã´i khÃ´ng thá»ƒ thiáº¿u cho khÃ´ng gian báº¿p hiá»‡n Ä‘áº¡i. Báº¿p gas Ã¢m 2 lÃ² náº¥u máº·t kÃ­nh sang trá»ng káº¿t há»£p mÃ¡y hÃºt mÃ¹i kÃ­nh cong cÃ´ng suáº¥t hÃºt lá»›n, Ä‘Ã¡nh bay má»i mÃ¹i dáº§u má»¡.',
            specs: 'Trá»n bá»™ gá»“m: 01 Báº¿p gas Ã¢m (PÃ©p Ä‘á»“ng thau) + 01 MÃ¡y hÃºt mÃ¹i kÃ­nh cong 70cm\nCÃ´ng suáº¥t hÃºt mÃ¹i: 1000 m3/h\nKÃ­ch thÆ°á»›c khoÃ©t Ä‘Ã¡ báº¿p Ã¢m: 680 x 380 mm\nÄá»™ng cÆ¡ hÃºt mÃ¹i: Tuabin Ä‘Ã´i lÃµi Ä‘á»“ng 100%',
            featured: true,
            onSale: true,
            createdAt: '2026-07-29T00:09:00'
        }
    ];

    const defaultSettings = {
        hotline: '1900.123.123',
        zalo: '0901.111.222',
        address: '123 Thá»§ Äá»©c, Há»“ ChÃ­ Minh',
        logo: 'assets/logo/logo_primary_gas - Copy.png'
    };

    // ========== HELPERS ==========
    function _getSettings() {
        try {
            return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || defaultSettings;
        } catch { return defaultSettings; }
    }

    function _saveSettings(settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    function _getProducts() {
        try {
            const items = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
            return items.map(p => {
                if (p.slug && p.slug.startsWith('cat-')) p.slug = p.slug.replace(/^cat-/, '');
                if (!p.slug) p.slug = _generateSlug(p.name);
                return p;
            });
        } catch { return []; }
    }

    function _saveProducts(products) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }

    function _getCategories() {
        try {
            const items = JSON.parse(localStorage.getItem(CATEGORIES_KEY)) || [];
            return items.map(c => {
                if (c.slug && c.slug.startsWith('cat-')) c.slug = c.slug.replace(/^cat-/, '');
                if (!c.slug) c.slug = _generateSlug(c.name);
                return c;
            });
        } catch { return []; }
    }

    function _saveCategories(categories) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }

    function _getNewsCategories() {
        try {
            const items = JSON.parse(localStorage.getItem(NEWS_CATEGORIES_KEY)) || [];
            return items.map(c => {
                if (c.slug && c.slug.startsWith('cat-')) c.slug = c.slug.replace(/^cat-/, '');
                if (!c.slug) c.slug = _generateSlug(c.name);
                return c;
            });
        } catch { return []; }
    }

    function _saveNewsCategories(categories) {
        localStorage.setItem(NEWS_CATEGORIES_KEY, JSON.stringify(categories));
    }

    function _getNews() {
        try {
            const items = JSON.parse(localStorage.getItem(NEWS_KEY)) || [];
            return items.map(n => {
                if (n.slug && n.slug.startsWith('cat-')) n.slug = n.slug.replace(/^cat-/, '');
                if (!n.slug) n.slug = _generateSlug(n.title);
                return n;
            });
        } catch { return []; }
    }

    function _saveNews(newsList) {
        localStorage.setItem(NEWS_KEY, JSON.stringify(newsList));
    }

    function _nextNewsId() {
        const news = _getNews();
        if (news.length === 0) return 1;
        return Math.max(...news.map(n => n.id)) + 1;
    }

    function _generateSlug(name) {
        return String(name || '')
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/Ä‘/g, 'd').replace(/Ä/g, 'D')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    function _nextProductId() {
        const products = _getProducts();
        if (products.length === 0) return 1;
        return Math.max(...products.map(p => p.id)) + 1;
    }

    function _nextCategoryId() {
        const cats = _getCategories();
        if (cats.length === 0) return 1;
        return Math.max(...cats.map(c => c.id)) + 1;
    }

    function _nextNewsCategoryId() {
        const cats = _getNewsCategories();
        if (cats.length === 0) return 1;
        return Math.max(...cats.map(c => c.id)) + 1;
    }

    function _formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'Ä‘';
    }

    function _shuffleArray(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // ========== PUBLIC API ==========
    return {
        /**
         * Initialize database asynchronously with API
         */
        async initAsync() {
            try {
                // Try to load from API
                const response = await fetch('api.php');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.products) {
                        _saveProducts(data.products);
                        _saveCategories(data.categories || []);
                        if (data.settings) _saveSettings(data.settings);
                        if (data.news) _saveNews(data.news);
                        if (data.newsCategories) _saveNewsCategories(data.newsCategories);
                        console.log('[ProductDB] Loaded from API.');
                        document.dispatchEvent(new Event('ProductDBReady'));
                        return;
                    }
                }
            } catch (e) {
                console.log('[ProductDB] API fetch failed, using local/seed data.', e);
            }

            // Fallback: Use LocalStorage or Seed data if API fails
            if (!localStorage.getItem(INIT_KEY)) {
                _saveCategories(seedCategories);
                _saveProducts(seedProducts);
                _saveSettings(defaultSettings);
                _saveNews(seedNews);
                _saveNewsCategories(seedNewsCategories);
                localStorage.setItem(INIT_KEY, 'true');
                console.log('[ProductDB] Initialized with seed data.');
                // Push initial seed data to API so it creates the data.json
                this.syncToApi();
            } else {
                let nc = _getNewsCategories();
                if (nc.length === 0) {
                    _saveNewsCategories(seedNewsCategories);
                } else {
                    let updated = false;
                    nc = nc.map(c => {
                        if (!c.seoDesc) {
                            const seed = seedNewsCategories.find(s => s.id === c.id);
                            if (seed) {
                                c.seoDesc = seed.seoDesc;
                                updated = true;
                            }
                        }
                        return c;
                    });
                    if (updated) {
                        _saveNewsCategories(nc);
                        this.syncToApi();
                    }
                }
                if (_getNews().length === 0) {
                    _saveNews(seedNews);
                }

                // MIGRATION: Ensure seed flash deals are set for existing DB
                let prods = _getProducts();
                let pUpdated = false;
                if (!prods.some(p => p.isFlashDeal)) {
                    prods = prods.map(p => {
                        const seed = seedProducts.find(s => s.id === p.id);
                        if (seed && seed.isFlashDeal) {
                            p.isFlashDeal = true;
                            p.flashDealDesc = seed.flashDealDesc;
                            pUpdated = true;
                        }
                        return p;
                    });
                    if (pUpdated) {
                        _saveProducts(prods);
                        this.syncToApi();
                    }
                }
            }
            document.dispatchEvent(new Event('ProductDBReady'));
        },

        /**
         * Sync local data to API
         */
        async syncToApi() {
            try {
                await fetch('api.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        products: _getProducts(),
                        categories: _getCategories(),
                        settings: _getSettings(),
                        news: _getNews(),
                        newsCategories: _getNewsCategories()
                    })
                });
                console.log('[ProductDB] Synced to API.');
            } catch (e) {
                console.error('[ProductDB] Failed to sync to API', e);
            }
        },

        /**
         * Force re-seed (useful for reset)
         */
        reset() {
            localStorage.removeItem(INIT_KEY);
            localStorage.removeItem(PRODUCTS_KEY);
            localStorage.removeItem(CATEGORIES_KEY);
            localStorage.removeItem(SETTINGS_KEY);
            localStorage.removeItem(NEWS_KEY);
            localStorage.removeItem(NEWS_CATEGORIES_KEY);
            this.initAsync();
        },

        // ===== PRODUCT CRUD =====
        getAll(isAdmin = false) {
            const products = _getProducts();
            if (isAdmin) return products;
            return products.filter(p => p.active !== false);
        },

        getById(id) {
            return _getProducts().find(p => p.id === parseInt(id));
        },

        getBySlug(slug) {
            return _getProducts().find(p => 
                (p.slug === slug) || 
                (_generateSlug(p.name) === slug) || 
                (p.id.toString() === slug)
            );
        },

        getByCategory(categoryId, isAdmin = false) {
            const products = _getProducts().filter(p => p.categoryId === parseInt(categoryId));
            if (isAdmin) return products;
            return products.filter(p => p.active !== false);
        },

        add(product) {
            const products = _getProducts();
            const newProduct = {
                ...product,
                id: _nextProductId(),
                price: parseInt(product.price) || 0,
                discount: parseInt(product.discount) || 0,
                categoryId: parseInt(product.categoryId),
                featured: !!product.featured,
                onSale: !!product.onSale,
                isSaleOff50: !!product.isSaleOff50,
                active: product.active !== false,
                seoTitle: product.seoTitle || '',
                seoDesc: product.seoDesc || '',
                slug: product.slug || '',
                createdAt: new Date().toISOString()
            };
            products.push(newProduct);
            _saveProducts(products);
            this.syncToApi();
            return newProduct;
        },

        update(id, data) {
            const products = _getProducts();
            const index = products.findIndex(p => p.id === parseInt(id));
            if (index === -1) return null;
            products[index] = {
                ...products[index],
                ...data,
                id: parseInt(id),
                price: parseInt(data.price) || products[index].price,
                discount: parseInt(data.discount) || 0,
                categoryId: parseInt(data.categoryId) || products[index].categoryId,
                featured: !!data.featured,
                onSale: !!data.onSale,
                isSaleOff50: data.isSaleOff50 !== undefined ? !!data.isSaleOff50 : !!products[index].isSaleOff50,
                isFlashDeal: data.isFlashDeal !== undefined ? !!data.isFlashDeal : !!products[index].isFlashDeal,
                flashDealDesc: data.flashDealDesc !== undefined ? data.flashDealDesc : (products[index].flashDealDesc || ''),
                flashDealPrice: data.flashDealPrice !== undefined ? parseInt(data.flashDealPrice) : (products[index].flashDealPrice || 0),
                active: data.active !== false,
                seoTitle: data.seoTitle !== undefined ? data.seoTitle : (products[index].seoTitle || ''),
                seoDesc: data.seoDesc !== undefined ? data.seoDesc : (products[index].seoDesc || ''),
                slug: data.slug !== undefined ? data.slug : (products[index].slug || '')
            };
            _saveProducts(products);
            this.syncToApi();
            return products[index];
        },

        delete(id) {
            const products = _getProducts();
            const filtered = products.filter(p => p.id !== parseInt(id));
            if (filtered.length === products.length) return false;
            _saveProducts(filtered);
            this.syncToApi();
            return true;
        },

        // ===== CATEGORY CRUD =====
        getCategories() {
            return _getCategories();
        },

        getCategoryById(id) {
            return _getCategories().find(c => c.id === parseInt(id));
        },

        getCategoryBySlug(slug) {
            return _getCategories().find(c => c.slug === slug);
        },

        addCategory(category) {
            const cats = _getCategories();
            const newCat = {
                id: _nextCategoryId(),
                name: category.name,
                slug: category.slug || _generateSlug(category.name),
                seoDesc: category.seoDesc || ''
            };
            cats.push(newCat);
            _saveCategories(cats);
            this.syncToApi();
            return newCat;
        },

        updateCategory(id, data) {
            const cats = _getCategories();
            const index = cats.findIndex(c => c.id === parseInt(id));
            if (index === -1) return null;
            cats[index] = {
                ...cats[index],
                name: data.name || cats[index].name,
                slug: data.slug || _generateSlug(data.name || cats[index].name),
                seoDesc: data.seoDesc !== undefined ? data.seoDesc : (cats[index].seoDesc || '')
            };
            _saveCategories(cats);
            this.syncToApi();
            return cats[index];
        },

        deleteCategory(id) {
            const products = _getProducts();
            const hasProducts = products.some(p => p.categoryId === parseInt(id));
            if (hasProducts) return { success: false, message: 'KhÃ´ng thá»ƒ xÃ³a danh má»¥c cÃ³ sáº£n pháº©m!' };
            const cats = _getCategories();
            const filtered = cats.filter(c => c.id !== parseInt(id));
            if (filtered.length === cats.length) return { success: false, message: 'Danh má»¥c khÃ´ng tá»“n táº¡i!' };
            _saveCategories(filtered);
            this.syncToApi();
            return { success: true };
        },

        toggleFlashDeal(id, isFlashDeal) {
            const products = _getProducts();
            const index = products.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                products[index].isFlashDeal = isFlashDeal;
                if (isFlashDeal && !products[index].flashDealDesc) {
                    products[index].flashDealDesc = 'GiÃ¡ sá»‘c khÃ´ng thá»ƒ bá» lá»¡!';
                }
                if (isFlashDeal && !products[index].flashDealPrice) {
                    products[index].flashDealPrice = Math.round(products[index].price * 0.9); // Default 10% off
                }
                _saveProducts(products);
                this.syncToApi();
                return true;
            }
            return false;
        },

        getFlashDealProducts() {
            return _getProducts().filter(p => p.isFlashDeal && p.active !== false);
        },

        updateFlashDealData(id, desc, price) {
            const products = _getProducts();
            const index = products.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                if (desc !== undefined) products[index].flashDealDesc = desc;
                if (price !== undefined) products[index].flashDealPrice = parseInt(price) || 0;
                _saveProducts(products);
                this.syncToApi();
                return true;
            }
            return false;
        },

        getProductCountByCategory(categoryId) {
            return _getProducts().filter(p => p.categoryId === parseInt(categoryId)).length;
        },

        // ===== QUERY HELPERS =====
        getFeatured() {
            return _getProducts().filter(p => p.featured && p.active !== false);
        },

        getOnSale() {
            return _getProducts().filter(p => p.onSale && p.discount > 0 && p.active !== false);
        },

        getRelated(productId, limit = 4) {
            const product = this.getById(productId);
            if (!product) return [];
            const sameCategory = _getProducts().filter(
                p => p.categoryId === product.categoryId && p.id !== parseInt(productId) && p.active !== false
            );
            return _shuffleArray(sameCategory).slice(0, limit);
        },

        getRandom(limit = 20) {
            return _shuffleArray(_getProducts().filter(p => p.active !== false)).slice(0, limit);
        },

        paginate(page = 1, perPage = 20, categoryId = null, isAdmin = false) {
            let products = categoryId
                ? this.getByCategory(categoryId, isAdmin)
                : this.getAll(isAdmin);

            const totalItems = products.length;
            const totalPages = Math.ceil(totalItems / perPage);
            const start = (page - 1) * perPage;
            const items = products.slice(start, start + perPage);

            return {
                items,
                page: parseInt(page),
                perPage,
                totalItems,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            };
        },

        search(keyword, isAdmin = false) {
            const kw = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            let products = _getProducts();
            if (!isAdmin) {
                products = products.filter(p => p.active !== false);
            }
            return products.filter(p => {
                const name = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                return name.includes(kw);
            });
        },

        // ===== UTILITIES =====
        formatPrice: _formatPrice,

        getDiscountedPrice(product) {
            if (product.isFlashDeal && product.flashDealPrice) return parseInt(product.flashDealPrice);
            if (product.isSaleOff50) return Math.round(product.price * 0.5);
            if (!product.discount || product.discount <= 0) return product.price;
            return Math.round(product.price * (1 - product.discount / 100));
        },

        getCategoryName(categoryId) {
            const cat = this.getCategoryById(categoryId);
            return cat ? cat.name : 'KhÃ´ng phÃ¢n loáº¡i';
        },

        // Stats for admin dashboard
        getStats() {
            const products = _getProducts();
            const categories = _getCategories();
            return {
                totalProducts: products.length,
                totalCategories: categories.length,
                featuredCount: products.filter(p => p.featured).length,
                onSaleCount: products.filter(p => p.onSale && p.discount > 0).length
            };
        },

        // ===== SETTINGS CRUD =====
        getSettings() {
            return _getSettings();
        },

        updateSettings(newSettings) {
            _saveSettings(newSettings);
            this.syncToApi();
            return newSettings;
        },

        // ===== NEWS CRUD =====
        getNews(isAdmin = false) {
            const news = _getNews();
            if (isAdmin) return news;
            return news.filter(n => n.active !== false);
        },

        getNewsById(id) {
            return _getNews().find(n => n.id === parseInt(id)) || null;
        },

        addNews(data) {
            const news = _getNews();
            const id = _nextNewsId();
            const newEntry = {
                id,
                ...data,
                slug: data.slug || _generateSlug(data.title),
                createdAt: new Date().toISOString()
            };
            news.push(newEntry);
            _saveNews(news);
            this.syncToApi();
            return newEntry;
        },

        updateNews(id, data) {
            const news = _getNews();
            const index = news.findIndex(n => n.id === parseInt(id));
            if (index !== -1) {
                if (data.title && !data.slug) {
                    data.slug = _generateSlug(data.title);
                }
                news[index] = { ...news[index], ...data };
                _saveNews(news);
                this.syncToApi();
                return news[index];
            }
            return null;
        },

        deleteNews(id) {
            const news = _getNews();
            const filtered = news.filter(n => n.id !== parseInt(id));
            _saveNews(filtered);
            this.syncToApi();
            return { success: true };
        },

        // ===== NEWS CATEGORIES CRUD =====
        getNewsCategories() {
            return _getNewsCategories();
        },

        getNewsCategoryById(id) {
            return _getNewsCategories().find(c => c.id === parseInt(id)) || null;
        },

        addNewsCategory(data) {
            const categories = _getNewsCategories();
            const id = _nextNewsCategoryId();
            const slug = data.slug || _generateSlug(data.name);
            if (categories.some(c => c.slug === slug)) {
                return { success: false, message: 'Danh má»¥c tin tá»©c Ä‘Ã£ tá»“n táº¡i!' };
            }
            const newCat = { id, name: data.name, slug, seoDesc: data.seoDesc || '' };
            categories.push(newCat);
            _saveNewsCategories(categories);
            this.syncToApi();
            return { success: true, category: newCat };
        },

        updateNewsCategory(id, data) {
            const categories = _getNewsCategories();
            const index = categories.findIndex(c => c.id === parseInt(id));
            if (index !== -1) {
                const slug = data.slug || _generateSlug(data.name);
                if (categories.some(c => c.slug === slug && c.id !== parseInt(id))) {
                    return { success: false, message: 'ÄÆ°á»ng dáº«n tÄ©nh Ä‘Ã£ bá»‹ trÃ¹ng vá»›i danh má»¥c khÃ¡c!' };
                }
                categories[index] = { ...categories[index], name: data.name, slug, seoDesc: data.seoDesc !== undefined ? data.seoDesc : (categories[index].seoDesc || '') };
                _saveNewsCategories(categories);
                this.syncToApi();
                return { success: true, category: categories[index] };
            }
            return { success: false, message: 'KhÃ´ng tÃ¬m tháº¥y danh má»¥c!' };
        },

        deleteNewsCategory(id) {
            const categories = _getNewsCategories();
            const news = _getNews();

            if (news.some(n => n.categoryId === parseInt(id))) {
                return { success: false, message: 'KhÃ´ng thá»ƒ xÃ³a danh má»¥c Ä‘ang chá»©a tin tá»©c!' };
            }

            const filtered = categories.filter(c => c.id !== parseInt(id));
            _saveNewsCategories(filtered);
            this.syncToApi();
            return { success: true };
        }
    };
})();

// Removed auto-init, will be initialized by main.js and admin.js
// ProductDB.init();
