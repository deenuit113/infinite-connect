import React, { useState } from 'react';
import { Dialog, DialogContent } from '@components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';
import { X } from 'lucide-react';
import QRScannerTabContent from './QRScannerTabContent';
import QRDisplayTabContent from './QRDisplayTabContent';

interface QRScanDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRScanDisplayModal: React.FC<QRScanDisplayModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('tab1');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        hideCloseButton
        className="
                fixed inset-0 w-full h-full max-w-none max-h-none 
                translate-x-0 translate-y-0 rounded-none border-none shadow-none
                p-0 flex flex-col bg-white
              "
      >
        <button
          onClick={onClose}
          className="absolute z-50 top-4 right-4 text-white opacity-80 hover:opacity-100"
        >
          <X size={24} />
        </button>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow">
          {/* TabsList 중앙 정렬 */}
          <TabsList
            className="
              absolute w-[342px] h-[46px] top-[132px] left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 
              flex justify-center items-center bg-[#2a2a2a] rounded-[100px] 
            "
          >
            <TabsTrigger
              value="tab1"
              className="
                px-6 py-2 text-sm font-medium rounded-[100px]
                bg-[#7253ff] text-[var(--text-secondary)]  data-[state=active]:bg-[#7253ff] data-[state=active]:text-[var(--text-secondary)] 
                data-[state=inactive]:bg-transparent data-[state=inactive]:text-[var(--text-secondary)]
              "
            >
              QR 스캔
            </TabsTrigger>
            <TabsTrigger
              value="tab2"
              className="
                px-6 py-2 text-sm font-medium rounded-[100px]
                bg-transparent text-[var(--text-secondary)] data-[state=active]:bg-[#7253ff] data-[state=active]:text-black
                data-[state=inactive]:bg-transparent data-[state=inactive]:text-[var(--text-secondary)]
              "
            >
              QR 표시
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="flex justify-start items-start bg-white">
            {/* QR 스캐너 콘텐츠 */}
            <QRScannerTabContent isActive={activeTab === 'tab1'} />
          </TabsContent>
          <TabsContent value="tab2" className="mt-25 py-6 text-white">
            <QRDisplayTabContent />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanDisplayModal;
