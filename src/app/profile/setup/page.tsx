import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';

export default function ProfileSetupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Complete Your Profile" />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>One last step...</CardTitle>
            <CardDescription>
              Set up your profile to personalize your learning experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="johndoe" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="reminders" className="text-base">
                  Learning Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get daily notifications to keep your streak going.
                </p>
              </div>
              <Switch id="reminders" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/learn">Save and Continue</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
