export type userTypes = {
  id: string;
  fullName: string;
  email: string;
  pictureUrl: string;
  bio: string;
  instaLinks: string;
  location: string;
  occupation: string;
};
export type EditUserType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  pictureUrl?: string;
  password?: string;
  bio?: string;
};
