import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabase } from '@utils/supabaseClient';

// 명함 데이터 인터페이스 (카멜 케이스)
export interface BusinessCard {
  businessCardId: string;
  cardName: string;
  fieldsOfExpertise: string;
  subExpertise: string;
  company?: string;
  interests?: string[];
  phone?: string;
  email?: string;
  businessWebsite?: string;
  website?: string;
  experienceYears?: number;
  viewCount?: number;
  isPublic?: boolean;
  isPrimary?: boolean;
  createdAt?: string;
  nickname: string;
  cardType: string;
  businessName?: string;
  fax?: string;
  jobTitle?: string;
  department?: string;
  businessAddress?: string;
  horizontalCardImage?: string | null;
  verticalCardImage?: string | null;
  networkingMode?: boolean | null;
  networkingTime?: string | null;
  primaryUrl?: Record<string, string> | null;
  subFirstUrl?: Record<string, string> | null;
  subSecondUrl?: Record<string, string> | null;
  name: string;
}

interface DbBusinessCard {
  business_card_id: string;
  card_name: string;
  fields_of_expertise: string;
  sub_expertise: string;
  company?: string;
  interests?: string[]; // JSON 배열로 저장된 문자열 배열
  phone?: string;
  email?: string;
  business_website?: string;
  website?: string;
  experience_years?: number;
  view_count?: number;
  is_public?: boolean;
  is_primary?: boolean;
  created_at?: string;
  nickname: string;
  card_type: 'dawn' | 'morning' | 'day' | 'evening' | 'night';
  business_name?: string;
  fax?: string;
  job_title?: string;
  department?: string;
  business_address?: string;
  horizontal_card_image?: string | null;
  vertical_card_image?: string | null;
  networking_mode?: boolean | null;
  networking_time?: string | null;
  primary_url?: Record<string, string> | null;
  sub_url_01?: Record<string, string> | null;
  sub_url_02?: Record<string, string> | null;
  name: string;
}

export interface User {
  userId: string;
  nickname: string;
  email: string;
  name: string;
}

