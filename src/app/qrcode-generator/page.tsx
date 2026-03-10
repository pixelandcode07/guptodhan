"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QRCodeGeneratorPage() {
    const defaultText = `Business Identification Number (BIN) Details
BIN :  005393046-0811
Name of the Entity : GUPTODHAN DIGITAL
Trading Brand Name : N/A
Old BIN : N/A
e-TIN : 330624150501
Registration : Registered for VAT
Date of Issue : 19/02/2023
Date of Effect : 02/2023
Address: Palong Modho Bazar; Palong PS; Shariatpur-8000; Bangladesh
Type of Ownership: Proprietorship
Major Area of Economic Activity: Services`;

    const [text, setText] = useState(defaultText);
    const qrRef = useRef<HTMLDivElement>(null);

    const downloadQRCode = () => {
        if (!qrRef.current) return;
        const canvas = qrRef.current.querySelector("canvas");
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "Guptodhan_BIN_QRCode.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                
                {/* Left Side: Input Form */}
                <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-100 text-[#ff6b00] rounded-lg">
                            <QrCode size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#00005E]">Guptodhan QR Generator</h2>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">
                        Enter text, URL, or business details below to generate a static QR code instantly. This code will never expire.
                    </p>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your details here..."
                        className="w-full h-[320px] p-4 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent outline-none resize-none transition-all"
                    />
                </div>

                {/* Right Side: QR Code Preview */}
                <div className="w-full md:w-[400px] p-8 flex flex-col items-center justify-center bg-gray-50/50">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Live Preview</h3>
                    
                    <div 
                        ref={qrRef}
                        className="p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-sm mb-6 transition-all hover:shadow-md"
                    >
                        {text ? (
                            <QRCodeCanvas
                                value={text}
                                size={240}
                                level="H" // High error correction (কমপ্লেক্স ডেটার জন্য)
                                includeMargin={true}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                            />
                        ) : (
                            <div className="w-[240px] h-[240px] flex items-center justify-center bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                                <span className="text-gray-400 text-sm">No data to display</span>
                            </div>
                        )}
                    </div>

                    <Button 
                        onClick={downloadQRCode}
                        disabled={!text}
                        className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white font-bold py-6 rounded-xl shadow-md shadow-orange-200 transition-all flex items-center justify-center gap-2"
                    >
                        <Download size={20} />
                        Download QR Code
                    </Button>
                    
                    <p className="mt-4 text-[12px] text-gray-400 text-center px-4">
                        This is a lifetime static QR code. It saves directly to notes when scanned with a mobile device.
                    </p>
                </div>

            </div>
        </div>
    );
}