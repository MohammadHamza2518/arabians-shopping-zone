// Central WhatsApp Link & Message Generator for Arabians Shopping Zone
// Strictly using WhatsApp Number: 72338 62626 (country code: 91)

export const STORE_WHATSAPP_PHONE = "917233862626";
export const STORE_WHATSAPP_DISPLAY = "+91 72338 62626";

/**
 * Builds a direct wa.me link with encoded pre-filled text
 */
export function createWhatsAppUrl(message, phone = STORE_WHATSAPP_PHONE) {
  const cleanPhone = (phone || STORE_WHATSAPP_PHONE).toString().replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * 1. Pre-filled WhatsApp message for a single product order or inquiry
 */
export function getProductOrderWhatsAppUrl(product, quantity = 1, size = null, phone = STORE_WHATSAPP_PHONE, customization = null) {
  const price = product?.price || 0;
  const total = price * quantity;
  
  let customSection = '';
  if (customization) {
    if (customization.shareLaterOnWhatsApp) {
      customSection = `\n✍️ *Custom Personalization:* Will share Urdu/custom names & date directly in this chat\n`;
    } else if (customization.isWedding) {
      customSection = 
`\n👑 *Nikah Personalization Details:*
• Groom (Dulha): ${customization.groomName || 'N/A'}
• Bride (Dulhan): ${customization.brideName || 'N/A'}${customization.eventDate ? `\n• Nikah Date: ${customization.eventDate}` : ''}${customization.cityVenue ? `\n• City / Venue: ${customization.cityVenue}` : ''}${customization.specialNotes ? `\n• Special Calligraphy Notes: ${customization.specialNotes}` : ''}\n`;
    } else if (customization.customText) {
      customSection = 
`\n✍️ *Custom Laser Engraving Details:*
• Inscription: ${customization.customText}${customization.specialNotes ? `\n• Special Notes: ${customization.specialNotes}` : ''}\n`;
    }
  }

  const msg = 
`Assalam o Alaikum Arabians Shopping Zone! 🌙

I would like to order:
📦 *Product:* ${product?.name || 'Product'}
${size ? `📏 *Size / Variant:* ${size}\n` : ''}🔢 *Quantity:* ${quantity}${customSection}
💰 *Total Price:* ₹${total}

Please confirm availability, share design preview, and provide dispatch details for my pincode.`;

  return createWhatsAppUrl(msg, phone);
}

/**
 * 2. Pre-filled WhatsApp message for full cart / checkout order
 */
export function getCartOrderWhatsAppUrl({ orderId, customer, items, total, paymentMethod }, phone = STORE_WHATSAPP_PHONE) {
  const itemsList = (items || []).map(i => {
    const pName = i.name || i.product?.name || 'Item';
    const pSize = i.selectedSize || i.size || i.variant ? ` (${i.selectedSize || i.size || i.variant})` : '';
    const pQty = i.quantity || 1;
    const pPrice = (i.price || i.product?.price || 0) * pQty;
    let custDetails = '';
    const c = i.customization;
    if (c) {
      if (c.shareLaterOnWhatsApp) {
        custDetails = `\n    └ ✍️ *Custom Names:* Will send photos/names on WhatsApp`;
      } else if (c.isWedding) {
        custDetails = `\n    └ 👑 *Dulha & Dulhan:* ${c.groomName || '-'} ❤️ ${c.brideName || '-'}${c.eventDate ? ` | 📅 ${c.eventDate}` : ''}${c.specialNotes ? ` | 📝 ${c.specialNotes}` : ''}`;
      } else if (c.customText) {
        custDetails = `\n    └ ✍️ *Custom Text:* ${c.customText}${c.specialNotes ? ` | 📝 ${c.specialNotes}` : ''}`;
      }
    }
    return `• ${pName}${pSize} x ${pQty} = ₹${pPrice}${custDetails}`;
  }).join('\n');

  const customerName = customer?.name || customer?.customerName || 'Valued Customer';
  const customerPhone = customer?.phone || '';
  const customerAddr = customer?.address 
    ? `${customer.address}, ${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}`
    : 'Provided on chat';

  const msg = 
`Assalam o Alaikum Arabians Shopping Zone! 🌙

I want to place an order via WhatsApp:
${orderId ? `🆔 *Order ID:* ${orderId}\n` : ''}👤 *Name:* ${customerName}
📞 *Phone:* ${customerPhone}
📍 *Shipping Address:* ${customerAddr}

🛍️ *Order Items:*
${itemsList || '• Order Items'}

💰 *Grand Total:* ₹${total}
💳 *Payment Preference:* ${paymentMethod || 'WhatsApp Order / COD'}

Please confirm my order and share custom embossing preview & dispatch details!`;

  return createWhatsAppUrl(msg, phone);
}

/**
 * 3. Pre-filled WhatsApp message for Custom Royal Hamper
 */
export function getHamperOrderWhatsAppUrl({
  trunkTheme,
  thobe,
  thobeSize,
  fragrance,
  keepsake,
  recipientName,
  senderName,
  includeTasbih,
  isDirectGift,
  totalPrice
}, phone = STORE_WHATSAPP_PHONE) {
  const msg = 
`Assalam o Alaikum Arabians Shopping Zone! 🎁

I would like to order a Custom Royal Gift Hamper:
🎁 *Trunk Style:* ${trunkTheme?.name || 'Royal Trunk'}
👑 *Thobe:* ${thobe?.name || 'Emirati Thobe'} (Size: ${thobeSize || '54'})
🌿 *Fragrance:* ${fragrance?.name || 'Aged Dehnul Oud'}
💍 *Keepsake:* ${keepsake?.name || 'Sacred Keepsake'}
${includeTasbih ? `📿 *Sacred Add-on:* 33-Bead Natural Olive Wood Tasbih\n` : ''}💌 *Gift For:* ${recipientName || 'Family'} | *From:* ${senderName || 'Me'}
${isDirectGift ? `🛡️ *Direct Gift:* Send directly to recipient (Hide invoice price)\n` : ''}💰 *Hamper Total:* ₹${totalPrice}

Please confirm my hamper custom preparation & delivery timeline.`;

  return createWhatsAppUrl(msg, phone);
}

/**
 * 4. Pre-filled WhatsApp message for Order Tracking & Shipment Status
 */
export function getTrackOrderWhatsAppUrl(orderId, customerName = '', status = '', phone = STORE_WHATSAPP_PHONE) {
  const msg = 
`Assalam o Alaikum Arabians Support Team! 🚚

I need an update regarding my order shipment:
🆔 *Order ID:* ${orderId || 'ASZ-'}
${customerName ? `👤 *Customer Name:* ${customerName}\n` : ''}${status ? `📦 *Current Status:* ${status}\n` : ''}
Please share live courier tracking details and expected delivery date.`;

  return createWhatsAppUrl(msg, phone);
}

/**
 * 5. Pre-filled WhatsApp message for Wholesale / Dealership Program
 */
export function getDistributorWhatsAppUrl({ contactPerson, firmName, city, state, phone: distPhone, categories, notes }, phone = STORE_WHATSAPP_PHONE) {
  const msg = 
`Assalam o Alaikum Arabians Team! 🤝

I am interested in the Arabians Retailer & Dealership Program:
👤 *Contact Person:* ${contactPerson || ''}
${firmName ? `🏢 *Shop / Business Name:* ${firmName}\n` : ''}📍 *City & State:* ${city || ''}, ${state || ''}
📞 *Mobile:* ${distPhone || ''}
${categories?.length ? `📦 *Interested In:* ${categories.join(', ')}\n` : ''}${notes ? `📝 *Notes:* ${notes}\n` : ''}
Please share wholesale price list, retail margins, and dealership onboarding details.`;

  return createWhatsAppUrl(msg, phone);
}

/**
 * 6. Pre-filled WhatsApp message for 7-Day Returns & Exchanges
 */
export function getReturnWhatsAppUrl(orderId = '', phone = STORE_WHATSAPP_PHONE) {
  const msg = 
`Assalam o Alaikum Arabians Returns Desk! 🔄

I would like to initiate a 7-Day Return / Size Exchange:
🆔 *Order ID:* ${orderId || 'ASZ-'}
📦 *Product Name:* 
⚠️ *Reason:* (Size Exchange / Damaged in Transit / Item Issue)
📸 (Attaching pictures of parcel label and product)

Please guide me on the free reverse courier pickup process.`;

  return createWhatsAppUrl(msg, phone);
}

/**
 * 7. Pre-filled WhatsApp message for General Support / Sizing / Guidance
 */
export function getGeneralSupportWhatsAppUrl(contextTopic = '', phone = STORE_WHATSAPP_PHONE) {
  const msg = 
`Assalam o Alaikum Arabians Shopping Zone! ✨

I am visiting your store website and need assistance${contextTopic ? ` with *${contextTopic}*` : ''}:
• Sizing advice for Thobes & Amama Shareef
• Authentic Talbina dosage & preparation instructions
• Pure Oud & Bakhoor recommendations
• Check delivery time to my pincode

Please guide me.`;

  return createWhatsAppUrl(msg, phone);
}

/**
 * 8. Pre-filled WhatsApp message for Viral Video / Reel Inquiry
 */
export function getReelInquiryWhatsAppUrl(reel, phone = STORE_WHATSAPP_PHONE) {
  const msg = 
`Assalam o Alaikum Arabians! 🎬

I watched your video:
🎥 *"${reel?.title || 'Reel'}"* (${reel?.views || ''} views)
${reel?.productName ? `📦 *Product:* ${reel.productName} (${reel.productPrice || ''})\n` : ''}
I would like to order this. Please share sizes and delivery details.`;

  return createWhatsAppUrl(msg, phone);
}

/**
 * 9. Order Confirmation Slip for Customer with Live Tracking Link
 */
export function getOrderConfirmationWhatsAppUrl(order, phone = STORE_WHATSAPP_PHONE) {
  if (!order) return createWhatsAppUrl('Assalam o Alaikum Arabians!', phone);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://arabiansshoppingzone.com';
  const trackLink = `${origin}/#/track?query=${order.id}`;

  const itemsList = (order.items || []).map(i => {
    const size = i.selectedSize ? ` (${i.selectedSize})` : '';
    let custInfo = '';
    const c = i.customization;
    if (c) {
      if (c.shareLaterOnWhatsApp) {
        custInfo = `\n    └ ✍️ *Custom Names:* Will send on WhatsApp`;
      } else if (c.isWedding) {
        custInfo = `\n    └ 👑 *Dulha & Dulhan:* ${c.groomName || '-'} ❤️ ${c.brideName || '-'}${c.eventDate ? ` | 📅 ${c.eventDate}` : ''}`;
      } else if (c.customText) {
        custInfo = `\n    └ ✍️ *Engraving:* ${c.customText}`;
      }
    }
    return `• ${i.name || 'Item'}${size} x ${i.quantity || 1} = ₹${(i.price || 0) * (i.quantity || 1)}${custInfo}`;
  }).join('\n');

  const msg = 
`Assalam o Alaikum Arabians Shopping Zone! 🌙

I have placed an order on your website:
👑 *Order ID:* ${order.id}
💰 *Total Amount:* ₹${order.total} (${(order.paymentMode || order.paymentMethod || 'COD').toUpperCase()})
👤 *Customer:* ${order.customerName || order.customer?.name || 'Customer'}
📞 *Phone:* ${order.phone || order.customer?.phone || ''}
📍 *Delivery Address:* ${order.address || 'Address provided'}

🛍️ *Ordered Items:*
${itemsList || '• Order Items'}

🚚 *Track Order Live Anytime:*
${trackLink}

Please confirm my dispatch and send BlueDart/Delhivery tracking updates! JazakAllah Khair!`;

  return createWhatsAppUrl(msg, phone);
}

/**
 * 10. Direct WhatsApp Dispatch Notification to Customer's Phone (From Store Owner Admin)
 */
export function getSendCustomerWhatsAppUrl(customerPhone, order) {
  if (!order) return '#';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://arabiansshoppingzone.com';
  const trackLink = `${origin}/#/track?query=${order.id}`;
  const trackingNumber = order.trackingNumber || order.trackingId;
  const courier = order.courier || 'BlueDart Express Air';

  const trackingInfo = trackingNumber
    ? `📦 *Courier:* ${courier}\n🔢 *Tracking AWB:* ${trackingNumber}\n`
    : `📦 *Status:* Preparing for Express Dispatch\n`;

  const msg = 
`Assalam o Alaikum ${order.customerName || order.customer?.name || 'Valued Customer'}! 🌙

Your *Arabians Shopping Zone* order *${order.id}* has been updated to: *${(order.status || 'CONFIRMED').toUpperCase()}*! 🚀

${trackingInfo}💰 *Total Payable:* ₹${order.total} (${(order.paymentMode || order.paymentMethod || 'COD').toUpperCase()})
📍 *Delivery to:* ${order.address || 'Your address'}

🚚 *Track Your Parcel Live Anytime:*
${trackLink}

Our parcels are packed with a tamper-proof guarantee seal. If you have any questions or wish to update delivery instructions, simply reply to this chat.

JazakAllah Khair for shopping with Arabians Shopping Zone! ✨`;

  const cleanPhone = (customerPhone || '').toString().replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg.trim())}`;
}
