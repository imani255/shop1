'use client';

import React from 'react';
import { format } from 'date-fns';

interface StickerInvoiceProps {
  order: any;
  settings?: any;
}

// Simple Code39 Barcode SVG Generator
const Barcode: React.FC<{ value: string }> = ({ value }) => {
  const CODE39_MAP: Record<string, string> = {
    '0': '000110100', '1': '100100001', '2': '001100001', '3': '101100000',
    '4': '000110001', '5': '100110000', '6': '001110000', '7': '000100101',
    '8': '100100100', '9': '001100100', 'A': '100001001', 'B': '001001001',
    'C': '101001000', 'D': '000011001', 'E': '100011000', 'F': '001011000',
    'G': '000001101', 'H': '100001100', 'I': '001001100', 'J': '000011100',
    'K': '100000011', 'L': '001000011', 'M': '101000010', 'N': '000010011',
    'O': '100010010', 'P': '001010010', 'Q': '000000111', 'R': '100000110',
    'S': '001000110', 'T': '000010110', 'U': '110000001', 'V': '011000001',
    'W': '111000000', 'X': '010010001', 'Y': '110010000', 'Z': '011010000',
    '-': '010000101', '.': '110000100', ' ': '011000100', '*': '010010100',
    '$': '010101000', '/': '010100010', '+': '010001010', '%': '000101010'
  };

  // Code39 starts and ends with an asterisk '*'
  const cleanValue = value.trim().toUpperCase();
  const rawString = `*${cleanValue}*`;
  
  let paths: React.JSX.Element[] = [];
  let currentX = 0;
  const narrowWidth = 1.5;
  const wideWidth = 3.5;
  const gapWidth = 1.5;
  const barHeight = 45;

  for (let i = 0; i < rawString.length; i++) {
    const char = rawString[i];
    const pattern = CODE39_MAP[char] || CODE39_MAP['*']; // fallback to asterisk

    for (let j = 0; j < 9; j++) {
      const isBar = j % 2 === 0;
      const isWide = pattern[j] === '1';
      const width = isWide ? wideWidth : narrowWidth;

      if (isBar) {
        paths.push(
          <rect
            key={`${i}-${j}`}
            x={currentX}
            y={0}
            width={width}
            height={barHeight}
            fill="black"
          />
        );
      }
      currentX += width;
    }
    // Inter-character gap
    currentX += gapWidth;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        width="100%"
        height={barHeight + 5}
        viewBox={`0 0 ${currentX} ${barHeight + 5}`}
        preserveAspectRatio="xMidYMid meet"
        className="max-w-[280px]"
      >
        {paths}
      </svg>
      <span className="text-[10px] font-mono tracking-[0.25em] font-semibold mt-1">{cleanValue}</span>
    </div>
  );
};

const PrintableStickerInvoice: React.FC<StickerInvoiceProps> = ({ order, settings }) => {
  if (!order) return null;

  const orderId = String(order.shortId || order._id || '').slice(-8).toUpperCase();
  const dateStr = order.createdAt ? format(new Date(order.createdAt), 'dd/MM/yyyy') : 'N/A';
  const consignmentId = order.shippingDetails?.consignmentId || order.shippingDetails?.trackingId || '';
  const courierName = order.shippingDetails?.courierName || 'Courier';

  return (
    <div className="sticker-print-layout bg-white text-black font-sans mx-auto p-4 border border-dashed border-gray-300 w-[100mm] h-[100mm] flex flex-col justify-between print:border-none print:p-2 print:m-0 print:w-full print:h-full box-border">
      {/* Styles injected specifically for print media formatting of sticker labels */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: 100mm 100mm;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background-color: white;
          }
          .sticker-print-layout {
            width: 100mm !important;
            height: 100mm !important;
            page-break-after: always;
            break-after: page;
            border: none !important;
            padding: 12px !important;
            box-sizing: border-box !important;
          }
        }
      `}} />

      {/* Header Info */}
      <div className="border-b pb-1.5 flex justify-between items-center text-xs">
        <div>
          <h1 className="text-sm font-black tracking-tight text-primary">
            {settings?.siteName || 'Care Mom SHOP'}
          </h1>
          <p className="text-[9px] text-gray-500 font-medium">Order ID: #{orderId}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-gray-500 font-semibold">{dateStr}</p>
          <span className="inline-block bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
            COD
          </span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="py-2 border-b text-xs flex-1 flex flex-col justify-center">
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Ship To:</p>
          <p className="font-extrabold text-sm">{order.shippingAddress?.fullName || 'Customer'}</p>
          <p className="font-black text-[13px] tracking-wide text-primary-foreground bg-primary px-1 py-0.5 rounded inline-block">
            {order.shippingAddress?.phone || ''}
          </p>
          <p className="text-[11px] leading-tight text-gray-800 mt-1 font-medium">
            {order.shippingAddress?.street || ''}, {order.shippingAddress?.city || ''}
          </p>
        </div>
      </div>

      {/* Order Items (Compact) */}
      <div className="py-1.5 border-b text-[10px]">
        <p className="font-bold text-gray-500 uppercase tracking-wider mb-1 text-[9px]">Items ({order.items?.length || 0}):</p>
        <div className="max-h-[70px] overflow-hidden space-y-0.5">
          {order.items?.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between font-medium">
              <span className="truncate pr-2 max-w-[200px]">
                • {item.name} {item.size ? `(${item.size})` : ''} {item.color ? `[${item.color}]` : ''}
              </span>
              <span className="font-bold flex-shrink-0">Qty: {item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-1.5 pt-1 border-t border-dotted font-bold text-xs">
          <span>Amount to Collect:</span>
          <span className="text-sm font-black text-primary">৳{Math.round(order.totalAmount)}</span>
        </div>
      </div>

      {/* Courier & Barcode Section */}
      <div className="pt-2 text-center">
        {consignmentId ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-600 mb-1 px-1">
              <span>Courier: <span className="text-primary uppercase font-extrabold">{courierName}</span></span>
              <span>Consignment ID:</span>
            </div>
            <Barcode value={consignmentId} />
          </div>
        ) : (
          <div className="py-2 border border-dashed border-red-300 rounded bg-red-50 text-red-600 text-[10px] font-bold">
            No Courier Booking Found / Consignment ID Missing
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintableStickerInvoice;
