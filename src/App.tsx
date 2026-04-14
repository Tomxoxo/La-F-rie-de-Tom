/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from "motion/react";
import { 
  Camera, 
  Globe, 
  Palette, 
  Search,
  ArrowRight,
  Instagram,
  Linkedin,
  Mail,
  Sparkles,
  Heart,
  Star
} from "lucide-react";
import LiveAssistant from "./components/LiveAssistant";

export default function App() {
  return (
    <div className="min-h-screen selection:bg-pink-200 selection:text-pink-900 bg-[#fff5f8] overflow-x-hidden">
      {/* Magical Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-100/40 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-purple-100/30 rounded-full blur-[100px] animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center text-pink-600">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-serif text-3xl font-bold tracking-tighter flex items-center gap-2"
        >
          <Sparkles className="w-6 h-6" /> TOM <Sparkles className="w-6 h-6" />
        </motion.div>
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.3em] font-bold">
          <a href="#personality" className="hover:text-pink-400 transition-colors">Personnalité</a>
          <a href="#interests" className="hover:text-pink-400 transition-colors">Passions</a>
          <a href="#assistant" className="hover:text-pink-400 transition-colors">Fée Magique</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center px-6 md:px-20">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              <span className="inline-block text-pink-500 text-[12px] font-bold uppercase tracking-[0.3em]">
                Notre Petit Prince Magique
              </span>
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            </div>
            <h1 className="font-serif text-7xl md:text-9xl leading-[0.85] tracking-tighter mb-8 text-pink-600">
              L'Âme <br />
              <span className="italic font-normal text-pink-400">Étincelante</span>
            </h1>
            <p className="text-xl md:text-2xl text-pink-400 max-w-md leading-relaxed mb-10 font-medium italic">
              "Tom ne marche pas, il flotte sur un nuage de créativité et de gentillesse pure."
            </p>
            <div className="flex gap-4">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#assistant" 
                className="px-10 py-5 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-full flex items-center gap-3 shadow-[0_10px_30px_rgba(255,105,180,0.4)] font-bold text-lg"
              >
                Parler à sa fée <Sparkles className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative aspect-[3/4] rounded-[4rem] overflow-hidden shadow-[0_20px_60px_rgba(255,182,193,0.6)] border-8 border-white"
          >
            <img 
              src="https://picsum.photos/seed/magical-tom/800/1200" 
              alt="Magical Tom" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/40 to-transparent" />
            <div className="absolute bottom-10 left-10 text-white">
              <p className="text-xs uppercase tracking-[0.4em] font-bold mb-2">Royaume Enchanté</p>
              <p className="text-3xl font-serif italic">Paris, Ville Lumière</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Assistant Section */}
      <section id="assistant" className="py-32 px-6 bg-gradient-to-b from-[#fff5f8] to-pink-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="inline-block mb-6"
            >
              <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-spin-slow" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="font-serif text-6xl md:text-8xl mb-6 text-pink-600"
            >
              La Fée <span className="italic text-pink-400">de Tom</span>
            </motion.h2>
            <p className="text-pink-400 text-xl max-w-lg mx-auto font-medium italic">
              "Posez vos questions à la petite fée qui veille sur Tom. Elle vous racontera à quel point son cœur est grand et son esprit est brillant !"
            </p>
          </div>
          
          <LiveAssistant />
        </div>
      </section>

      {/* Personality Section */}
      <section id="personality" className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-pink-100 to-white" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-5xl md:text-7xl text-pink-600 mb-4">Son Caractère <span className="italic text-pink-400">Divin</span></h2>
            <div className="w-24 h-1 bg-pink-200 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Créativité", desc: "Il transforme l'ordinaire en extraordinaire avec une pluie d'étoiles.", icon: Palette },
              { title: "Détermination", desc: "Un petit battant au sourire étincelant qui ne renonce jamais.", icon: Star },
              { title: "Curiosité", desc: "Un regard émerveillé sur chaque petit détail du monde.", icon: Search },
              { title: "Gentillesse", desc: "Un cœur d'or pur qui répand la joie partout où il passe.", icon: Heart }
            ].map((trait, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-pink-50 rounded-[3rem] border-2 border-pink-100 text-center group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <trait.icon className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-2xl font-serif text-pink-600 mb-4">{trait.title}</h3>
                <p className="text-pink-400 leading-relaxed italic">"{trait.desc}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Passions Section */}
      <section id="interests" className="py-32 px-6 bg-[#fff5f8]">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="font-serif text-5xl md:text-7xl text-pink-600 mb-16 text-center">Ses Passions <span className="italic text-pink-400">Enchantées</span></h2>
          <div className="grid md:grid-cols-2 gap-10 w-full">
            {[
              { title: "Photographie Magique", desc: "Capturer l'invisible et la lumière des moments précieux." },
              { title: "Mode Étincelante", desc: "L'art de s'exprimer à travers des tissus de rêve." },
              { title: "Voyages Féériques", desc: "Explorer des contrées lointaines pour nourrir son âme." },
              { title: "Scénographie de Rêve", desc: "Créer des espaces où la magie peut enfin exister." }
            ].map((interest, i) => (
              <div key={i} className="flex gap-6 items-center p-8 bg-white rounded-[2rem] shadow-sm">
                <div className="text-4xl">✨</div>
                <div>
                  <h3 className="text-xl font-bold text-pink-600 mb-2">{interest.title}</h3>
                  <p className="text-pink-400 italic">{interest.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-pink-600 text-white text-center">
        <div className="max-w-7xl mx-auto">
          <div className="font-serif text-5xl mb-8 tracking-tighter">TOM.</div>
          <p className="text-pink-200 mb-10 text-xl italic">"Répandons la magie ensemble"</p>
          <div className="flex justify-center gap-10 mb-12">
            <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-white"><Instagram className="w-8 h-8" /></motion.a>
            <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-white"><Linkedin className="w-8 h-8" /></motion.a>
            <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-white"><Mail className="w-8 h-8" /></motion.a>
          </div>
          <div className="w-full h-px bg-pink-500 mb-8" />
          <p className="text-xs uppercase tracking-[0.5em] text-pink-300">
            © 2026 Royaume de Tom — Magie Éternelle
          </p>
        </div>
      </footer>
    </div>
  );
}


