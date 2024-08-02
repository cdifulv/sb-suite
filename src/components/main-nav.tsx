'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type NavItem as Item } from '@/types/nav';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Icons } from '@/components/icons';

interface MainNavProps {
  items?: Item[];
}

export function MainNav({ items }: MainNavProps) {
  const currentRoute = usePathname();

  return (
    <>
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Icons.package2 className="h-6 w-6" />
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        {items?.length ? (
          <>
            {items?.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'text-muted-foreground transition-colors hover:text-foreground flex items-center text-sm font-medium',
                  currentRoute === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground',
                  item.disabled && 'cursor-not-allowed opacity-80'
                )}
              >
                {item.title}
              </Link>
            ))}
          </>
        ) : null}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex flex-row md:hidden">
            <Button variant="outline" size="icon" className="shrink-0 mr-2">
              <Icons.menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Icons.package2 className="h-6 w-6" />
              <span className="inline-block font-bold">{siteConfig.name}</span>
            </Link>
          </div>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle />
          <SheetDescription />
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Icons.package2 className="h-6 w-6" />
              <span className="inline-block font-bold">{siteConfig.name}</span>
            </Link>
            {items?.length ? (
              <>
                {items?.map(
                  (item, index) =>
                    item.href && (
                      <Link
                        key={index}
                        href={item.href}
                        className={cn(
                          'transition-colors hover:text-foreground flex items-center text-sm font-medium',
                          currentRoute === item.href
                            ? 'text-foreground'
                            : 'text-muted-foreground',
                          item.disabled && 'cursor-not-allowed opacity-80'
                        )}
                      >
                        {item.title}
                      </Link>
                    )
                )}
              </>
            ) : null}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
