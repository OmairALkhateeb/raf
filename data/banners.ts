import { Banner, BannerPlacement } from '@/types';
import { flickr } from '@/utils/mockImage';

// Temporary mock source. The real backend serves the same shape from
// GET /api/store/banners?placement=...  — admin-managed, the front-end only
// renders them and resolves their click target (see utils/bannerLink.ts).
// Images are topic-relevant (loremflickr) until the backend provides real art.

const art = (keywords: string, id: string) => ({
  imageDesktop: flickr(keywords, id + '-d', 1600, 800),
  imageMobile: flickr(keywords, id + '-m', 800, 900),
});

export const banners: Banner[] = [
  /* ── home_hero ── */
  {
    id: 'bn1',
    placement: 'home_hero',
    title: 'The Essence of Oman',
    titleAr: 'جوهر عُمان',
    subtitle: 'Discover exclusive fragrances crafted from centuries-old Omani traditions',
    subtitleAr: 'اكتشف العطور الحصرية المصنوعة من تقاليد عمانية عمرها قرون',
    buttonText: 'Shop Fragrances',
    buttonTextAr: 'تسوق العطور',
    ...art('perfume,oud', 'bn1'),
    linkType: 'category',
    target: { categorySlug: 'fragrances' },
    bgColor: '#1a0a00',
    textColor: '#F5F0E8',
  },
  {
    id: 'bn2',
    placement: 'home_hero',
    title: 'Heritage in Every Thread',
    titleAr: 'التراث في كل خيط',
    subtitle: 'Handcrafted Omani fashion celebrating the art of traditional weaving',
    subtitleAr: 'أزياء عمانية مصنوعة يدوياً تحتفل بفن النسيج التقليدي',
    buttonText: 'Explore Fashion',
    buttonTextAr: 'استكشف الأزياء',
    ...art('fashion,abaya', 'bn2'),
    linkType: 'category',
    target: { categorySlug: 'fashion' },
    bgColor: '#2D1F1F',
    textColor: '#E8D5A3',
  },
  {
    id: 'bn3',
    placement: 'home_hero',
    title: 'Gifts from the Mountains',
    titleAr: 'هدايا من الجبال',
    subtitle: 'Premium Sidr honey & frankincense — treasures of the Dhofar region',
    subtitleAr: 'عسل السدر الممتاز واللبان — كنوز منطقة ظفار',
    buttonText: 'Shop Gourmet',
    buttonTextAr: 'تسوق المأكولات الفاخرة',
    ...art('honey,dates', 'bn3'),
    linkType: 'category',
    target: { categorySlug: 'food-gourmet' },
    bgColor: '#1A2A1A',
    textColor: '#F5F0E8',
  },

  /* ── home_middle ── product_listing (a curated, filtered listing) ── */
  {
    id: 'bn4',
    placement: 'home_middle',
    title: 'For Dry Skin, On Offer',
    titleAr: 'للبشرة الجافة، بأسعار مخفّضة',
    subtitle: 'Hydrating face care, now discounted',
    subtitleAr: 'عناية مرطّبة للوجه، الآن بخصم',
    buttonText: 'Shop the Edit',
    buttonTextAr: 'تسوق التشكيلة',
    ...art('skincare,serum', 'bn4'),
    linkType: 'product_listing',
    target: { filters: { category: 'face-care', skin_type: 'dry', has_discount: 1 } },
    bgColor: '#2D1F1F',
    textColor: '#F5F0E8',
  },
  {
    id: 'bn5',
    placement: 'home_middle',
    title: 'The House of Amouage',
    titleAr: 'دار أموآج',
    subtitle: 'The gift of kings — explore the full collection',
    subtitleAr: 'هدية الملوك — استكشف المجموعة كاملة',
    buttonText: 'View Brand',
    buttonTextAr: 'عرض العلامة',
    ...art('perfume,luxury', 'bn5'),
    linkType: 'brand',
    target: { brandSlug: 'amouage' },
    bgColor: '#1a0a00',
    textColor: '#E8D5A3',
  },

  /* ── home_bottom ── search / custom listing ── */
  {
    id: 'bn6',
    placement: 'home_bottom',
    title: 'Looking for Oud?',
    titleAr: 'تبحث عن العود؟',
    subtitle: 'Search our finest oud & bukhoor',
    subtitleAr: 'ابحث في أجود أنواع العود والبخور',
    buttonText: 'Search',
    buttonTextAr: 'ابحث',
    ...art('oud,incense', 'bn6'),
    linkType: 'search',
    target: { searchQuery: 'oud' },
    bgColor: '#2D1F1F',
    textColor: '#F5F0E8',
  },

  /* ── category_page (shown on /products when a category is active) ── */
  {
    id: 'bn7',
    placement: 'category_page',
    title: 'New Season Arrivals',
    titleAr: 'وصل حديثاً لهذا الموسم',
    subtitle: 'Fresh picks across the collection',
    subtitleAr: 'مختارات جديدة من المجموعة',
    buttonText: 'Discover',
    buttonTextAr: 'اكتشف',
    ...art('cosmetics,beauty', 'bn7'),
    linkType: 'product_listing',
    target: { url: '/products?sort=newest' },
    bgColor: '#1A2A1A',
    textColor: '#F5F0E8',
  },

  /* ── brand_page ── */
  {
    id: 'bn8',
    placement: 'brand_page',
    title: 'Authentic, Guaranteed',
    titleAr: 'أصيل ومضمون',
    subtitle: 'Every product sourced directly from the maker',
    subtitleAr: 'كل منتج موثّق من المصدر مباشرة',
    buttonText: 'Shop All',
    buttonTextAr: 'تسوق الكل',
    ...art('perfume,store', 'bn8'),
    linkType: 'custom_url',
    target: { url: '/products' },
    bgColor: '#2D1F1F',
    textColor: '#E8D5A3',
  },
];

export const getBannersByPlacement = (placement: BannerPlacement): Banner[] =>
  banners.filter(b => b.placement === placement);

export const getBannerById = (id: string): Banner | undefined =>
  banners.find(b => b.id === id);
