// File: lib/utils/time.ts

/**
 * "1m", "1h", "7d" এর মতো স্ট্রিংকে মিলিসেকেন্ডে পার্স করে।
 * @param expiresIn - যেমন "1m", "10h", "30d"
 * @returns মিলিসেকেন্ডে সময়
 */
export const parseExpiresIn = (expiresIn: string): number => {
  if (!expiresIn) {
    return 60 * 60 * 1000; // ডিফল্ট ১ ঘন্টা
  }

  const unit = expiresIn.slice(-1).toLowerCase(); // 's', 'm', 'h', 'd'
  const value = parseInt(expiresIn.slice(0, -1), 10);

  if (isNaN(value)) {
    return 60 * 60 * 1000; // পার্স ফেইল হলে ডিফল্ট ১ ঘন্টা
  }

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      // যদি শুধু সংখ্যা থাকে (যেমন "3600000"), সেটাকে মিলিসেকেন্ড হিসেবেই ধরে নিবে
      if (!isNaN(parseInt(expiresIn, 10))) {
        return parseInt(expiresIn, 10);
      }
      return 60 * 60 * 1000; // ডিফল্ট ১ ঘন্টা
  }
};