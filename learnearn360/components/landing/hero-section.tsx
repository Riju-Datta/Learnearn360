"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, BookOpen, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, label: "Active Learners", value: "12,000+" },
  { icon: BookOpen, label: "Courses", value: "150+" },
  { icon: TrendingUp, label: "Jobs Landed", value: "2,400+" },
  { icon: Star, label: "Avg Rating", value: "4.9/5" },
];

const hubs = [
  { icon: "💻", label: "Coding", color: "from-blue-500/20 to-blue-600/10 border-blue-500/30" },
  { icon: "🚀", label: "Startup Hub", color: "from-orange-500/20 to-orange-600/10 border-orange-500/30" },
  { icon: "💼", label: "Freelancing", color: "from-green-500/20 to-green-600/10 border-green-500/30" },
  { icon: "🤖", label: "AI Hub", color: "from-pink-500/20 to-pink-600/10 border-pink-500/30" },
  { icon: "🎯", label: "Career Hub", color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30" },
  { icon: "💰", label: "Money-Making", color: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <Zap className="w-4 h-4" />
          <span>All-in-one Learn & Earn Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
          <span className="text-white">Learn Skills.</span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Build Connections.
          </span>
          <br />
          <span className="text-white">Earn Money.</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          The platform that combines <strong className="text-gray-200">learning</strong>, <strong className="text-gray-200">community</strong>, <strong className="text-gray-200">accountability</strong>, and <strong className="text-gray-200">real earning opportunities</strong> — all in one place. From zero to income, step by step.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-xl shadow-blue-500/25 h-14 px-8 text-base font-semibold">
              Start for Free — No Credit Card
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5 hover:text-white h-14 px-8 text-base">
              See How It Works
            </Button>
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <stat.icon className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Hub pills */}
        <div>
          <p className="text-sm text-gray-500 mb-4">8 specialized hubs for every goal</p>
          <div className="flex flex-wrap justify-center gap-3">
            {hubs.map((hub) => (
              <div key={hub.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r border text-sm font-medium text-gray-300 ${hub.color}`}>
                <span>{hub.icon}</span>
                <span>{hub.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
