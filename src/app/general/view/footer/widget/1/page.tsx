import axios from 'axios';
import SocialLinks from '../Components/Social_links';

export default async function Page() {
  let socialLinks = [];
  try {
    const res = await axios.get(
      'http://localhost:3000/api/v1/public/social-links'
    );
    if (res.data?.success) socialLinks = res.data.data;
  } catch (err) {
    console.error(err);
  }
  return <SocialLinks initialLinks={socialLinks} />;
}
