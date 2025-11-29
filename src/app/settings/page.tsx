'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Header } from '@/components/header';
import {
  Sun,
  Moon,
  Languages,
  Bell,
  Mail,
  User,
  ShieldCheck,
  LogOut,
  Sparkles,
  BookOpen,
  CalendarClock,
  Type,
} from 'lucide-react';
import { SettingsSection } from '@/components/settings/settings-section';
import { SettingsRow } from '@/components/settings/settings-row';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/context/language-provider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [didacticMode, setDidacticMode] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [reminderTime, setReminderTime] = useState('19:00');
  const [tempHour, setTempHour] = useState('19');
  const [tempMinute, setTempMinute] = useState('00');
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setIsDarkTheme(theme === 'dark');
    setCurrentLanguage(language);
  }, [theme, language]);

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
    setIsDarkTheme(checked);
  };
  
  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/auth');
    }
  };

  const handleSaveReminder = () => {
    setReminderTime(`${tempHour}:${tempMinute}`);
  };

  const handleLanguageSave = () => {
    setLanguage(currentLanguage);
  };
  
  if (!mounted) {
    return null; // or a loading spinner
  }

  const languageMap = {
    es: t('language_es'),
    en: t('language_en'),
    pt: t('language_pt'),
    zh: t('language_zh'),
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={t('settings')} showBackButton />
      <main className="mx-auto w-full max-w-[420px] flex-1 space-y-4 px-4 pb-28 md:max-w-[720px] md:space-y-6 md:px-6 md:pb-32">
        <SettingsSection title="General">
          <SettingsRow
            icon={isDarkTheme ? Moon : Sun}
            title={t('theme')}
            subtitle={isDarkTheme ? t('quick_actions_theme_dark') : t('quick_actions_theme_light')}
            trailing={{ type: 'toggle', checked: isDarkTheme, onCheckedChange: handleThemeChange }}
          />
           <Dialog>
            <DialogTrigger asChild>
              <div>
                <SettingsRow
                    icon={Type}
                    title={t('font_size')}
                    subtitle={t('font_size_desc')}
                    trailing={{ type: 'text', value: t('font_size_medium') }}
                    isButton
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('font_size_select')}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <RadioGroup defaultValue="md" className="space-y-2">
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="sm" id="font-sm" />
                    <Label htmlFor="font-sm" className="flex-1 cursor-pointer">{t('font_size_small')}</Label>
                  </div>
                   <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="md" id="font-md" />
                    <Label htmlFor="font-md" className="flex-1 cursor-pointer">{t('font_size_medium')}</Label>
                  </div>
                   <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="lg" id="font-lg" />
                    <Label htmlFor="font-lg" className="flex-1 cursor-pointer">{t('font_size_large')}</Label>
                  </div>
                </RadioGroup>
              </div>
            </DialogContent>
          </Dialog>
           <Dialog>
            <DialogTrigger asChild>
              <div>
                <SettingsRow
                    icon={Languages}
                    title={t('language')}
                    subtitle={languageMap[language]}
                    trailing={{ type: 'text', value: t('change') }}
                    isButton
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('select_language')}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <RadioGroup value={currentLanguage} onValueChange={(val) => setCurrentLanguage(val as 'es' | 'en')} className="space-y-2">
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="es" id="lang-es" />
                    <Label htmlFor="lang-es" className="flex-1 cursor-pointer">{languageMap.es}</Label>
                  </div>
                   <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="en" id="lang-en" />
                    <Label htmlFor="lang-en" className="flex-1 cursor-pointer">{languageMap.en}</Label>
                  </div>
                   <div className="flex items-center space-x-2 rounded-md border p-4 opacity-50">
                    <RadioGroupItem value="pt" id="lang-pt" disabled />
                    <Label htmlFor="lang-pt" className="flex-1 cursor-not-allowed">{languageMap.pt}</Label>
                  </div>
                   <div className="flex items-center space-x-2 rounded-md border p-4 opacity-50">
                    <RadioGroupItem value="zh" id="lang-zh" disabled />
                    <Label htmlFor="lang-zh" className="flex-1 cursor-not-allowed">{languageMap.zh}</Label>
                  </div>
                </RadioGroup>
              </div>
              <DialogFooter>
                 <DialogClose asChild>
                    <Button onClick={handleLanguageSave}>{t('save')}</Button>
                 </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SettingsSection>

        <SettingsSection title={t('learning')}>
          <SettingsRow
            icon={Sparkles}
            title={t('didactic_mode')}
            subtitle={t('didactic_mode_desc')}
            trailing={{ type: 'toggle', checked: didacticMode, onCheckedChange: setDidacticMode }}
          />
          <SettingsRow
            icon={BookOpen}
            title={t('daily_challenge')}
            subtitle={t('daily_challenge_desc')}
            trailing={{ type: 'toggle', checked: dailyChallenge, onCheckedChange: setDailyChallenge }}
          />
          <Dialog>
            <DialogTrigger asChild>
              <div>
                <SettingsRow
                  icon={CalendarClock}
                  title={t('reminders')}
                  subtitle={t('reminders_desc')}
                  trailing={{ type: 'text', value: reminderTime }}
                  isButton
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('configure_reminder')}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>{t('hour')}</Label>
                  <Select value={tempHour} onValueChange={setTempHour}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={String(i).padStart(2, '0')}>
                          {String(i).padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('minute')}</Label>
                   <Select value={tempMinute} onValueChange={setTempMinute}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['00', '15', '30', '45'].map((min) => (
                        <SelectItem key={min} value={min}>
                          {min}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={handleSaveReminder}>{t('save')}</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SettingsSection>

        <SettingsSection title={t('notifications')}>
          <SettingsRow
            icon={Bell}
            title={t('push_notifications')}
            subtitle={t('push_notifications_desc')}
            trailing={{ type: 'toggle', checked: pushNotifications, onCheckedChange: setPushNotifications }}
          />
          <SettingsRow
            icon={Mail}
            title={t('email_notifications')}
            subtitle={t('email_notifications_desc')}
            trailing={{ type: 'toggle', checked: emailNotifications, onCheckedChange: setEmailNotifications }}
          />
        </SettingsSection>

        <SettingsSection title={t('account')}>
          <SettingsRow
            icon={User}
            title={t('profile')}
            subtitle={t('profile_desc')}
            trailing={{ type: 'chevron' }}
            href="/profile"
          />
          <SettingsRow
            icon={ShieldCheck}
            title={t('privacy')}
            subtitle={t('privacy_desc')}
            trailing={{ type: 'text', value: t('manage') }}
            isButton
          />
          <SettingsRow
            icon={LogOut}
            title={t('log_out')}
            subtitle={t('logout_desc')}
            onClick={handleLogout}
            isButton={true}
          />
        </SettingsSection>
      </main>
    </div>
  );
}
