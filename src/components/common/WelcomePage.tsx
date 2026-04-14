"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  MapPin,
  Sparkles,
  Home,
  Key,
  TrendingUp,
  Award,
  Users,
  Clock,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Search,
  Bath,
  Bed,
  Square,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const sampleProperties = [
  {
    id: 1,
    title: "Luxury Villa with Pool",
    location: "Malabar Hill, Mumbai",
    price: "₹25,00,00,000",
    beds: 5,
    baths: 4,
    sqft: "4,500",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
    tag: "Featured",
  },
  {
    id: 2,
    title: "Modern Downtown Penthouse",
    location: "Bandra West, Mumbai",
    price: "₹32,00,00,000",
    beds: 3,
    baths: 3,
    sqft: "2,800",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    tag: "New",
  },
  {
    id: 3,
    title: "Beachfront Paradise",
    location: "Juhu Beach, Mumbai",
    price: "₹18,50,00,000",
    beds: 4,
    baths: 3,
    sqft: "3,200",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    tag: "Hot",
  },
  {
    id: 4,
    title: "Mountain Retreat Villa",
    location: "Lonavala, Maharashtra",
    price: "₹41,00,00,000",
    beds: 6,
    baths: 5,
    sqft: "5,500",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    tag: "Premium",
  },
  {
    id: 5,
    title: "Smart Home Estate",
    location: "Bengaluru, Karnataka",
    price: "₹14,50,00,000",
    beds: 4,
    baths: 3,
    sqft: "3,100",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    tag: "Smart",
  },
  {
    id: 6,
    title: "Heritage Bungalow",
    location: "Chennai, Tamil Nadu",
    price: "₹21,00,00,000",
    beds: 4,
    baths: 2,
    sqft: "2,900",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
    tag: "Heritage",
  },
];

const stats = [
  { value: "10K+", label: "Properties Listed" },
  { value: "5K+", label: "Happy Clients" },
  { value: "500+", label: "Expert Agents" },
  { value: "50+", label: "Cities Covered" },
];

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Find your perfect property with AI-powered search and filters",
  },
  {
    icon: Home,
    title: "Verified Listings",
    description: "Every property is verified by our expert team",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Real-time market data and analytics at your fingertips",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Bank-level security for all your deals",
  },
];

const whyChooseUs = [
  {
    icon: Award,
    title: "Award Winning",
    desc: "Best Real Estate Platform 2025",
  },
  { icon: Clock, title: "24/7 Support", desc: "Round the clock assistance" },
  { icon: Users, title: "Expert Team", desc: "500+ professional agents" },
  { icon: Key, title: "Easy Process", desc: "Streamlined buying & renting" },
];

const steps = [
  {
    step: "01",
    title: "Search",
    desc: "Browse thousands of listings with our smart filters",
  },
  {
    step: "02",
    title: "Connect",
    desc: "Schedule viewings and connect with expert agents",
  },
  {
    step: "03",
    title: "Move In",
    desc: "Complete the process and get your keys",
  },
];

function MotionCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

function SlideUp({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, type: "spring", bounce: 0 }}
    >
      {children}
    </motion.div>
  );
}

