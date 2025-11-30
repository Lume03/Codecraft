import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  render,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface WeeklySummaryEmailProps {
  username?: string;
  totalPractices?: number;
  lessonsCompleted?: number;
  averageScore?: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:9002';

const StatCard = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => (
  <div className="rounded-lg bg-gray-100 p-4 text-center">
    <Text className="m-0 text-3xl font-bold text-gray-800">{value}</Text>
    <Text className="m-0 mt-1 text-sm text-gray-500">{label}</Text>
  </div>
);

export const WeeklySummaryEmail = ({
  username = 'Estudiante',
  totalPractices = 0,
  lessonsCompleted = 0,
  averageScore = 0,
}: WeeklySummaryEmailProps) => {
  const previewText = `¡Mira tu increíble progreso esta semana, ${username}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: '#66D3FF', // Matching your app's primary color
              },
            },
          },
        }}
      >
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px] text-center">
              {/* Using a placeholder for the logo */}
              <Text className="text-2xl font-bold text-black">RavenCode</Text>
            </Section>
            <Section>
              <Text className="text-[16px] leading-[24px] text-black">
                ¡Hola, <strong>{username}</strong>!
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                Aquí tienes un resumen de tu increíble progreso de aprendizaje en
                RavenCode durante la última semana. ¡Sigue así, lo estás haciendo
                genial!
              </Text>
            </Section>

            <Section className="mt-[24px]">
              <div className="grid grid-cols-3 gap-3">
                <StatCard value={totalPractices} label="Prácticas" />
                <StatCard value={lessonsCompleted} label="Lecciones" />
                <StatCard value={`${averageScore}%`} label="Puntaje" />
              </div>
            </Section>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded-full bg-primary px-5 py-3 text-center text-[14px] font-semibold text-black no-underline"
                href={`${baseUrl}/learn`}
              >
                Continuar Aprendiendo
              </Button>
            </Section>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              Recibes este correo porque tienes activadas las notificaciones de resumen semanal en tu cuenta de RavenCode.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
