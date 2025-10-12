import axios from 'axios';
import SocialLinks from '../../Components/Social_links';

const fetchSocalLinks = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL;
    const { data } = await axios.get(`${baseUrl}/api/v1/public/footer-widgets`);
    return data;
  } catch (error) {
    console.log('fetch facts Error:', error);
    return { data: [] };
  }
};

export default async function page() {
  const socailLinks = await fetchSocalLinks();
  console.log(socailLinks);

  return <SocialLinks socialLink={socailLinks.data.links} />;
}