function PropertyCard({
  property,
  index,
}: {
  property: (typeof sampleProperties)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        type: "spring",
        bounce: 0.2,
      }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="group"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] transition-all duration-300 border-2 border-slate-200 hover:border-[#005CA8]">
        <div className="relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#005CA8] text-white text-xs font-bold px-4 py-1.5 rounded-full">
              {property.tag}
            </span>
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="h-64 overflow-hidden"
          >
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-1 text-[#005CA8] mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium text-slate-500">
              {property.location}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#005CA8] transition-colors">
            {property.title}
          </h3>
          <p className="text-2xl font-black text-[#005CA8] mb-4">
            {property.price}
          </p>
          <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-600">
                {property.beds} Beds
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-600">
                {property.baths} Baths
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-600">
                {property.sqft} sqft
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function RealEstateWelcome() {
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#005CA8] selection:text-white overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-[#005CA8]/5 blur-[120px]" />
        <div className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[#005CA8]/10 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-cyan-400/5 blur-[80px]" />
      </div>

      <nav className="relative z-50 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full border-b border-slate-200/50 backdrop-blur-md bg-white/80 ">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 "
        >
          <div className="p-2 bg-[#005CA8] rounded-xl shadow-lg shadow-[#005CA8]/30">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            ESTATE<span className="text-[#005CA8]">PORTAL</span>
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <Link href="/auth/login">
            <Button
              variant="ghost"
              className="text-slate-600 hover:text-[#005CA8] font-bold gap-2 cursor-pointer border border-slate-300 hover:border-[#005CA8] rounded-xl px-5 py-5"
            >
              <ArrowRight className="w-4 h-4 -rotate-45" />
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-[#005CA8] hover:bg-[#004a87] text-white rounded-xl px-6 py-5 shadow-lg shadow-[#005CA8]/20 font-bold gap-2 cursor-pointer">
              <Users className="w-4 h-4" />
              Join Now
            </Button>
          </Link>
        </motion.div>
      </nav>

      <main className="relative flex-grow">
        <section className="px-6 py-16 md:py-24">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="z-10 order-2 lg:order-1"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 mb-8"
              >
                <Sparkles className="w-4 h-4 text-[#005CA8]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#005CA8]">
                  Premium Real Estate
                </span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter">
                Find Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005CA8] via-blue-500 to-cyan-400">
                  Dream Home
                </span>
              </h1>
              <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
                Discover thousands of premium properties across the nation. Your
                perfect home is just a click away with our cutting-edge real
                estate platform.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-[#005CA8] hover:bg-[#004a87] text-white h-16 px-10 rounded-2xl text-lg font-bold group shadow-2xl shadow-[#005CA8]/30 cursor-pointer"
                  >
                    Explore Properties
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-16 pt-10 border-t border-slate-200 flex items-center gap-12 flex-wrap"
              >
                {stats.slice(0, 3).map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-3xl font-black text-[#005CA8]">
                      {stat.value}
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100, rotateY: 90 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, type: "spring" }}
              className="relative group order-1 lg:order-2"
            >
              <div className="absolute -inset-10 bg-gradient-to-tr from-[#005CA8] to-cyan-300 opacity-20 blur-[80px] rounded-full" />
              <div className="relative rounded-[3rem] overflow-hidden border-2 border-slate-200 shadow-[0_20px_60px_rgb(0,92,168,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-10" />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
                    alt="Luxury Home"
                    className="w-full h-[550px] object-cover"
                  />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="absolute top-6 right-6 z-20 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-white shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">
                        Property Value
                      </p>
                      <p className="text-lg font-black text-green-600">
                        +15.2%
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="absolute bottom-6 left-6 z-20 flex items-center gap-3"
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                    <MapPin className="text-[#005CA8] w-7 h-7" />
                  </div>
                  <div className="text-white">
                    <p className="font-bold text-lg leading-none">
                      Premium Location
                    </p>
                    <p className="text-white/80 text-sm">
                      Malabar Hill, Mumbai
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#005CA8]/10 text-[#005CA8] text-xs font-bold uppercase tracking-widest mb-4">
                  Featured Properties
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                  Discover Premium Listings
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  Explore our hand-picked selection of the most desirable
                  properties in the market today
                </p>
              </div>
            </FadeIn>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sampleProperties.slice(0, 6).map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={index}
                />
              ))}
            </div>
            <FadeIn delay={0.3}>
              <div className="text-center mt-12">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-[#005CA8] hover:bg-[#004a87] text-white h-14 px-10 rounded-2xl font-bold cursor-pointer"
                  >
                    View All Properties
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="px-6 py-20 bg-[#005CA8] relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-white/5 blur-[100px]" />
            <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] rounded-full bg-white/5 blur-[80px]" />
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Why Choose EstatePortal
                </h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  Experience the future of real estate with our cutting-edge
                  platform and dedicated service
                </p>
              </div>
            </FadeIn>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item, index) => (
                <MotionCard key={index} delay={index * 0.1}>
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.2)] text-center hover:bg-white/20 hover:border-white/50 transition-all">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/70 text-sm">{item.desc}</p>
                  </div>
                </MotionCard>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold uppercase tracking-widest mb-4">
                  Our Services
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                  Everything You Need
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  From buying to selling, we provide comprehensive real estate
                  solutions tailored to your needs
                </p>
              </div>
            </FadeIn>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <MotionCard key={index} delay={index * 0.1}>
                  <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:border-[#005CA8] transition-all group">
                    <div className="w-14 h-14 bg-[#005CA8]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#005CA8] transition-all">
                      <feature.icon className="w-7 h-7 text-[#005CA8] group-hover:text-white transition-all" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </MotionCard>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#005CA8]/20 blur-[100px]" />
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <SlideUp>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Start Your Journey Today
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
                  Join thousands of satisfied homeowners who found their dream
                  property through EstatePortal
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="bg-[#005CA8] hover:bg-[#004a87] text-white h-14 px-10 rounded-2xl font-bold cursor-pointer"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <button className="flex items-center px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer">
                    <Phone className="w-5 h-5 mr-2" />
                    <span className="text-sm font-bold">Contact Us</span>
                  </button>
                </div>
              </div>
            </SlideUp>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-white/10"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <motion.p
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="text-4xl md:text-5xl font-black text-[#005CA8] mb-2"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest mb-4">
                  How It Works
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                  Simple Process
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  Finding your dream home has never been easier
                </p>
              </div>
            </FadeIn>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((item, index) => (
                <MotionCard key={index} delay={index * 0.15}>
                  <div className="relative bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:border-[#005CA8] transition-all">
                    <span className="text-6xl font-black text-[#005CA8]/10 absolute top-4 right-4">
                      {item.step}
                    </span>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-[#005CA8] rounded-xl flex items-center justify-center mb-6">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                </MotionCard>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-[#005CA8] rounded-xl">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter">
                  ESTATE<span className="text-[#005CA8]">PORTAL</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Your trusted partner in finding the perfect property. Experience
                the future of real estate today.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#005CA8] transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                {["Home", "Properties", "About Us", "Contact", "Blog"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="hover:text-[#005CA8] transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Services</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                {[
                  "Buy Property",
                  "Sell Property",
                  "Rent Property",
                  "Agent Login",
                  "Admin Panel",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-[#005CA8] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#005CA8]" />
                  <span>Fort Area, Mumbai 400001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#005CA8]" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#005CA8]" />
                  <span>hello@estateportal.in</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
              © 2026 EstatePortal — All Rights Reserved
            </p>
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-[#005CA8] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#005CA8] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
