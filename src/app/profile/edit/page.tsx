import { Header } from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { user } from '@/lib/data';
import Link from 'next/link';
import { Camera } from 'lucide-react';

export default function ProfileEditPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Edit Profile" showBackButton />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Update Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage
                    src={user.avatar.imageUrl}
                    alt={user.avatar.description}
                  />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change picture</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue={user.username} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/profile">Save Changes</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
