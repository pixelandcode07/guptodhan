'use client';

import React from 'react';

import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  Smartphone,
  Send,
  Youtube,
  Film,
  PhoneCall,
  MessageSquareHeart,
  CircleX,
  Save,
} from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const page: React.FC = () => {
  return (
    <div className="mb-6">
      <div className="bg-white shadow rounded pt-4 ">
        <SectionTitle text="Update  Social Media Links" />

        <form className="space-y-4 p-4 pt-0 max-w-[1000px] mt-10 text-sm mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="facebook"
                className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Facebook className="w-4 h-4 text-blue-600" /> Facebook:
              </label>
              <Input
                id="facebook"
                name="facebook"
                defaultValue="https://www.facebook.com/guptodhanbd"
                placeholder="https://facebook.com/"
              />
            </div>

            <div>
              <label
                htmlFor="twitter"
                className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Twitter className="w-4 h-4 text-sky-500" /> Twitter:
              </label>
              <Input
                id="twitter"
                name="twitter"
                defaultValue="#"
                placeholder="https://twitter.com/"
              />
            </div>

            <div>
              <label
                htmlFor="instagram"
                className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Instagram className="w-4 h-4 text-yellow-500" /> Instagram:
              </label>
              <Input
                id="instagram"
                name="instagram"
                defaultValue=""
                placeholder="https://instagram.com/"
              />
            </div>

            <div>
              <label
                htmlFor="linkedin"
                className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Linkedin className="w-4 h-4 text-blue-700" /> Linkedin:
              </label>
              <Input
                id="linkedin"
                name="linkedin"
                defaultValue=""
                placeholder="https://linkedin.com/"
              />
            </div>

            <div>
              <label
                htmlFor="messenger"
                className="block text-sm font-medium mb-1 flex items-center gap-1">
                <MessageCircle className="w-4 h-4 text-teal-400" /> Messenger:
              </label>
              <Input
                id="messenger"
                name="messenger"
                defaultValue="#"
                placeholder="https://m.me/username"
              />
            </div>

            <div>
              <label
                htmlFor="whatsapp"
                className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Smartphone className="w-4 h-4 text-green-600" /> WhatsApp:
              </label>
              <Input
                id="whatsapp"
                name="whatsapp"
                defaultValue="#"
                placeholder="https://whatsapp.com/"
              />
            </div>

            <div>
              <label
                htmlFor="telegram"
                className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Send className="w-4 h-4 text-sky-600" /> Telegram:
              </label>
              <Input
                id="telegram"
                name="telegram"
                defaultValue="#"
                placeholder="https://telegram.com/"
              />
            </div>

            <div>
              <label
                htmlFor="youtube"
                className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Youtube className="w-4 h-4 text-red-600" /> Youtube:
              </label>
              <Input
                id="youtube"
                name="youtube"
                defaultValue="https://www.youtube.com/@guptodhanlive"
                placeholder="https://youtube.com/"
              />
            </div>

            <div>
              <label
                htmlFor="tiktok"
                className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Film className="w-4 h-4" /> Tiktok:
              </label>
              <Input
                id="tiktok"
                name="tiktok"
                defaultValue=""
                placeholder="https://www.tiktok.com/@username"
              />
            </div>

            <div>
              <label
                htmlFor="pinterest"
                className="block text-sm font-medium mb-1 flex items-center gap-1">
                <MessageSquareHeart className="w-4 h-4 text-red-700" />
                Pinterest:
              </label>
              <Input
                id="pinterest"
                name="pinterest"
                defaultValue="#"
                placeholder="https://www.pinterest.com/ideas"
              />
            </div>

            <div>
              <label
                htmlFor="viber"
                className="block text-sm font-medium mb-1 flex items-center gap-1">
                <PhoneCall className="w-4 h-4 text-purple-700" /> Viber:
              </label>
              <Input
                id="viber"
                name="viber"
                defaultValue=""
                placeholder="https://www.viber.com"
              />
            </div>
          </div>

          <div className="flex justify-center gap-2 pt-4">
            <Button
              // text="Cancel"
              // variant="danger"
              // size="sm"
              // icon={<CircleX className="w-4 h-4" />}
              variant="destructive">
              Cencle
            </Button>
            <Button
            // text="Update Color"
            // variant="primary"
            // size="sm"
            // icon={<Save className="w-4 h-4" />}
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
