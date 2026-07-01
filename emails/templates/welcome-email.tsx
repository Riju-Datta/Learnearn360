import {
  Html, Head, Body, Container, Section, Text, Button, Heading, Hr, Preview,
} from "@react-email/components";

type Props = { name: string; dashboardUrl: string };

export default function WelcomeEmail({ name, dashboardUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to LearnEarn 360 — let's get you started</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>LearnEarn <span style={{ color: "#10b981" }}>360</span></Heading>
          <Section style={card}>
            <Heading style={h1}>Welcome, {name}! 🚀</Heading>
            <Text style={text}>
              You've just joined thousands of learners and earners building real skills and real income.
            </Text>
            <Text style={subheading}>Get started in 3 steps:</Text>
            <Text style={listItem}>1. Complete your profile</Text>
            <Text style={listItem}>2. Join your first room</Text>
            <Text style={listItem}>3. Set your daily goals</Text>
            <Section style={{ textAlign: "center" as const, marginTop: 32 }}>
              <Button style={button} href={dashboardUrl}>Go to Dashboard</Button>
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
const card = { backgroundColor: "#0f172a", borderRadius: "12px", padding: "32px", border: "1px solid #1e293b" };
const h1 = { color: "#ffffff", fontSize: "22px", marginBottom: "16px" };
const text = { color: "#94a3b8", fontSize: "15px", lineHeight: "1.6" };
const subheading = { color: "#10b981", fontSize: "15px", fontWeight: "600" as const, marginTop: "20px" };
const listItem = { color: "#94a3b8", fontSize: "14px", margin: "6px 0" };
const button = { backgroundColor: "#3b82f6", color: "#ffffff", padding: "14px 32px", borderRadius: "8px", textDecoration: "none", fontWeight: "600" as const, fontSize: "16px" };
const hr = { borderColor: "#1e293b", margin: "32px 0" };
const footer = { color: "#475569", fontSize: "12px", textAlign: "center" as const };
