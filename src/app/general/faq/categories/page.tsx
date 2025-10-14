import React from 'react';
import FaqCategoriesTable from './Components/FaqCategoriesTable';
import axios from 'axios';

const fetchFaq = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL;
    const { data } = await axios.get(`${baseUrl}/api/v1/faq-category`);
    return data;
  } catch (error) {
    console.log('fetch facts Error:', error);
    return { data: [] };
  }
};

export default async function page() {
  const faq = await fetchFaq();
  return (
    <div className="  bg-white ">
      <FaqCategoriesTable data={faq?.data} />
    </div>
  );
}
