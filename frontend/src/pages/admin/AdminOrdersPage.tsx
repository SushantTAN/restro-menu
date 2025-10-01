import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CartItem } from '@/context/CartContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';

const AdminOrdersPage: React.FC = () => {
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const [decodedResult, setDecodedResult] = useState<any | null>(null);

  useEffect(() => {
    const qrCodeScannerId = "qr-code-full-region";
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrCodeScannerId,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        disableFlip: false,
      },
      /* verbose= */ false
    );

    const onScanSuccess = (decodedText: string, decodedResult: any) => {
      // handle the scanned code as you like
      console.log(`Code matched = ${decodedText}`, decodedResult);
      setDecodedText(decodedText);
      setDecodedResult(decodedResult);
      html5QrcodeScanner.clear(); // Stop scanning after a successful scan
    };

    const onScanError = (errorMessage: string) => {
      // handle scan error as you like
      console.warn(`QR Code Scan Error: ${errorMessage}`);
    };

    html5QrcodeScanner.render(onScanSuccess, onScanError);

    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner", error);
      });
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Orders Page</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">QR Code Scanner</h2>
        <div id="qr-code-full-region" style={{ width: "500px", height: "500px" }}></div>
      </div>

      {decodedText && (
        <Card className='mb-3'>
          <CardContent>

            <>
              {(
                <div>
                  <div className="hidden md:flex justify-between font-medium mb-2">
                    <span className="w-2/5">Item</span>
                    <span className="w-1/5 text-center">Quantity</span>
                    <span className="w-1/5 text-right">Price</span>
                    <span className="w-1/5 text-right">Actions</span>
                  </div>
                  {JSON.parse(decodedText)?.reduce((acc, item) => {
                    const presentDataIndex = acc.findIndex(el => el._id === item._id);
                    if (presentDataIndex > -1) {
                      acc[presentDataIndex] = { ...acc[presentDataIndex], quantity: acc[presentDataIndex]?.quantity + 1 }
                    } else {
                      acc.push(item)
                    }
                    return acc;
                  }, [] as CartItem[]).map((item) => (
                    <div key={item._id + (item.orderedFor || '')} className="flex flex-wrap justify-between items-center mb-4 md:mb-2">
                      <span className="w-full md:w-2/5 mb-2 md:mb-0">
                        {item.name}
                        {/* {item.orderedFor && <p className="text-sm text-gray-500">Ordered for: {item.orderedFor}</p>} */}
                      </span>
                      <div className="w-1/2 md:w-1/5 flex items-center justify-start md:justify-center">
                        <Button variant="outline" size="sm" ><FaMinus /></Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button variant="outline" size="sm"><FaPlus /></Button>
                      </div>
                      <span className="w-1/2 md:w-1/5 text-right md:text-right">Rs {(item.price * item.quantity).toFixed(2)}</span>
                      <div className="w-full md:w-1/5 text-right mt-2 md:mt-0">
                        <Button variant="destructive" size="sm" ><FaTrash className='' /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}



              <hr className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>Rs {(10).toFixed(2)}</span>
              </div>


              <Button variant="outline" size="sm" className="mt-4" >Clear Cart</Button>


            </>

          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminOrdersPage;
