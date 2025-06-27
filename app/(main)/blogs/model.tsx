export type CloudinaryResult = {
  info: {
    public_id: string;
    secure_url: string;
    [key: string]: any;
  };
  event: string;
};

export type FormDataType = {
  title: string;
  text: string;
  imageUrl: string;
};
