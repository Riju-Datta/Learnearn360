import {
  Html, Head, Body, Container, Section, Text, Button, Heading, Hr, Preview,
} from "@react-email/components";

type Props = { name: string; streak: number; dashboardUrl: string };

export default function StreakReminderEmail({ name, streak, dashboardUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Don't lose your {streak}-day streak, {name}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>LearnEarn <span style={{ color: "#10b981" }}>360</span></Heading>
          <Section style={card}>
            <Text style={emoji}>🔥</Text>
            <Heading style={h1}>Your {streak}-day streak is waiting!</Heading>
            <Text style={text}>
              Hey {name}, you haven't checked in today. A few minutes of learning keeps your streak alive
              and your momentum going.
            </Text>
            <Section style={{ textAlign: "center" as const, marginTop: 24 }}>
              <Button style={button} href={dashboardUrl}>Continue My Streak</Button>
            </Section>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>© 2026 LearnEarn 360. All rights reserved.</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#030712", fontFamily: "Inter, sans-serif" };
const container = { margin: "0 auto", padding: "40px 20px", maxWidth: "600px" };
const logo = { color: "#3b82f6", fontSize: "28px", textAlign: "center" as const, marginBottom: "24px" };
const card = { backgroundColor: "#0f172a", borderRadius: "12px", padding: "32px", border: "1px solid #1e293b", textAlign: "center" as const };
const emoji = { fontSize: "48px", margin: "0 0 8px" };
const h1 = { color: "#ffffff", fontSize: "22px", marginBottom: "12px" };
const text = { color: "#94a3b8", fontSize: "15px", lineHeight: "1.6" };
const button = { backgroundColor: "#f97316", color: "#ffffff", padding: "14px 32px", borderRadius: "8px", textDecoration: "none", fontWeight: "600" as const, fontSize: "16px" };
const hr = { borderColor: "#1e293b", margin: "32px 0" };
const footer = { color: "#475569", fontSize: "12px", textAlign: "center" as const };
