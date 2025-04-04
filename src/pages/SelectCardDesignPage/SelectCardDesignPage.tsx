import { Button } from '@components/commons/Button/Button';
import TypeCardCarousel from '@components/commons/Card/TypeCardCarousel';
import { Header } from '@components/commons/Header/Header';
import { Logo } from '@components/commons/Header/Logo';
import { CardType } from '@components/SelectCardDesignPage/types';
import { gradients } from '@constants/cardType';
import { useUpdateBusinessCardTypeMutation } from '@features/BusinessCard/api/selectCardDesignApi';
import { RootState } from '@store/store';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const SelectCardDesignPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [cardType, setCardType] = useState<CardType>('dawn');
  const [updateCardType, { isLoading }] = useUpdateBusinessCardTypeMutation();
  const [gradient, setGradient] = useState<string>(
    'linear-gradient(0deg, #121212 86.3%, #9A8BC6 100%)',
  );
  const [nextGradient, setNextGradient] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { businessCardId } = location.state || {};

  const handleCompleteSelection = async () => {
    if (!businessCardId) {
      alert('유효한 명함 ID가 없습니다.');
      return;
    }
    try {
      await updateCardType({ cardId: businessCardId, cardType });
      console.log('선택한 타입:', cardType);
      alert('명함 타입이 성공적으로 업데이트되었습니다!');
      navigate('/additionalinfo', {
        state: { businessCardId: businessCardId },
      });
    } catch (error) {
      console.error('명함 타입 업데이트 중 오류 발생:', error);
      alert('명함 타입 업데이트에 실패했습니다.');
    }
  };

  const handleCardTypeChange = (newCardType: CardType) => {
    const keys = Object.keys(gradients) as CardType[];
    const currentIndex = keys.indexOf(cardType); // 현재 인덱스
    const nextIndex = keys.indexOf(newCardType); // 다음 인덱스

    if (currentIndex !== nextIndex) {
      setNextGradient(gradients[newCardType]); // 다음 배경 설정
      setIsTransitioning(true); // 트랜지션 시작

      setTimeout(() => {
        setGradient(gradients[newCardType]); // 현재 배경 업데이트
        setIsTransitioning(false); // 트랜지션 종료
      }, 800); // 애니메이션 지속 시간과 동일하게 설정
    }

    setCardType(newCardType); // 카드 타입 업데이트
  };

  if (!businessCardId) {
    return <p>유효한 명함 ID가 없습니다.</p>;
  }

  return (
    <div
      className="flex flex-col justify-center items-center h-screen box-border bg-[var(--bg-default-black)]"
      style={{
        background: nextGradient,
      }}
    >
      {/* 배경 */}
      <div
        className={`absolute inset-0 transition-opacity duration-800 ease-in-out`}
        style={{
          background: gradient,
          opacity: isTransitioning ? 0 : 1,
        }}
      ></div>
      {/* 상단 상태바 */}
      <Header className="px-[16px] bg-transparent fixed top-0 left-0 z-12">
        <Header.Left>
          <Logo />
          <span className="font-semibold text-[20px] text-white tracking-[-0.33px]">
            Networking
          </span>
        </Header.Left>
      </Header>
      {/* 정보 & 캐러셀 영역 */}
      <div className="flex-1 z-10 pt-14">
        <div className="text-white text-[20px] font-bold mt-[36px] h-[56px] mb-[22px] mx-[19px] leading-[140%]">
          {userInfo?.name}님이 선호하는 <br /> 네트워킹 시간대를 선택해주세요
        </div>
        <div className="items-center">
          <TypeCardCarousel onCardTypeChange={handleCardTypeChange} />
        </div>
      </div>
      <div className="flex w-full h-[104px] mt-[55px] pt-[16px] pb-[24px] px-[16px] z-10">
        <Button
          btntype="enabled"
          className="w-full py-2"
          onClick={handleCompleteSelection}
          disabled={isLoading}
        >
          <div className="text-[14px] leading-[24px]">카드 선택</div>
        </Button>
      </div>
    </div>
  );
};

export default SelectCardDesignPage;