export const businessCardApi = createApi({
  reducerPath: 'businessCardApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['BusinessCard', 'User'],
  endpoints: (builder) => ({
    getBusinessCardById: builder.query<BusinessCard | null, string>({
      queryFn: async (cardId) => {
        try {
          const { data, error } = (await supabase
            .from('business_cards')
            .select(
              `
              business_card_id,
              card_name,
              fields_of_expertise,
              sub_expertise,
              company,
              interests,
              phone,
              email,
              business_website,
              website,
              experience_years,
              view_count,
              is_public,
              is_primary,
              created_at,
              nickname,
              card_type,
              business_name,
              fax,
              job_title,
              department,
              business_address,
              horizontal_card_image,
              vertical_card_image,
              networking_mode,
              networking_time,
              primary_url,
              sub_url_01,
              sub_url_02,
              name
            `,
            )
            .eq('business_card_id', cardId)
            .limit(1)
            .single()) as PostgrestSingleResponse<DbBusinessCard>;

          if (error) throw error;
          if (!data) return { data: null };

          // 스네이크 케이스 -> 카멜 케이스 변환
          const transformedData: BusinessCard = {
            businessCardId: data.business_card_id,
            cardName: data.card_name,
            fieldsOfExpertise: data.fields_of_expertise,
            subExpertise: data.sub_expertise,
            company: data.company ?? '',
            interests: Array.isArray(data.interests) ? data.interests : [],
            phone: data.phone ?? '',
            email: data.email ?? '',
            businessWebsite: data.business_website ?? '',
            website: data.website ?? '',
            experienceYears: data.experience_years ?? 0,
            viewCount: data.view_count ?? 0,
            isPublic: data.is_public ?? true,
            isPrimary: data.is_primary ?? false,
            createdAt: data.created_at ?? '',
            nickname: data.nickname ?? '',
            cardType: data.card_type ?? 'dawn',
            businessName: data.business_name ?? '',
            fax: data.fax ?? '',
            jobTitle: data.job_title ?? '',
            department: data.department ?? '',
            businessAddress: data.business_address ?? '',
            horizontalCardImage: data.horizontal_card_image ?? '',
            verticalCardImage: data.vertical_card_image ?? '',
            networkingMode: data.networking_mode ?? false,
            networkingTime: data.networking_time ?? '',
            primaryUrl: data.primary_url ?? null,
            subFirstUrl: data.sub_url_01 ?? null,
            subSecondUrl: data.sub_url_02 ?? null,
            name: data.name,
          };

          return { data: transformedData };
        } catch (error) {
          // 직렬화 가능한 에러 객체로 변환
          return {
            error: {
              message: error instanceof Error ? error.message : 'Unknown error',
              name: error instanceof Error ? error.name : 'Error',
            },
          };
        }
      },
      providesTags: (_, __, cardId) => [{ type: 'BusinessCard', id: cardId }],
    }),
    getUserByNickname: builder.query<User | null, string>({
      queryFn: async (nickname) => {
        try {
          const { data, error } = (await supabase
            .from('users')
            .select('user_id, nickname, email, name')
            .eq('nickname', nickname)
            .limit(1)
            .single()) as PostgrestSingleResponse<User>;

          if (error) throw error;

          if (!data) return { data: null };

          return { data };
        } catch (error) {
          return {
            error: {
              message: error instanceof Error ? error.message : 'Unknown error',
              name: error instanceof Error ? error.name : 'Error',
            },
          };
        }
      },
      providesTags: (_, __, nickname) => [{ type: 'User', id: nickname }],
    }),

    // 명함 추가 API 수정 필요 추가 카드 타입, 추가 정보 입력 후 가능하도록
    addBusinessCard: builder.mutation<BusinessCard, { nickname: string }>({
      queryFn: async ({ nickname }) => {
        try {
          const { error } = await supabase
            .from('business_cards')
            .insert({
              card_name: '', // 기본값
              fields_of_expertise: '', // 기본값
              sub_expertise: '', // 기본값
              nickname, // 추가한 사람의 닉네임
              is_public: false, // 기본값으로 비공개 설정
              is_primary: false, // 대표 명함 아님
              card_type: 'dawn', // 기본값으로 'dawn'
            })
            .select()
            .single();

          if (error) throw error;

          return { data: undefined };
        } catch (error) {
          return {
            error:
              error instanceof Error
                ? { message: error.message, name: error.name }
                : { message: 'Unknown Error', name: 'Error' },
          };
        }
      },
      invalidatesTags: ['BusinessCard'],
    }),
    deleteBusinessCard: builder.mutation<void, string>({
      queryFn: async (cardId) => {
        try {
          const { error } = await supabase
            .from('business_cards')
            .delete()
            .eq('business_card_id', cardId);

          if (error) throw error;

          return { data: undefined };
        } catch (error) {
          return {
            error: {
              message: error instanceof Error ? error.message : 'Unknown error',
              name: error instanceof Error ? error.name : 'Error',
            },
          };
        }
      },
      invalidatesTags: (_, __, cardId) => [{ type: 'BusinessCard', id: cardId }],
    }),
    setPrimaryBusinessCard: builder.mutation<void, string>({
      queryFn: async (cardId) => {
        try {
          const { error } = await supabase
            .from('business_cards')
            .update({ is_primary: true }) // is_primary를 true로 업데이트
            .eq('business_card_id', cardId); // cardId 조건

          if (error) throw error;

          return { data: undefined };
        } catch (error) {
          return {
            error: {
              message: error instanceof Error ? error.message : 'Unknown error',
              name: error instanceof Error ? error.name : 'Error',
            },
          };
        }
      },
      invalidatesTags: (_, __, cardId) => [
        { type: 'BusinessCard', id: cardId }, // 현재 대표 명함
        { type: 'BusinessCard' }, // 모든 카드 목록 무효화
      ],
    }),
  }),
});

export const {
  useGetBusinessCardByIdQuery,
  useAddBusinessCardMutation,
  useDeleteBusinessCardMutation,
  useGetUserByNicknameQuery,
  useSetPrimaryBusinessCardMutation,
} = businessCardApi;
