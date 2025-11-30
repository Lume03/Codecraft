import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  render,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface WeeklySummaryEmailProps {
  username?: string;
  streak?: number;
  averageScore?: number;
  totalPractices?: number;
  lessonsCompleted?: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:9002';

const StatCard = ({
  icon,
  value,
  label,
  valueColor = 'text-white',
}: {
  icon: string;
  value: string | number;
  label: string;
  valueColor?: string;
}) => (
  <div className="w-full rounded-xl bg-[#2A2A2A] p-6 text-center border border-solid border-[#333333]">
    <Text className="m-0 text-4xl leading-none mb-4">{icon}</Text>
    <Text className={`m-0 text-2xl font-bold ${valueColor}`}>{value}</Text>
    <Text className="m-0 mt-2 text-xs font-semibold text-[#888888] uppercase tracking-wider">{label}</Text>
  </div>
);

export const WeeklySummaryEmail = ({
  username = 'Estudiante',
  streak = 0,
  averageScore = 0,
  totalPractices = 0,
  lessonsCompleted = 0,
}: WeeklySummaryEmailProps) => {
  const previewText = `¡Imparable, ${username}! Mira tu progreso de esta semana en RavenCode.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: '#66D3FF',
                darkBg: '#121212',
                cardBg: '#1E1E1E',
                statCardBg: '#2A2A2A',
                orange: '#FF9F43',
                green: '#2ECC71',
                yellow: '#F1C40F',
                lightText: '#B0B0B0',
                mutedText: '#888888',
              },
            },
          },
        }}
      >
        <Body className="mx-auto my-auto bg-darkBg px-2 font-sans">
          <Container className="mx-auto my-[40px] w-full max-w-[480px]">

            <Section className="text-center">
              <Text className="text-2xl font-bold text-white">RavenCode</Text>
              <Text className="text-sm text-lightText">Resumen Semanal</Text>
            </Section>

            <Section className="rounded-xl bg-cardBg p-8">
              <Section className="text-center">
                <Text className="text-2xl font-bold text-white">
                  ¡Imparable, {username}!
                </Text>
                <Text className="text-base text-lightText">
                  Esta semana has estado on fire. Aquí tienes tus resultados:
                </Text>
              </Section>

              <Section className="mt-8">
                <Row>
                  <Column className="w-1/2 pr-2 align-top">
                    <StatCard
                      icon="🔥"
                      value={`${streak} Días`}
                      label="Racha Actual"
                      valueColor="text-orange"
                    />
                  </Column>
                  <Column className="w-1/2 pl-2 align-top">
                    <StatCard
                      icon="🎯"
                      value={`${averageScore}%`}
                      label="Precisión Global"
                      valueColor="text-green"
                    />
                  </Column>
                </Row>
                <Row className="mt-4">
                  <Column className="w-1/2 pr-2 align-top">
                    <StatCard
                      icon="📝"
                      value={totalPractices}
                      label="Ejercicios"
                      valueColor="text-white"
                    />
                  </Column>
                  <Column className="w-1/2 pl-2 align-top">
                    <StatCard
                      icon="🏅"
                      value={lessonsCompleted}
                      label="Secciones Dominadas"
                      valueColor="text-yellow"
                    />
                  </Column>
                </Row>
              </Section>

              <Section className="mt-8 text-center">
                <Button
                  className="rounded-full bg-primary px-10 py-4 text-center text-base font-bold text-black no-underline"
                  href={`${baseUrl}/learn`}
                >
                  Continuar mi Racha
                </Button>
              </Section>
            </Section>

            <Section className="mt-6 text-center">
              <Text className="text-xs text-mutedText">
                Recibes este correo porque tienes activados los resúmenes
                semanales.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
