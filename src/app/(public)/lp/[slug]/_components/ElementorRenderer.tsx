'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { 
  CheckCircle2, 
  Loader2, 
  ShoppingCart, 
  Minus, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Phone
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import DOMPurify from 'isomorphic-dompurify';

const alignMap: Record<string, string> = {
  left: 'justify-start',
  right: 'justify-end',
  center: 'justify-center'
};

// Helper to convert Elementor styling objects to inline CSS variables/styles
const getElementorStyles = (settings: any) => {
  const styles: React.CSSProperties = {};

  if (!settings) return styles;

  // Background
  if (settings.background_background === 'classic' && settings.background_color) {
    styles.backgroundColor = settings.background_color;
  } else if (settings.background_background === 'gradient') {
    const colorA = settings.background_color || '#ffffff';
    const colorB = settings.background_color_b || '#ffffff';
    styles.background = `linear-gradient(180deg, ${colorA} 0%, ${colorB} 100%)`;
  }

  // Text Color
  if (settings.title_color) styles.color = settings.title_color;
  if (settings.text_color) styles.color = settings.text_color;

  // Padding
  if (settings.padding) {
    const top = settings.padding.top || '0';
    const right = settings.padding.right || '0';
    const bottom = settings.padding.bottom || '0';
    const left = settings.padding.left || '0';
    const unit = settings.padding.unit || 'px';
    styles.padding = `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
  }

  // Margin
  if (settings.margin) {
    const top = settings.margin.top || '0';
    const right = settings.margin.right || '0';
    const bottom = settings.margin.bottom || '0';
    const left = settings.margin.left || '0';
    const unit = settings.margin.unit || 'px';
    styles.margin = `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
  }

  // Border Radius
  if (settings.border_radius) {
    const top = settings.border_radius.top || '0';
    const right = settings.border_radius.right || '0';
    const bottom = settings.border_radius.bottom || '0';
    const left = settings.border_radius.left || '0';
    const unit = settings.border_radius.unit || 'px';
    styles.borderRadius = `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
  }

  // Border
  if (settings.border_border === 'solid' && settings.border_color) {
    const width = settings.border_width?.top || '1';
    styles.border = `${width}px solid ${settings.border_color}`;
  }

  return styles;
};

// Recursive Elementor Renderer Component
export default function ElementorRenderer({ data, settings: globalSettings }: { data: any; settings?: any }) {
  const layout = Array.isArray(data) ? data : (data?.content || []);

  return (
    <div className="elementor-imported-lp w-full overflow-x-hidden font-sans">
      {layout.map((element: any) => (
        <RenderElement key={element.id} element={element} globalSettings={globalSettings} />
      ))}
    </div>
  );
}

function RenderElement({ element, globalSettings }: { element: any; globalSettings: any }) {
  if (!element) return null;

  const styles = getElementorStyles(element.settings);

  switch (element.elType) {
    case 'section':
      const contentWidth = element.settings?.content_width?.size || '1140';
      const gap = element.settings?.gap || 'default';
      
      return (
        <section 
          className="w-full relative py-6 flex justify-center" 
          style={styles}
        >
          <div 
            className="w-full flex flex-col md:flex-row gap-4 px-4" 
            style={{ maxWidth: `${contentWidth}px` }}
          >
            {element.elements?.map((col: any) => (
              <RenderElement key={col.id} element={col} globalSettings={globalSettings} />
            ))}
          </div>
        </section>
      );

    case 'column':
      const colSize = element.settings?._column_size || 100;
      return (
        <div 
          className="flex-1 flex flex-col gap-4" 
          style={{ 
            flexBasis: `${colSize}%`,
            ...styles
          }}
        >
          {element.elements?.map((el: any) => (
            <RenderElement key={el.id} element={el} globalSettings={globalSettings} />
          ))}
        </div>
      );

    case 'widget':
      return <RenderWidget widget={element} globalSettings={globalSettings} />;

    default:
      // Recursive fallback for inner sections
      if (element.elements && element.elements.length > 0) {
        return (
          <div className="w-full flex flex-col md:flex-row gap-4" style={styles}>
            {element.elements.map((child: any) => (
              <RenderElement key={child.id} element={child} globalSettings={globalSettings} />
            ))}
          </div>
        );
      }
      return null;
  }
}

function RenderWidget({ widget, globalSettings }: { widget: any; globalSettings: any }) {
  const { widgetType, settings } = widget;
  const styles = getElementorStyles(settings);

  switch (widgetType) {
    case 'heading':
      const headingTag = settings.header_size || 'h2';
      const HeadingComponent = headingTag as any;
      const headingAlign = settings.align || 'left';
      
      return (
        <HeadingComponent 
          className="font-bold tracking-tight py-2 leading-tight"
          style={{ 
            textAlign: headingAlign,
            fontSize: settings.typography_font_size?.size ? `${settings.typography_font_size.size}px` : undefined,
            fontWeight: settings.typography_font_weight || undefined,
            ...styles 
          }}
        >
          {settings.title}
        </HeadingComponent>
      );

    case 'text-editor':
      const textAlign = settings.align || 'left';
      return (
        <div 
          className="prose max-w-none text-slate-800 dark:prose-invert"
          style={{ 
            textAlign: textAlign,
            fontSize: settings.typography_font_size?.size ? `${settings.typography_font_size.size}px` : undefined,
            ...styles 
          }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(settings.editor || '') }}
        />
      );

    case 'image':
      const imageAlign = settings.align || 'center';
      const imageUrl = settings.image?.url || '';
      if (!imageUrl) return null;

      return (
        <div className={`w-full flex ${alignMap[imageAlign] || 'justify-center'}`}>
          <img 
            src={imageUrl} 
            alt={settings.image?.alt || 'Landing Page Image'} 
            className="max-w-full h-auto object-contain"
            style={{
              width: settings.width?.size ? `${settings.width.size}${settings.width.unit || 'px'}` : '100%',
              ...styles
            }}
          />
        </div>
      );

    case 'video':
      const youtubeUrl = settings.youtube_url || '';
      const hostedUrl = settings.hosted_url?.url || '';

      const getEmbedUrl = (url: string) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
      };

      return (
        <div className="w-full flex justify-center py-4" style={styles}>
          {youtubeUrl ? (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border shadow-lg max-w-3xl">
              <iframe 
                src={getEmbedUrl(youtubeUrl)} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          ) : hostedUrl ? (
            <video 
              controls 
              src={hostedUrl} 
              className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-lg"
              poster={settings.image_overlay?.url}
            />
          ) : null}
        </div>
      );

    case 'button':
      const btnAlign = settings.align || 'center';
      const btnLink = settings.link?.url || '#';
      
      const handleButtonClick = (e: React.MouseEvent) => {
        if (btnLink.startsWith('#')) {
          e.preventDefault();
          const targetId = btnLink.substring(1);
          let target = null;
          try {
            target = document.getElementById(targetId) || document.querySelector(btnLink);
          } catch (err) {
            target = document.getElementById(targetId);
          }
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      };

      return (
        <div className={`w-full flex ${alignMap[btnAlign] || 'justify-center'} py-2`}>
          <a 
            href={btnLink}
            onClick={handleButtonClick}
            className="px-8 py-4 inline-flex items-center justify-center font-black transition-all hover:opacity-90 shadow-md text-center"
            style={{
              backgroundColor: settings.background_color || '#FFDC66',
              color: settings.button_text_color || '#000000',
              fontSize: settings.typography_font_size?.size ? `${settings.typography_font_size.size}px` : '20px',
              ...styles
            }}
          >
            {settings.text || 'Order Now'}
          </a>
        </div>
      );

    case 'accordion':
      return <ElementorAccordion settings={settings} styles={styles} />;

    case 'image-carousel':
      return <ElementorCarousel settings={settings} styles={styles} />;

    case 'checkout-form':
      return <ElementorCheckoutForm settings={settings} styles={styles} globalSettings={globalSettings} />;

    case 'icon-list':
      return (
        <ul className="space-y-2 py-2" style={styles}>
          {settings.icon_list?.map((item: any) => (
            <li key={item._id} className="flex items-start gap-2 text-sm md:text-base font-semibold text-slate-800">
              <span className="text-primary font-black mt-0.5">✓</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      );

    case 'animated-headline':
      return (
        <div className="w-full text-center py-4" style={styles}>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            {settings.before_text}{' '}
            <span className="underline decoration-red-600 decoration-wavy">
              {settings.highlighted_text}
            </span>
          </h2>
        </div>
      );

    default:
      return null;
  }
}

// Subcomponents for Widgets
function ElementorAccordion({ settings, styles }: { settings: any; styles: any }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full space-y-3 py-4 max-w-3xl mx-auto" style={styles}>
      {settings.tabs?.map((tab: any, index: number) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={tab._id} 
            className="border rounded-2xl overflow-hidden bg-slate-50 dark:bg-zinc-900/20"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-4 font-bold text-left text-slate-800 dark:text-zinc-100 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800/40"
            >
              <span>{tab.tab_title}</span>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {isOpen && (
              <div 
                className="p-4 border-t text-sm leading-relaxed text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-950 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tab.tab_content || '') }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ElementorCarousel({ settings, styles }: { settings: any; styles: any }) {
  const images = settings.carousel || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div className="w-full flex justify-center py-4" style={styles}>
      <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden border shadow-lg group">
        <img 
          src={images[currentIndex]?.url} 
          alt="Carousel Image"
          className="w-full h-full object-cover transition-all duration-700 ease-in-out"
        />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                idx === currentIndex ? 'bg-primary scale-125' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ElementorCheckoutForm({ settings, styles, globalSettings }: { settings: any; styles: any; globalSettings: any }) {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');
  
  // Checkout fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');

  // Hardcoded or dynamically extracted single product details
  const [productDetails, setProductDetails] = useState({
    productId: '',
    productName: '',
    price: 0,
    productImage: ''
  });

  // Pull default product from settings or page globalSettings
  useEffect(() => {
    const fetchDefaultProduct = async () => {
      const targetProductId = settings?.productId || settings?.product || globalSettings?.productId || '';
      if (!targetProductId) {
        return;
      }
      try {
        const res = await fetch(`/api/products?ids=${targetProductId}`);
        if (res.ok) {
          const data = await res.json();
          const product = data.products?.[0];
          if (product) {
            setProductDetails({
              productId: product._id,
              productName: product.name,
              price: product.salePrice || product.price,
              productImage: product.images?.[0] || ''
            });
          }
        }
      } catch (e) {
        console.error('Failed to load product details:', e);
      }
    };
    fetchDefaultProduct();
  }, [settings, globalSettings]);

  const chargeInsideDhaka = globalSettings?.deliveryChargeInsideDhaka ?? 60;
  const chargeOutsideDhaka = globalSettings?.deliveryChargeOutsideDhaka ?? 120;
  const deliveryCharge = deliveryArea === 'inside' ? chargeInsideDhaka : chargeOutsideDhaka;
  const totalAmount = productDetails.price + deliveryCharge;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !street) {
      toast.error('অনুগ্রহ করে সব তথ্য পূরণ করুন');
      return;
    }

    if (!/^(?:01)[3-9]\d{8}$/.test(phone)) {
      toast.error('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন');
      return;
    }

    if (!productDetails.productId) {
      toast.error('প্রোডাক্ট পাওয়া যায়নি। অর্ডার করা সম্ভব নয়।');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        landingPageSlug: slug,
        items: [{
          product: productDetails.productId,
          name: productDetails.productName,
          quantity: 1,
          price: productDetails.price,
          image: productDetails.productImage
        }],
        shippingAddress: {
          fullName,
          phone,
          email: `${phone}@store.com`,
          street,
          city: deliveryArea === 'inside' ? 'Dhaka' : 'Outside Dhaka',
          state: deliveryArea === 'inside' ? 'Dhaka' : 'Outside Dhaka',
          division: deliveryArea === 'inside' ? 'Dhaka' : 'Outside Dhaka',
          district: deliveryArea === 'inside' ? 'Dhaka' : 'Outside Dhaka',
          thana: deliveryArea === 'inside' ? 'Dhaka' : 'Outside Dhaka',
          zipCode: '0000',
          country: 'Bangladesh'
        },
        paymentMethod,
        deliveryCharge,
        totalAmount
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const order = await res.json();
        setSuccessOrderId(order._id);
        setSuccess(true);
        toast.success('আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!');
      } else {
        const err = await res.json();
        toast.error(err.message || 'অর্ডার করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      toast.error('সার্ভার কানেকশন এরর। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto text-center p-8 bg-emerald-50 rounded-[2rem] border-2 border-emerald-200 space-y-4 my-8">
        <div className="inline-flex h-16 w-16 items-center justify-center bg-emerald-100 text-emerald-600 rounded-full">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">অর্ডার সফলভাবে সম্পন্ন হয়েছে!</h3>
        <p className="text-sm text-muted-foreground">খুব শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে ফোনে যোগাযোগ করবেন।</p>
        <p className="text-xs font-bold text-primary">অর্ডার আইডি: #{successOrderId.slice(-6).toUpperCase()}</p>
        <Button onClick={() => setSuccess(false)} variant="outline" className="rounded-full">নতুন অর্ডার করুন</Button>
      </div>
    );
  }

  return (
    <div id="order" className="w-full max-w-xl mx-auto my-8 bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl" style={styles}>
      <div className="bg-primary p-6 text-primary-foreground text-center">
        <h3 className="text-lg md:text-xl font-bold flex items-center justify-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          অর্ডার কনফার্ম করতে নিচের ফর্মটি পূরণ করুন
        </h3>
      </div>
      <form onSubmit={handleSubmitOrder} className="p-6 space-y-4">
        {!productDetails.productId && (
          <div className="p-4 border border-amber-200 bg-amber-50 text-amber-800 rounded-2xl text-xs font-bold text-center">
            কোনো প্রোডাক্ট সিলেক্ট করা নেই। অর্ডার ফর্মটি নিষ্ক্রিয়।
          </div>
        )}
        {productDetails.productId && (
          <div className="flex gap-4 p-4 border rounded-2xl bg-slate-50 items-center">
            {productDetails.productImage && (
              <img src={productDetails.productImage} alt={productDetails.productName} className="h-16 w-16 object-cover rounded-xl border bg-white" />
            )}
            <div className="flex-1">
              <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{productDetails.productName}</h4>
              <p className="text-sm font-black text-primary">৳{productDetails.price}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="font-bold text-slate-700">আপনার নাম</Label>
          <Input 
            placeholder="পূর্ণ নাম লিখুন" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={!productDetails.productId}
            className="h-12 rounded-xl border-2 focus-visible:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-bold text-slate-700">মোবাইল নম্বর</Label>
          <Input 
            placeholder="যেমন: ০১৭XXXXXXXX" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!productDetails.productId}
            className="h-12 rounded-xl border-2 focus-visible:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-bold text-slate-700">সম্পূর্ণ ঠিকানা</Label>
          <Input 
            placeholder="যেমন: গ্রাম/রোড, থানা, জেলা" 
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            disabled={!productDetails.productId}
            className="h-12 rounded-xl border-2 focus-visible:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-bold text-slate-700">ডেলিভারি এলাকা</Label>
          <RadioGroup 
            value={deliveryArea} 
            onValueChange={(val: any) => setDeliveryArea(val)}
            disabled={!productDetails.productId}
            className="flex gap-4 pt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inside" id="inside" disabled={!productDetails.productId} />
              <Label htmlFor="inside" className="cursor-pointer">ঢাকার ভিতরে (৳{chargeInsideDhaka})</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="outside" id="outside" disabled={!productDetails.productId} />
              <Label htmlFor="outside" className="cursor-pointer">ঢাকার বাইরে (৳{chargeOutsideDhaka})</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>প্রোডাক্টের দাম</span>
            <span className="font-bold text-slate-800">৳{productDetails.price}</span>
          </div>
          <div className="flex justify-between">
            <span>ডেলিভারি চার্জ</span>
            <span className="font-bold text-slate-800">৳{deliveryCharge}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-base font-black text-slate-900 pt-1">
            <span>সর্বমোট</span>
            <span className="text-primary text-lg font-black">৳{totalAmount}</span>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading || !productDetails.productId}
          className="w-full h-14 text-base font-black rounded-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4 gap-2 flex items-center justify-center"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Phone className="h-4 w-4" />
              অর্ডার কনফার্ম করুন (৳{totalAmount})
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
