import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
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

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  valueColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  valueColor,
}) => (
  <table
    width="100%"
    cellPadding={0}
    cellSpacing={0}
    style={{
      borderCollapse: 'separate',
      backgroundColor: '#2A2A2A',
      borderRadius: 16,
      border: '1px solid #333333',
    }}
  >
    <tbody>
      <tr>
        <td
          style={{
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              marginBottom: '8px',
              lineHeight: '1',
            }}
          >
            {icon}
          </div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: valueColor,
            }}
          >
            {value}
          </div>
          <div
            style={{
              marginTop: '4px',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#888888',
            }}
          >
            {label}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
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
            {/* Header */}
            <Section className="text-center">
              <Text className="text-2xl font-bold text-white">RavenCode</Text>
              <Text className="text-sm text-lightText">Resumen Semanal</Text>
            </Section>

            {/* Card principal */}
            <Section className="rounded-xl bg-cardBg p-8">
              <Section className="text-center">
                <Text className="text-2xl font-bold text-white">
                  ¡Imparable, {username}!
                </Text>
                <Text className="text-base text-lightText">
                  Esta semana has estado on fire. Aquí tienes tus resultados:
                </Text>
              </Section>

              {/* Stats */}
              <Section className="mt-8">
                {/* Fila 1 */}
                <table
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ borderCollapse: 'separate' }}
                >
                  <tbody>
                    <tr>
                      <td width="50%" style={{ paddingRight: '8px' }}>
                        <StatCard
                          icon="🔥"
                          value={`${streak} Días`}
                          label="Racha Actual"
                          valueColor="#FF9F43"
                        />
                      </td>
                      <td width="50%" style={{ paddingLeft: '8px' }}>
                        <StatCard
                          icon="🎯"
                          value={`${averageScore}%`}
                          label="Precisión Global"
                          valueColor="#2ECC71"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Fila 2 */}
                <table
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ marginTop: '16px', borderCollapse: 'separate' }}
                >
                  <tbody>
                    <tr>
                      <td width="50%" style={{ paddingRight: '8px' }}>
                        <StatCard
                          icon="📝"
                          value={totalPractices}
                          label="Ejercicios"
                          valueColor="#FFFFFF"
                        />
                      </td>
                      <td width="50%" style={{ paddingLeft: '8px' }}>
                        <StatCard
                          icon="🏅"
                          value={lessonsCompleted}
                          label="Secciones Dominadas"
                          valueColor="#F1C40F"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>

              {/* Botón */}
              <Section className="mt-8 text-center">
                <Button
                  className="rounded-full bg-primary px-10 py-4 text-center text-base font-bold text-black no-underline"
                  href={`${baseUrl}/learn`}
                >
                  Continuar mi Racha
                </Button>
              </Section>
            </Section>

            {/* Footer */}
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
