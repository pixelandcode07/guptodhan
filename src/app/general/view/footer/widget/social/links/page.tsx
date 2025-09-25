import axios from 'axios';
import SocialLinks from '../../Components/Social_links';

export default async function page() {
  let socailLinks = null;
  try {
    const res = await axios.get(
      'http://localhost:3000/api/v1/public/footer-widgets',
      {
        headers: { 'Cache-Control': 'no-store' },
      }
    );

    if (
      res.data?.success &&
      Array.isArray(res.data.data) &&
      res.data.data.length > 0
    ) {
      socailLinks = res.data.data[0];
    }
  } catch (err: any) {
    console.error('API Error:', err.response?.data || err.message);
  }
  return <SocialLinks socialLink={socailLinks} />;
}
