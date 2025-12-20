'use client';

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, Shield, CheckCircle, Upload, Zap } from "lucide-react";

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".hero-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      })
        .from(".hero-cta", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        }, "-=0.5")
        .from(".feature-card", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        }, "-=0.5");

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen flex flex-col" ref={heroRef}>
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center pt-20 pb-32">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 text-violet-600 text-sm font-medium hero-text border border-violet-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            AI-Powered Policy Analysis
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 hero-text">
            Ensure Compliance with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              Intelligent AI
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto hero-text">
            Upload your policy documents and let our advanced AI analyze them for compliance, risks, and improvements in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 hero-cta">
            <Link
              href="/upload"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all hover:scale-105 shadow-lg shadow-violet-500/25"
            >
              <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              Upload Document
            </Link>
            <Link
              href="/policies"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-900 border border-slate-200 font-medium hover:bg-violet-50 hover:border-violet-200 transition-all"
            >
              View Policies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white border-t border-slate-100" ref={featureRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why use ComplianceAI?</h2>
            <p className="text-slate-600">Streamline your compliance process with cutting-edge technology</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Risk Detection",
                desc: "Automatically identify potential compliance risks and policy violations."
              },
              {
                icon: CheckCircle,
                title: "Instant Validation",
                desc: "Get immediate feedback on policy documents with detailed reports."
              },
              {
                icon: Zap,
                title: "Smart Analysis",
                desc: "Deep semantic understanding of legal and corporate terminology."
              }
            ].map((feature, i) => (
              <div key={i} className="feature-card p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-100 transition-all">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-violet-100 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-violet-600" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
