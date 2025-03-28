// UserCardPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIncrementViewCountMutation } from '@features/User/api/viewCountApi';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { useGetBusinessCardByIdQuery } from '@features/BusinessCard/api/businessCardApi';
import HorizontalCard from '@components/commons/Card/HorizontalCard';
import { Header } from '@components/commons/Header/Header';
import { IconButton } from '@components/commons/Button/IconButton';
import QrIcon from '@components/NetworkingListPage/UI/QrIcon';
import AlarmIcon from '@components/NetworkingListPage/UI/AlarmIcon';
import QRScanDisplayModal from '@components/commons/QR/QRScanDisplayModal';
import { Button } from '@components/commons/Button/Button';
import { ChevronLeft } from 'lucide-react';
import { ScrollArea } from '@components/ui/scroll-area';
import CareerInfo from '@components/CardInfo/CareerInfo';
import ContactInfo from '@components/CardInfo/ContactInfo';

const UserCardPage: React.FC = (): React.JSX.Element => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  // URL 파라미터: 상대방 명함 ID
  const { nickname, businessCardId } = useParams<{ nickname: string; businessCardId: string }>();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isHeaderSolid, setIsHeaderSolid] = useState(false);

  // 명함 상세 데이터 API 호출
  const { data: businessCard, isLoading, error } = useGetBusinessCardByIdQuery(businessCardId!);

  const [incrementViewCount] = useIncrementViewCountMutation();

  console.log(businessCard?.interests);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsHeaderSolid(scrollPosition > 56);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (nickname && userInfo?.nickname && nickname !== userInfo.nickname) {
      // URL의 nickname이 현재 로그인한 유저의 nickname과 다를 경우에만 조회수 증가
      incrementViewCount({
        nickname: userInfo.nickname, // 조회하는 사람의 닉네임 (현재 로그인한 사용자)
        businessCardId: businessCardId!, // 대상 명함 ID
      }).catch((err) => console.error('조회수 증가 실패:', err));
    }
    // eslint-disable-next-line
  }, [nickname, userInfo?.nickname, businessCardId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">로딩 중...</div>
    );
  }
  if (error || !businessCard) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        명함 데이터를 불러오는데 실패했습니다.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white flex flex-col justify-start flex-grow overflow-y-auto"
      style={{
        background: 'linear-gradient(0deg, #121212 86.3%, #606171 100%)',
      }}
    >
      <Header
        className={`px-[16px] fixed top-0 left-0 z-12 w-full transition-colors duration-500 ${
          isHeaderSolid ? 'bg-[#121212]/70 backdrop-filter backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <Header.Left>
          <ChevronLeft className="w-7 h-7" />
        </Header.Left>
        <Header.Right>
          <IconButton icon={<QrIcon />} onClick={() => setIsQRModalOpen(true)} />
          <IconButton icon={<AlarmIcon />} />
        </Header.Right>
      </Header>
      <div className="relative flex flex-col mt-14 pt-[30px] pb-10 items-center justify-start overflow-x-hidden">
        {/* 이름 * 명함 이미지 */}
        <div className="w-full px-4 gap-4">
          <div className="h-[48px] text-[32px] text-[var(--text-accent)] font-bold leading-[150%]">
            {businessCard?.businessName ? businessCard?.businessName : businessCard.name}
          </div>
          <div className="flex py-0 justify-center">
            <HorizontalCard cardId={businessCardId!} />
          </div>
          {/* 관심사 스크롤 */}
        </div>
        <ScrollArea className="w-full pl-4 mb-4 relative">
          <div className="flex flex-row gap-[6px] flex-nowrap overflow-x-auto">
            {businessCard.interests?.map((interest, index) => (
              <div
                key={index}
                className="px-[10px] py-[8px] bg-gray-800 rounded-[4px] text-[12px] leading-[150%] text-white text-center whitespace-nowrap"
              >
                {interest}
              </div>
            ))}
            <div className="px-[10px] py-[8px] bg-gray-800 rounded-[4px] text-[12px] leading-[150%] text-white text-center whitespace-nowrap">
              관심사12222
            </div>
            <div className="px-[10px] py-[8px] bg-gray-800 rounded-[4px] text-[12px] leading-[150%] text-white text-center whitespace-nowrap">
              관심사2
            </div>
          </div>
        </ScrollArea>

        <div className="w-full px-4">
          <Button btntype="enabled" className="w-full py-2 font-medium">
            <div className="text-[14px] leading-[24px]">카드 선택</div>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <div className="flex flex-col gap-[10px]">
          <CareerInfo
            company={businessCard.company}
            jobTitle={businessCard.jobTitle}
            experienceYears={businessCard.experienceYears}
            fieldsOfExpertise={businessCard.fieldsOfExpertise}
            subExpertise={businessCard.subExpertise}
          />
        </div>

        <ContactInfo
          phone={businessCard.phone || undefined}
          email={businessCard.email || undefined}
          primaryUrl={businessCard.primaryUrl ?? undefined}
          subFirstUrl={businessCard.subFirstUrl ?? undefined}
          subSecondUrl={businessCard.subSecondUrl ?? undefined}
        />
      </div>
      <QRScanDisplayModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </div>
  );
};

export default UserCardPage;
