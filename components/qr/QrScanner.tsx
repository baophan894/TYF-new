'use client';
import { useState } from 'react';
import jsQR from 'jsqr';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';

const QRScanner = () => {
  const [qrData, setQRData] = useState<string | null>(null);
  const [cccd, setCCCD] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [dob, setDob] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null); // New state for address
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);

          const imageData = context.getImageData(0, 0, img.width, img.height);
          const qrCode = jsQR(imageData.data, img.width, img.height);

          if (qrCode) {
            const qrString = qrCode.data;
            setQRData(qrString);
            parseQRData(qrString); // Extract and parse QR code data
          } else {
            setQRData('No QR code found');
          }
        }
        setIsLoading(false);
      };
    };
    reader.readAsDataURL(file);
  };

  const parseQRData = (data: string) => {
    const fields = data.split('|');
    if (fields.length >= 7) {
      setCCCD(fields[0]);
      setName(fields[2]);
      setDob(formatDate(fields[3])); // Format date (assuming it's in ddmmyyyy format)
      setGender(fields[4]);
      extractLocation(fields[5]); // Extract city and province
    } else {
      setQRData('Invalid QR code data format');
    }
  };

  const extractLocation = (addressString: string) => {
    // Example: "63 Đào Duy Từ, Phú Hòa, Thành phố Huế, Thừa Thiên Huế"
    const locationParts = addressString.split(',').map(part => part.trim());
    const city = locationParts[locationParts.length - 2]; // "Thành phố Huế"
    const province = locationParts[locationParts.length - 1]; // "Thừa Thiên Huế"
    setAddress(`${city}, ${province}`);
  };

  const formatDate = (dateString: string) => {
    // Convert from ddmmyyyy to dd/mm/yyyy
    return `${dateString.slice(0, 2)}/${dateString.slice(2, 4)}/${dateString.slice(4)}`;
  };

  return (
    <form className="p-4 border border-gray-300 rounded-md">
      <Input type="file" accept="image/*" onChange={handleFileUpload} className="mb-4" />
      {isLoading ? (
        <p>Scanning...</p>
      ) : qrData ? (
        <div>
          <p>CCCD: {cccd}</p>
          <p>Họ và Tên: {name}</p>
          <p>Ngày Sinh: {dob}</p>
          <p>Giới Tính: {gender}</p>
          <p>Địa chỉ: {address}</p> {/* Display the extracted city and province */}
        </div>
      ) : (
        <p>No QR code scanned yet.</p>
      )}
      <Button className="mt-4" onClick={() => setQRData(null)}>Clear</Button>
    </form>
  );
};

export default QRScanner;
