'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, themeStatetype } from '@/state/Global';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
  username: z.string().min(2).max(20),
  email: z.string().email(),
  description: z.string().max(200).optional(),
});

type FormData = z.infer<typeof schema>;

export function UpdateProfileDialog() {
  const dispatch = useDispatch();
  const user = useSelector((state: { global: themeStatetype }) => state.global.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user.username,
      email: user.email,
      description: user.description,
    },
  });

  const [imagePreview, setImagePreview] = useState<string>(user.profileImageUrl || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormData) => {
    // For now, just use base64 or keep previous URL
    const profileImageUrl = imageFile ? imagePreview : user.profileImageUrl;

    dispatch(setUser({ ...data, profileImageUrl }));
    alert('Profile updated!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Pencil className="w-4 h-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Update Your Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Profile Image Upload */}
          <div className="space-y-2">
            <Label>Profile Image</Label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-full border border-gray-300 shadow-sm"
              />
            )}
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Username */}
          <div>
            <Label>Username</Label>
            <Input {...register('username')} placeholder="Enter username" />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input {...register('email')} placeholder="Enter email" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Description */}
          <div>
            <Label>About You</Label>
            <Input {...register('description')} placeholder="Short bio..." />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full mt-2">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
