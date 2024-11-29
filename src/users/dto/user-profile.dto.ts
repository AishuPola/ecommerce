export class UserProfileDto {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  country: string;
  address?: string;
  profilePicture?: string;
  isVerified: boolean;
  role: string;
}
