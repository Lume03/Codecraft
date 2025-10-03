import React from 'react';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div>
      <h2 className="mb-2 text-[15px] font-semibold leading-tight md:mb-3 md:text-[16px]">
        {title}
      </h2>
      <div className="overflow-hidden rounded-2xl border">
        <div className="divide-y divide-border">{children}</div>
      </div>
    </div>
  );
}
