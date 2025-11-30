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
import { useAuth, useUser } from '@/firebase';
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
import { useToast } from '@/hooks/use-toast';
import { getToken } from 'firebase/messaging';
import type { UserProfile } from '@/docs/backend-types';
import { messaging } from '@/firebase';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const { toast } = useToast();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [didacticMode, setDidacticMode] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [reminderTime, setReminderTime] = useState('21:00'); // This will now be UTC
  const [tempHour, setTempHour] = useState('21');
  const [tempMinute, setTempMinute] = useState('00');
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const auth = useAuth();
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user?.uid) {
        const fetchUserProfile = async () => {
            try {
            const res = await fetch(`/api/users?firebaseUid=${user.uid}`);
            if (res.ok) {
                const data: UserProfile = await res.json();
                setUserProfile(data);
                
                // Convert stored UTC time to local time for display
                if (data.reminderTime) {
                  const [utcHours, utcMinutes] = data.reminderTime.split(':').map(Number);
                  const utcDate = new Date();
                  utcDate.setUTCHours(utcHours, utcMinutes, 0, 0);
                  
                  const localHours = utcDate.getHours().toString().padStart(2, '0');
                  const localMinutes = utcDate.getMinutes().toString().padStart(2, '0');
                  
                  setReminderTime(`${localHours}:${localMinutes}`); // Display local time
                  setTempHour(localHours);
                  setTempMinute(localMinutes);
                } else {
                  // Default to 21:00 local time
                  setReminderTime('21:00');
                  setTempHour('21');
                  setTempMinute('00');
                }
                
                setPushNotifications(!!data.fcmToken);

            }
            } catch (error) {
            console.error("Error fetching user profile:", error);
            }
        };
        fetchUserProfile();
    }
  }, [user]);

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

  const handleSaveReminder = async () => {
    const localTime = `${tempHour}:${tempMinute}`;

    // Convert local time to UTC for saving
    const localDate = new Date();
    const [localHours, localMinutes] = localTime.split(':').map(Number);
    localDate.setHours(localHours, localMinutes, 0, 0);
    
    const utcHours = localDate.getUTCHours().toString().padStart(2, '0');
    const utcMinutes = localDate.getUTCMinutes().toString().padStart(2, '0');
    const utcTime = `${utcHours}:${utcMinutes}`;
    
    if (user) {
         await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firebaseUid: user.uid,
                email: user.email,
                reminderTime: utcTime, // Save UTC time
            }),
        });
        setReminderTime(localTime); // Update display with local time
        toast({ title: "Recordatorio guardado", description: `Tu recordatorio se ha establecido a las ${localTime}` });
    }
  };

  const handleLanguageSave = () => {
    setLanguage(currentLanguage as 'es' | 'en');
  };

  const requestNotificationPermission = async (checked: boolean) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Debes iniciar sesión para activar las notificaciones.' });
        return;
    }
    
    // When toggling off
    if (!checked) {
        try {
          await fetch('/api/users/token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ firebaseUid: user.uid, token: null }), // Send null to remove token
          });
          setPushNotifications(false);
          toast({ title: 'Desactivado', description: 'Ya no recibirás notificaciones push.' });
        } catch (error) {
           console.error('Failed to unsubscribe:', error);
           toast({ variant: 'destructive', title: 'Error', description: 'No se pudo desactivar la suscripción.' });
        }
        return;
    }

    // When toggling on
    if (!messaging) {
      toast({ variant: 'destructive', title: 'Error', description: 'El servicio de mensajería no está disponible.' });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
        
        if (currentToken) {
          // Send token to your server
          await fetch('/api/users/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firebaseUid: user.uid, token: currentToken }),
          });
          setPushNotifications(true);
           toast({
            title: '¡Suscrito!',
            description: 'Recibirás notificaciones push.',
          });
        } else {
          setPushNotifications(false);
          toast({ variant: 'destructive', title: 'Error', description: 'No se pudo obtener el token de notificación. Inténtalo de nuevo.' });
        }
      } else {
        setPushNotifications(false);
        toast({ variant: 'destructive', title: 'Permiso denegado', description: 'No se han activado las notificaciones.' });
      }
    } catch (error) {
      console.error('Error getting notification permission:', error);
      setPushNotifications(false);
      toast({ variant: 'destructive', title: 'Error', description: 'Ocurrió un error al solicitar el permiso de notificación.' });
    }
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
                <RadioGroup value={currentLanguage} onValueChange={(val) => setCurrentLanguage(val as 'es' | 'en' | 'pt' | 'zh')} className="space-y-2">
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
                  <Label htmlFor="reminder-hour">{t('hour')}</Label>
                  <Select value={tempHour} onValueChange={setTempHour}>
                    <SelectTrigger id="reminder-hour" aria-label={t('hour')}>
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
                  <Label htmlFor="reminder-minute">{t('minute')}</Label>
                   <Select value={tempMinute} onValueChange={setTempMinute}>
                    <SelectTrigger id="reminder-minute" aria-label={t('minute')}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }).map((_, i) => (
                        <SelectItem key={i} value={String(i).padStart(2, '0')}>
                          {String(i).padStart(2, '0')}
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
            trailing={{ type: 'toggle', checked: pushNotifications, onCheckedChange: requestNotificationPermission }}
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
