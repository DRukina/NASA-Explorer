import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  showBackButton?: boolean;
  backTo?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl';
  children: React.ReactNode;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '7xl': 'max-w-7xl',
};

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  showBackButton = true,
  backTo = '/',
  maxWidth = '7xl',
  children,
}) => {
  return (
    <div className="min-h-screen">
      <nav className="p-6">
        <div
          className={`${maxWidthClasses[maxWidth]} mx-auto flex items-center justify-between`}
        >
          {showBackButton && (
            <Link
              to={backTo}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          )}

          <h1 className="text-xl font-semibold text-white">{title}</h1>

          {!showBackButton && <div />}
        </div>
      </nav>

      <main className={`${maxWidthClasses[maxWidth]} mx-auto px-6 pb-12`}>
        {children}
      </main>
    </div>
  );
};
