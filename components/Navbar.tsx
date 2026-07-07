'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import AuthStatus, { type AuthStatusPaths } from '@/components/auth/auth-status';
import { authPaths } from '@/lib/auth-config';
import LogoSvg from '@/components/LogoSvg';
import zeusIconData from '@/zeus-icon.json';

export interface NavbarProps {
  /** Ruta de inicio (por defecto authPaths.home) */
  homePath?: string;
  /** Rutas de auth para AuthStatus (login, register, home, profile, settings) */
  paths?: AuthStatusPaths;
  className?: string;
}

export default function Navbar({
  homePath = authPaths.home,
  paths,
  className = '',
}: NavbarProps) {
  const pathname = usePathname();
  const bgClass = 'bg-[#0f0f1a] border-b border-gray-800 text-white';

  return (
    <nav
      className={
        'flex items-center justify-between px-4 py-1.5 border-b ' + bgClass + ' ' + className
      }
      role="navigation"
    >
      <div className="flex items-center gap-3">
        <Link href={homePath} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <LogoSvg size={36} />
          <LogoSvg size={20} data={zeusIconData} />
        </Link>
        <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-800/50">Inicio</Link>
        <Link href="/editor" className="text-sm text-gray-300 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-800/50">Editor</Link>
        <Link href="/galeria" className="text-sm text-gray-300 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-800/50">Galería</Link>
      </div>
      <div className="flex items-center gap-4">
        <AuthStatus paths={paths} />
      </div>
    </nav>
  );
}
